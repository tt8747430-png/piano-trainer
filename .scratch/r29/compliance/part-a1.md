# Round 29 compliance, part A1: standing rules, Step 0, A1–A19

Checked against branch `claude/keen-gates-q9bnit` (round 29 from 7bc59c57) in code, not from progress.md.
Statuses: DONE, PARTIAL, NOT DONE, CONTRADICTS. "Not verified" means it needs the running app and was not run
(read-only audit).

## Standing rules (as they apply to what round 29 built)

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| R1 | Bar one row, compact; actions in it; nothing under it | PARTIAL | `shared/ui/ScreenHeader.tsx`: one row (`min-h-14`), but a page's tabs are a second row (Learn, Scales, Progressions, Accompaniment, Admin) and titles wrap to two lines (`line-clamp-2`), so the height varies. No strip under the bar found (DraftStatus sits in bars/Settings). |
| R2/R15 | One selected look, fill to the edges, hover lighter | DONE (one gap) | `choice` utility and `--chosen` in `theme.css`, `src/styles/choice.test.ts` (4ad592ac). Gap: Practice's `RowGroup` still `card p-1.5`, so hover is an inset block (audit row "open, settings agent"). |
| R3 | Real menus | DONE | `MoreMenu` → `ActionMenu` on the dropdown-menu primitive. |
| R4 | Drag, never Move up/down | DONE | no Move up/down string in the en locales. |
| R5 | Floating actions: one style, centred capsule, never docked to a side | CONTRADICTS | `shared/ui/FloatingActions.tsx` `justify-center aside:justify-end` and `ALIGN … aside:flex-col`: on a laptop (≥64rem) or a phone on its side with keys docked, the actions stand as a column at the right edge. This hits round 29's Chords and Scales (keys docked). Also two styles: Chords a `FloatingBar` capsule (7875ffe7), Scales a lone `PlayFab` circle (`scale-explorer/ui/PlayUpDown.tsx`). |
| R6, R7 | Tab bar hides; keyboard rules | not verified | nothing in round 29 changed them; the bar's hide rule changed in 0a9069b4 (A31). |
| R8 | Nothing clipped at 320 | not verified | after-shots at 320 exist for most screens (`shots/after/*-320*`). |
| R9 | An item's settings in one place, not split across toolbar/bar/menus | PARTIAL | `app/settings-homes.test.ts` lets `widgets/practice-player`, `score-view-menu`, `player-setup`, `pages/player` write Player settings: the View popover still calls `setScoreView`/`setPracticeToggle` from the toolbar beside `/settings/player`. |
| R10 | No developer words; help behind ⓘ | PARTIAL | known renames done (A6). "Needs a melody staff" (`locales/en/player.ts` `needs.tune`) and "Play melody" (`common.ts` `tune`) remain, both named in A6/A14 to go. |
| R11 | New … one sheet | DONE | `NewSheet`; New progression a sheet (unchanged). |
| R12 | Songs are songs (no original vs yours) | PARTIAL | `piece.ts` `yourVersion: 'Your version'` still shown; left for B6. |
| R13 | No edge blur | DONE | 0bce757a: masks gone from `theme.css`, `BeatStrip`/`ChordPair` plain; grep finds no `mask`/`fade-scroll-x`. |
| R14 | One shape scale | DONE | `--radius-control/card/sheet/pill`, `src/styles/shapes.test.ts` (79811d63); one `rounded-[inherit]` left (`IntervalRow.tsx`, inherits, harmless). |
| R16 | Built-in folder permissions (one function in `entities/library`, D8) | NOT DONE | no permission function in `entities/library/model` (only `canMoveFolder`); not in round 29's work so far (B3/B6). |
| R17 | Confirm + Undo through one dialog | PARTIAL | see A9. Removing a lesson from a course/level (`widgets/content-editor/ui/RowGroups.tsx` `remove` → `say(… removed)` with Undo) does not confirm, though R17 lists "Remove (a lesson from a course)". |
| R18 | One home per setting; kind pages | PARTIAL | registry of homes + two tests (A10). Lesson reading has no kind page: its home is General (`registry.ts` `lessonReading: 'general'`), no text size; the spec calls this "R18's own example". Player and editor kind pages built (B7, 4ffa41de). |
| R19 | Acts are buttons, not switches | DONE | song Settings' Favourite switch gone; see A11 for Learned's menu command. |
| R20 | Settings one column / two panes | DONE | `widgets/settings-screen/ui/SettingsScreen.tsx` (045617ab). |
| R21 | Pictures, icons, labels | DONE | `PictureChoice` in `KeyboardSettingsFields.tsx`, `GeneralPage.tsx`; coloured tiles on `SettingsList` rows (7031d3d9). |
| R22 | Never "keyboard" alone | PARTIAL | pages renamed (51f697f0), glossary lines 318–323. `common.keyboard: 'Keyboard'` / ru `'Клавиатура'` is still the on-screen piano's accessible name (logged as left). |
| R23 | One set of marks | DONE | `NavMarks`, `src/app/nav-marks.test.ts` (acebab69). |
| R24 | Five row kinds | DONE | `RowLink`, `ChoiceRow`/`PictureChoice`, `SwitchRow`, `ActionRow`, `DangerRow`/`DangerGroup`. |
| R25 | Destructive last and alone | PARTIAL | `DangerGroup` on Account, Storage, song, lesson, course Settings (9bc0e55a). Song's own-music Reset/Delete still its own `AlertDialog` (`pages/piece/ui/OwnMusicAsk.tsx`). |
| R26 | Back goes up; replace for non-places | DONE | `app/routes/parents.ts` + test, `shared/lib/use-up.ts`, `useSetSearch`, no `useGoBack` left (b24068b9, 66fd1593, d9d5883e). |
| R27 | Search a palette | DONE | `widgets/search-palette`, ⌘K and sidebar Search open it (`AppNav.tsx`), "Search everywhere" string (4ecda26d). Phone's per-place field not verified. |
| R28 | Wide screen filled; Practice one grid or bands; Songs' Explore in the bar | CONTRADICTS | `pages/practice/ui/PracticePage.tsx`: `grid items-start lg:grid-cols-2 xl:grid-cols-3` of groups of 4, 2 and 3 rows: fixed columns of different lengths, the exact case R28 forbids (owner/56). Songs' Explore switch not built (B3). |
| R29 | One button family/heading style; transport one capsule | PARTIAL | Chords' transport one capsule (7875ffe7); "Practise in the Player" heading style left open (progress A20). |
| R30 | Only what works here | PARTIAL | A42 in progress. |

