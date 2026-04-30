"use client";

import { DocumentRow } from "@/app/lib/types";
import { FileText } from "lucide-react";

type Props = {
  title: string;
  documents: DocumentRow[];
  activeDocumentId?: string;
  onSelect: (doc: DocumentRow) => void;
};

export function DocumentList({
  title,
  documents,
  activeDocumentId,
  onSelect,
}: Props) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title} ({documents.length})
      </h2>

      <div className="space-y-2">
        {documents.length === 0 ? (
          <p className="rounded-lg border border-dashed p-3 text-sm text-gray-400">
            No documents yet.
            <br />
            Create one or import a file to begin.
          </p>
        ) : (
          documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelect(doc)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
                activeDocumentId === doc.id
                  ? "border-black bg-gray-100"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="rounded-xl bg-slate-100 p-2 text-slate-700 group-hover:bg-slate-200">
                <FileText size={16} />
              </div>
              <div>
                <div className="font-medium">{doc.title}</div>
                <div className="text-xs text-gray-400">
                  Updated {new Date(doc.updated_at).toLocaleString()}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}