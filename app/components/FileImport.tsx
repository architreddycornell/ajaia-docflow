"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { DocumentRow } from "@/app/lib/types";

type Props = {
  ownerId: string;
  onImported: (doc: DocumentRow) => void;
};

export function FileImport({ ownerId, onImported }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerId", ownerId);

    const res = await fetch("/api/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Import failed");
      return;
    }

    onImported(data);
  }

  return (
    <div className="rounded-xl border border-dashed p-4">
      <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
        <Upload size={20} />
        <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
                {loading ? "Importing..." : "Import .txt or .md"}
            </span>
            <span className="text-xs text-gray-500">
                Creates a new editable document
            </span>
        </div>
        <input
          type="file"
          accept=".txt,.md"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}