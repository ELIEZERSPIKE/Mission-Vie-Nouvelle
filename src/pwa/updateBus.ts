// petit bus d'événements minimal, sans dépendance externe,
// pour relier registerSW (dans main.tsx) au composant UpdateToast

type UpdateSWFn = (reloadPage?: boolean) => Promise<void>;

let updateSWFn: UpdateSWFn | null = null;

const NEED_REFRESH_EVENT = 'pwa:need-refresh';
const OFFLINE_READY_EVENT = 'pwa:offline-ready';

export function setUpdateSW(fn: UpdateSWFn) {
  updateSWFn = fn;
}

export function notifyNeedRefresh() {
  window.dispatchEvent(new CustomEvent(NEED_REFRESH_EVENT));
}

export function notifyOfflineReady() {
  window.dispatchEvent(new CustomEvent(OFFLINE_READY_EVENT));
}

export function onNeedRefresh(callback: () => void) {
  window.addEventListener(NEED_REFRESH_EVENT, callback);
  return () => window.removeEventListener(NEED_REFRESH_EVENT, callback);
}

export function onOfflineReady(callback: () => void) {
  window.addEventListener(OFFLINE_READY_EVENT, callback);
  return () => window.removeEventListener(OFFLINE_READY_EVENT, callback);
}

// à appeler quand l'utilisateur clique sur "Mettre à jour"
export function applyUpdate() {
  if (!updateSWFn) return;
  updateSWFn(true); // true => reload automatique après activation du nouveau SW
}