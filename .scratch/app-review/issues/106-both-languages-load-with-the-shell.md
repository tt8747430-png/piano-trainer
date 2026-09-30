# 106. Both languages' every namespace loads with the shell

Status: wontfix
Severity: P2
Tier: 6
Rule: CODE_STYLE §7 (the first paint carries only the shell)
Where: `src/shared/i18n/index.ts:3-4,21`

## What is wrong

The first paint holds 34,436 B of locale text (Russian 21,009, English 13,427); the first screen reads `common`, `path` and `music` only.

## The test that shows it

Measured in scratch builds: registering each screens chunk's namespaces there saves 22.1 kB raw, 6.8 kB gzip (4% of the first paint's 166 kB); loading only the chosen language saves 9.1 kB gzip.

## The fix

None.

## Comments

The first saves 6.8 kB gzip, served from the precache after the first visit, at the cost of every screens chunk registering exactly the namespaces its screens and their widgets use, a miss showing raw keys that no test would see (`renderApp` loads every chunk). The second makes a language switch wait on a fetch and ends `initAsync: false`'s promise of text on the first render.
