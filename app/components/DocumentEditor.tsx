"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { DocumentRow, DEMO_USERS } from "@/app/lib/types";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Save,
  Share2,
} from "lucide-react";

type Props = {
  document: DocumentRow | null;
  currentUserId: string;
  onSaved: (doc: DocumentRow) => void;
};

export function DocumentEditor({ document, currentUserId, onSaved }: Props) {
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [title, setTitle] = useState(document?.title ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [shareMessage, setShareMessage] = useState("");

  const otherUsers = useMemo(
    () => DEMO_USERS.filter((u) => u.id !== currentUserId),
    [currentUserId]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
    ],
    content: document?.content_html ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[420px] rounded-xl border bg-white p-6 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    setTitle(document?.title ?? "");
    if (editor && document) {
      editor.commands.setContent(document.content_html || "");
    }
  }, [document?.id, editor]);

  useEffect(() => {
  if (!editor || !document) return;

  const handler = () => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    setSaveState("saving");

    saveTimeout.current = setTimeout(async () => {
      const res = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim() || "Untitled Document",
          content_html: editor.getHTML(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSaveState("saved");
        onSaved(updated);

        setTimeout(() => {
          setSaveState("idle");
        }, 1200);
      } else {
        setSaveState("idle");
      }
    }, 900);
  };

  editor.on("update", handler);

  return () => {
    editor.off("update", handler);
  };
}, [editor, document, title, onSaved]);

  async function saveDocument() {
    if (!document || !editor) return;

    setSaveState("saving");

    const res = await fetch(`/api/documents/${document.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim() || "Untitled Document",
        content_html: editor.getHTML(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setSaveState("saved");
      onSaved(data);
      setTimeout(() => setSaveState("idle"), 1200);
    } else {
      setSaveState("idle");
      alert(data.error || "Save failed");
    }
  }

  async function shareWith(userId: string) {
    if (!document) return;

    setShareMessage("");

    const res = await fetch(`/api/documents/${document.id}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerId: currentUserId, sharedWithUserId: userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setShareMessage(data.error || "Share failed");
      return;
    }

    setShareMessage("Shared successfully.");
  }

  if (!document) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">
        Create, import, or select a document to begin.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-[260px] flex-1 rounded-lg border px-3 py-2 text-xl font-semibold"
            placeholder="Document title"
          />

          <button
            onClick={saveDocument}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            <Save size={16} />
            {saveState === "saving"
              ? "Saving..."
              : saveState === "saved"
              ? "Saved"
              : "Saved automatically"}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <ToolbarButton
            active={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            label="Bold"
            icon={<Bold size={16} />}
          />
          <ToolbarButton
            active={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            label="Italic"
            icon={<Italic size={16} />}
          />
          <ToolbarButton
            active={editor?.isActive("underline")}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            label="Underline"
            icon={<UnderlineIcon size={16} />}
          />
          <ToolbarButton
            active={editor?.isActive("heading", { level: 1 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            label="Heading"
            icon={<Heading1 size={16} />}
          />
          <ToolbarButton
            active={editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            label="Bullets"
            icon={<List size={16} />}
          />
          <ToolbarButton
            active={editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            label="Numbers"
            icon={<ListOrdered size={16} />}
          />
        </div>

        <EditorContent editor={editor} />
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-3 flex items-center gap-2 font-medium">
          <Share2 size={16} />
          Share document
        </div>

        <div className="flex flex-wrap gap-2">
          {otherUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => shareWith(user.id)}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Share with {user.name}
            </button>
          ))}
        </div>

        {shareMessage && (
          <p className="mt-2 text-sm text-gray-600">{shareMessage}</p>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  icon,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm ${
        active ? "bg-black text-white" : "bg-white hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}