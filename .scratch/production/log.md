# Production work log

The running record of the production rounds (spec: `spec.md`, plan: `plan.md`). Read this first after a compaction:
it says where the work stands, what was decided on the owner's behalf, and what comes next. Newest at the bottom of
each section. The owner said (2026-10-29): continue through every round overnight without asking; log everything.

## Where it stands

- Branch `claude/keen-gates-q9bnit`; `main` carries rounds 0 and 1 (pushed after green suites: 6502 → 6513 tests).
- Supabase project `piano-trainer`, ref `itmiutianxvtlwhdsalo`, `eu-west-1`, org `hhhabylwpqoudiihkqyn`.
  Migrations in `supabase/migrations` all applied; Edge Functions `request-account-deletion`, `purge-account`
  deployed (verify_jwt false, they check their caller). `supabase/tests/access.sql` passes.
- Round 2 (sync) in progress: done `shared/lib/sync/merge.ts` (mergeDocuments, byKey, byId, automatic item rule),
  `shared/api/sync` (CloudSync port, fake, Supabase adapter); in progress `shared/lib/sync/runner.ts` + test
  (uncommitted when this log was started).

## Decisions taken on the owner's behalf (report them in the morning)

1. No RxDB: the stores are small JSON in localStorage; the sync runs over them (plan, round 2).
2. One document per store (id `state`), its data the store's own save (`{state fields…, _version}`), read back
   through the store's sanitiser by announcing it as another tab's save. Merge field by field; a record field key
   by key, a list of id'd items item by item (no per-store configuration).
3. A save of another app version in the cloud: the higher version stands; an older device leaves it be.
4. A deletion meeting a change keeps the changed copy and reports `clash` (no dialog yet: stores are never deleted
   whole, so this cannot arise until per-item deletion is synced; noted for round 3's UI).
5. The `takes` bucket is unneeded (takes are MIDI notes): drop it in a migration with the round-2 changes.
6. Content-body type split (entry vs body) and a lesson's embedded songs: left to round 4 (plan 0.5 notes).
7. Schemas (Valibot): only if a store's sanitiser cannot read a synced document; so far none needed.
8. `.env` committed with the project URL and publishable key (public by design), so Vercel needs no setup.

## Owner's to-dos (cannot be done from here)

- Google OAuth client ID and secret → Supabase Auth → Providers → Google (redirect URI in spec).
- Vault secrets `project_url`, `secret_key` for the daily account purge (spec).

## Log

- 2026-10-29 Round 0 done and on main: ADR 0116, NetResult, createStores/createContent, factsOf, ContentPort with
  ensureContent in routes; flaky Progressions test made robust (beforeAll warm-up).
- 2026-10-29 Round 1 done and on main: migrations, Edge Functions, access test, `.env`, shared/api/supabase,
  shared/api/auth (gateway, fake, contract, adapter test).
- 2026-10-29 Round 2: merge kernel and cloud port committed; runner being written.
