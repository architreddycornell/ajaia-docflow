type Share = {
  document_id: string;
  shared_with_user_id: string;
};

type Doc = {
  id: string;
  owner_id: string;
};

export function canAccessDocument(userId: string, doc: Doc, shares: Share[]) {
  if (doc.owner_id === userId) return true;

  return shares.some(
    (share) =>
      share.document_id === doc.id &&
      share.shared_with_user_id === userId
  );
}

export function getDocumentRelationship(userId: string, ownerId: string) {
  return userId === ownerId ? "owned" : "shared";
}