# Plan: rounds 0 and 1

From `spec.md`. Run inline, a task at a time: its test first (watch it fail), the smallest code, tidy, then
`typecheck`, `lint`, `test:related` on its files, one commit. The full suite and the build once at each round's end,
then the branch and `main`. Later rounds get their plan when they start, from what these two leave.

Packages, said before they're added: `@supabase/supabase-js` and `supabase` (CLI, dev) in round 1, `rxdb` and
`valibot` in round 2.

**Order changed while building (2026-10-29):** schemas (0.1) move to round 2, where each store becomes sync
documents, so the sanitisers are rewritten once, not twice; branded ids (0.2) are built with the content port (0.5),
where the kinds get their ids. Round 0 runs 0.3 → 0.4 → 0.6 → 0.5.

## Round 0: the seams

**0.0 ADR.** `docs/adr/0116-the-backend.md`: the network rule (only the server's questions are gated), accounts
optional, content audiences and downloads, the seams below; adapted from memory-palaces' ADRs 0004 and 0005; added to
the index.

**0.1 Schemas (Valibot)** — moved to round 2.
- `shared/lib/schema.ts`: `savedShape(schema)` reading a save field by field, each field to its default when it
  fails (CLAUDE.md's rule as a function).
- Each entity's sanitiser becomes its `model/schema.ts`; the type is `v.InferOutput<typeof Schema>`; `store.ts` reads
  through `savedShape`.
- Tests: `schema.test.ts` (a field added later reads as its default; a wrong field falls to its default alone; another
  version's save starts from the initial state); every store's existing tests stay green unchanged.
- Check: `test:related` on every `store.ts`; no sanitiser left (`grep -r "function sanitis" src` empty).

**0.2 Branded ids and slugs** — built within 0.5.
- `shared/lib/id.ts`: `type Id<Brand> = string & { readonly __brand: Brand }` and a validating constructor per kind.
- `PieceId`, `LessonId`, `CourseId`, `PatternId`, `ProgressionId`, `ExerciseId`, `BookId` in their entities' `types.ts`;
  the URL's param stays the slug, parsed to the id at the route.
- Tests: a lesson id is refused where a piece id is wanted (a `@ts-expect-error` line in a type test); every route's
  param round-trips.
- Check: `typecheck` (it finds every caller).

**0.3 Network results.**
- `shared/api/result.ts`: `type NetResult<T> = { ok: true, value: T } | { ok: false, reason: 'offline' | 'refused'
  | 'failed', detail?: string }` and `toNetResult(promise)`.
- Tests: offline before any request (`navigator.onLine` false), a 4xx as `refused`, a throw as `failed`.

**0.4 Saved stores over a swappable storage.**
- `shared/lib/saved-store.ts`: `SaveStorage` port, `{ read(key), write(key, value), remove(key), watch(key, on) }`,
  all asynchronous; `localSaveStorage()` (today's behaviour, with other tabs) and `memorySaveStorage()` for tests.
- A store exposes `ready: Promise<void>`; `App` waits for every store behind a boot gate (the splash's first form).
- `setup.ts`/`setup-dom.ts` give each test a fresh `memorySaveStorage()`.
- Tests: a store reads its save once ready; writes reach the storage; another tab's save of its version is followed;
  the boot gate renders nothing until ready, then the app.
- Check: the full suite at the round's end (it touches every store and the test setup).

**0.5 Content through one gateway.** Design settled while building (2026-10-29), from where content is read:
- **Synchronous, always on the device:** the small kinds whole (exercises, patterns' figures and methods, the
  progression library, books: ~180 KB) and every item's **index entry** (a piece's title, level, key, collection,
  sections' names; a course's and a journey's structure; a lesson's title and place). Lists, search, filters, the
  router's not-found checks and progress keep reading these synchronously, as today.
- **Asynchronous, through the port:** only the **bodies**: a piece's chart or score, a lesson's sections (~2.8 MB).
  Their readers are few: the Player, the song page and its sections, the score editor, the lesson view.
- So the piece and lesson types split into `…Entry` (index) and `…Body`; `pieceById` and `lessonById` give entries;
  `useContent('piece' | 'lesson', id)` gives the body with its status. The learner's own songs and versions stay
  whole in their store (always on the device) and come back from `useContent` ready at once.
- **What reads every song's body** (found 2026-10-29): chords on song rows and a piece's Skills (`chordsOfPiece`,
  `skillsOfPiece`, `features/trainer/check-plan`), the progressions a song uses and the songs a progression is in
  (`progression-library/in-songs`), and Search's index (`pages/search/model/index-entries`). Each becomes a field
  **derived into the entry** by the same function (`chords`, `skills`, `stretches`: the readings `findNumerals`
  needs), computed when the files are read now and when an item is published later, and tested to equal what the
  body gives. Then nothing outside the Player, the song page, the editor and the lesson view needs a body.
- **Order inside 0.5:** (a) the entry/body split of pieces with the derived fields, its readers moved; (b) the port,
  the hook and the four states on the body readers; (c) lessons the same way; (d) the architecture test and the
  build's chunk check.

- `shared/api/content/port.ts`: `ContentPort { catalog(kind): Promise<CatalogEntry[]>, item(kind, id):
  Promise<NetResult<Item>>, watch(on) }`; `filesContentPort()` serving today's `entities/*/content`; a fake.
- `shared/lib/content/use-content.ts`: `useContent(kind, id)` → `{ status: 'loading' | 'ready' | 'offline' |
  'missing', item }`, `useCatalog(kind)`; one `ContentProvider` from the composition root.
- Move every direct import of `PIECES`, `LESSONS`, `COURSES`, `pieceById`, … outside the entities to the hooks (about
  200 import sites, 16 files outside entities name the constants); `entities/*/content` is then imported only by
  `filesContentPort`.
- Each screen showing content renders the four states: a skeleton while loading, "Needs a connection" offline, the
  not-found page when missing (the `shared/ui` pieces exist; strings in en and ru).
- Tests: the hooks against the fake (each state); one `renderApp` test per place showing loading then the item; an
  architecture test that no module outside `filesContentPort` imports `entities/*/content`.
- Check: `npm run build` (the content leaves the selectors' chunks: compare `dist/assets` before and after).

**0.6 One composition root.**
- `createServices()` returns `{ audio, midi, content, storage }` now (`auth` and `sync` join in rounds 1 and 2); a
  `ServicesProvider` gives them; `renderApp` takes overrides of each.
- Tests: `renderApp` with a fake content port and memory storage; nothing in `src` builds a service but the root
  (architecture test).

**Done (2026-10-29):** 0.0 ADR 0116; 0.3 `shared/api/network`; 0.4+0.6 `createStores` and `createContent` in
the composition root (every store already took its storage); 0.5 A `factsOf` (cross-song readers on facts), C the
`ContentPort` (`has`, `ensure`) ensured in the routes' `beforeLoad` with the existing pending, not-found and error
screens. **Left to round 4:** the entry/body type split (TypeScript finds the readers once entries lack bodies),
`factsOf` reading an entry's own `facts`, a lesson's route ensuring the songs its blocks embed (`LessonBlock`,
`LessonLinkRow`, `GuidedSongs`, the pattern sample's tune), and the architecture test that only the content port
imports `entities/*/content`.

**0.7 Round end.** Full suite, build, CLAUDE.md (the seams in its map and change rules), the glossary (Content port,
Save storage, Net result), push the branch and `main`.

## Round 1: the database and its rules

**1.1 The project in the repo.** `supabase/config.toml` (project `itmiutianxvtlwhdsalo`), `.env.example` with
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`; secrets never committed.

**1.2 Migrations**, copied from memory-palaces where they fit, applied with the Supabase tools, each a file:
- `user_documents`: one table per saved store (`settings`, `progress`, `library`, `pieces`, `takes`, `views`,
  `patterns`, `keyboard`, `diagram_inversions`): `user_id`, `id`, `data jsonb`, `updated_at`, `deleted`, primary key
  `(user_id, id)`; RLS `auth.uid() = user_id` for each verb; `updated_at` index for the pull.
- `push_documents` RPC (based writes, advisory locks in id order) and its pull; realtime on `updated_at`.
- Storage: a private `takes` bucket, paths under the user's id, RLS on `storage.objects`.
- `profiles` (display name, avatar path, created), `account_deletions` and the `pg_cron` purge job with its Edge
  Function.
- `harden_grants`: revoke from `anon` and `public`, grant the verbs RLS allows to `authenticated`.
- Check: `get_advisors` (security and performance) with nothing open; a SQL test per table that another user's row is
  invisible and unwritable.

**1.3 Types.** `shared/api/supabase/database.types.ts` generated by `generate_typescript_types`; the schemas of 0.1
checked against them in a type test.

**1.4 The gateways**, copied from memory-palaces' `shared/api` and fitted:
- `auth-gateway.ts` (sign in with password, sign up, OAuth for `google` and `apple`, reset, change password, sign out
  local-first) and `supabase-auth-gateway.ts`; `cloud-sync-port.ts` and `storage-port.ts` with their Supabase
  adapters; in-memory fakes of each, tested to behave as the real ones (one contract test file per port run against
  the fake, and against the project once by hand).
- The client built once in `createServices()`; `auth` added to the services.
- Tests: each gateway's results as `NetResult`s; signing out offline still clears the session.

**Done (2026-10-29):** migrations applied (security advisor clean; `supabase/tests/access.sql` passes), the two
Edge Functions deployed, `.env` with the public URL and key, `shared/api/supabase` (client, types) and
`shared/api/auth` (gateway, fake, contract). **Moved to round 2:** the cloud-sync and storage ports, built with the
sync that uses them. **Owner, later:** the purge's two Vault secrets.

**1.5 Round end.** Full suite, build, ADR 0116's History, CLAUDE.md (`supabase/`, the gateways), push.

## Round 2: sync (planned 2026-10-29)

**Decided while planning:** no RxDB. Every store is small JSON in localStorage, synchronous, read by zustand; takes
are MIDI notes, not audio. Moving eight stores onto RxDB would rewrite each for nothing a sync over them lacks, so
the sync runs over the stores as they are, with memory-palaces' design (ADR 0005 there): a pending-change log, pushes
naming their base, the server refusing a write over any other, a field-by-field merge, only a deletion meeting a
change elsewhere asking. ADR 0116 is amended to say so. The `takes` bucket goes (nothing to put in it); `avatars`
stays. `valibot` comes with the documents' schemas only if a store's sanitiser does not already read a document.

**2.1 Documents.** Each store says what its documents are, in its entity's `model/documents.ts`:
`documentsOf(state) → Map<id, data>` and `withDocuments(state, docs) → state`, read through the store's own
sanitiser. Settings, progress, views, library, diagram inversions: one document each (`settings`, …). Pieces: one per
own song and per version (`song:<id>`, `version:<id>`); patterns: one per own pattern; takes: one per take. Tests:
round trip for each store; a document of another shape reads through the sanitiser to the defaults.

**2.2 The sync's kernel, pure** (`shared/lib/sync`): `SyncDocument { id, data, updatedAt, deleted }`;
`changedDocuments(before, after)`; `mergeFields(base, mine, theirs)` (a field one side changed is kept; both changed:
the newer clock, progress's counters summed from the base); the pending log (`pending`, `confirm(at)`). Tests from
memory-palaces' `mergeFields` cases and our stores' fields.

**2.3 The cloud port** (`shared/api/sync`): `pull(table, since) → NetResult<rows>`, `push(table, rows) →
NetResult<refused rows>`; the Supabase adapter (`push_documents`, a select past the checkpoint); a fake server
implementing `push_documents`' rule, held to the adapter by a contract test (and run once against the project).

**2.4 The runner** (`features/sync`): `syncNow` — pull since the checkpoint, merge into the stores, push the pending
with their bases, merge what is refused and push again, confirm, step the checkpoint; one cycle at a time; offline it
says so and does nothing. Pending changes recorded by subscribing to each store (`pt-sync`: log, checkpoints, the
bases). Tests: two devices over the fake server (edit here and there, delete meeting an edit, offline then back).

**2.5 When it runs** (`app/providers/SyncProvider`): signed in only; Autosync on reconnect, on visibility, 4 s after
writes settle; Settings quietly. A first sync on a device holds the splash (round 7) for at most 10 s.

**2.6 Round end.** Full suite, build, ADR 0116 amended, CLAUDE.md, push.

## Round 3: accounts, Settings, Profile, the welcome (planned 2026-10-29)

From memory-palaces' threshold pages (login, signup, forgot-password, auth-callback, settings-profile with
DeleteAccountSheet, SocialButtons) fitted to our kit (`SettingsGroup`, `RowLink`, `SwitchRow`, `Segmented`,
`SettingField`, `ScreenHeader`, `BackButton`). Every string in en and ru; each page's test through `renderApp`.

**3.1 Account pages** (`pages/account`, one place, routes under `/account`): Sign in (email, password, Forgot,
Google · Apple coming soon, Create an account), Create an account (name, email, password; "check your email" when the
server asks to confirm), Forgotten password (sends the email, says so whatever the address), the callback
(`/auth/callback`: the code exchanged; `?next=reset` opens New password). Offline: each form's button disabled with
the offline note (the network rule). Errors from `NetResult.detail` mapped to plain messages (wrong password, email
taken, weak password, too many tries).

**3.2 Settings regrouped:** `/settings` an index: the account card (signed out: Sign in · sync your songs and
progress; signed in: name, email, the sync's state), then rows to Preferences (language, theme, appearance),
Playing (the keyboard, MIDI, recording), Sync and data (Autosync status and Synchronise, backup, reset progress),
Help (How to use, About: version, credits). Each a page under `/settings/…`, the old page's rows moved, not
rewritten.

**3.3 Account settings** (`/settings/account`, signed in): name (synced in `profiles`), email, change password, sign
out (local, always), delete account (typed confirmation, the 30-day grace, `request-account-deletion`); the
scheduled-deletion gate on sign-in (Cancel deletion · Sign out).

**3.4 Profile** (`/profile`): name and initial avatar, or a guest's sign-in card; the practice record from
`pt-progress` (streak, minutes this week against the daily goal, songs learned, lessons and courses finished,
Skills rated); the songs played most. From the account card and the shell's header.

**3.5 Welcome** on first run (`pt-settings.welcomed`): language, level (picks Learn's start), MIDI keyboard, daily
goal; Sign in or Continue without an account.

## Round 4: content from the database (planned 2026-10-29)

Today ~3 MB of authored content (pieces 1.5 MB, courses 0.9 MB, lessons 0.5 MB, the rest small) is compiled into
the app and read synchronously everywhere (`PIECES`, `COLLECTIONS`, lesson and course modules). The round moves the
bodies out of the bundle without making every reader async:

- **The repo stays the authoring source until round 6** (inline editing): `entities/*/content` are what the export
  reads and what the content tests check. The app's bundle keeps only the **catalog index** (generated: ids, titles,
  facts, levels, sizes) and the **starter set** (a few songs and the first lessons, so a first run offline works).
- **A body registry** (`shared/api/content`): bodies brought onto the device live in IndexedDB and, once opened
  this session, in memory; `has` is synchronous over memory, `ensure` reads IndexedDB, then the server. Routes
  already `ensureContent` before their screen renders (round 0), so screens read bodies synchronously from the
  registry as they read the modules now.

Tasks, each test-first, one commit:

**4.1 Tables** `content_items` (`kind`, `id`, `version`, `audience` everyone · signed-in · group:<id> · admins,
`status` draft · published, `meta jsonb`, `body jsonb`, `size`, `updated_at`) and `content_versions` (each published
version, kept); RLS: published items whose audience the caller is in (anon reads `everyone`), drafts to admins
(`app_metadata.role`). Writes only by admins. `tests/access.sql` extended.

**4.2 Export** `scripts/export-content.ts` (run with jiti, `@` aliased): every piece and lesson as
`{kind, id, version: hash(body), meta, body}` into `content/export/*.json`; a content test proves export → import
round-trips to the same objects.

**4.3 Seed** the project from the export (SQL in chunks through the Supabase tools; later an admin Edge Function).

**4.4 The Supabase content port**: `ensure` = IndexedDB → `content_items` select by kind and id → stored; a version
change in the index replaces the stored body. Fake-IndexedDB in tests.

**4.5 The split**: `entities/piece` and `entities/lesson` read their entries from the catalog index and their
bodies from the registry; the starter set bundled; the architecture test holds the bundle to it. `factsOf` reads the
entry's facts. A lesson's route ensures the songs it embeds.

**4.6 Offline UX**: Download for offline (a song, a course, a collection, a folder), a Downloaded filter, "Needs a
connection" on what is away while offline, Settings → Sync and data → Storage (downloads, sizes, Remove).

Order: 4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6; the full suite and the build at the end; ADR 0116 r4.
