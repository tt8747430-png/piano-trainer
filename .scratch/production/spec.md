# Production: accounts, sync, content from the database, admin, inline editing

Status: ready. The owner's words: "make the app production ready … good architecture, database, accounts … splash
screen … hardcoded lessons or songs … a database to pull the information from … proper settings … proper profile
page … inline editor for all the content … admin dashboard … content downloadable so the user takes only what he
needs." Model: the owner's `memory-palaces` repo (Supabase + RxDB), whose code we may copy.

## Decided by the owner

- **Backend:** a new Supabase project, `piano-trainer` (ref `<project-ref>`, `eu-west-1`), beside
  memory-palaces in the same organisation.
- **Accounts are optional**, as in memory-palaces: the app works fully without one; an account adds sync, backup and
  the profile across devices.
- **Sign-in:** email and password, Google; Apple shown as **Coming soon** (disabled) until a paid Apple developer
  account exists. Password reset by email.
- **Later, from the owner:** Google's OAuth client ID and secret, for Supabase → Authentication → Providers → Google
  (redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`). Until then the Google button is built
  and tested against the fake gateway, and the provider stays off.
- **Later, from the owner:** the daily account purge needs two Vault secrets in the project (Dashboard → Project
  Settings → Vault): `project_url` = `https://<project-ref>.supabase.co` and `secret_key` = an `sb_secret_…`
  key from Settings → API Keys. Until then the job logs a notice and purges nothing; deletion requests still work.
- **The built-in content is the admin's alone to edit.** Every learner makes their own songs, patterns and
  progressions, and keeps each **private** or **publishes** it to the **Public library**, where everyone can find,
  play and copy it. The other open questions follow best practice (below).

## Defaults until the owner says otherwise

1. Content is authored in the app (inline editor) and lives in the database; the current files are imported once and
   then deleted; a nightly export keeps a readable copy in the repo.
2. Editors: the owner alone (`admin`); an `editor` role (content, no accounts) is built in but given to no one.
4. Downloads: what the learner is working on downloads by itself (the current course, favourites, setlists, recent
   songs), with a switch to turn it off.
5. Starter set, always in the app: the first course, ten songs, the theory pages.
6. Profile: a plain practice record (streak, minutes against the daily goal, songs learned, lessons and courses
   finished, Skills); no badges or achievements yet.
7. No practice reminders yet (a web app can notify only once installed, on iPhone from iOS 16.4).
8. The welcome asks the language, the level, whether there is a MIDI keyboard and a daily goal; the level picks where
   Learn starts.
9. No payments; nothing in the schema blocks a plan later.

## Rounds

Each round: its ADR first, tests first, one commit per task, the full suite and the build on the merged result,
then the branch and `main`.

### 0. Preparation: the seams the rest builds on
- **Content through one asynchronous gateway:** `useContent(kind, id)` and `useCatalog(kind)` over a `ContentPort`
  (files now, the database in round 4), each read loading · ready · offline · missing; every screen that shows
  content renders all four.
- **Saved stores over a swappable storage:** `createSavedStore` takes an asynchronous `SaveStorage` port (localStorage
  now, RxDB in round 2) and a store is `ready` once read; the app waits for its stores behind the splash.
- **One composition root** builds every service (audio, MIDI, auth, sync, content, storage) and tests take fakes
  from the same place.
- **Branded ids** (`PieceId`, `LessonId`, `CourseId`, …) and a stable `slug` for URLs beside the database's id.
- **Network results as values:** `ok · offline · refused · failed`, never a throw, at every server call.
- **One schema per shape** (Valibot): the type, the validation and the local database's schema from one source;
  every sanitiser becomes its schema; database types generated from Supabase.

### 1. The database and its rules
- Migrations in `supabase/migrations/`, copied from memory-palaces where they fit: per-user tables for every saved
  store (`settings`, `progress`, `library`, `pieces`, `takes`, `views`, `patterns`, `keyboard`, …), each row
  `user_id`, `id`, `data jsonb`, `updated_at`, `deleted`; RLS on every table (`auth.uid() = user_id`); private storage
  bucket for recorded takes; `push_documents` (the based write with advisory locks); hardened grants;
  `account_deletions` with `pg_cron` purge.
- `shared/api`: the auth gateway, the cloud-sync port and storage port as memory-palaces has them, with in-memory
  fakes for tests; the Supabase client built once in `composition-root.ts`; keys from `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_PUBLISHABLE_KEY`.

### 2. The local database and sync
- RxDB on IndexedDB replaces `localStorage` under every `createSavedStore`; each store keeps its key, version and
  sanitiser (CLAUDE.md's rule holds: one version read, field by field).
- Memory-palaces' sync: the pending-change log, `syncNow`, Autosync (reconnect, visibility, pagehide, 4 s after
  writes), quiet sync for settings, field-by-field merge against the base copy, the review dialog only for a deletion
  that meets a change elsewhere, realtime only lighting the banner.
- The network rule (memory-palaces ADR 0004): only the server's questions are gated offline.

### 3. Accounts, Settings, Profile, the first run
- Pages: sign in, sign up, forgotten password, the OAuth callback; `SocialButtons` with Apple muted as Coming soon.
- **Settings** in groups, each its own page: Profile and account · Preferences · Playing (keyboard, MIDI and its log,
  recording, floating tools) · Practice (daily goal) · Sync and data (status, Autosync, export/import, Storage, reset
  progress) · Privacy (policy, delete account) · Help (How to use, About: version and credits). The account card on
  top; a guest's card offers sign-in.
- **Profile:** name and avatar, the practice record, the songs played most.
- **Account deletion:** 30-day grace, the scheduled-deletion gate, the purge job.
- **Welcome** on first run (default 8), then Learn.

### 4. Content from the database, downloaded as needed
- Tables `content_items` (`id`, `kind`: piece · course · lesson · pattern · progression · exercise · book, `version`,
  `audience`, `meta jsonb`, `body jsonb`, `size`) and `content_versions` (every published version); read by RLS per
  audience: everyone, groups, admins (drafts).
- **The catalog index** (titles, levels, keys, tags, sizes) syncs whole and drives lists, search and filters offline.
- **Bodies** download on first open and stay on the device; an item changes only when its version does.
  **Download for offline** on a song, course, collection or folder; a **Downloaded** filter; an item not on the device
  offline is greyed with "Needs a connection"; **Settings → Storage** lists downloads with Remove.
- The starter set ships in the bundle; CLAUDE.md's "the built-in content always works" becomes "the starter set
  always works" (ADR).
- An import script loads today's `entities/*/content` once, checked by the content tests; then the files go.

### 4b. The Public library
- A learner's own item (song, pattern, progression) is Private by default; **Publish** needs an account and puts a
  snapshot in `public_items` (author's display name, kind, meta, body, `published_at`, `version`, counts); the author
  updates it by publishing again, or **Unpublishes** it. The private copy stays the learner's to edit.
- **Songs → Public library**: browse by kind, level and key, sorted by New or Most saved; search; open and play
  offline once downloaded, as any content. **Save to my library** makes the learner's own copy, crediting the author
  (`copied_from`); a save count, no likes or comments yet.
- **Best practice for shared content**: a **Report** on every public item (reason, to the admin's Content queue);
  the admin can hide or remove an item and block an account from publishing; publishing is rate-limited and an item's
  size capped by the database; a one-line rights notice before the first publish (only what you wrote or may share);
  an account's deletion removes its public items with it.

### 5. Admin
- Role in `app_metadata.role` (`admin`, `editor`), set only by the service role; read from the JWT by RLS and Edge
  Functions; the app shows the Admin area only to it, in its own lazy chunk.
- **Accounts** (email, joined, last active, groups, devices), **Groups**, **Feature switches** per group (every build
  goes to everyone; a feature waits behind its switch), **Content** (drafts, published, audiences), **Reports** (the Public library's, with Hide · Remove · Block), **Activity log**.
  All through Edge Functions that check the role; never a client query on `auth.users`.

### 6. Inline content editing
- Edit where the item shows: songs and studies in the score editor (saving to the catalog for an admin), lessons and
  courses in place (text, headings, examples, order, blocks; en and ru side by side), patterns, progressions and
  exercises in their pages.
- The content tests' rules run as the editor's checks; draft → preview → publish to an audience; every version kept,
  any one restorable.

### 7. Splash, updates, production basics
- The splash held while the local database opens and an account's first sync on a device (10 s budget, Open now);
  iPhone launch images from `public/favicon.svg`; the update prompt.
- Error reporting, privacy policy and terms (GDPR), security headers on Vercel, a staging project, backups, a few
  end-to-end tests in a real browser.
- **Performance:** precache the shell only (Verovio's 8 MB worker, fonts and samples cached on first use); size
  budgets per chunk checked by the build; real-use speed (web-vitals) reported with the errors.
- **Quality:** an error boundary per screen with Reload, reported with its route; screenshot tests of the key screens
  at 320, 390, 844×390 and 1280; axe in the screen tests; a component gallery page (every shared control in every
  state, light and dark); checks on every pull request; Renovate grouped weekly.

## Later, in review rounds

- Split by job: `musicxml/read.ts` and `write.ts` by element; `arrangement/arrange.ts` and `notation/mei.ts` by pass;
  `EditorPalette`, `NoteKeys` and `shared/ui/FloatingActions` into hooks and layout; `router.tsx` by place.
- The 109 `useEffect`s against React's "You might not need an Effect".
- Each language, and each place's strings, loaded with its screen.
- A faster suite: logic as plain-function tests, one `renderApp` test per flow, a few end-to-end journeys.
