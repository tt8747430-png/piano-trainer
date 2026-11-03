# Round 29 compliance: How to work, D1–D19, Part B, Constraints, the work's process

Checked on `claude/keen-gates-q9bnit` at 884d7115 (round began at 7bc59c57; 146 non-merge commits, 68
touching `src/`). Read-only: grep and reading of source, `git log`/`git show`, the scratch files. No tests run.

Overall: rounds 1–4 are partly built; rounds 5–14 (B1–B11 apart from B7 and part of B1) are mostly not started.
`progress.md` marks almost all of them "open", so for those items it is honest. The problems are the process
gaps and the few places where what was built goes against the prompt.

## How to work (prompt lines 73–102)

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| Rules | Read owner-way, feedback-log, ux-principles first | DONE | c9b3f8d3 "owner feedback logged" (Phase 0) |
| Autonomy | Don't ask, don't stop between rounds; questions in the report | PARTIAL | No stop found, but `progress.md` has no "owner's questions" section (it has to-dos only). Rounds 5–14 not reached |
| Order | Research → plan → build; don't patch what the plan replaces | PARTIAL | Specs came before code (47b2a829 before dcaa63b6). B1's server and badges (ef48f266, 00c8af17, 5baac640, round 5) were built while round 1 still had A3, A4 and A19 open |
| Commits | audit → spec → rounds; one commit per task | PARTIAL | The order holds. ce1d42e1 bundles three tasks in one commit (settings registry + ConfirmDialog + updates by hand, 44 files). 0dae27ba mixes code, after-shots and progress |
| Pushes | Push each round after typecheck/lint/related; full suite + build before `main` | PARTIAL | The branch is level with origin; origin/main is at 75ced891 (HEAD is 5 commits ahead). The only full-suite record after baseline is "Round 1, checkpoint 1" (6952 tests). No gate record for the merges of rounds 2–4 (826d2de7, 49b24af6, ce8f8579, 8aa66bda) |
| Agents | Few, where large and separate | DONE | Six briefs in `.scratch/r29/briefs/`, worktree merges. The count is defensible |
| May decide | Migrations with access tests, no `drop` | DONE | 20261103100000/100100 have no `drop`; `supabase/tests/profile-access.sql`; types regenerated |
| References | Study before building | not checkable | Notes are in the session scratchpad, outside the repo |
| Before an item | Read files, run at 402/1280, before-shots | DONE | 360 before-shots (36 screens × 5 sizes × 2 themes) |
| Progress file | Every A/B item with state, commits, questions; updated with every commit | PARTIAL | All items are listed. The Commits column is empty for A1, A2, A6, A7, A9, A10, A11, A38, A42. Only 26 commits touch it, against 68 `src` commits. Stale entries: see "Claimed done but not" |
| Per change | typecheck, lint, test:related | not checkable | No per-commit record; CI is run by hand |
| Specs | Spec + ADR before a model/store/route change | DONE | 10 specs, ADR r29 lines (0116 l.229–230 etc.). New routes `/settings/player` and `/settings/<page>` are covered by the back-as-up and settings-registry specs |

