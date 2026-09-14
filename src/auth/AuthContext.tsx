import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { tokenService } from './tokenService';
import type { ReactNode } from 'react';

interface User {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  address: string | null;
  bio: string | null;
  has_cv: boolean;
  roles: string[];
  permissions: string[];
  must_change_password: boolean;
}

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

interface UpdatePersonalInfoPayload {
  date_of_birth?: string | null;
  address?: string | null;
  bio?: string | null;
}

interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  updatePersonalInfo: (payload: UpdatePersonalInfoPayload) => Promise<User>;
  uploadAvatar: (file: File) => Promise<User>;
  deleteAvatar: () => Promise<User>;
  uploadCv: (file: File) => Promise<User>;
  deleteCv: () => Promise<User>;
  downloadCv: () => Promise<void>;
  viewCv: () => Promise<void>; // ← ajouté
  hasPermission: (permission: string) => boolean;
  
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenService.getAccessToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    axiosClient.get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => tokenService.clearTokens())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (identifier: string, password: string) => {
    const { data } = await axiosClient.post('/auth/login', { login: identifier, password });
    tokenService.setTokens(data.access_token, data.refresh_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: RegisterPayload) => {
    const { data } = await axiosClient.post('/auth/register', payload);
    tokenService.setTokens(data.access_token, data.refresh_token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const refreshToken = tokenService.getRefreshToken();
    try {
      await axiosClient.post('/auth/logout', { refresh_token: refreshToken });
    } finally {
      tokenService.clearTokens();
      setUser(null);
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    const { data } = await axiosClient.put('/auth/me', payload);
    setUser(data);
    return data;
  };
  const viewCv = async () => {
  const response = await axiosClient.get('/auth/me/cv/download', { responseType: 'blob' });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  window.open(url, '_blank');
  // Le blob reste utilisable tant que l'onglet est ouvert ; on le révoque
  // après un délai généreux plutôt qu'immédiatement (sinon l'onglet
  // pourrait afficher une page blanche si le navigateur est lent à charger).
  setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
};

  const changePassword = async (payload: ChangePasswordPayload) => {
    const refreshToken = tokenService.getRefreshToken();
    await axiosClient.put('/auth/me/password', { ...payload, refresh_token: refreshToken });
    setUser((prev) => (prev ? { ...prev, must_change_password: false } : prev));
  };

  const forgotPassword = async (email: string) => {
    await axiosClient.post('/auth/password/forgot', { email });
  };

  const resetPassword = async (
    token: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => {
    await axiosClient.post('/auth/password/reset', { token, email, password, password_confirmation });
  };

  const updatePersonalInfo = async (payload: UpdatePersonalInfoPayload) => {
    const { data } = await axiosClient.put('/auth/me/personal-info', payload);
    setUser(data);
    return data;
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await axiosClient.post('/auth/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUser(data);
    return data;
  };

  const deleteAvatar = async () => {
    const { data } = await axiosClient.delete('/auth/me/avatar');
    setUser(data);
    return data;
  };

  const uploadCv = async (file: File) => {
    const formData = new FormData();
    formData.append('cv', file);
    const { data } = await axiosClient.post('/auth/me/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUser(data);
    return data;
  };

  const deleteCv = async () => {
    const { data } = await axiosClient.delete('/auth/me/cv');
    setUser(data);
    return data;
  };

  const downloadCv = async () => {
    const response = await axiosClient.get('/auth/me/cv/download', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cv-${user?.full_name ?? 'utilisateur'}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const hasPermission = (permission: string) => user?.permissions.includes(permission) ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        updatePersonalInfo,
        uploadAvatar,
        deleteAvatar,
        uploadCv,
        deleteCv,
        downloadCv,
        viewCv,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}