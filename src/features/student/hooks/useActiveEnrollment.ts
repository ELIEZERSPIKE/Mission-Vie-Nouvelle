import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../../api/axiosClient';

interface Enrollment {
  id: string;
  status: string;
  academic_year_id: string;
  academicYear?: {
    id: string;
    label: string;
  };
}

async function fetchMyEnrollments(): Promise<Enrollment[]> {
  const { data } = await axiosClient.get('/enrollments');
  return data;
}

export function useActiveEnrollment() {
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: fetchMyEnrollments,
  });

  const activeEnrollment = enrollments?.find((e) => e.status === 'ACTIVE');

  return { activeEnrollment, isLoading };
}