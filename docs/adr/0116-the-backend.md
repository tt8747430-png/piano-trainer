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
  library, a sheet as Noji's: a description of at least 20 characters, kept in `meta.description` (the item's JSON,
  no column of its own), the row as others will see it, the rights in a line and why publish behind the ⓘ;
  published, the page's card says so with View, Edit or Update, and Unpublish). A published
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
  types in `shared/api/supabase`, built once in the composition root from the build's environment (the
  project's URL and publishable key: Vercel's environment variables, `.env.local` on a machine, their names in
  `.env.example`; the build stops without them, and none of it is in git); the accounts' gateway in `shared/api/auth`.

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
- r12 — A course's own title and summary are content (`course`, `{ id, title, summary }`), exported and seeded
  with the rest and read over the course where they read in both languages (`updatesCourse`); an editor edits
  them on the course editor (`/courses/$courseId/edit`) with the draft's strip (2026-10-29).
- r13 — The project's settings left git: `.env` is no longer committed (it had been, its values being public, so
  Vercel needed no setup: the owner's call to make, and they made the other one). The build and the dev server
  stop when either is missing; the seed script and CI read the same names from the environment (2026-10-29).
- r14 — Content is data, courses first: a course's record lists its lessons' ids in order (`CourseRecord`,
  `courseRecord`), each lesson read from its kept `<course>/<lesson>` body or the app's own and one with neither
  passed over. The course editor orders, removes and adds lessons; Add lesson creates the lesson on the server
  unpublished (`ContentEditingPort.create`: a `draft` row and its first draft) and opens it in the lesson editor,
  which opens a lesson not yet published from its draft. A draft opens with words missing; only publishing asks
  for every text (`DraftSpec.publishable`). A course's record also holds its shelf, level and weeks, so an
  editor makes a whole course: New course (Learn's Courses, `/courses/new`) creates it unpublished with no
  lessons and opens its editor; a kept record of a course the app does not have is listed after the app's own
  (`keptContent().ids`) (2026-10-29).
- r15 — Journeys are content (`journey`, kept whole; the kind check takes it, migration
  `20261029210000_content_journeys`): each journey is the database's copy where it reads (`updatesJourney`), its
  lessons the kept bodies of the ids it lists, one with no body passed over. The journey editor
  (`/journeys/$journeyId/edit`, from an editor's Lessons) names the journey, orders, names and adds chapters, and
  orders, removes and adds a chapter's steps; a new lesson is created unpublished and opened in the lesson
  editor. Continue, Search and the map read the catalog (`allCourses`, `allJourneys`), not the bundled lists. One
  list for every order an editor arranges (`OrderList`, `AddByName`) (2026-10-29).
- r16 — Songs are made in the app: an editor's New built-in song (a collection folder's More) creates the song on
  the server unpublished with its collection (`MadeSong`, `readsAsMadeSong`), its chart started as a learner's
  new song's, and opens its original in the score editor from its draft (`useMadeSong`; the edit route lets an
  original the device has not got through). Published, it is in the catalog at its collection's end
  (`songCollections`, `allCollections`), its folder, Search and the Player reading it (2026-10-29).
- r17 — The Admin area's Drafts tab lists every draft kept, the newest first (`ContentEditingPort.drafts`: each
  its kind, name, when changed, and whether it was ever published), each opening its editor: what an editor made
  and left unpublished is found again there (2026-10-29).
- r18 — Progressions are content (`progression`, kept whole): the library is the app's own under the database's
  copies, then the progressions editors made, each reading as one (`readsAsProgression`: a style, a name and how
  it sounds in both languages, a line of numerals that reads); `libraryProgressions`, `libraryByStyle` and
  `commonProgressions` replace the bundled constants. An editor's Progressions bar edits the progression in sight
  and makes a new one (`/practice/progressions/$progressionId/edit`, `/practice/progressions/new`). The editors'
  shared parts (`DraftScreen`, `TextFields`, `OrderList`) moved to `widgets/content-editor` (2026-10-29).
- r19 — The lesson editor edits a lesson's structure: each section's blocks as cards (moved, removed), Add block
  for a new block of a kind (text, steps, note, rule, chords, notes, progression; `blankBlock`), sections moved,
  removed and added (`withSection*`, `withBlock*` in `entities/lesson/model/structure.ts`). A structured block
  editor, not an inline rich-text one (TipTap): every text is English and Russian side by side, which a single
  rich-text document does not hold; markdown shortcuts and a `/` menu stay open (2026-10-30).
- r21 — Supersedes r19's structured cards: the owner asked for one continuous document, edited where it reads
  (Obsidian's Live Preview), with no Edit/Preview switch and no floating publish bar. The lesson editor is a TipTap
  3 document written in one language at a time (the bar's EN/RU), which answers r19's objection: each node
  carries the lesson's text it shows (`lessonToDoc`/`docToLesson` in `pages/lesson-editor/model/lesson-doc.ts`,
  tested round trip), so the other language comes back untouched. Examples are atoms drawn by `LessonView`'s
  renderer, their line of text typed in the block and their other fields in a popover (a sheet on a phone); a
  toolbar, Insert, a `/` menu, a drag handle and Alt+↑/↓ (`doc-blocks.ts`). The course and journey editors are
  the same kind of page (title and summary written in place, properties, rows dragged with `@dnd-kit`, across
  chapters too; `widgets/content-editor`'s `RowGroups`, `AddRow`, `DocText`). The draft's status sits under the
  bar's title and Publish with its menu at the bar's end (`DraftStatus`, `DraftActions`; `DraftStrip` and
  `OrderList` gone); the score editor's original shows them in the column's head (Edit the original is the mode pop-up's). The editors are their
  own chunk (`lesson-editor-screens`), so a learner never downloads TipTap (2026-10-30).
- r22 — New course, New progression and the progression editor as documents (`DocTitleField`, properties,
  Create floating); the bars say what is edited (Edit lesson …); voicings, a pattern and a link edited in their
  blocks (Versions kept as written); blocks dragged by finger on a phone (`moveBlockTo`), rows by dnd-kit's
  touch sensor; lesson names in the language written; a compact EN · RU (2026-10-30).
- r23 — A draft of an item the database has not got yet (a journey or progression never seeded) creates the item,
  unpublished, then keeps the draft. The lesson editor's `/` opens after words too, the block going after their
  line; Insert grouped (Text, Music, For the learner) with voicings and a link added (2026-10-30).
- r24 — Publish as its own sheet with a description, the published card on a song's and a pattern's page, and
  the Public library as Noji's: shelves of Newest and Most saved over the list, kinds as chips (2026-10-30).
- r24 — Manage lessons: a level's chapters as cards of the learner's rows, dragged within and across them, a row's
  menu moving it to another chapter, + a lesson or a chapter. The language written in chosen in the draft's
  menu; the lesson editor's toolbar one floating capsule, Insert its accent; a level's lesson's Read first
  (2026-10-30).
- r25 — Every New … one sheet (`NewSheet`): New song as Flat's new score (staves as tiles, the key signature grid, time tiles), New course, New progression, Add lesson and Add chapter; /courses/new and /practice/progressions/new gone (2026-10-30).
