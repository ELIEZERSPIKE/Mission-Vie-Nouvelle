import axiosClient from '../axiosClient';

export interface PendingPayment {
  id: string;
  order_id: string;
  payment_provider: string;
  provider_reference: string | null;
  amount: number;
  currency: string;
  status: 'PENDING' | 'AGGREGATOR_CONFIRMED' | 'VALIDATED' | 'FAILED' | 'REFUNDED';
  created_at: string;
  order?: {
    id: string;
    description?: string;
    user?: {
      id: string;
      first_name: string;
      last_name: string;
      phone: string | null;
    } | null;
    academic_year?: {
      id: string;
      label: string;
      program?: { name: string } | null;
    } | null;
  } | null;
}

export const paymentsApi = {
  listPending: async (): Promise<PendingPayment[]> => {
    const { data } = await axiosClient.get('/admin/payments');
    return data;
  },

  validate: async (paymentId: string) => {
    const { data } = await axiosClient.post(`/admin/payments/${paymentId}/validate`);
    return data;
  },

  reject: async (paymentId: string, reason?: string) => {
    const { data } = await axiosClient.post(`/admin/payments/${paymentId}/reject`, { reason });
    return data;
  },
};