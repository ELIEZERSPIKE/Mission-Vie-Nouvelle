// components/ScrollToAnchor.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToAnchor() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si pas de hash → scroll en haut (changement de page)
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // Si hash → scroll vers l'élément
    const id = hash.replace("#", "");
    const element = document.getElementById(id);

    if (element) {
      // Petit délai pour laisser le DOM se monter
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [pathname, hash]);

  return null;
}