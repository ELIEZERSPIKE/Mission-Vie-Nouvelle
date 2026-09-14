import axiosClient from '../axiosClient';

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
  price?: number | null;
  currency?: string;
}

export const academicYearsApi = {
  listAdmin: async (programId?: string): Promise<AcademicYear[]> => {
    const { data } = await axiosClient.get('/academic-years/admin', {
      params: programId ? { program_id: programId } : undefined,
    });
    return data;
  },

  getOne: async (id: string): Promise<AcademicYear> => {
    const { data } = await axiosClient.get(`/academic-years/${id}`);
    return data;
  },

  create: async (payload: {
    program_id: string;
    starts_at: string;
    ends_at?: string;
    label?: string;
    auto_generate_periods?: boolean;
    period_mode?: 'TRIMESTRE' | 'SEMESTRE';
  }): Promise<AcademicYear> => {
    const { data } = await axiosClient.post('/academic-years', payload);
    return data;
  },

  addPeriod: async (
    academicYearId: string,
    payload: { label: string; starts_at: string; ends_at: string }
  ) => {
    const { data } = await axiosClient.post(`/academic-years/${academicYearId}/trimesters`, payload);
    return data;
  },

  update: async (
    id: string,
    payload: Partial<Pick<AcademicYear, 'label' | 'starts_at' | 'ends_at' | 'status' | 'price' | 'currency'>>
  ): Promise<AcademicYear> => {
    const { data } = await axiosClient.patch(`/academic-years/${id}`, payload);
    return data;
  },

  /**
   * Supprime une année académique. Le backend renvoie 409 si des inscriptions
   * ou commandes y sont déjà rattachées — dans ce cas, fermer (status CLOSED
   * via update()) plutôt que supprimer.
   */
  remove: async (id: string): Promise<void> => {
    await axiosClient.delete(`/academic-years/${id}`);
  },
};