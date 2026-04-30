
---

# 13. ARCHITECTURE.md

```md
# Architecture Note

## Product Goal

The assignment asked for a lightweight collaborative document editor inspired by Google Docs. I scoped the product around the smallest coherent document workflow: create, edit, save, reopen, import, and share.

The goal was not to recreate Google Docs, but to demonstrate practical product judgment, full-stack execution, persistence, and access logic under a time constraint.

## Architecture Overview

DocFlow uses a Next.js application with API routes, a TipTap rich-text editor on the frontend, and Supabase for persistent storage.

The app has three major surfaces:

1. Document workspace
2. File import workflow
3. Sharing workflow

The frontend communicates with internal API routes rather than calling database logic directly from every component. This keeps product behavior easier to reason about and creates a clearer path toward future authentication and authorization.

## Data Model

The schema has three tables:

### users_demo

Seeded users for mocked authentication.

### documents

Stores document metadata and rich-text HTML content.

Key fields:

- `id`
- `title`
- `content_html`
- `owner_id`
- `created_at`
- `updated_at`

### document_shares

Stores document access grants.

Key fields:

- `document_id`
- `shared_with_user_id`
- `permission`

This allows the UI to distinguish between owned documents and documents shared with the current user.

## Sharing Model

I implemented a simple owner/share model.

Owners can share their document with another seeded user. Shared documents appear under "Shared with me" when that user is selected.

This is intentionally simpler than enterprise access control, but demonstrates the core access pattern needed for collaboration:

- every document has an owner
- access can be granted to another user
- shared access is persisted
- owned and shared documents are visibly separated

## File Upload Strategy

The app supports `.txt` and `.md` imports.

When a user uploads a supported file, the app creates a new editable document using the file name as the title and the file contents as editable body content.

I intentionally did not implement `.docx` parsing because reliable document parsing would add extra dependency and edge-case complexity. Within this timebox, `.txt` and `.md` support better demonstrates the product workflow without distracting from the core editor and sharing model.

## Persistence Strategy

Supabase was chosen because it provides hosted persistence, simple SQL tables, and a smooth deployment path. This avoids local-only storage and lets reviewers test the live deployed version without needing to run a database locally.

For the assessment demo, Supabase Row Level Security is disabled because access is enforced through application-level mock-user logic. In a production version, I would move this to Supabase Auth-backed RLS policies.

## UX Priorities

I prioritized:

- fast document creation
- simple navigation
- clear owned/shared distinction
- visible formatting controls
- low-friction file import
- simple reviewer testing through mocked users

The user switcher is not intended as production authentication. It is a deliberate assessment-friendly shortcut that makes sharing behavior easy to test.

## Scope Cuts

I intentionally deprioritized:

- real-time collaboration
- operational transforms / CRDTs
- Google authentication
- comments
- suggestions
- version history
- `.docx` parsing
- granular role-based permissions

These features are valuable, but each would require meaningful complexity. The stronger assessment choice was to ship a complete, testable vertical slice.

## What I Would Build Next

With another 2-4 hours, I would add:

1. Debounced auto-save
2. Read-only vs edit permissions
3. Document delete/archive
4. Basic version history
5. Export to Markdown or PDF