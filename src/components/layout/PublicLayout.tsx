import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * PublicLayout — wrapper pour toutes les pages publiques du site vitrine.
 * Inclut la Navbar dynamique (visiteur / connecté) et le Footer.
 * Aucune protection d'accès : toutes les routes enfants sont accessibles
 * sans authentification.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