## Step 0: carry-over check

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| S0 record | Each Step 0 item marked done or open in `audit.md` | NOT DONE | `audit.md` has no Step 0 row; progress.md has no Step 0 entry. |
| S0.1 | Lesson content: no jump to top, looks editable, blocks like Notion/Craft | NOT DONE | no round 29 commit touches `pages/lesson-editor` for this (only renames, focus, marks). |
| S0.2 | Music editors: Flat critique (A34, A40); menus' current options | NOT DONE | A34, A40 open in progress.md. |
| S0.3 | New song like Flat's, no preset cards | DONE (pre-existing) | `pages/songs/ui/NewSongSheet.tsx`, no "preset" string; not re-checked in the audit. |
| S0.4 | Song Settings like a deck's; Export… one sheet; publish from Settings | DONE (pre-existing) | `SongSettingsPage.tsx` holds Export… (`SongExportSheet`), Publish in library; `NewActions.tsx` dial has no Publish. |
| S0.5 | Editors' header and floating toolbar clearly separate | not verified | no round 29 change or audit row. |
| S0.6 | No stale UI | PARTIAL | stale left: "Play melody" on Sound and recording, "Your version", glossary's old "**Between** … _Avoid:_ Passing chords" entry (`docs/UBIQUITOUS_LANGUAGE.md:474`) contradicting the new "Passing chords" entry (line 628). |
| S0.7 | Every standing rule on every screen | PARTIAL | see the R table; A19's laptop pass not done. |

