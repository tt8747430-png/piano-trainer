# Spec: the Profile's tables, badges and avatars (B1, D12, D17)

## Problem
The Profile has an initial, three figures, Activity and one list of eight badges (`achievements.ts`) that mixes
one-time milestones with goals. A learner's name lives in Supabase Auth's `user_metadata.name`; there is no
handle, picture, bio or privacy choice, and nothing for Explore to show as an author.

## Decision
### Server (one migration, no `drop`)
- `public.profiles` (`id uuid pk references auth.users on delete cascade`, `name text` ≤ 60,
  `handle citext unique` 3–24 `[a-z0-9_]`, `bio text` ≤ 160, `avatar text` (a built-in avatar id or the
  storage path), `public boolean default false` (D12), `created_at`, `updated_at`). A trigger creates the row
  on sign-up from `user_metadata.name`; the name moves here (Auth's metadata no longer read).
- RLS: the owner selects/inserts/updates their row; anyone (anon included) selects `id, name, handle,
  avatar, bio` of rows where `public`; nobody deletes (account deletion cascades).
- `public.handle_available(text) returns boolean` (security definer, rate-limited by the existing
  `publish_blocks` pattern): the Edit profile page's check.
- Storage bucket `avatars` (public read for objects whose profile is public, else owner only), path
  `<uid>/<uuid>.webp`, 256×256 WebP made in the browser before upload, ≤ 200 KB; owner writes only.
- `supabase/tests/profile-access.sql`: a learner reads and writes only their own row and avatar; another
  learner and anon see a public profile's fields, never a private one's; handles are unique case-insensitive.
- `database.types.ts` regenerated; `shared/api/profile` (port, Supabase adapter, fake).
- Published songs show the author from `profiles` when `public`, else "Piano Trainer learner".

### Device (no server)
- **Badges** (tiered) and **milestones** (one-time) in `entities/progress/model/badges.ts` and
  `milestones.ts`, replacing `achievements.ts`. One thresholds table:
  | Badge | Figure | Bronze · Silver · Gold · Platinum |
  |---|---|---|
  | Streak Keeper | best streak (days) | 3 · 7 · 30 · 100 |
  | Repertoire | songs learned | 1 · 5 · 15 · 40 |
  | Lesson Finisher | lessons done | 1 · 10 · 30 · 75 |
  | Scale Master | keys practised (of 24) | 3 · 8 · 15 · 24 |
  | Daily Devotion | days practised | 7 · 30 · 100 · 365 |
  | Library Builder | own songs + folders | 1 · 5 · 15 · 40 |
  Each tier's earned date kept in `pt-progress` (`earned: Record<BadgeTier, isoDate>`), version bumped.
  Milestones: first song, first lesson, first recording, first published song, first MIDI session, a 100 %
  take; earned date likewise. `nextMilestone(record)` picks the closest unearned tier for the card.
- **Notifications** (`pt-notifications`, a new `createSavedStore`, synced): `{ id, kind, ref, at, read }`,
  max 100, pushed when a tier, milestone, level or longest streak is reached (a pure `changes(before, after)`
  in `entities/progress/model`), grouped Today / Yesterday / Earlier; Mark all read, Clear all.
- **Avatars**: 12 built-in avatars (SVG, `shared/ui/avatars/`, simple instrument and note motifs in the app's
  palette) chosen by id; upload replaces them.

### Pages and routes
`/profile` (hero, milestone card, badges row, achievements row), `/profile/streak` (replaces
`/profile/activity`, which redirects nowhere: the route is removed and its links updated),
`/profile/badges`, `/profile/badges/$badgeId`, `/profile/achievements`, `/profile/achievements/$id`,
`/profile/notifications`, `/settings/account/profile` (edit), `/settings/account/password`,
`/settings/privacy`. Parents per the parents table.

## Tests
- Thresholds: each tier earned at its figure, dates kept, `nextMilestone` picks the nearest.
- `changes()` emits one notification per crossing, none twice.
- Access SQL above; adapter tests against the fake.
- Profile renders loading, guest, empty and full states.

## ADR
0116 (the backend: profiles, avatars bucket, author name), 0052 (the Profile's pages).
