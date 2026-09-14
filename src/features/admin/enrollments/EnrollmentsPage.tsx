import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  enrollmentsApi,
  academicYearsApi,
  type PaymentProvider,
  type GrantManualResponse,
  type StudentSearchResult,
} from '../../../api/endpoints/enrollment';
import { programsApi } from '../../../api/endpoints/programs';
import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

type PaymentMode = 'PAYMENT' | 'NO_PAYMENT';

type LookupState =
  | { status: 'idle' }
  | { status: 'searching' }
  | { status: 'results'; results: StudentSearchResult[] }
  | { status: 'selected'; user: StudentSearchResult }
  | { status: 'creating' };

const selectClass =
  'h-11 w-full border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

const textareaClass =
  'w-full border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

// Debounce délai (ms) avant de lancer la recherche automatique pendant la saisie
const SEARCH_DEBOUNCE_MS = 350;

export function EnrollmentsPage() {
  const queryClient = useQueryClient();

  // --- Étudiant (recherche par nom/téléphone, en direct) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [lookup, setLookup] = useState<LookupState>({ status: 'idle' });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // --- Programme & année ---
  const [programId, setProgramId] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');

  // --- Paiement ---
  const [mode, setMode] = useState<PaymentMode>('PAYMENT');
  const [amount, setAmount] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('CASH');
  const [currency, setCurrency] = useState('XOF');
  const [reference, setReference] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<GrantManualResponse | null>(null);

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: programsApi.list,
  });

  const { data: academicYears } = useQuery({
    queryKey: ['academic-years', 'for-enrollment', programId],
    queryFn: () => academicYearsApi.forEnrollment(programId),
    enabled: !!programId,
  });

  const { data: enrollmentsPage, isLoading, isError } = useQuery({
    queryKey: ['enrollments', 'admin'],
    queryFn: () => enrollmentsApi.indexAdmin(),
  });
  const enrollments = enrollmentsPage?.data;

  // --- Recherche en direct : plus besoin de cliquer sur "Rechercher" ---
  // On lance automatiquement la recherche dès que l'utilisateur tape
  // (nom OU numéro de téléphone), avec un léger debounce pour éviter
  // une requête à chaque frappe.
  useEffect(() => {
    if (lookup.status !== 'idle' && lookup.status !== 'searching' && lookup.status !== 'results') {
      return; // un étudiant est déjà sélectionné ou en création : on ne relance pas la recherche
    }

    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      if (lookup.status !== 'idle') setLookup({ status: 'idle' });
      return;
    }

    setLookup({ status: 'searching' });
    const timeoutId = setTimeout(async () => {
      try {
        const { results } = await enrollmentsApi.studentSearch(trimmed);
        setLookup({ status: 'results', results });
      } catch {
        setLookup({ status: 'idle' });
        setFormError('Erreur lors de la recherche.');
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const selectStudent = (user: StudentSearchResult) => {
    setLookup({ status: 'selected', user });
    setFormError(null);
  };

  const startCreation = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setLookup({ status: 'creating' });
    setFormError(null);
  };

  const resetStudent = () => {
    setSearchQuery('');
    setLookup({ status: 'idle' });
  };

  const resetAll = () => {
    resetStudent();
    setProgramId('');
    setAcademicYearId('');
    setAmount('');
    setReference('');
    setAdminNote('');
  };

  // --- Liste complète des étudiants (indépendante du flux de recherche) ---
  // Déplacée au-dessus du formulaire, repliée derrière un bouton A.
  const [showAllStudents, setShowAllStudents] = useState(false);
  const { data: allStudentsResponse, isLoading: allLoading, isError: allError } = useQuery({
    queryKey: ['students', 'all'],
    queryFn: () => enrollmentsApi.studentSearch(''),
    enabled: showAllStudents,
  });
  const allStudents = allStudentsResponse?.results;

  const handleToggleStudents = () => setShowAllStudents((prev) => !prev);

  const grantManualMutation = useMutation({
    mutationFn: enrollmentsApi.grantManual,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'admin'] });
      setLastResult(res);
      setFormError(null);
      resetAll();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message ?? "Erreur lors de l'inscription.");
    },
  });

  const studentReady = lookup.status === 'selected' || lookup.status === 'creating';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLastResult(null);

    if (!studentReady) {
      setFormError("Sélectionnez ou créez d'abord un étudiant.");
      return;
    }
    if (mode === 'NO_PAYMENT' && !adminNote.trim()) {
      setFormError("La justification (admin_note) est obligatoire en l'absence de paiement.");
      return;
    }

    grantManualMutation.mutate({
      academic_year_id: academicYearId,
      ...(lookup.status === 'selected'
        ? { user_id: lookup.user.id }
        : { student: { first_name: firstName, last_name: lastName, phone, email: email || undefined } }),
      ...(mode === 'PAYMENT'
        ? {
            payment: {
              amount: Number(amount),
              payment_provider: paymentProvider,
              currency,
              reference: reference || undefined,
            },
          }
        : { admin_note: adminNote }),
    });
  };

  if (isLoading) {
    return (
      <div className="px-5 py-10 sm:px-8 sm:py-16">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-5 py-10 sm:px-8 sm:py-16">
        <div role="alert" className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Erreur lors du chargement des inscriptions.
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="border-t border-border/40 pt-8 md:pt-12">
          <p className="mb-3 text-sm font-medium tracking-wide text-primary">Guichet</p>
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">Inscriptions</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Recherchez ou créez un compte étudiant, puis enregistrez son inscription et son paiement.
          </p>
        </header>

        {/* --- Bouton A : liste complète des étudiants, au-dessus du formulaire --- */}
        <div className="mt-8">
          <Button type="button" variant="outline" onClick={handleToggleStudents}>
            {showAllStudents ? 'Masquer la liste des étudiants' : 'Afficher tous les étudiants'}
          </Button>

          {showAllStudents && (
            <div className="mt-4 max-h-96 overflow-y-auto border border-border/60 bg-card p-4">
              {allLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
              {allError && (
                <p className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Erreur lors du chargement des étudiants.
                </p>
              )}
              {allStudents && allStudents.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun étudiant trouvé.</p>
              )}
              {allStudents?.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b border-border/30 py-2 last:border-0">
                  <span>
                    {s.full_name} — {s.phone}
                    {s.email ? ` — ${s.email}` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      selectStudent(s);
                      setShowAllStudents(false);
                    }}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Choisir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {lastResult && (
          <div role="status" className="mt-8 border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
            <p>
              Inscription enregistrée pour <strong>{lastResult.student_account?.user.full_name}</strong>.
            </p>
            {lastResult.student_account?.temporary_password && (
              <p className="mt-1">
                Mot de passe temporaire :{' '}
                <strong className="font-mono">{lastResult.student_account.temporary_password}</strong>{' '}
                (à communiquer à l'étudiant)
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 border border-border/60 bg-card">
          {formError && (
            <div role="alert" className="border-b border-destructive/50 bg-destructive/10 px-6 py-3 text-sm text-destructive">
              {formError}
            </div>
          )}

          {/* --- Étudiant --- */}
          <fieldset className="border-b border-border/40 p-6 sm:p-8">
            <legend className="font-serif text-lg text-foreground">Étudiant</legend>

            {(lookup.status === 'idle' || lookup.status === 'searching' || lookup.status === 'results') && (
              <div className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="student-search">Rechercher par nom ou téléphone</Label>
                  <Input
                    id="student-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex. Jean Kokou ou 90 12 34 56"
                    className="h-11"
                    autoComplete="off"
                  />
                  {lookup.status === 'searching' && (
                    <p className="text-xs text-muted-foreground">Recherche en cours...</p>
                  )}
                </div>

                {lookup.status === 'results' && (
                  <div className="mt-2 border border-border/40">
                    {lookup.results.length === 0 && (
                      <p className="px-4 py-3 text-sm text-muted-foreground">Aucun résultat.</p>
                    )}
                    {lookup.results.map((u) => (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => selectStudent(u)}
                        className="block w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted"
                      >
                        {u.full_name} — {u.phone}
                        {u.email ? ` — ${u.email}` : ''}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={startCreation}
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-primary hover:bg-muted"
                    >
                      Aucun ne correspond — créer un nouveau compte
                    </button>
                  </div>
                )}
              </div>
            )}

            {lookup.status === 'selected' && (
              <p role="status" className="mt-4 flex items-center gap-3 text-sm text-foreground">
                <span>
                   <strong>{lookup.user.full_name}</strong> — {lookup.user.phone}
                </span>
                <button type="button" onClick={resetStudent} className="font-medium text-primary underline-offset-4 hover:underline">
                  Changer
                </button>
              </p>
            )}

            {lookup.status === 'creating' && (
              <div className="mt-4">
                <p role="status" className="flex items-center gap-3 text-sm text-foreground">
                  <span>Création d'un nouveau compte</span>
                  <button type="button" onClick={resetStudent} className="font-medium text-primary underline-offset-4 hover:underline">
                    Annuler / rechercher plutôt
                  </button>
                </p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">Prénom</Label>
                    <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Nom</Label>
                    <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optionnel)</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
                  </div>
                </div>
              </div>
            )}
          </fieldset>

          {/* --- Programme & année --- */}
          <fieldset disabled={!studentReady} className="border-b border-border/40 p-6 disabled:opacity-50 sm:p-8">
            <legend className="font-serif text-lg text-foreground">Programme &amp; année</legend>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="program">Programme</Label>
                <select
                  id="program"
                  className={selectClass}
                  value={programId}
                  onChange={(e) => {
                    setProgramId(e.target.value);
                    setAcademicYearId('');
                  }}
                  required
                >
                  <option value="">— Choisir —</option>
                  {programs?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic-year">Année académique</Label>
                <select
                  id="academic-year"
                  className={selectClass}
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(e.target.value)}
                  required
                  disabled={!programId}
                >
                  <option value="">— Choisir —</option>
                  {academicYears?.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.label} ({y.order_index}ᵉ année)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* --- Type d'inscription --- */}
          <fieldset disabled={!studentReady} className="border-b border-border/40 p-6 disabled:opacity-50 sm:p-8">
            <legend className="font-serif text-lg text-foreground">Type d'inscription</legend>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="radio" name="mode" checked={mode === 'PAYMENT'} onChange={() => setMode('PAYMENT')} className="h-4 w-4" />
                Paiement présentiel reçu
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'NO_PAYMENT'}
                  onChange={() => setMode('NO_PAYMENT')}
                  className="h-4 w-4"
                />
                Sans paiement (bourse, cas particulier)
              </label>
            </div>
          </fieldset>

          {/* --- Paiement / justification --- */}
          <fieldset disabled={!studentReady} className="p-6 disabled:opacity-50 sm:p-8">
            {mode === 'PAYMENT' ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant</Label>
                  <Input id="amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-provider">Moyen de paiement</Label>
                  <select
                    id="payment-provider"
                    className={selectClass}
                    value={paymentProvider}
                    onChange={(e) => setPaymentProvider(e.target.value as PaymentProvider)}
                  >
                    <option value="CASH">Espèces</option>
                    <option value="BANK_TRANSFER">Virement</option>
                    <option value="MANUAL_OTHER">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence (optionnel)</Label>
                  <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} className="h-11" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="admin-note">Justification (admin_note)</Label>
                <textarea
                  id="admin-note"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  required
                  rows={3}
                  className={textareaClass}
                />
              </div>
            )}

            <Button type="submit" disabled={grantManualMutation.isPending || !studentReady} className="mt-6 h-11 w-full sm:w-auto sm:px-8">
              {grantManualMutation.isPending ? 'Inscription...' : 'Inscrire'}
            </Button>
          </fieldset>
        </form>

        <div className="mt-10">
          <h2 className="font-serif text-xl text-foreground">Inscriptions enregistrées</h2>

          {!enrollments || enrollments.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Aucune inscription pour le moment.</p>
          ) : (
            <div className="mt-4 overflow-x-auto border border-border/60">
              <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Étudiant</th>
                    <th className="px-4 py-3 font-medium">Téléphone</th>
                    <th className="px-4 py-3 font-medium">Programme</th>
                    <th className="px-4 py-3 font-medium">Année</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Paiement</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {enrollment.user.first_name} {enrollment.user.last_name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{enrollment.user.phone}</td>
                      <td className="px-4 py-3 text-foreground">{enrollment.academic_year?.program?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-foreground">
                        {enrollment.academic_year
                          ? `${enrollment.academic_year.order_index}ᵉ année (${enrollment.academic_year.label})`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-foreground">{enrollment.status}</td>
                      <td className="px-4 py-3 text-muted-foreground">{enrollment.source}</td>
                      <td className="px-4 py-3 text-foreground">
                        {enrollment.payment ? `${enrollment.payment.amount} ${enrollment.payment.currency}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}