# 57. The kernel's barrels export what nothing outside imports

Status: done
Severity: P2
Tier: 3
Rule: CODE_STYLE §8 (arrangement exports only…); smell baseline: Speculative Generality
Where: `src/shared/lib/{music,arrangement,notation,schedule}/index.ts`, `src/shared/ui/score/index.ts`

## What is wrong

76 names were exported that no file outside the kernel imported (checked by parsing every import, not by grep, which the case-blind file system fools); `chordHolds` was used by nothing but its test.

## The test that shows it

Every barrel now exports only names imported outside it (the script in the review's workspace); `chordHolds` and its test deleted.

## The fix

The names leave the barrels; the modules keep them for the kernel's own use.

## Comments
