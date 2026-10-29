# Production work log

The running record of the production rounds (spec: `spec.md`, plan: `plan.md`). Read this first after a compaction:
it says where the work stands, what was decided on the owner's behalf, and what comes next. Newest at the bottom of
each section. The owner said (2026-10-29): continue through every round overnight without asking; log everything.

## Where it stands

- Branch `claude/keen-gates-q9bnit`; `main` carries rounds 0, 1 and 2 (green suites: 6502 → 6513 → 6552 tests).
- Supabase project `piano-trainer`, ref `itmiutianxvtlwhdsalo`, `eu-west-1`, org `hhhabylwpqoudiihkqyn`.
  Migrations in `supabase/migrations` all applied; Edge Functions `request-account-deletion`, `purge-account`
  deployed (verify_jwt false, they check their caller). `supabase/tests/access.sql` passes.
- Round 2 (sync) built: merge, CloudSync (fake + Supabase), createSyncRunner (status, onChange), AccountProvider
  (Autosync), app wiring (SYNCED_SAVES, createSync), app-level tests. On main. Round 3 (accounts UI) next: plan.md.

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

- Delete the empty, policy-less `takes` bucket (Dashboard → Storage): SQL may not delete buckets.

- Google OAuth client ID and secret → Supabase Auth → Providers → Google (redirect URI in spec).
- Vault secrets `project_url`, `secret_key` for the daily account purge (spec).
- Supabase Auth → URL configuration: Site URL = the Vercel domain; Redirect URLs = `https://<domain>/auth/callback`,
  `https://*-<team>.vercel.app/auth/callback` (previews) and `http://localhost:5173/auth/callback`. Without them
  OAuth, confirmation and reset links go to the Site URL instead of the callback.
- Supabase Auth → Passwords: minimum length 8 (the app asks for 8; the server's default is 6).

## Log

- 2026-10-29 Round 0 done and on main: ADR 0116, NetResult, createStores/createContent, factsOf, ContentPort with
  ensureContent in routes; flaky Progressions test made robust (beforeAll warm-up).
- 2026-10-29 Round 1 done and on main: migrations, Edge Functions, access test, `.env`, shared/api/supabase,
  shared/api/auth (gateway, fake, contract, adapter test).
- 2026-10-29 Round 2: merge kernel and cloud port committed; runner being written.
- 2026-10-29 Round 2: runner, status, AccountProvider (a heard sign-in wins over the first session read: a race found
  by test), app wiring; cloud adapter checked on the project (signed-out 401 → refused; it had read the Postgres
  code as status). `takes` bucket: policies dropped by migration. Owner allowed all Supabase tool calls
  (`.claude/settings.local.json`, ignored by git).
- 2026-10-29 Round 2 on main (6552 tests, build ok). Note for round 7: the entry chunk grew 396 → 616 KB with
  supabase-js; load auth and the cloud after first paint.
- 2026-10-29 Round 3 started (no code yet). Findings for 3.1, the account pages:
  - Pattern to copy: `pages/midi-settings` (ScreenHeader + BackButton fallback, `SettingsGroup`, `RowLink`); lazy
    screens in `app/routes/settings-screens.ts`, routes in `app/router.tsx` (~l.140–160, list ~l.528).
  - Fields: `shared/ui/NameField.tsx` (label over `InputGroup`/`InputGroupInput`): add `EmailField`/`PasswordField`
    beside it. No toast component in the kit: show errors inline (`role="alert"`) under the form.
  - i18n: add an `account` namespace: `NAMESPACES` in `shared/i18n/index.ts`, `locales/{en,ru}/index.ts`, ru typed
    by `LocaleResources['account']`.
  - No `useOnline` hook exists (RouteError reads `navigator.onLine`): add one in `shared/lib` (online/offline events,
    `useSyncExternalStore`), used to disable the forms' buttons with the offline note.
  - Auth errors (`NetResult.detail`, Supabase's messages): "Invalid login credentials" → wrong email or password;
    "User already registered" → email taken; "Password should be at least" → weak; "rate limit"/"For security
    purposes" → too many tries; "Email not confirmed" → confirm first. Map by substring in one pure function in
    `pages/account/model` with a test.
  - Social marks (Google, Apple SVG paths) in `../memory-palaces/src/shared/ui/SocialButtons.tsx`; Apple disabled
    with "Coming soon". Memory-palaces' Login/Forgot/AuthCallback pages under `../memory-palaces/src/pages/`.
  - Tests through `renderApp(path, { auth: createFakeAuth({ accounts }) })`; `useAccount()` gives `auth`.
- 2026-10-29 Round 3.1 committed (699df81c): `pages/account` (SignIn, SignUp, ForgotPassword, NewPassword,
  AuthCallback at `/account/*` and `/auth/callback`), `shared/ui/FormField`, `shared/lib/useOnline`,
  `shared/lib/account/authProblem`, `account` i18n namespace. Sign-up's confirmation link → the callback.
- 2026-10-29 Round 3.2/3.3 committed (9cd4a01b): Settings index (account card + rows) with pages
  `/settings/{preferences,playing,data,help,account}` in `pages/settings`; `SyncFields`; About shows
  `APP_BUILD` (`__APP_BUILD__` define in vite.config.ts: Vercel's commit or `dev`); AuthGateway gained
  `updateName`, `requestDeletion` (Edge Function), `pendingDeletion`, `cancelDeletion`; `app/deletion-gate`
  in RootLayout. MIDI's Back → Playing, How to use's → Help, the storage-full notice → Sync and data.
  Decision: Google sign-in is enabled in the UI now; until the owner adds the credentials it lands on
  Supabase's "provider not enabled" error (pre-release, no users).
