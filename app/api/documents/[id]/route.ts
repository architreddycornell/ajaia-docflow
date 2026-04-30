import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: doc, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const { data: shares } = await supabase
    .from("document_shares")
    .select("*")
    .eq("document_id", id);

  const isOwner = doc.owner_id === userId;
  const isShared = shares?.some((s) => s.shared_with_user_id === userId);

  if (!isOwner && !isShared) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ document: doc, shares: shares ?? [] });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const update: Record<string, string> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body.title === "string") update.title = body.title;
  if (typeof body.content_html === "string") {
    update.content_html = body.content_html;
  }

  const { data, error } = await supabase
    .from("documents")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}