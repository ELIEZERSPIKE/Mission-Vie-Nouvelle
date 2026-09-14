export type GroupResourceType = 'FILE' | 'LINK';

export interface GroupResourceUploader {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface GroupResource {
  id: string;
  academic_year_id: string;
  // Objet chargé via la relation eager-loaded 'uploadedBy' — pas l'UUID brut.
  uploaded_by: GroupResourceUploader;
  type: GroupResourceType;
  title: string;
  description: string | null;
  file_path: string | null;
  external_url: string | null;
  original_filename: string | null;
  mime_type: string | null;
  file_size_kb: number | null;
  created_at: string;
  updated_at: string;
}

export interface GroupResourcePage {
  data: GroupResource[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface CreateGroupResourceFilePayload {
  type: 'FILE';
  title: string;
  description?: string;
  file: File;
}

export interface CreateGroupResourceLinkPayload {
  type: 'LINK';
  title: string;
  description?: string;
  external_url: string;
}

export type CreateGroupResourcePayload =
  | CreateGroupResourceFilePayload
  | CreateGroupResourceLinkPayload;
  
  export interface UpdateGroupResourcePayload {
  title?: string;
  description?: string | null;
  external_url?: string;
  file?: File;
}