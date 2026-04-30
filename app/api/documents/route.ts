import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(request: NextRequest): Promise<Response> {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: owned, error: ownedError } = await supabase
    .from("documents")
    .select("*")
    .eq("owner_id", userId)
    .order("updated_at", { ascending: false });

  if (ownedError) {
    return NextResponse.json({ error: ownedError.message }, { status: 500 });
  }

  const { data: sharedRows, error: sharedError } = await supabase
    .from("document_shares")
    .select("document_id")
    .eq("shared_with_user_id", userId);

  if (sharedError) {
    return NextResponse.json({ error: sharedError.message }, { status: 500 });
  }

  const sharedIds = sharedRows?.map((row) => row.document_id) ?? [];

  let shared = [];

  if (sharedIds.length > 0) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .in("id", sharedIds)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    shared = data ?? [];
  }

  return NextResponse.json({ owned: owned ?? [], shared });
}

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const title = body.title?.trim() || "Untitled Document";
  const ownerId = body.ownerId;

  if (!ownerId) {
    return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      title,
      content_html: "<p>Start writing...</p>",
      owner_id: ownerId,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}