import axiosClient from '../axiosClient';

export interface Subject {
  id: string;
  program_id: string;
  year_order_index: number;
  trimester_order_index: number;
  title: string;
  slug: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
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

  update: async (id: string, payload: Partial<Pick<Subject, 'title' | 'status'>>): Promise<Subject> => {
    const { data } = await axiosClient.put(`/subjects/${id}`, payload);
    return data;
  },
};