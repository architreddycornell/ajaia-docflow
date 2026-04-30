# AI-Native Workflow Note

## AI Tools Used

I used AI assistance as a development copilot for:

- product scoping
- architecture planning
- schema design
- API route scaffolding
- editor library integration patterns
- test case generation
- documentation drafting
- tradeoff review

## Where AI Materially Sped Up the Work

AI was most useful in defining an implementation plan. The prompt had multiple possible directions: real-time collaboration, file handling, sharing, persistence, and editor UX. I used AI to compare scope options and converge on a practical solution.

AI also sped up repetitive scaffolding, especially:

- boilerplate API handlers
- TypeScript types
- README structure
- architecture note structure
- test case coverage ideas

## What I Changed or Rejected

I rejected several AI-suggested ideas that were too broad for the timebox, including:

- real-time collaboration
- Yjs/CRDT integration
- full authentication
- `.docx` parsing
- commenting workflows
- role-based enterprise permissions

These would have increased complexity without improving the core assessment signal as much as a working end-to-end document workflow.

I also reviewed and simplified generated code to keep the implementation readable and focused. Where possible, I preferred explicit logic over abstraction so reviewers could quickly understand the product behavior.

## How I Verified Correctness

I verified correctness through:

1. Manual end-to-end testing:
   - create document
   - rename document
   - edit formatted content
   - save and reopen document
   - import `.txt` / `.md`
   - share with another user
   - switch users and confirm shared visibility

2. Automated testing:
   - added a Vitest test for document access logic

3. UX review:
   - checked that reviewers can understand the workflow without setup explanation
   - added visible owned/shared document sections
   - kept supported file types clear in the UI and README

4. Deployment verification:
   - confirmed the deployed URL loads
   - confirmed Supabase persistence works after refresh
   - confirmed seeded users can demonstrate sharing behavior