import axiosClient from '../axiosClient';

export interface Subject {
  id: string;
  program_id: string;
  year_order_index: number;
  trimester_order_index: number;
  title: string;
  slug: string;
  description?: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

export interface AttachTarget {
  trimester_id?: string;
  academic_year_id?: string;
}

export interface SubjectSession {
  trimester_id: string;
  academic_year_id: string;
  label: string | null;
  starts_at: string;
  ends_at: string;
  attached: boolean;
}

export const subjectsApi = {
  listAdmin: async (programId: string, yearOrderIndex: number, trimesterOrderIndex: number): Promise<Subject[]> => {
    const { data } = await axiosClient.get('/subjects/admin', {
      params: { program_id: programId, year_order_index: yearOrderIndex, trimester_order_index: trimesterOrderIndex },
    });
    return data;
  },

  create: async (payload: {
    program_id: string;
    year_order_index: number;
    trimester_order_index: number;
    title: string;
    description?: string;
  }): Promise<Subject> => {
    const { data } = await axiosClient.post('/subjects', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Pick<Subject, 'title' | 'description' | 'status'>>): Promise<Subject> => {
    const { data } = await axiosClient.put(`/subjects/${id}`, payload);
    return data;
  },

  move: async (
    id: string,
    payload: { year_order_index: number; trimester_order_index: number }
  ): Promise<Subject> => {
    const { data } = await axiosClient.patch(`/subjects/${id}/position`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await axiosClient.delete(`/subjects/${id}`);
  },

  sessions: async (id: string): Promise<SubjectSession[]> => {
    const { data } = await axiosClient.get(`/subjects/${id}/sessions`);
    return data;
  },

  attach: async (id: string, target: AttachTarget): Promise<{ attached: string[] }> => {
    const { data } = await axiosClient.post(`/subjects/${id}/attach`, target);
    return data;
  },
};