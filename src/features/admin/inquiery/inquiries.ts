import axiosClient from "../../../api/axiosClient";
import type { InquirySection } from "../../../api/endpoints/inquiries";

export type InquiryStatus = "NEW" | "CONTACTED" | "CONVERTED" | "REJECTED";

export interface InquiryDocument {
  id: string;
  document_type: string;
  original_filename: string;
  created_at: string;
}

export interface InquirySummary {
  id: string;
  section: InquirySection;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  program_of_interest: string | null;
  status: InquiryStatus;
  documents_count: number;
  created_at: string;
}

export interface InquiryDetail extends Omit<InquirySummary, "documents_count"> {
  message: string | null;
  documents: InquiryDocument[];
}

export interface PaginatedInquiries {
  data: InquirySummary[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface InquiryFilters {
  section?: InquirySection;
  status?: InquiryStatus;
  page?: number;
}

export async function listInquiries(
  filters: InquiryFilters = {}
): Promise<PaginatedInquiries> {
  const { data } = await axiosClient.get<PaginatedInquiries>("/inquiries/admin", {
    params: filters,
  });
  return data;
}

export async function getInquiry(id: string): Promise<InquiryDetail> {
  const { data } = await axiosClient.get<InquiryDetail>(`/inquiries/admin/${id}`);
  return data;
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<InquiryDetail> {
  const { data } = await axiosClient.patch<InquiryDetail>(
    `/inquiries/admin/${id}/status`,
    { status }
  );
  return data;
}

/**
 * Déclenche le téléchargement d'une pièce jointe dans le navigateur.
 * Le endpoint est authentifié — apiClient doit déjà porter le token JWT.
 */
export async function downloadInquiryDocument(
  inquiryId: string,
  documentId: string,
  filename: string
): Promise<void> {
  const response = await axiosClient.get(
    `/inquiries/admin/${inquiryId}/documents/${documentId}/download`,
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}