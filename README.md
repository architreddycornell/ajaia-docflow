# DocFlow

DocFlow is a lightweight collaborative document editor built for the Ajaia AI Delivery assessment.

## Live Demo



# Vercel Link

(https://ajaia-docflow.vercel.app/)

## Test Users

The app uses a mocked user switcher rather than full authentication.

- Archit Reddy: `user_archit`
- Reviewer User: `user_reviewer`

Use the switcher in the top-right corner to test ownership and sharing behavior.

## Features

- Create a new document
- Rename documents
- Edit rich-text content in browser
- Basic formatting:
  - Bold
  - Italic
  - Underline
  - Heading
  - Bulleted lists
  - Numbered lists
- Save and reopen documents
- Import `.txt` or `.md` files as editable documents
- Share documents with another seeded user
- Distinguish between owned and shared documents
- Persist documents and sharing data in Supabase
- Automated test for access-control logic

## Intentional Scope Cuts

This project does not implement:

- Google authentication
- Real-time multi-editing
- CRDT or operational transform sync
- Comments or suggestions
- Enterprise-grade permissions
- `.docx` parsing

These were intentionally deprioritized to focus on a coherent, testable product slice within the 4-6 hour timebox.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- TipTap rich-text editor
- Supabase
- Vercel
- Vitest

## Local Setup

```bash
git clone [repo-url]
cd ajaia-docflow
npm install