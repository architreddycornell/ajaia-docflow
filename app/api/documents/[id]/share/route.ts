import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const sharedWithUserId = body.sharedWithUserId;
  const ownerId = body.ownerId;

  if (!sharedWithUserId || !ownerId) {
    return NextResponse.json(
      { error: "Missing sharedWithUserId or ownerId" },
      { status: 400 }
    );
  }

  const { data: doc } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (doc.owner_id !== ownerId) {
    return NextResponse.json(
      { error: "Only the owner can share this document" },
      { status: 403 }
    );
  }

  if (sharedWithUserId === ownerId) {
    return NextResponse.json(
      { error: "Cannot share a document with yourself" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
  .from("document_shares")
  .upsert(
    {
      document_id: id,
      shared_with_user_id: sharedWithUserId,
      permission: body.permission === "view" ? "view" : "edit",
    },
    {
      onConflict: "document_id,shared_with_user_id",
    }
  )
  .select("*")
  .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}