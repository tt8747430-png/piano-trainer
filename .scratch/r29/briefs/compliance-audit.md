# Brief: round 29 compliance audit (read-only)

The owner asked: does everything implemented in round 29 follow their prompt, `.scratch/r29/prompt.md`?
Your job is an honest, evidence-based check of ONE part of the prompt (given in your task) against the
code on branch `claude/keen-gates-q9bnit` in /home/user/piano-trainer. Do not change any code, do not
commit, do not run the full test suite or the dev server.

Inputs:
- The prompt: `.scratch/r29/prompt.md` (read your part in full, plus "Read this first", "Standing
  rules" and "Decided" for context; cite items as the prompt does, e.g. "A39", "D16", "rule 23").
- What was claimed: `.scratch/r29/progress.md` (status table and decisions), `.scratch/r29/audit.md`.
- What was done: `git log --format='%h %s' 7bc59c57..HEAD --no-merges` (round 29 began at 7bc59c57)
  and the code. Specs per area in `.scratch/r29/*/spec.md`.

For every numbered item (and every bullet with a concrete requirement) in your part, decide one of:
- DONE: built as the prompt asks (cite the file or commit you checked);
- PARTIAL: say exactly which bullets are missing;
- NOT DONE: nothing built;
- CONTRADICTS: built differently from what the prompt says (quote the prompt line and what the code
  does). These matter most: look for them actively (e.g. a choice the prompt fixed that the code
  changed, a "Done:" criterion claimed but not met, a decided rule broken).
Verify in code, not from progress.md alone: progress.md can be wrong. Grep and read the relevant
source; read only what you need.

Also note where progress.md claims "done" but the code disagrees.

Write your findings to the output file named in your task as a markdown table per item group:
| Item | Requirement (short) | Status | Evidence / what is missing |
then a short "Contradictions" list and a "Claimed done but not" list. Keep it under 300 lines.
Report back in under 12 lines: counts per status and the most serious contradictions.
