
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInquiry,
  updateInquiryStatus,
  downloadInquiryDocument,
  type InquiryStatus,
} from "./inquiries";
import type { InquirySection } from "../../../api/endpoints/inquiries";

const STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "Nouvelle",
  CONTACTED: "Contactée",
  CONVERTED: "Convertie",
  REJECTED: "Rejetée",
};

const SECTION_LABELS: Record<InquirySection, string> = {
  INSTITUT_BIBLIQUE: "Institut Biblique",
  FATHET: "FATHET",
};

export function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: inquiry, isLoading, isError } = useQuery({
    queryKey: ["admin-inquiry", id],
    queryFn: () => getInquiry(id as string),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: InquiryStatus) => updateInquiryStatus(id as string, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiry", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
    },
  });

  if (isLoading) return <p className="text-encre/60">Chargement...</p>;
  if (isError || !inquiry)
    return <p className="text-red-600">Demande introuvable.</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/admin/inquiries" className="text-sm text-primary hover:underline">
        ← Retour aux demandes
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-encre">
            {inquiry.first_name} {inquiry.last_name}
          </h1>
          <p className="text-encre/60">{SECTION_LABELS[inquiry.section]}</p>
        </div>

        <select
          value={inquiry.status}
          onChange={(e) => statusMutation.mutate(e.target.value as InquiryStatus)}
          disabled={statusMutation.isPending}
          className="rounded-md border border-sauge bg-white px-3 py-2 text-sm text-encre"
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-sauge rounded-lg p-4 space-y-2">
        <h2 className="font-serif text-lg text-encre mb-2">Coordonnées</h2>
        <p className="text-sm text-encre/80">Email : {inquiry.email}</p>
        <p className="text-sm text-encre/80">Téléphone : {inquiry.phone}</p>
        {inquiry.program_of_interest && (
          <p className="text-sm text-encre/80">
            Programme souhaité : {inquiry.program_of_interest}
          </p>
        )}
        <p className="text-sm text-encre/50">
          Reçue le {new Date(inquiry.created_at).toLocaleString("fr-FR")}
        </p>
      </div>

      {inquiry.message && (
        <div className="border border-sauge rounded-lg p-4">
          <h2 className="font-serif text-lg text-encre mb-2">Message</h2>
          <p className="text-sm text-encre/80 whitespace-pre-wrap">
            {inquiry.message}
          </p>
        </div>
      )}

      <div className="border border-sauge rounded-lg p-4">
        <h2 className="font-serif text-lg text-encre mb-3">
          Pièces jointes ({inquiry.documents.length})
        </h2>

        {inquiry.documents.length === 0 && (
          <p className="text-sm text-encre/50">Aucune pièce jointe.</p>
        )}

        <ul className="divide-y divide-sauge">
          {inquiry.documents.map((doc: { id: string; original_filename: string; document_type: string }) => (
            <li
              key={doc.id}
              className="flex items-center justify-between py-2.5"
            >
              <div>
                <p className="text-sm text-encre font-medium">
                  {doc.original_filename}
                </p>
                <p className="text-xs text-encre/50">{doc.document_type}</p>
              </div>
              <button
                onClick={() =>
                  downloadInquiryDocument(
                    inquiry.id,
                    doc.id,
                    doc.original_filename
                  )
                }
                className="text-sm text-primary hover:underline"
              >
                Télécharger
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}