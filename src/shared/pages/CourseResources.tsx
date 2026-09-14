import { FileText, Link2, Headphones, Download, Pencil, Trash2, Plus } from "lucide-react";

const RESOURCES = [
  { num: "01", name: "Plan de cours — Trimestre 3", type: "PDF", icon: FileText, date: "02 sept. 2026", size: "1,2 Mo" },
  { num: "02", name: "Bibliographie trimestrielle", type: "PDF", icon: FileText, date: "02 sept. 2026", size: "640 Ko" },
  { num: "03", name: "Introduction à la doctrine de Dieu", type: "Lien externe", icon: Link2, date: "05 sept. 2026", size: "" },
  { num: "04", name: "Enregistrement — Séance 1", type: "Audio", icon: Headphones, date: "08 sept. 2026", size: "42 Mo" },
  { num: "05", name: "Notes de cours — Christologie", type: "PDF", icon: FileText, date: "10 sept. 2026", size: "2,8 Mo" },
];

export default function CourseResources({ role = "TEACHER" }) {
  const canEdit = role === "TEACHER" || role === "ADMIN" || role === "SUPER_ADMIN";
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      <div className="mb-6">
        <p className="text-xs text-sauge mb-1">Licence Année 2 — Trimestre 3</p>
        <h1 className="font-serif text-2xl text-encre">Théologie Systématique III</h1>
      </div>

      {canEdit && (
        <div className="flex justify-end mb-3">
          <button className="inline-flex items-center gap-2 text-sm text-olive border border-olive/50 px-4 py-2 hover:bg-olive/5 transition-colors">
            <Plus size={15} /> Déposer une ressource
          </button>
        </div>
      )}

      <div>
        {RESOURCES.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.num} className="flex items-center justify-between py-4 border-b border-sauge/25">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="font-mono text-xs text-sauge w-6 shrink-0">{r.num}</span>
                <Icon size={18} className="text-sauge shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-encre truncate">{r.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-sauge">{r.type}</span>
                    {r.size && <span className="text-xs text-sauge">{r.size}</span>}
                    <span className="text-xs text-sauge">Ajouté le {r.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 text-sauge hover:text-olive transition-colors" title="Télécharger">
                  <Download size={16} />
                </button>
                {canEdit && (
                  <>
                    <button className="p-2 text-sauge hover:text-encre transition-colors" title="Modifier">
                      <Pencil size={15} />
                    </button>
                    <button className="p-2 text-sauge hover:text-destructive transition-colors" title="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}