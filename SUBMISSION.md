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
- Bold italic, underline, headlines, bullets, numbered lists
- Save and reopen documents
- Import `.txt` and `.md` files
- Share documents with another seeded user
- View owned vs shared documents
- Persist documents and shares in Supabase
- Run automated access-logic test

## Known Limitations

- Real-time multi-user editing
- View/Edit Permissions are stored but full view-only UI not implemented
- `.docx` import
- Comments and suggestions
- Version history

## What I Would Build Next

With another 2-4 hours, I would add:

1. Enforce view-only in editor and API update route
2. View-only vs edit access
3. Document Version history
5. Export to Markdown or PDF