## Part A, items 1–19

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| A1 | One Transpose, keep the editor's | DONE (differently) | one widget `widgets/transpose/ui/TransposeTool.tsx`; `pages/player/ui/TransposeTool.tsx` and `pages/score-editor/ui/EditorTranspose.tsx` wrap it. The kept one is the shared widget, not "the editor's" file; same effect. |
| A1 | Sweep pickers, steppers, sheets, rows, menus, empty states, bars | PARTIAL | audit rows only for Transpose and the headers. Steppers (`Stepper`) and menus are one each; empty states are three (`Empty` primitive plus `LibraryEmpty`, `ArchiveEmpty`); no audit row for sheets, menus, empty states. |
| A2 | Fixed-height bar with back, title, tabs/segmented switch, actions | PARTIAL | one `ScreenHeader` (39 users), but tabs are a second row and titles wrap, so not fixed height; Songs' My songs · Explore not built (B3). progress says done. |
| A2 | Large title may collapse; nothing jumps | DONE | one bar, `large` sets a bigger title in the same row; bar's hide rule (0a9069b4). |
| A3 | Where primary/secondary/Edit/Settings/Done sit, in DESIGN.md, applied | NOT DONE | progress: open. DESIGN.md "Placement" (pre-existing) says the bar holds two round actions and the primary floats, nothing on left/right for Edit, Settings, Done. Its "Floating: … each its icon alone unless the learner asks for names" is at odds with A3's "a primary action is a labelled button". |
| A4 | Page/sheet/menu rule; each break an audit row | PARTIAL | rule written in DESIGN.md "Placement" ("Page, sheet or menu (A4)"); no audit row of the places that break it. progress says "open" (it understates). |
| A5 | Control rule in DESIGN.md | DONE | DESIGN.md "Choices", ADR 0061 (0bce757a). |
| A5 | List every picker (keys, roots, qualities, scales, inversions, tempo, time, clef, instruments, levels) | NOT DONE | no list in `audit.md` or `key-picker/spec.md`; tempo, time, clef, instruments, levels not covered. |
| A5 | 12 keys; split black-key cells; unsplit where only pitch | DONE | `PitchPicker`, `NotePicker` (`shared/ui/pickers`); used by Chords, Scales, Intervals, the Player's setups and the lesson editor. Start on is a `MenuPicker` of the scale's notes, not the 12-cell octave (logged). |
| A5 | One compact row of pickers on explorers | DONE | `PickerRow` in `ChordBuilder.tsx`, `ScaleChoice.tsx`. |
| A5 | Circle of fifths as the picker for Key tab, **the editor's key, Transpose** | CONTRADICTS | the Key tab's circle chooses in place (`KeyCircle`), and `KeyPicker` is used by Progressions, the Chord finder and the lesson editor. But the score editor's key uses `KeySignaturePicker` (a sign grid, `pages/score-editor/ui/KeyPicker.tsx`, "ADR 0114"), and Transpose stays ± steps (`widgets/transpose`). The prompt and the round's own spec (`key-picker/spec.md` §3) both name the editor's key and Transpose. Wedges show a signature count, not the signature drawn (the spec says "drawn small"). |
| A5 | Keys checklist for Quiz/Exercises | DONE | `KeysChecklist` in `widgets/trainer-setup` (d52e781f). |
| A5 | Feedback at once (facts, note chips, staff, lit keys, diatonic chips) | not verified | the spec gives this to the explorers (A20–A22). |
| A5 | Used everywhere from one `shared/ui` component | PARTIAL | not in the editor's key or Transpose (above); Accompaniment has no key choice. |
| A5 | Edge blur removed | DONE | see R13. |
| A6 | Known renames; glossary _Avoid_ words; failing test | DONE | `src/shared/i18n/avoid-words.test.ts`, glossary lines 628–634 (42911975). "Melody staff" still in `player.ts` `needs.tune`. |
| A6 | Every string en/ru checked against the books | PARTIAL | progress: in progress, moved to B2. Stale glossary entry "Between" (line 474) says to avoid "Passing chords". |
| A7 | `includeSearch: false`; sweep tabs/sidebar | DONE | `widgets/app-nav/ui/AppNav.tsx:145,159` (3d593abf). |
| A8 | Radius tokens and one selected style via shared components | DONE | 79811d63, 4ad592ac, tests `shapes.test.ts`, `choice.test.ts`. |
| A8 | Known breaks (capsule, View cards, chips, Key/Time/Tempo, Practise/Learned, sidebar, Practice list, segmented) | PARTIAL | Practice list's inset hover still open (`RowGroup.tsx` `card p-1.5`; audit "open"). |
| A8 | Done: contact sheet of every control, 4 states, light and dark | NOT DONE | no contact sheet in `shots/after` (only 3 dark shots in all). progress says done. |
| A9 | List every loss/hide act with trigger, confirm/undo | PARTIAL | audit lists Archive, Delete (songs, folder, take, pattern), Reset progress; not Remove a lesson from a course, Restore an older version, Unpublish (still own dialogs in `features/edit-original`). |
| A9 | All through the one dialog | PARTIAL | `ConfirmDialog`/`confirm()`; own `AlertDialog`s remain in `features/edit-original/ui/VersionsDialog.tsx`, `DraftBar.tsx`, `pages/piece/ui/OwnMusicAsk.tsx`, `score-editor/ui/KeepBars.tsx`. Remove a lesson has no confirm (R17). |
| A9 | Done: a test per act (appears, Cancel no change, confirm acts) | NOT DONE | only `shared/ui/ConfirmDialog.test.tsx` tests Cancel; no per-act Cancel test found. |
| A10 | `settings-map.md` | DONE | `.scratch/r29/settings-map.md`. |
| A10 | One home each; "Lessons read as" duplicate removed | DONE | `registry.ts` `SETTING_HOMES`; lesson Settings shows a link row. |
| A10 | Registry of (key, home, **label, control**), pages **rendered from it** | CONTRADICTS | `entities/settings/model/registry.ts` holds only key → page; no label or control. Every page is hand-written (`GeneralPage.tsx`, `SoundPage.tsx` …); nothing renders from the registry (no import outside tests and the `data-setting` attribute). The spec (`settings-registry/spec.md` §1–2, "One renderer `widgets/settings-page`") put this off to the A12 rebuild, which did not do it. progress says "pages from the registry with A12", marked done. |
| A10 | Test fails a key on two pages | DONE | `src/app/settings-pages.test.tsx` (data-setting) and `settings-homes.test.ts`; one exception left (`use-metronome.ts`). |
| A11 | Pattern in DESIGN.md | DONE | DESIGN.md "An act on an item is a button" (progress wrongly says "left"). |
| A11 | Favourite: ♡ card, Player ⋯, row menus, swipe, Select; switch gone | DONE | `PlayerMore.tsx`, `songs.ts` menu strings; switch removed. |
| A11 | Learned the same (button and its menu command) | PARTIAL | no "Learned" command in a song row's ⋯ or long-press menu (no such string in `songs.ts`). |
| A11 | Sweep other acts posing as switches | DONE | audit: none found. |
| A12 | Research and pattern in DESIGN.md | DONE | DESIGN.md "Settings pages (R20 …)". |
| A12 | Two panes ≥64rem; grids removed from SettingsScreen and MidiSettingsPage | DONE | `SettingsScreen.tsx`; no `grid-cols` in `pages/settings`, `pages/midi-settings` (045617ab). |
| A12 | Every settings page built from the registry | NOT DONE | see A10. |
| A12 | Regroup; reword awkward labels | DONE | Metronome a row on Sound and recording; "Fold the keys" replaces "Hide them on a phone on its side". |
| A12 | Done: screenshots 402 and 1280 before/after | DONE | `shots/after/settings-*-402/1280.png`. |
| A13 | Rule in DESIGN.md; one `PictureChoice`; the known table | DONE | DESIGN.md "Picture choice"; `common.ts` keySize "All 88", "Names on marked keys", "Chord names", "Piano position" (not "Keyboard position"), "Fold the keys" (7031d3d9). |
| A13 | Per-row list of every settings page | PARTIAL | no row-by-row list in the audit; `settings-map.md` covers keys and homes. |
| A14 | Four pages renamed, icons | DONE | `SettingsList.tsx`, `/settings/on-screen-piano`, `connect-piano`, `computer-keys`, `sound-and-recording` (51f697f0). |
| A14 | Sound and recording: link to Metronome; **"Play melody" goes** | CONTRADICTS | link row present (`SoundPage.tsx`), but `<TuneSwitch />` ("Play melody", `common.ts:206`) is still on the page. |
| A14 | Built from the registry | NOT DONE | see A10. |
| A14 | Quick test answers in the audit | DONE | `audit.md` "A14 quick test". |
| A14 | Sweep "keyboard" alone en/ru | PARTIAL | the accessible name `common.keyboard` remains (logged). |
| A15 | Account card (avatar, name, email, one status line; signed-out line) | DONE | `AccountCard.tsx`, its test covers synced, waiting, offline, failed and signed out (144f4b56). |
| A15 | Account page order; Sync only there | DONE | `AccountSettingsPage.tsx`; test "Sync now has one home, the Account". |
| A15 | Storage and backup page; Sync and data gone | DONE | `StoragePage.tsx`; no `sync-and-data` left. |
| A15 | Done: screenshots signed in and out at 402 and 1280 | PARTIAL | one `settings-account-*` set only (one state). |
| A16 | Rule 23 applied; shared rows aligned; test | DONE | `nav-marks.test.ts` with six allowed movement files (acebab69). |
| A16 | Hover to the card's edges | PARTIAL | Practice's `RowGroup` still inset (see A8). |
| A16 | Done: screenshots of Settings, a song, Practice, Profile at 402 and 1280 | PARTIAL | no Profile shot; Practice only at 320 and 402 (`look-practice-*`). |
| A17 | Pattern in DESIGN.md | DONE | DESIGN.md "Destructive rows". |
| A17 | Every row given its kind; destructive last | DONE | `DangerGroup` on Account, Storage, song, lesson, course Settings. |
| A17 | Tests: red, last group, opens its confirmation | PARTIAL | tests in Account, Settings, Piece, Lesson and Course Settings tests; song's Reset/Delete keeps `OwnMusicAsk`'s own dialog (logged "to move with B6"). |
| A17 | Done: screenshots of Account, Storage, song, lesson, course Settings at 390 and 1280 | PARTIAL | no lesson or course Settings shots; widths 320/402/1280, not 390. |
| A18 | Parents, `useUp`, `replace` list, flows checked, palette | DONE | `parents.ts` + test, `use-up.ts`, `back-as-up/navigates.md` (46 sites), `widgets/search-palette`; `/search` no longer a sidebar place. |
| A19 | Every place and page at 1280/1440/1920; screenshot per place | NOT DONE | progress: open; no 1440/1920 shots; Practice's unequal columns remain (R28). |

