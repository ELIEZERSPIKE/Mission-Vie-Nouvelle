import { Providers } from './providers';
import { AppRouter } from './router';
import { AuthToastViewport } from '../features/auth/components/AuthToast';
import { UpdateToast } from '../components/UpdateToast';

export function App() {
  return (
    <Providers>
      <AuthToastViewport />
      <UpdateToast />
      <AppRouter />
    </Providers>
  );
}