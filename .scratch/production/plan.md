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

**1.5 Round end.** Full suite, build, ADR 0116's History, CLAUDE.md (`supabase/`, the gateways), push.
