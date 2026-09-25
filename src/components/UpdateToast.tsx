import { useEffect, useState } from 'react';
import { onNeedRefresh, onOfflineReady, applyUpdate } from '../pwa/updateBus';

export function UpdateToast() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const offNeed = onNeedRefresh(() => setNeedRefresh(true));
    const offOffline = onOfflineReady(() => {
      // Ne l'afficher qu'une seule fois
      if (localStorage.getItem('offline-ready-seen')) return;
      localStorage.setItem('offline-ready-seen', '1');
      setOfflineReady(true);
    });
    return () => {
      offNeed();
      offOffline();
    };
  }, []);

  // Disparition automatique du message "hors ligne"
  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(t);
  }, [offlineReady]);

  if (!needRefresh && !offlineReady) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-4 sm:bottom-4
                 rounded-lg border border-sauge bg-papier px-4 py-3 shadow-md
                 flex items-center justify-between gap-3
                 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      {needRefresh ? (
        <>
          <span className="text-sm text-encre">Nouvelle version disponible</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNeedRefresh(false)}
              className="text-sm text-encre/60 hover:text-encre"
            >
              Plus tard
            </button>
            <button
              onClick={applyUpdate}
              className="text-sm font-medium text-primary underline underline-offset-2"
            >
              Mettre à jour
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="text-sm text-encre">Application prête hors ligne</span>
          <button
            onClick={() => setOfflineReady(false)}
            aria-label="Fermer"
            className="text-encre/60 hover:text-encre"
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
}