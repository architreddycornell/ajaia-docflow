"use client";

import { useEffect, useState } from "react";
import { DocumentRow } from "@/app/lib/types";
import { UserSwitcher } from "@/app/components/UserSwitcher";
import { DocumentList } from "@/app/components/DocumentList";
import { DocumentEditor } from "@/app/components/DocumentEditor";
import { FileImport } from "@/app/components/FileImport";
import { Plus } from "lucide-react";

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState("user_archit");
  const [owned, setOwned] = useState<DocumentRow[]>([]);
  const [shared, setShared] = useState<DocumentRow[]>([]);
  const [activeDoc, setActiveDoc] = useState<DocumentRow | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadDocuments(userId = currentUserId) {
    setLoading(true);

    const res = await fetch(`/api/documents?userId=${userId}`);
    const data = await res.json();

    setOwned(data.owned ?? []);
    setShared(data.shared ?? []);
    setLoading(false);

    if (activeDoc) {
      const stillAccessible = [...(data.owned ?? []), ...(data.shared ?? [])].find(
        (doc) => doc.id === activeDoc.id
      );

      if (!stillAccessible) setActiveDoc(null);
    }
  }

  useEffect(() => {
    loadDocuments(currentUserId);
  }, [currentUserId]);

  async function createDocument() {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerId: currentUserId }),
    });

    const doc = await res.json();

    if (res.ok) {
      setOwned((prev) => [doc, ...prev]);
      setActiveDoc(doc);
    } else {
      alert(doc.error || "Could not create document");
    }
  }

  function handleSaved(doc: DocumentRow) {
    setActiveDoc(doc);
    setOwned((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
    setShared((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
  }

  function handleImported(doc: DocumentRow) {
    setOwned((prev) => [doc, ...prev]);
    setActiveDoc(doc);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between rounded-2xl border bg-white px-6 py-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              DocFlow
            </h1>
            <p className="text-sm text-gray-500">
              Lightweight collaborative editor
            </p>
          </div>
  <UserSwitcher
    currentUserId={currentUserId}
    onChange={(userId) => {
      setCurrentUserId(userId);
      setActiveDoc(null);
    }}
  />
</header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
            <button
              onClick={createDocument}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white"
            >
              <Plus size={16} />
              New Document
            </button>

            <FileImport ownerId={currentUserId} onImported={handleImported} />

            {loading ? (
              <p className="text-sm text-gray-500">Loading documents...</p>
            ) : (
              <>
                <DocumentList
                  title="Owned by me"
                  documents={owned}
                  activeDocumentId={activeDoc?.id}
                  onSelect={setActiveDoc}
                />

                <DocumentList
                  title="Shared with me"
                  documents={shared}
                  activeDocumentId={activeDoc?.id}
                  onSelect={setActiveDoc}
                />
              </>
            )}
          </aside>

          <section>
            <DocumentEditor
              document={activeDoc}
              currentUserId={currentUserId}
              onSaved={handleSaved}
            />
          </section>
        </div>
      </div>
    </main>
  );
}