## Decided D1–D19

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| D1 | Explore as a "My songs · Explore" switch in the Songs bar; the bottom row goes | NOT DONE | `pages/songs/ui/LibraryScreen.tsx:48-57` still draws the Public library `RowLink` card. No switch |
| D2 | Profile a sidebar place on a laptop, a tab on a phone | DONE (pre-r29) | Routes and parents (`parents.ts:116` Settings → Profile on a phone). Not changed in r29 |
| D3 | Klangio-style rights checkbox gating Publish | NOT DONE | Only the old line `songs.ts:328 rights: 'Publish only music you wrote or may share.'` |
| D4 | Deep customisation (presets, free CSS-like, live preview) | NOT DONE | Belongs to B9 |
| D5 | Learner view for admins/editors | NOT DONE | No `learnerView` anywhere in `src` |
| D6 | Pencil ⇄ Done; lessons one page | DONE | Pre-existing; A38's song page fix 9d683ceb |
| D7 | Annotations typed, not freehand | NOT DONE | B8 not started |
| D8 | Built-in folder rules in one permission function in `entities/library` | NOT DONE | `entities/library/model/*` was unchanged in r29 and has no permission function |
| D9 | Player/editor toolbars customisable (4–5 + More, Reset) | NOT DONE | Nothing in `entities/settings/model/types.ts` |
| D10 | Archive in a built-in folder = hide from me; "Archived (n)" | NOT DONE | No "Archived (n)" string. A9 added a confirm before Archive, but not the folder view |
| D11 | Modes sheet keeps one line per mode | NOT DONE | No Modes sheet (B8) |
| D12 | Private by default; Privacy switch; "Piano Trainer learner" until public | PARTIAL | The server has `public` defaulting to private (ef48f266). No Privacy switch, and no "Piano Trainer learner" string in `src` |
| D13 | Settings two panes on a laptop | DONE | 045617ab |
| D14 | Progressions' roles and moves drawn on the chords, no switch | DONE | 1ea3aeac (kernel `chordRole`) |
| D15 | Salamander samples self-hosted in `public/samples/piano/`, AAC, 4 layers, smplr spike, 80 MB budget, credit | NOT DONE | No `public/samples/`, no `smplr` in package.json, no sampler in `shared/api/audio`. The progress row for A27 says "Left: the sampled grand" (honest) |
| D16 | CC0 metronome one-shots, accented and normal strokes, in `public/samples/metronome/` with `SOURCES.md`; woodblock, clave, rimshot, cowbell, click, kick, snare, closed/open hat, ride; under 300 KB; spoken count only as the owner's to-do | CONTRADICTS / PARTIAL | 118a0f4f puts 4 WAVs in `public/sounds/` (woodblock, kick, snare, hihat; ~122 KB). No `SOURCES.md`: the licence is only in a code comment (`recorded-sounds.ts`). The accent is "the same block a fifth higher" (a pitch shift), not a recorded accented stroke. Clave, rimshot, cowbell, classic click, open hat and ride are missing. The spoken count is left out and logged (dd17ba1c): correct |
| D17 | Migration (no drop), access tests run, types regenerated, ADR line | DONE | Migrations above, `profile-access.sql`, `database.types.ts` +34, ADR 0116 l.230 |
| D18 | Old and new wording of each legal paragraph in `copy.md`; meaning changes in the report | CONTRADICTS | `copy.md` is a title line only. a8e46a3a changed the en and ru Privacy paragraph ("Sync and data" → "Storage and backup"), and that change is not recorded there. The meaning is unchanged |
| D19 | All of it, autonomously | PARTIAL | Rounds 5–14 are mostly open (see Part B) |

