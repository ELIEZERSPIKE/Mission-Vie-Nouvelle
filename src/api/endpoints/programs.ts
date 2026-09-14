import axiosClient from '../axiosClient';

export interface Program {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
}

// Définis le type ProgramWithModules si tu veux inclure les relations
export interface Module {
  id: string;
  name: string;
  courses: Course[];
}

export interface Course {
  id: string;
  title: string;
}

export interface ProgramWithModules extends Program {
  modules: Module[];
}

export const programsApi = {
  /**
   * Programmes ACTIVE uniquement — usage public / guichet (EnrollmentsPage).
   */
  listPublic: async (): Promise<Program[]> => {
    const { data } = await axiosClient.get('/programs');
    return data;
  },

  /**
   * Alias de listPublic, nom court utilisé par EnrollmentsPage.
   */
  list: async (): Promise<Program[]> => {
    const { data } = await axiosClient.get('/programs');
    return data;
  },

  listAdmin: async (): Promise<Program[]> => {
    const { data } = await axiosClient.get('/programs/admin');
    return data;
  },

  create: async (payload: { name: string; description?: string }): Promise<Program> => {
  const { data } = await axiosClient.post('/programs', payload);
  return data;
},

  update: async (id: string, payload: Partial<Pick<Program, 'name' | 'description' | 'status'>>): Promise<Program> => {
    const { data } = await axiosClient.put(`/programs/${id}`, payload);
    return data;
  },

  /**
   * Archive un programme (il n'apparaîtra plus dans les listes publiques).
   */
  archive: async (id: string): Promise<Program> => {
    const { data } = await axiosClient.patch(`/programs/${id}/archive`);
    return data;
  },

  /**
   * Désarchive un programme (il redevient visible).
   */
  unarchive: async (id: string): Promise<Program> => {
    const { data } = await axiosClient.patch(`/programs/${id}/unarchive`);
    return data;
  },

  /**
   * Publie un programme (il redevient visible dans les listes publiques).
   */
  publish: async (id: string): Promise<Program> => {
    const { data } = await axiosClient.patch(`/programs/${id}/publish`);
    return data;
  },

  /**
   * Récupère les détails d'un programme avec ses modules et cours.
   */
  getById: async (id: string): Promise<ProgramWithModules> => {
    const { data } = await axiosClient.get(`/programs/${id}`);
    return data;
  },

  /**
   * Récupère les programmes auxquels l'utilisateur a accès (inscrit ou admin).
   */
  getUserPrograms: async (): Promise<ProgramWithModules[]> => {
    const { data } = await axiosClient.get(`/programs/user/programs`);
    return data;
  },
};
