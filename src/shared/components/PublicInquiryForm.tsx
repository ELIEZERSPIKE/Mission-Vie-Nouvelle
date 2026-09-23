// src/shared/components/PublicInquiryForm.tsx

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  getRequiredDocuments,
  submitInquiry,
  type InquirySection,
  type InquiryFormValues,
} from "../../api/endpoints/inquiries";
import { authToast } from "../../features/auth/lib/authToast";

interface PublicInquiryFormProps {
  section: InquirySection;
  defaultProgramOfInterest?: string;
}

const SECTION_LABELS: Record<InquirySection, string> = {
  INSTITUT_BIBLIQUE: "Institut Biblique Vie Nouvelle",
  FATHET: "Programme FATHET",
};

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export function PublicInquiryForm({ section, defaultProgramOfInterest }: PublicInquiryFormProps) {
  const emptyValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    program_of_interest: defaultProgramOfInterest ?? "",
    message: "",
  };

  const [values, setValues] = useState<Omit<InquiryFormValues, "section">>(emptyValues);
  const [files, setFiles] = useState<Record<string, File | File[]>>({});
  const [error, setError] = useState<string | null>(null);
  // Change de valeur à chaque succès pour forcer le remount des <input type="file">
  // (leur valeur ne peut pas être réinitialisée directement en React).
  const [formKey, setFormKey] = useState(0);

  const { data: documentSpecs, isLoading: loadingDocs } = useQuery({
    queryKey: ["inquiry-documents", section],
    queryFn: () => getRequiredDocuments(section),
  });

  const mutation = useMutation({
    mutationFn: () => submitInquiry({ ...values, section }, files),
    onSuccess: () => {
      authToast.success(
        "Votre demande d'inscription a bien été reçue. Notre équipe vous contactera prochainement."
      );
      setError(null);
      setValues(emptyValues);
      setFiles({});
      setFormKey((k) => k + 1);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Une erreur est survenue. Veuillez réessayer.";
      setError(message);
    },
  });

  function handleFileChange(type: string, multiple: boolean, fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    if (multiple) {
      setFiles((prev) => ({ ...prev, [type]: Array.from(fileList) }));
    } else {
      setFiles((prev) => ({ ...prev, [type]: fileList[0] }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  }

  const inputClass =
    "w-full rounded-lg border border-border/40 bg-white px-3 py-2 text-sm text-foreground/90 placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-300";

  const fileInputClass =
    "w-full text-sm text-foreground/70 file:mr-3 file:rounded-lg file:border-0 file:bg-foreground/5 file:px-3 file:py-2 file:text-foreground/70 file:cursor-pointer file:transition-colors file:duration-300 hover:file:bg-foreground/10";

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit}
      className="p-5 sm:p-6 rounded-xl bg-white border border-border/40 shadow-sm space-y-6"
    >
      <div>
        <h4 className="text-sm font-medium text-foreground/70 tracking-wide mb-1">
          Formulaire d'inscription — {SECTION_LABELS[section]}
        </h4>
        <p className="text-sm text-foreground/60 leading-relaxed">
          Renseignez vos informations et joignez les pièces du dossier.
        </p>
      </div>

      {/* Section : Informations personnelles */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">
            1
          </span>
          <h5 className="text-xs font-medium uppercase tracking-wide text-foreground/60">
            Informations personnelles
          </h5>
          <span className="flex-1 border-t border-border/40" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground/70 mb-1.5">Prénom</label>
            <input
              type="text"
              required
              value={values.first_name}
              onChange={(e) => setValues((v) => ({ ...v, first_name: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/70 mb-1.5">Nom</label>
            <input
              type="text"
              required
              value={values.last_name}
              onChange={(e) => setValues((v) => ({ ...v, last_name: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/70 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/70 mb-1.5">Téléphone</label>
            <input
              type="tel"
              required
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
      </motion.section>

      {/* Section : Programme & message */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">
            2
          </span>
          <h5 className="text-xs font-medium uppercase tracking-wide text-foreground/60">
            Votre projet
          </h5>
          <span className="flex-1 border-t border-border/40" />
        </div>

        {section === "FATHET" && (
          <div>
            <label className="block text-sm text-foreground/70 mb-1.5">Programme souhaité</label>
            <input
              type="text"
              placeholder="ex: Licence, Master, Bachelor, Certification de Servantes"
              value={values.program_of_interest}
              onChange={(e) => setValues((v) => ({ ...v, program_of_interest: e.target.value }))}
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className="block text-sm text-foreground/70 mb-1.5">Message (optionnel)</label>
          <textarea
            rows={3}
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            className={inputClass}
          />
        </div>
      </motion.section>

      {/* Section : Pièces du dossier */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">
            3
          </span>
          <h5 className="text-xs font-medium uppercase tracking-wide text-foreground/60">
            Pièces du dossier
          </h5>
          <span className="flex-1 border-t border-border/40" />
        </div>

        {loadingDocs && (
          <p className="text-sm text-foreground/50">Chargement des pièces requises...</p>
        )}

        {documentSpecs &&
          Object.entries(documentSpecs).map(([type, spec]) => {
            const selected = files[type];
            const selectedList = Array.isArray(selected)
              ? selected
              : selected
                ? [selected]
                : [];

            return (
              <div key={type} className="space-y-1.5">
                <label className="block text-sm text-foreground/70">
                  {spec.label}
                  {spec.required && <span className="text-red-500"> *</span>}
                  {spec.multiple && (
                    <span className="text-foreground/40 text-xs"> (plusieurs fichiers acceptés)</span>
                  )}
                </label>
                <input
                  type="file"
                  required={spec.required}
                  multiple={spec.multiple}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(type, spec.multiple, e.target.files)}
                  className={fileInputClass}
                />

                {selectedList.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {selectedList.map((f, i) => (
                      <li
                        key={`${type}-${i}`}
                        className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-xs text-foreground/70"
                      >
                        <svg
                          className="h-3.5 w-3.5 shrink-0 text-primary"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 2.75h6.5L15 6.25v11H5z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 2.75v3.5H15" />
                        </svg>
                        <span className="truncate">{f.name}</span>
                        <span className="ml-auto shrink-0 text-foreground/40">
                          {(f.size / 1024).toFixed(0)} Ko
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </motion.section>

      {error && (
        <p className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={mutation.isPending || loadingDocs}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary rounded-lg px-5 py-2.5 hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {mutation.isPending ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </div>
    </form>
  );
}