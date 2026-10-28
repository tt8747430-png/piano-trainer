# ADR 0116 — The backend: accounts, sync, content from the database

- **Status:** accepted · **Date:** 2026-10-29

## Context

Everything the learner does lives in one browser and every song, lesson and course is written into the code (about
3 MB), so a change to content is a release, nothing follows the learner to another device and nothing is backed up.
The owner asked for a production app: a database, accounts, content pulled from the database and downloaded as
needed, an admin area, inline editing and a Public library. The owner's `memory-palaces` repo runs on Supabase and
RxDB with the accounts, sync and deletion we need; we copy its design and code where they fit (its ADRs 0004, 0005).

## Decision

- **Supabase**, project `piano-trainer` (`eu-west-1`): Postgres with row-level security on every table, auth, private
  storage, Edge Functions. A staging project mirrors it.
- **Accounts are optional.** The app does everything without one; an account adds sync, backup and the profile on
  every device. Sign-in by email and password or Google; Apple shown as Coming soon.
- **The network rule** (memory-palaces' ADR 0004): an action waits on the network only when the server must answer
  for it to be right (sign in, sign up, reset, a password change, requesting deletion, publishing). Every other write
  is the device's and a sync carries it later. Signing out is local, always.
- **Sync** (its ADR 0005): every saved store lives in a local database (RxDB on IndexedDB) and each write waits in a
  pending-change log until a sync confirms it. A push names the server copy it was based on; the server refuses a
  write over any other and the device merges field by field. Only a deletion meeting a change elsewhere asks.
  Settings sync quietly; the rest on Autosync or Synchronise.
- **Account deletion** has a 30-day grace and a daily purge.
- **Content lives in the database**, read-only to learners: a catalog index synced whole (titles, levels, keys, sizes)
  drives every list offline; an item's body downloads when first opened, or ahead with Download for offline, and is
  fetched again only when its version changes. A starter set ships in the app and always works. Each item has an
  audience: everyone, groups, or admins. Only an admin edits the built-in content, in place, as drafts published with
  every version kept.
- **The Public library:** a learner's own songs, patterns and progressions are private until published; a published
  item is a snapshot others can play and save a copy of, credited. Reports go to the admin.
- **Admin** is a role set only by the server (`app_metadata.role`), read by row-level security and Edge Functions;
  accounts are listed through an Edge Function, never by the client. Features reach groups behind switches; every
  build goes to everyone.
- **The seams the app is built on:**
  - a song's music and a lesson come through one port (`ContentPort`: `has`, `ensure`); a route that shows one
    ensures it in `beforeLoad`, so the route's pending, not-found and error screens are its loading, missing and
    offline states; what reads across the songs reads `factsOf`, never the music;
  - the saved stores are built once on one storage (`createStores`), which RxDB replaces in round 2;
  - every service and port is built once in the composition root, and tests take fakes from the same place;
  - every server call returns its result as a value (`ok`, `offline`, `refused`, `failed`), never a throw;
  - ids are branded by kind with the entry/body split, and one schema per data shape (Valibot) with the sync's
    documents: both when the database serves content and stores sync (rounds 2 and 4).

- **Where it lives:** `supabase/` (migrations, Edge Functions, `tests/access.sql`); the client and the database's
  types in `shared/api/supabase`, built once in the composition root from `.env` (the project's URL and
  publishable key, public by design); the accounts' gateway in `shared/api/auth`.

## Consequences

- The app's code drops the content and the first install drops its size; a screen showing content renders its
  loading and offline states.
- A shape change still bumps a store's version (ADR 0038); the server's tables follow the same schemas.
- Testing runs against in-memory fakes of every port, each fake held to the real adapter by a contract test.

## History

- 0116 — The backend: Supabase, optional accounts, sync, content from the database, admin, the Public library
  (2026-10-29), from the owner's production request and memory-palaces' ADRs 0004 and 0005.
- r1 — The database: the learner's document tables with row-level security, `push_documents`, private buckets
  for takes and avatars, account deletion with its daily purge and Edge Functions; the accounts' gateway
  (2026-10-29).
