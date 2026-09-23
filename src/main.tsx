import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './index.css';

import { registerSW } from 'virtual:pwa-register';
import { setUpdateSW, notifyNeedRefresh, notifyOfflineReady } from './pwa/updateBus';

const UPDATE_CHECK_MS = 60 * 60 * 1000; // vérification des mises à jour : toutes les heures

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // une nouvelle version est en attente (SW installé mais pas encore actif)
    notifyNeedRefresh();
  },
  onOfflineReady() {
    notifyOfflineReady();
  },
  onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
    if (!registration) return;

    const checkUpdate = () => {
      if (navigator.onLine) registration.update().catch(() => {});
    };

    setInterval(checkUpdate, UPDATE_CHECK_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkUpdate();
    });
  },
  onRegisterError(error: unknown) {
    console.error('[PWA] Échec de l\'enregistrement du service worker', error);
  },
});

// on garde une référence à updateSW pour pouvoir déclencher le rechargement
// depuis n'importe quel composant (bouton "Mettre à jour")
setUpdateSW(updateSW);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);