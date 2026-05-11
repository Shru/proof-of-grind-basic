# Contributing to Proof of Grind

Thanks for helping out!

## Getting started

1. Fork the repo and clone it locally
2. Copy `.env.example` to `.env` and fill in the Supabase credentials (ask the maintainer)
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

## Making changes

- Create a branch off `main` named after the issue: `fix-123-bug-description` or `feat-123-feature-name`
- Keep changes focused — one issue per PR
- Make sure `npm run build` passes before opening a PR

## Opening a pull request

- Reference the issue in your PR description: `Closes #<issue-number>`
- Briefly describe what you changed and why
- A maintainer will review and merge

## Code style

- TypeScript — no `any` if avoidable
- Use the existing `shadcn/ui` components in `src/components/ui/` rather than adding new UI libraries
- Use `cn()` from `src/components/ui/utils.ts` for conditional Tailwind classes