## Part B

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| B1.1 Hero | Chosen avatar/upload + Edit photo; name, "@handle · Joined"; tiles Day streak / Songs learned / Practice time, streak → Streak page; guest "Exploring as a guest" + Sign in | PARTIAL / CONTRADICTS | `ProfilePage.tsx` Hero shows an initial `Avatar` and the **email** (not @handle · Joined), with no Edit photo. The tiles are Streak / **Songs played** / **Steps learned**, not Songs learned / Practice time, and they are not links. The guest gets a Sign in button |
| B1.2 Next milestone | Closest unearned tier, progress bar | DONE | `Badges.tsx` "almost" card, `nextMilestone` (00c8af17, 5baac640) |
| B1.3 Badges | Six tiered badges; row with See all; Badges page; detail per badge | PARTIAL | The six badges are a grid on the Profile. No See all, no Badges page, no detail pages. Scale Master counts scales learned, not keys practised (decided in the audit) |
| B1.4 Achievements | Milestones + personal records page, detail pages | NOT DONE | — |
| B1.5 Streak page merged with Activity | One page | NOT DONE | `ActivityPage.tsx` is pre-existing; no Streak page and no merge |
| B1.6 Notifications | Feed, bell count, `pt-notifications` | NOT DONE | No `pt-notifications` |
| B1.7 Edit profile | Avatar picker, name, handle (server check), bio, email; Change password; Delete account as a state machine | NOT DONE (UI) | The server has `handle_available` only |
| B1.8 Privacy page | Name on songs, profile visible | NOT DONE | — |
| B1.9 States | Skeletons, empty, guest per section | PARTIAL | Only the record's empty state |
| B1.10 Data | Thresholds in one table in `entities/progress/model` with tests; profile migration, avatars bucket, access tests | DONE | `entities/progress/model/badges.ts` + test; migrations + `profile-access.sql` |
| B1 Done | Side-by-side screenshots at 402/1280 | NOT DONE | No profile shots in `shots/after` |
| B2 | Research; rewrite every legal/policy/empty/ⓘ text en+ru; `copy.md` before/after | NOT DONE | `copy.md` is empty. A6's renames (42911975) are a partial start |
| B3 | Explore switch, chips, shelves, cards, item page, "Add to my library" | NOT DONE | See D1 |
| B4 | Edit in place for levels and the Courses shelf; Manage pages go; permission function; tests | NOT DONE | `/journeys/$journeyId/edit` and `/courses/manage` are still routes (`router.tsx:678,689`) |
| B5 | Learner view, banner, session only, tests | NOT DONE | — |
| B6 | Lessons and courses get the Publish page + rights; table of actions × items | NOT DONE | — |
| B7 Player page | From the registry; A35's list: Audio playback, Metronome link, Playback speed, Display (clef, countdown, cursor, scroll, keyboard, fingering), Pedal; links to the Metronome and the On-screen piano | PARTIAL | 4ffa41de: `widgets/player-settings` has Audio, a Metronome link (`/practice/metronome`), Speed, Display (countdown, cursor, layout, keys, fingers; wired in `use-practice-player.ts:178,255`), One hand and Pedal. **Clef is not built.** There is **no link row to the On-screen piano** (R18) |
| B7 Editor page | Entry: hear notes, Replace or Insert, the palette's side; the score's Layout reached from it | PARTIAL / CONTRADICTS | `ScoreEditorSettingsPage.tsx` has only `EditingGroup` (hear notes + three links). Replace/Insert and the palette's side are left out ("no engine"). No link to the score's Layout. The same `EditingGroup` with the `editing.hearNotes` switch is also drawn on the score's own Settings (`pages/score-editor/ui/ScoreSettingsPage.tsx:268`). That breaks R18 ("Never the same control on two pages … Both open the same page, not a copy") |
| B7 Lesson/course pages | Keep only their own | DONE (A10) | The lesson reading row links to its home (audit A10) |
| B8 | Modes, Version, Tools sheets, annotations, Display, score layout, feedback | NOT DONE | Only the Display fields that B7 put on the settings page |
| B9 | Block toolbar on course/overview pages, style editor, card style, Appearance, item acts, About page | NOT DONE | No About page (credits are a footnote line in Settings) |
| B10 | Select toolbar and swipe pages, bar editors, `pt-settings` bump, tests | NOT DONE | — |
| B11 | Tools group, tool pages, Tools sheet over screens, circle of fifths as a tool, one engine | PARTIAL | Only "one engine": the Player's click and count-in come from the Metronome engine (093e86b9). Practice still has three groups (`PracticePage.tsx`). No Drone, Tools sheet or circle-of-fifths page |

## Constraints (1876–1921)

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| Out of scope | No new instruments, payments, keys | DONE | None added |
| Completeness | en+ru, states | DONE for what was built | ru typed against en (tsc) |
| Devices | 402, 393, 320, 874×402, 1280 (+1440/1920), light/dark | PARTIAL | The before-shots cover all of them. There are 113 after-shots, for look, player, practice and settings only |
| App Store shots | Phase 3 | n/a yet | — |
| Samples' cache | Runtime CacheFirst for `/samples/`, 200 only, no expiry, Remove on Download row, counted on Storage | NOT DONE | `vite.config.ts` only adds `wav` to the precache `globPatterns`. There is no `/samples/` route and no Download for offline row |
| Stale chunk | `vite:preloadError` reloads once, guarded | NOT DONE | No `preloadError` in `src` |
| iPhone storage hint | Add to Home Screen hint about 7-day eviction | NOT DONE | No such string |
| Updates by hand | Later hides till return; Version row as Software Update; Install and restart; one state; red dot | DONE | `shared/lib/app-update`, `app/update-prompt/check-on-return.ts`, `settings.ts:98-103`. The red dot sits on the Profile's Settings gear (`ProfilePage.tsx`) |
| Offline is a state | "Available when online", disabled, never red | PARTIAL | The existing offline lines (`common.ts:20`, `songs.ts:294,351`) were not swept |
| Schema changes | As D17 | DONE | — |
| Free styles | Whitelist, no url(), no layout break | n/a | B9 not built |

