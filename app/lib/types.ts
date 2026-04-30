export type DemoUser = {
  id: string;
  name: string;
  email: string;
};

export type DocumentRow = {
  id: string;
  title: string;
  content_html: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export const DEMO_USERS: DemoUser[] = [
  { id: "user_archit", name: "Archit Reddy", email: "archit@example.com" },
  { id: "user_reviewer", name: "Reviewer User", email: "reviewer@example.com" },
];