import axiosClient from '../axiosClient';


export type InquirySection = "INSTITUT_BIBLIQUE" | "FATHET";

export interface RequiredDocumentSpec {
  label: string;
  multiple: boolean;
  required: boolean;
}

export type RequiredDocumentsMap = Record<string, RequiredDocumentSpec>;

export interface InquiryFormValues {
  section: InquirySection;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  program_of_interest?: string;
  message?: string;
}

export async function getRequiredDocuments(
  section: InquirySection
): Promise<RequiredDocumentsMap> {
  const { data } = await axiosClient.get<RequiredDocumentsMap>(
    `/inquiries/documents/${section.toLowerCase()}`
  );
  return data;
}

/**
 * files : clé = document_type, valeur = File ou File[] selon que le type
 * accepte plusieurs fichiers (voir RequiredDocumentSpec.multiple).
 */
export async function submitInquiry(
  values: InquiryFormValues,
  files: Record<string, File | File[]>
): Promise<{ message: string; inquiry_id: string }> {
  const formData = new FormData();

  formData.append("section", values.section);
  formData.append("first_name", values.first_name);
  formData.append("last_name", values.last_name);
  formData.append("email", values.email);
  formData.append("phone", values.phone);
  if (values.program_of_interest) {
    formData.append("program_of_interest", values.program_of_interest);
  }
  if (values.message) {
    formData.append("message", values.message);
  }

  for (const [type, fileOrFiles] of Object.entries(files)) {
    if (Array.isArray(fileOrFiles)) {
      fileOrFiles.forEach((file) => {
        formData.append(`documents[${type}][]`, file);
      });
    } else {
      formData.append(`documents[${type}]`, fileOrFiles);
    }
  }

  const { data } = await axiosClient.post("/inquiries", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}