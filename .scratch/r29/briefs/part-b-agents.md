# Part B agents: shared brief

You build items of Part B in a git worktree. The spec is `.scratch/r29/plan/part-b.md`: read your items' sections
in full (and "Build order" and "Owner's to-dos" at its end) before writing code. Read `CLAUDE.md` and
`.claude/skills/owner-way/SKILL.md` (the owner's rules) first; `docs/CODE_STYLE.md` and `DESIGN.md` before UI.

## Rules (the owner's, verbatim in spirit)
- The plan's "Will build" and "Done when" are the spec. Where it leaves a choice, take the default the plan names
  (its "Owner's question" default); otherwise the sensible choice, and log it as a ruling in your report.
- Test first (red, green). Every UI string in en and ru. Loading, empty, error, offline states.
- One commit per finished task, message "R29-B<n>: what and why", ending with these two lines exactly:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01RLULmeGMHBXAgs4W7vM6qK
- Check only what you changed: `npm run typecheck`, `npm run lint`, `npm run test:related -- <changed files>`;
  `npm run build` after a route change. NEVER the full `npm run test`. Never two test runs at once.
- `npx prettier --write <files you touched>` only; never `npm run format`.
- Never `git checkout/restore/stash/reset` work you did not make. No `npm install`.
- Database: write migrations under `supabase/migrations/` (no `drop` statements), update
  `shared/api/supabase/database.types.ts` by hand to match, and build the device side against the fakes. Do NOT
  apply migrations (no database access); list them in your report.
- Never write secrets, keys, emails or account values to files or commits.
- A saved store's shape change bumps its version (no migration code).
- Kill any process you start by its PID before you finish (dev servers, test runs).
- Screenshots (Playwright, Chromium is installed; `require('playwright')`) at 402x874, 874x402 and 1280x800 into
  `.scratch/r29/shots/after/`, checked for overflow and clipping; fix what you see.

## Report (short, under 400 words, also saved to `.scratch/r29/briefs/<your-items>-report.md`)
What was built per item, the commits, the rulings (each with its cost if wrong), what is left and why, and any
migration to apply.
