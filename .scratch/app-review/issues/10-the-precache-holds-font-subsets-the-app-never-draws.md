# 10. The precache holds font subsets the app never draws

Status: done
Severity: P2
Tier: 1
Rule: vite.config.ts's own rule ("the scripts the app writes"), applied to Literata only
Where: `vite.config.ts:61-64`

## What is wrong

Every character in `src` and `index.html` mapped against each subset's `unicode-range`: Onest's Vietnamese and Cyrillic-ext and Literata's Cyrillic-ext and Latin-ext hold none (the one Latin-ext character, ž, is in a credit set in Onest). They were precached anyway: about 130 KiB on every install.

## The test that shows it

Configuration: `npm run build` precaches 60 entries, 3149 KiB (was 64, 3279 KiB).

## The fix

`globIgnores` lists every subset no character reaches, with the rule in its comment.

## Comments
