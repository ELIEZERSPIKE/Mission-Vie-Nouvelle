import axiosClient from "../axiosClient";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export interface StudentUser {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string; // $appends côté modèle Laravel
  phone: string;
  email: string | null;
  email_verified_at: string | null;
  status: UserStatus;
}

export interface CreateStudentPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
}

export interface CreateStudentResponse {
  message: string;
  user: StudentUser;
  already_exists: boolean;
  temporary_password?: string;
}

export const studentsApi = {
  /**
   * Crée un compte étudiant au guichet, ou retourne le compte existant
   * (already_exists: true) si le téléphone est déjà enregistré.
   */
  // src/api/endpoints/students.ts
  store: async (
    payload: CreateStudentPayload,
  ): Promise<CreateStudentResponse> => {
    const { data } = await axiosClient.post("/students", payload);
    return data;
  },
};
