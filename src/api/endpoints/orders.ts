import axiosClient from '../axiosClient';

export interface InitiateOrderResponse {
  order_id: string;
  payment_url: string;
}

export interface OrderInfo {
  transaction_id: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
}

export const ordersApi = {
  initiate: async (academicYearId: string): Promise<InitiateOrderResponse> => {
    const { data } = await axiosClient.post(`/academic-years/${academicYearId}/orders`);
    return data;
  },

  getByTransaction: async (transactionId: string): Promise<OrderInfo> => {
    const { data } = await axiosClient.get(`/orders/${transactionId}`);
    return data;
  },

  simulate: async (transactionId: string, outcome: 'ACCEPTED' | 'REFUSED') => {
    const { data } = await axiosClient.post(`/fake-payment/${transactionId}/simulate`, { outcome });
    return data;
  },
};