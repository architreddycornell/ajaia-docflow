import { describe, expect, it } from "vitest";
import { canAccessDocument, getDocumentRelationship } from "../lib/access";

describe("document access logic", () => {
  const doc = {
    id: "doc_1",
    owner_id: "user_archit",
  };

  const shares = [
    {
      document_id: "doc_1",
      shared_with_user_id: "user_reviewer",
    },
  ];

  it("allows the owner to access a document", () => {
    expect(canAccessDocument("user_archit", doc, shares)).toBe(true);
  });

  it("allows a shared user to access a document", () => {
    expect(canAccessDocument("user_reviewer", doc, shares)).toBe(true);
  });

  it("blocks unrelated users", () => {
    expect(canAccessDocument("user_other", doc, shares)).toBe(false);
  });

  it("labels owner vs shared relationship", () => {
    expect(getDocumentRelationship("user_archit", "user_archit")).toBe("owned");
    expect(getDocumentRelationship("user_reviewer", "user_archit")).toBe(
      "shared"
    );
  });
});