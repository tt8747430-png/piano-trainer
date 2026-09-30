# 12. Deep links revalidate by Vercel's default, not the config

Status: done
Severity: P3
Tier: 1
Rule: CODE_STYLE §11 ("`vercel.test.ts` pins all of it")
Where: `vercel.ts:12`

## What is wrong

The revalidate rule matched `/index.html` only; `/`, every deep link and the icons revalidated by Vercel's static default, which the config neither stated nor tested. The test's deep link was `/theory/scales`, a path the app no longer has.

## The test that shows it

`vercel.test.ts`: "makes %s revalidate, so a deploy reaches learners" for `/`, `/learn/scales`, `/index.html`, `/sw.js`, `/manifest.webmanifest`, `/favicon.svg`.

## The fix

One rule: everything outside `/assets/` revalidates; `/assets/` stays immutable for a year.

## Comments
