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
- **Sync** (its ADR 0005, without its local database): every saved store stays in the browser's storage, small
  JSON, and syncs as one document in its table (`state`), its data the store's own save. The device notes a store
  changed when its save is written (`createSyncRunner`'s watched storage); a sync reads the cloud's copy, merges it
  with the device's against the copy both started from where both changed (a field at a time; a record key by key,
  a list of items with ids item by item), brings the result into the store as another tab's save is brought in,
  and pushes it naming that base; the server refuses a write over any other copy and the device merges again. A
  save of a newer app version in the cloud is left be. Autosync, signed in only: at sign-in, on reconnect, when the
  app comes into view, 4 s after saving settles (`AccountProvider`). The keyboard's store stays on the device.
- **Account deletion** has a 30-day grace and a daily purge.
- **Content lives in the database** (`content_items`: kind, id, version, audience, status, meta, body; every
  published version kept in `content_versions`), read-only to learners; editors (`app_metadata.role` admin or
  editor) read drafts and write. The authored content is small (songs 82 KB as data, lessons about 1 MB, in lazy
  chunks), so **the app carries all of it** as its offline starter and the built-in content always works. The
  database delivers what changed and what is new: after first paint the app compares the published versions with
  its own content's (a hash of each body), keeps the changed bodies in IndexedDB (`pt-content`), and reads them at
  the next start, before the first screen, where each entity overlays them on its own (`keepContent`; a body is
  taken only where it reads as its item). An update so lands as an app update does, never mid-use. A recording's
  file stays the app's asset (its URL is a build's), the database holding its timing. What is never bundled
  downloads when opened: the Public library's items, and recordings once they move to storage (round 7). Until
  content is edited in the app (round 6), `entities/*/content` is the source: `scripts/export-content.mjs` and
  `scripts/seed-content.mjs` publish it.
- **The Public library:** a learner's own song is private until they publish it (its More: Publish to the Public
  library, asked first with what it means and the rights it takes; Update once it has changed; Remove). A published
  song is a snapshot held as a save holds an own song (`public_items`, one per author and song, 200 KB at most), read
  by anyone, written by its author unless an editor has blocked them, at most 20 publishes an hour. Songs → Public
  library lists them, newest or most saved, searched by title; a song's page plays it and saves an own copy (a save
  counted once per signed-in learner, `save_public_item`) and takes a report (`public_reports`, a reason and a
  note) to the editors, who hide an item (`hide_public_item`, never its author) or block a publisher. Patterns and
  progressions follow on the same tables.
- **Admin** is a role set only by the server (`app_metadata.role`: admin or editor; anyone else a learner), read
  by row-level security, by Edge Functions and into the app's `Account`. The first admin is the owner: their
  address is listed in `admin_bootstrap` (in the database only, never the repo) and their account becomes an admin
  when it is made. Accounts are listed and their roles changed through the `admin` Edge Function, which checks the
  caller's role itself; never by a client query on `auth.users`. Groups, their members and feature switches are
  admins' tables; a switch is on for everyone, no one, or chosen groups, and the app asks `my_features()` at start
  and at each sign-in (`useFeature`): every build goes to everyone, a feature waits behind its switch. The Admin
  area (`/admin`, its own chunk, in Settings for admins): Accounts, Groups, Switches, Reports, Activity; every
  change is written to `admin_log`.
- **The seams the app is built on:**
  - a song's music and a lesson come through one port (`ContentPort`: `has`, `ensure`); a route that shows one
    ensures it in `beforeLoad`, so the route's pending, not-found and error screens are its loading, missing and
    offline states; what reads across the songs reads `factsOf`, never the music;
  - the saved stores are built once on one storage (`createStores`), the sync's watched storage;
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
- r2 — Sync over the saved stores as they are, no RxDB: one document a store, merged field by field, collections
  item by item; Autosync while signed in; the takes bucket's policies dropped (takes are MIDI notes) (2026-10-29).
- r3 — The accounts' screens: sign in (email, Google; Apple coming soon), create an account, a forgotten and a new
  password, the callback; Settings as an index of pages with the account's own (rename, password, sign out,
  delete after 30 days, the gate on signing in to an account to be deleted); the Profile; the welcome (2026-10-29).
- r4 — Content in the database as updates over the carried content, not bodies taken out of the bundle: measured,
  the content is small; the database's changes are kept on the device and read at the next start (2026-10-29).
- r4b — The Public library for songs; a store's first sync takes the account's plain values (2026-10-29).
- r5 — Admin: roles, the first admin from `admin_bootstrap`, the `admin` function, groups, feature switches,
  reports and the activity log; the Admin area (2026-10-29).
- r6 — Content edited in the app: an editor's draft of an item (`content_drafts`), published by `publish_content`
  (the draft's body becomes the item's under the hash of its body, the version kept) or a kept version restored;
  the `ContentEditingPort` (`shared/api/content-editing`). A built-in song's original is edited in the score
  editor (`/edit/$pieceId?original=true`, `features/edit-original`): it opens on the draft, else the song as
  published now; each change is saved to the draft once the editor rests; Publish checks the music reads first.
  A lesson's every text is edited on its lesson editor (`/lessons/$lessonId/edit`, a course's under its course;
  `pages/lesson-editor`), English and Russian side by side; its examples stay as authored this round
  (2026-10-29).
- r7 — Error reports: a screen's error (`RouteError`) and one never caught are reported once a run, ten at most,
  into `error_reports` (written by anyone, capped at a hundred a minute, read by admins: the Admin area's Errors
  tab), with no third party. Privacy and Terms pages. supabase-js loads on the first call that needs it, after
  the first paint: every adapter takes a `Backend` (`() => Promise<PianoClient>`), and the app's first chunk
  went from 154 KB to 100 KB gzipped (2026-10-29).
- r8 — End-to-end checks with axe on the production build (`e2e/`); WCAG 2.5.3 fixes (shorthand a control's name
  says in words drawn by `Glyph`); a song saved from the Public library names who published it; Settings shows
  what the device keeps and asks the browser to keep it safe; Renovate's config (2026-10-29).
- r9 — Patterns in the Public library: `public_items.kind` takes `pattern` (an own pattern's name and two figures,
  `pattern/`-prefixed source ids); the library browses one kind at a time (Songs · Patterns, `?kind=`); a pattern
  saved opens as the learner's own; `features/publish` publishes either (2026-10-29).
- r10 — Review of rounds 6–9 at every size: the Public library's kind moved into its bar's tabs (2026-10-29).
- r11 — A lesson's examples written as a line of text are edited in the lesson editor (a row of chords, a line of
  notes and its left hand's, a progression's numerals), each read by the reader the lesson plays it with; a
  lesson publishes only with every one reading (2026-10-29).