## Contradictions

1. **R5**: floating actions dock to the right edge as a column wherever keys are docked on a laptop or a phone on its side (`FloatingActions.tsx` `aside:justify-end`, `aside:flex-col`). The rule says "A centred capsule, never docked to a side". This hits round 29's Chords and Scales.
2. **R28 / A19**: Practice on a laptop is still fixed columns of unequal length (`PracticePage.tsx` `lg:grid-cols-2 xl:grid-cols-3`, groups of 4/2/3 rows). R28 names Practice explicitly.
3. **A5**: "Keys (Scales and keys' Key tab, the editor's key, Transpose): the circle of fifths is the picker". The editor's key is a sign grid (`KeySignaturePicker`, kept under ADR 0114), and Transpose is ± steps. ADR 0114 is older than the brief, so by "When two parts disagree" the brief wins. The round's own spec named both places too.
4. **A10/A12/A14**: "registry (key, home, label, control), and render pages from it". The registry is key → home only, and every page is hand-written. The work was put off from A10 to A12 and not done there, yet all three are marked done.
5. **A14**: "'Play melody' goes (A35)". It is still on Sound and recording (`TuneSwitch`, "Play melody").
6. **R17**: Remove a lesson from a course or level is Undo-only, with no confirm.
7. **A3** (open): DESIGN.md's floating buttons are "icon alone unless the learner asks for names". A3 says "a primary action is a labelled button".

## Claimed done but not

- **A2** (done): tabs are a second row and titles wrap, so the bar's height is not fixed; Songs' My songs · Explore switch not built.
- **A5** (done): the editor's key and Transpose are not the circle; no list of every picker (tempo, time, clef, instruments, levels).
- **A8** (done): no contact sheet (its Done line); Practice list's inset hover still open per audit.md itself.
- **A10** (done): pages not drawn from the registry; the registry has no label or control.
- **A12** (done): "every settings page on it from the registry" not done.
- **A14** (done): "Play melody" still shown; pages not from the registry.
- **A15** (done): signed-in and signed-out screenshots not both present.
- **A16** (done): Profile and Practice-at-1280 screenshots missing; Practice rows' hover inset.
- **A17** (done): lesson and course Settings screenshots missing; song Reset/Delete outside `ConfirmDialog`.
- **A1** (done): only Transpose and headers audited; the asked sweep (sheets, menus, empty states) has no rows.
- **Step 0**: never recorded in `audit.md`, which the brief asks for.
- In the other direction, progress understates two items: A4's rule and A11's DESIGN.md pattern are both written, though progress marks them open or "left".
