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
        {title}
      </h2>

      <div className="space-y-2">
        {documents.length === 0 ? (
          <p className="rounded-lg border border-dashed p-3 text-sm text-gray-400">
            No documents yet.
          </p>
        ) : (
          documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelect(doc)}
              className={`flex w-full items-center gap-2 rounded-xl border p-3 text-left text-sm transition ${
                activeDocumentId === doc.id
                  ? "border-black bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <FileText size={16} />
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