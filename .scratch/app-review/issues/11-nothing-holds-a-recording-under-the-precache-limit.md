# 11. Nothing holds a recording under the precache limit

Status: done
Severity: P3
Tier: 1
Rule: ADR 0016 ("1.04 MB, under Workbox's 2 MiB precache limit")
Where: `vite.config.ts`, `src/entities/piece/content/catalog.test.ts`

## What is wrong

Workbox leaves a file over 2 MiB out of the precache with only a build warning: a longer recording would play online only, silently.

## The test that shows it

`catalog.test.ts`: "keeps every recording small enough to be precached, so it plays offline (ADR 0016)".

## The fix

`PRECACHE_FILE_LIMIT` in `shared/config`, set as Workbox's `maximumFileSizeToCacheInBytes` and held by the test.

## Comments
