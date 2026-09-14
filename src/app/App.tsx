import { Providers } from './providers';
import { AppRouter } from './router';
import { AuthToastViewport } from '../features/auth/components/AuthToast';

export function App() {
  return (
    <Providers>
      <AuthToastViewport />
      <AppRouter />
    </Providers>
  );
}