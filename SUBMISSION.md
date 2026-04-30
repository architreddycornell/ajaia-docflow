# Submission Contents

## Live Product URL

https://ajaia-docflow.vercel.app/


## Walkthrough Video



## Included Materials

- Source code for DocFlow
- `README.md` with setup and run instructions
- `ARCHITECTURE.md`
- `AI_WORKFLOW.md`
- `SUBMISSION.md`
- Supabase schema SQL
- Automated test for access logic

## Test Accounts

The app uses mocked seeded users:

1. Archit Reddy
   - ID: `user_archit`
   - Email: `archit@example.com`

2. Reviewer User
   - ID: `user_reviewer`
   - Email: `reviewer@example.com`

Use the top-right user switcher to test document ownership and sharing.

## What Works

- Create documents
- Rename documents
- Edit rich-text content
- Save and reopen documents
- Import `.txt` and `.md` files
- Share documents with another seeded user
- View owned vs shared documents
- Persist documents and shares in Supabase
- Run automated access-logic test

## Incomplete or Intentionally Deferred

- Real-time multiplayer editing
- Full authentication
- `.docx` import
- Comments and suggestions
- Version history
- Role-based permissions

## What I Would Build Next

With another 2-4 hours, I would add:

1. Debounced auto-save
2. View-only vs edit access
3. Document deletion/archive
4. Version history
5. Export to Markdown or PDF