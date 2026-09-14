import axiosClient from '../axiosClient';

export interface Program {
  id: string;
  name: string;
  code: string;
}

export interface CatalogSubject {
  id: string;
  title: string;
  content_items: { id: string; title: string; type: string }[];
}

export interface CatalogTrimester {
  id: string;
  label: string;
  order_index: number;
  status: string;
  subjects: CatalogSubject[];
}

export interface MyCourseYear {
  id: string;
  label: string;
  program: { id: string; name: string; code: string };
  trimesters: FullCatalogTrimester[];
}

export interface CatalogYear {
  id: string;
  label: string;
  order_index: number;
  price: number | null;
  currency: string;
  program: Program;
  has_access: boolean;
  trimesters: CatalogTrimester[];
}

export interface FullCatalogSubject {
  id: string;
  title: string;
  description: string | null;
  content_items: { id: string; title: string; type: string }[];
}

export interface FullCatalogTrimester {
  id: string;
  label: string;
  order_index: number;
  status: string;
  subjects: FullCatalogSubject[];
}

export interface FullCatalogYear {
  id: string;
  label: string;
  order_index: number;
  price: number | null;
  currency: string;
  has_access: boolean;
  trimesters: FullCatalogTrimester[];
}

export interface FullCatalogProgram {
  id: string;
  code: string;
  name: string;
  academic_years: FullCatalogYear[];
}

export const catalogApi = {
  getPrograms: async (): Promise<Program[]> => {
    const { data } = await axiosClient.get('/catalog/programs');
    return data;
  },
  getCatalog: async (programId: string): Promise<CatalogYear[]> => {
    const { data } = await axiosClient.get('/catalog', { params: { program_id: programId } });
    return data;
  },
    getFullCatalog: async (): Promise<FullCatalogProgram[]> => {
    const { data } = await axiosClient.get('/catalog/full');
    return data;
  },
 
  getMyCourses: async (): Promise<MyCourseYear[]> => {
    const { data } = await axiosClient.get('/catalog/my-courses');
    return data;
  },
};