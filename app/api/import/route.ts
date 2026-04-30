import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const ownerId = formData.get("ownerId") as string | null;

  if (!file || !ownerId) {
    return NextResponse.json(
      { error: "Missing file or ownerId" },
      { status: 400 }
    );
  }

  const allowed = [".txt", ".md"];
  const isAllowed = allowed.some((ext) => file.name.toLowerCase().endsWith(ext));

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Only .txt and .md files are supported" },
      { status: 400 }
    );
  }

  const text = await file.text();

  if (text.length > 50000) {
    return NextResponse.json(
      { error: "File is too large for this demo" },
      { status: 400 }
    );
  }

  const html = `<p>${escapeHtml(text).replaceAll("\n", "</p><p>")}</p>`;

  const { data, error } = await supabase
    .from("documents")
    .insert({
      title: file.name.replace(/\.(txt|md)$/i, ""),
      content_html: html,
      owner_id: ownerId,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}