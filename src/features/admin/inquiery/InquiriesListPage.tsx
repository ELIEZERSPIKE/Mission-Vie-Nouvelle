
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listInquiries, type InquiryStatus } from "./inquiries";
import type { InquirySection } from "../../../api/endpoints/inquiries";

const STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "Nouvelle",
  CONTACTED: "Contactée",
  CONVERTED: "Convertie",
  REJECTED: "Rejetée",
};

const STATUS_STYLES: Record<InquiryStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-amber-100 text-amber-800",
  CONVERTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const SECTION_LABELS: Record<InquirySection, string> = {
  INSTITUT_BIBLIQUE: "Institut Biblique",
  FATHET: "FATHET",
};

export function InquiriesListPage() {
  const [section, setSection] = useState<InquirySection | "">("");
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-inquiries", section, status, page],
    queryFn: () =>
      listInquiries({
        section: section || undefined,
        status: status || undefined,
        page,
      }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-encre">Demandes d'inscription</h1>
      </div>

      <div className="flex gap-3">
        <select
          value={section}
          onChange={(e) => {
            setSection(e.target.value as InquirySection | "");
            setPage(1);
          }}
          className="rounded-md border border-sauge bg-white px-3 py-2 text-sm text-encre"
        >
          <option value="">Toutes les sections</option>
          <option value="INSTITUT_BIBLIQUE">Institut Biblique</option>
          <option value="FATHET">FATHET</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as InquiryStatus | "");
            setPage(1);
          }}
          className="rounded-md border border-sauge bg-white px-3 py-2 text-sm text-encre"
        >
          <option value="">Tous les statuts</option>
          <option value="NEW">Nouvelle</option>
          <option value="CONTACTED">Contactée</option>
          <option value="CONVERTED">Convertie</option>
          <option value="REJECTED">Rejetée</option>
        </select>
      </div>

      {isLoading && <p className="text-encre/60">Chargement...</p>}
      {isError && (
        <p className="text-red-600">Impossible de charger les demandes.</p>
      )}

      {data && (
        <div className="border border-sauge rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-papier border-b border-sauge">
              <tr className="text-left text-encre/70">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Section</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Pièces</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Reçue le</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="border-b border-sauge last:border-0 hover:bg-papier/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/inquiries/${inquiry.id}`}
                      className="text-encre font-medium hover:text-primary"
                    >
                      {inquiry.first_name} {inquiry.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-encre/80">
                    {SECTION_LABELS[inquiry.section]}
                  </td>
                  <td className="px-4 py-3 text-encre/80">
                    <div>{inquiry.email}</div>
                    <div className="text-xs text-encre/50">{inquiry.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-encre/80">
                    {inquiry.documents_count}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[inquiry.status]}`}
                    >
                      {STATUS_LABELS[inquiry.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-encre/60">
                    {new Date(inquiry.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {data.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-encre/50">
                    Aucune demande pour ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {data && data.last_page > 1 && (
        <div className="flex items-center gap-2 justify-center">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-md border border-sauge text-sm text-encre disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="text-sm text-encre/70">
            Page {data.current_page} / {data.last_page}
          </span>
          <button
            disabled={page >= data.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-md border border-sauge text-sm text-encre disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}