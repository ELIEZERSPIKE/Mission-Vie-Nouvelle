import axiosClient from '../axiosClient';

export type PaymentProvider = 'CASH' | 'BANK_TRANSFER' | 'MANUAL_OTHER';
export type PaymentStatus = 'PENDING' | 'VALIDATED' | 'AGGREGATOR_CONFIRMED' | 'REJECTED';
export type EnrollmentStatus = 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
export type EnrollmentSource = 'ADMIN' | 'ONLINE';

export interface Payment {
  id: string;
  order_id: string | null;
  payment_provider: PaymentProvider;
  provider_reference: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: string;
  program_id: string;
  order_index: number;
  label: string;
  starts_at: string;
  ends_at: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  program?: { id: string; code: string; name: string };
  trimesters?: Array<{ id: string; label: string; order_index: number; status: string; starts_at: string; ends_at: string }>;
}

export interface Enrollment {
  id: string;
  user_id: string;
  academic_year_id: string;
  status: EnrollmentStatus;
  source: EnrollmentSource;
  started_at: string;
  payment_id: string | null;
  payment: Payment | null;
  admin_note: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentWithAcademicYear extends Enrollment {
  academic_year: AcademicYear;
}

export interface EnrollmentStudentSummary {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface EnrollmentAdminRow extends Enrollment {
  user: EnrollmentStudentSummary;
  academic_year: AcademicYear | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface StudentSearchResult {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
}

export interface StudentAccountInfo {
  user: StudentSearchResult;
  already_exists: boolean;
  temporary_password?: string;
}

export interface GrantManualPayload {
  // Cas A : étudiant déjà sélectionné via studentSearch.
  user_id?: string;

  // Cas B : aucun compte trouvé — création.
  student?: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
  };

  academic_year_id: string;

  // Renseigné UNIQUEMENT si un paiement présentiel a été reçu.
  payment?: {
    amount: number;
    payment_provider: PaymentProvider;
    currency?: string;
    reference?: string;
  };

  // Obligatoire si aucun paiement n'est renseigné (traçabilité).
  admin_note?: string;
}

export interface GrantManualResponse {
  enrollment: Enrollment;
  student_account: StudentAccountInfo | null;
}

export const enrollmentsApi = {
  /**
   * Recherche par nom (guichet). Renvoie une liste — le nom n'étant pas
   * unique, l'admin doit confirmer visuellement le bon compte.
   */
  studentSearch: async (q: string): Promise<{ results: StudentSearchResult[] }> => {
    const { data } = await axiosClient.get('/enrollments/student-search', { params: { q } });
    return data;
  },

  /**
   * Inscription hors ligne en un seul geste (guichet admin).
   * Couvre le paiement présentiel (CASH/BANK_TRANSFER/MANUAL_OTHER) validé
   * directement, ou une inscription sans paiement justifiée par admin_note.
   */
  grantManual: async (payload: GrantManualPayload): Promise<GrantManualResponse> => {
    const { data } = await axiosClient.post('/enrollments/grant-manual', payload);
    return data;
  },

  /**
   * Liste les inscriptions de l'étudiant authentifié (avec academic_year.program).
   */
  index: async (): Promise<EnrollmentWithAcademicYear[]> => {
    const { data } = await axiosClient.get('/enrollments');
    return data;
  },

  /**
   * Liste admin : toutes les inscriptions avec étudiant, programme et année
   * (academic_year.order_index donne le rang — 1ère/2ème/3ème année du programme).
   */
  indexAdmin: async (page = 1): Promise<PaginatedResponse<EnrollmentAdminRow>> => {
    const { data } = await axiosClient.get('/enrollments/admin', { params: { page } });
    return data;
  },
};

export const academicYearsApi = {
  /**
   * Guichet uniquement : années ACTIVE d'un programme, tous rangs confondus
   * (1re/2e/3e) — pour permettre l'inscription en cours de cursus.
   */
  forEnrollment: async (programId: string): Promise<AcademicYear[]> => {
    const { data } = await axiosClient.get('/academic-years/for-enrollment', {
      params: { program_id: programId },
    });
    return data;
  },
};