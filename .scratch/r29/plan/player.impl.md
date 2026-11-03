# The Player: its bar, Pick your view and its one Settings page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Player as approved on the mockup page (screens 2.1–2.18): the bar ✕ · title · ✎ · keys · MIDI · ⚙;
the tools row "Sheet ⌃" · Transpose · Simplify; one Settings page whose rows open their own pages; hands in the
floating transport; Simplify one button; Diagrams as Chordify's strip.

**Architecture:** `PlayerLayout`'s bar keeps `ScoreBar` (shared with the editor) and gains the edit pencil beside
the title (`ScoreBar`'s `titleEnd` slot) and a keys toggle; Setup and More leave the bar. The Player's Settings
becomes a list page (`PlayerSettingsList`) with child routes for its inner pages, each in `ChoiceCard`s. The View
menu becomes `ViewChip` + `PickViewPanel`. Each task is one screen or one control, test first.

**Tech Stack:** React 19, TanStack Router, Vitest 4, i18n en/ru; `ChoiceCard` from build 1.

**Spec:** `.scratch/r29/mockups/song-player-editor.html` (2.1–2.18, 4.1), its feedback
`.scratch/r29/owner/feedback-song-player-editor.md` (both passes), `.scratch/r29/plan/design.md`,
`.scratch/r29/plan/settings.md` ST15 (where the mockups do not differ).

## Global Constraints

- One gear per screen; no ⋯ menu and no setting in a menu; every setting one home (`SETTING_HOMES` → `player`).
- Settings pages: `ChoiceCard` for choices among words, `SwitchRow` for on/off, longer help in ⓘ.
- The floating capsule: Play on the right; nothing floating covers the music's last line without room under it.
- Back goes up (`parents.ts`): each inner page's parent is the Player's Settings, whose parent is the Player
  with its search kept.
- Every string en + ru; professional terms (Count-in, Sustain pedal, Click track, Staves, Solo).
- Phone and laptop alike; the laptop shows a Settings page as a panel at the right (screen 4.1) — task 8.

## Review Focus

1. A walk, a progression or an exercise (no song): the gear opens the same list without "This song" rows that do
   not apply (no Song information, no Export) — task 2 test "a walk's Settings has no song rows".
2. Pick your view for a song with no lyrics: Lyrics greyed with its reason, not hidden — task 3 test.
3. Hands set to Right, then a song with one staff: the hands button hidden, playback unaffected — task 5 test.
4. Simplify on, then Transpose: the simplified names follow the transposed key — task 6 test.
5. The Diagrams strip at a section's end turns a page; a loop inside a page never turns it — task 7 test.

---

### Task 1: The bar — ✎ beside the title, keys, MIDI, gear; Setup and More leave

**Files:** `src/widgets/practice-player/ui/ScoreBar.tsx` (slot `titleEnd?: ReactNode` after the title),
`src/pages/player/ui/PlayerLayout.tsx` (actions: `KeysToggle`, `MidiButton`, gear; `modes` → `titleEnd`),
`src/pages/score-editor/ui/EditorHeader.tsx` (Done ✓ in `titleEnd`, Undo · Redo after), tests
`PlayerPage.test.tsx`, `ScoreEditorPage.test.tsx`.
**Interfaces:** Produces `KeysToggle` (`widgets/practice-player/ui/KeysToggle.tsx`): a tool button, aria-pressed,
writing `scoreView.keys` (the keys shown under the music), label "Piano keys".
- [ ] Failing tests: "the bar is Close, title, Edit, Piano keys, MIDI, Settings — no Setup, no More"
  (`getAllByRole('button'|'link')` within the bar, names in order); "Piano keys hides and shows the keys, saved";
  editor "Done sits beside the title".
- [ ] Run — FAIL. Implement. Run `test:related` on the changed files — PASS. Commit.

### Task 2: The Player's Settings as a list of pages

**Files:** `src/pages/player/ui/PlayerSettingsList.tsx` (new; replaces `PieceSettingsPage`'s body),
`src/app/router.tsx` (children of `/play/$pieceId/settings`: `staves`, `display`, `playback`, `sections`,
`information`; walks', progressions' and exercises' `/settings` the same list), `src/app/routes/parents.ts`.
**Interfaces:** Groups in order — **While you play**: Staves ›, Display ›, Playback ›, Metronome › (to the Metronome's
Settings); **This song** (a song only): Sections ›, Song information ›; **Share** (a song only): Export… (the Export
drawer, existing), Print… (existing print); Help ›.
- [ ] Failing tests: "the gear opens the list in this order"; "a walk's Settings has no song rows"; "Back from Display
  returns to the list, Back again to the Player with its search".
- [ ] Implement; delete `widgets/player-settings` once its parts live in the inner pages (task 4). Commit.

### Task 3: "Sheet ⌃" and Pick your view

**Files:** `src/pages/player/ui/ViewChip.tsx`, `PickViewPanel.tsx` (replace `PlayerViewMenu.tsx`), tests.
**Interfaces:** the chip names the shown view; the panel: a segmented row Sheet · Grid · Diagrams · Lyrics (a view the
song cannot show greyed with its reason in ⓘ), a picture of the chosen view, the checkbox "Show this when opening a
song" (`scoreView.askOnOpen`, its one home), Done.
- [ ] Failing tests: "the chip opens the panel and Grid shows the grid"; "Lyrics is greyed for a song without words";
  "Show this when opening a song is saved".
- [ ] Implement; the View menu's display options move to task 4's Display page. Commit.

### Task 4: The inner pages — Staves, Display, Playback

**Files:** `src/pages/player/ui/StavesPage.tsx` (All staves play, each staff Solo · Show · Volume, Only the chords),
`DisplayPage.tsx` (Layout card; On the sheet switches: chord symbols, finger numbers, note names, lyrics; per view
only what applies), `PlaybackPage.tsx` (cards: Count-in None · One bar of clicks · 3, 2, 1 on the screen; Sustain
pedal As written · Off; Cursor Beat by beat · Smooth; Speed trainer step 2 · 5 · 10 %).
- [ ] Failing tests per page: each control writes its key; `settings-pages.test.tsx` lists the three as `player`.
- [ ] Implement; registry homes stay `player`. Commit.

### Task 5: Hands in the transport

**Files:** `src/widgets/practice-player/ui/HandsButton.tsx`, the dock; `otherHand.play` as "Hear the other hand".
- [ ] Failing tests: "Right hand dims the left and plays only the right"; "a one-staff song has no hands button".
- [ ] Implement; the One hand page does not exist. Commit.

### Task 6: Simplify, one button

**Files:** `src/pages/player/ui/SimplifyTool.tsx` (a toggle, aria-pressed; on: chord symbols shown and played as their
basic chords), tests `SimplifyTool.test.tsx`.
- [ ] Failing tests: "Simplify on shows Cmaj9/E as C"; "with Transpose +2 it shows D".
- [ ] Implement (the existing simplification, without its panel). Commit.

### Task 7: Diagrams as Chordify's

**Files:** `src/widgets/chord-views/ui/DiagramsView.tsx`, `BeatStrip.tsx`.
**Interfaces:** the chord now and the next dimmed; under them the strip of every chord by its beats; the current beat
a black box; the strip pages by part, never scrolling continuously.
- [ ] Failing tests: "the next chord is dimmed"; "the box moves a beat at a time"; "at the part's end the strip turns
  to the next part"; "a loop inside a part never turns it".
- [ ] Implement. Commit.

### Task 8: Laptop panel, gate, docs

- [ ] On a laptop (≥64rem) a Player Settings page opens as a panel at the right with the music in sight (test with
  `onLaptop()`).
- [ ] `npm run typecheck && npm run lint`; full `npm run test`; `npm run build`; screenshots 390, 320 (ru), 844×390,
  1280 against 2.1–2.18 and 4.1.
- [ ] ADR 0105 (the Player) and 0108 (the view), glossary, CLAUDE.md's Player line; commit; push the branch and `main`.

## Not in this plan

- Transpose's fix (the Player keeps an offset) — rounds 3–4 plan T.
- Lyrics view improvements (research first), the Chord player's styles (Practice redesign).