## The work: phases, rounds, report (1922–1994)

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| P0.1–2 | Branch level with main; gate on main noted | DONE | `baseline-gate.txt` (6905 tests, build), 462fe4fc |
| P0.3 | progress, audit, settings-map, copy, shots/before | DONE | All exist (`copy.md` empty) |
| P0.4 | Before-shots on every device, light/dark, Daisy + Fantaisie | PARTIAL | 360 shots. The Fantaisie-Impromptu isn't in the repo (owner's to-do) |
| P0.5 | Read owner-way, DESIGN.md, ADRs | DONE | c9b3f8d3 |
| P1 | Ten specs + ADR lines before their round | DONE | 47b2a829 |
| P2 order | Rounds in order, items in listed order | CONTRADICTS | Rounds 1–5 interleaved. Round 1 is still open (A3, A4, A19 open; A6, A9, A11, A38, A42 in progress) while rounds 2, 3, 4 and 5 were built and merged |
| P2 per round | One commit per item, progress per commit, after-shots, impeccable audit, round report, push, full gate + main | PARTIAL | No impeccable audit is recorded anywhere (`grep impeccable` finds nothing in progress, audit or briefs). There is one round report, "Round 1, checkpoint 1", and none for the work of rounds 2–4. Full-gate evidence exists only for checkpoint 1 |
| Each round done | impeccable audit then polish/adapt; every standing rule checked | NOT DONE | No record |
| Report after each round | What changed, left, questions, push state, shots | PARTIAL | Only checkpoint 1, and it has no questions or screenshots list |
| P3 docs | ADRs, DESIGN.md, glossary, CLAUDE.md map | PARTIAL (on track) | ADR/DESIGN/glossary commits per merge (3af497ac, 74f267f6, fe414b91, 91f5c05c, a78559e9). CLAUDE.md lists the new Settings pages and the Search palette |
| P3 to-dos | Owner's to-dos in one place | DONE, one stale | `progress.md` § Owner's to-dos (spoken count, Fantaisie MusicXML, reseed). The Freesound to-do is stale (see below) |
| At the end | New owner feedback into owner-way's feedback-log | PARTIAL | Last edit was a7f6f884 (Nov 2). Later owner direction ("best sounds", "Metronome as Chordify's", 118a0f4f, 6d7613df) is not logged yet |

## Contradictions

1. **R18 / B7: the same setting on two pages.** `editing.hearNotes` (the whole `EditingGroup`) appears on
   Settings › Score editor and again on each score's Settings (`ScoreSettingsPage.tsx:268`). Commit 4ffa41de says
   so. The prompt says "Never the same control on two pages … Both open the same page, not a copy."
2. **D16: metronome sounds.** They are in `public/sounds/`, not `public/samples/metronome/`. There is no
   `SOURCES.md`. The accent is pitch-shifted instead of a recorded accented stroke. 4 of the 10 named sounds exist.
3. **D18: `copy.md` is empty**, though a8e46a3a reworded a legal paragraph in en and ru.
4. **Phase 2 order: rounds are interleaved.** Round 1 is unfinished (A3, A4 and A19 never started) while rounds 2–5
   were built. Round reports and impeccable audits are missing for every round.
5. **B1.1 hero figures.** It shows email, "Songs played" and "Steps learned" where the prompt fixes "@handle ·
   Joined", "Songs learned" and "Practice time". The streak tile doesn't open a Streak page.
6. **One commit per task.** ce1d42e1 lands the registry, the ConfirmDialog and updates by hand together.

## Claimed done but not (or stale in progress.md)

- **B7 "done":** Clef, Replace/Insert, the palette's side, the link to the score's Layout and the On-screen piano
  link row are missing, and the hear-notes switch is duplicated (Contradiction 1). Better marked "in progress".
- **Owner's to-do "Freesound 403 … Until then the synthesised voices play"** is stale: 118a0f4f shipped VCSL CC0
  recordings. The A39 row's "Left: samples (owner's CC0 files)" is stale for the same reason. Both should say
  which D16 sounds are still missing.
- **A10 "done"** with "pages from the registry with A12": the score's own Settings still draws a kind setting
  (Contradiction 1), and `settings-pages.test.tsx` doesn't catch it.
- **Phase 0 "done"** is fine. **Phase 1 "done"** is fine.
