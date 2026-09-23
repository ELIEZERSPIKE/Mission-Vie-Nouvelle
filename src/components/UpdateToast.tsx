import { useEffect, useState } from 'react';
import { onNeedRefresh, onOfflineReady, applyUpdate } from '../pwa/updateBus';

export function UpdateToast() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const offNeed = onNeedRefresh(() => setNeedRefresh(true));
    const offOffline = onOfflineReady(() => setOfflineReady(true));
    return () => {
      offNeed();
      offOffline();
    };
  }, []);

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-sauge bg-papier px-4 py-3 shadow-md flex items-center gap-3">
      {needRefresh ? (
        <>
          <span className="text-sm text-encre">Nouvelle version disponible</span>
          <button
            onClick={applyUpdate}
            className="text-sm font-medium text-primary underline underline-offset-2"
          >
            Mettre à jour
          </button>
        </>
      ) : (
        <span className="text-sm text-encre">Application prête hors ligne</span>
      )}
    </div>
  );
}