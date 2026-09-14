import axiosClient from '../axiosClient';

// Exactement les mêmes valeurs que la validation Laravel
// (ContentItemController::store(), règle 'type').
export type ContentItemType = 'PDF' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'ASSESSMENT';

export interface ContentItemFile {
  id: string;
  mime_type: string;
  size_bytes: number;
  is_primary: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentItemType;
  created_at: string;
  subject?: {
    id: string;
    title: string;
    program_id: string;
    year_order_index: number;
    trimester_order_index: number;
    program?: {
      id: string;
      name: string;
      code: string;
    };
  };
  files: Array<{ id: string; size_bytes: number }>;
}

export interface ContentItemWithContext extends ContentItem {
  subject: {
    id: string;
    title: string;
    program_id: string;
    year_order_index: number;
    trimester_order_index: number;
    program?: { id: string; name: string; code: string };
  };
  created_at: string;
}

export const contentItemsApi = {
  listBySubject: async (subjectId: string): Promise<ContentItem[]> => {
    const { data } = await axiosClient.get('/content-items', { params: { subject_id: subjectId } });
    return data;
  },

  createWithFile: async (subjectId: string, title: string, file: File, type: ContentItemType = 'PDF'): Promise<ContentItem> => {
    const form = new FormData();
    form.append('subject_id', subjectId);
    form.append('title', title);
    form.append('type', type);
    form.append('file', file);

    const { data } = await axiosClient.post('/content-items', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  listAll: async (): Promise<ContentItemWithContext[]> => {
    const { data } = await axiosClient.get('/content-items/admin/all');
    return data;
  },

  downloadFile: async (fileId: string, filename: string) => {
    const response = await axiosClient.get(`/content-items/files/${fileId}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  },
  replaceFile: async (contentItemId: string, file: File) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await axiosClient.post(`/content-items/${contentItemId}/file/replace`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
},

newVersion: async (contentItemId: string, file: File) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await axiosClient.post(`/content-items/${contentItemId}/file/new-version`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
},
};