# The score editor: its bar and its Settings as a list of pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** The score editor as approved on the mockup page (screens 3.1–3.10, 3.23) and its feedback: the bar as the
Player's (✕ · title · Done | Piano keys · MIDI · Undo · Redo · ⚙); the score's Settings a list (Title and credits;
Music: Staves, Key signature, Time signature, Tempo, Bars; How the editor works: Layout, Note input, Recording), each
row opening its own page; Key "From bar"; Time's Customize two stacked boxes; Tempo beat · beats a minute · words;
Recording "Click while recording" and Count-in; no Sound popover in the dock; no `/settings/score-editor`.

**Architecture:** `ScoreSettingsPage` keeps its route (`/edit/$pieceId/settings`) and becomes a list whose rows open
in-page pages (state, a Back at their top, as the Player's Settings sheet does). Key, Time and Tempo pages reuse the
pickers the popovers hold (`KeyPicker`, `TimePicker`, `TempoPicker`), so the printed marking, the palette and the
Settings write through one component each. The editor's keys use `scoreView.keys` (the Player's), shown by the
bar's `KeysToggle`.

**Spec:** `.scratch/r29/mockups/song-player-editor.html` (3.1–3.10, 3.23), `.scratch/r29/owner/feedback-song-player-editor.md`
(3.5, 3.6, 3.7, 3.10, 3.22, 3.23, both passes), `.scratch/r29/plan/settings.md` ST16 where the mockups do not differ.

## Global Constraints

- One gear per screen; one icon one meaning; every setting one home (`SETTING_HOMES`).
- Settings pages: `ChoiceCard` for choices among words, `SwitchRow` for on/off, help in ⓘ.
- Professional terms: Key signature, Time signature, Tempo, Count-in, Click while recording, Staves.
- Every string en + ru; phone (390, 320) and laptop (1280) alike; Back goes up.
- The latest owner words win over ST16 (Key, Time and Tempo stay in Settings as pages, mockup 3.3).

## Review Focus

1. Key from bar 5: the key changes from bar 5 on, bars 1–4 keep theirs.
2. Time Customize 5/8 typed in two boxes; an invalid unit (3) refused.
3. Tempo: beat ♩. with 60 a minute writes the mark as printed; words "Andante" printed and removable.
4. The editor's Piano keys and the Player's are one setting: hidden in one, hidden in the other.
5. A lesson's example editor has no gear (unchanged).

---

### Task 1: The bar as the Player's — Piano keys; the dock without the Sound popover

**Files:** `EditorHeader.tsx` (`KeysToggle` before MIDI), `EditorToolsRow.tsx` (View without the Keys chip),
`ScoreEditor.tsx` / `EditorPalette.tsx` (the palette's keys toggle and the keyboard fold read `scoreView.keys`),
`EditorDock.tsx`, `RecordingStrip.tsx` (no `RecordingSettings`; file deleted).
- [ ] Failing tests: "the bar is Close, Done, Piano keys, MIDI, Undo, Redo, Score settings"; "Piano keys hides the keys
  in the editor and in the Player alike"; "the dock has no Sound button".
- [ ] Implement; `test:related`; commit.

### Task 2: Score Settings as a list of pages

**Files:** `ScoreSettingsPage.tsx` (list + page state), new `ScoreSettingsPages.tsx` (Staves, Bars, Layout, Note input,
Recording pages), en/ru `editor` strings.
**Interfaces:** groups **Title and credits** (the five text rows, unchanged), **Music** (Staves › n, Key signature ›,
Time signature ›, Tempo ›, Bars › n), **How the editor works** (Layout ›, Note input ›, Recording ›). Layout: Staff
size and Bars per line as ChoiceCards. Note input: "Play notes while editing" (`editing.hearNotes`). Recording:
"Click while recording" (`recorder.click`, ⓘ "A click on every beat, so what you play lands in the right bars") and
Count-in. `/settings/score-editor` and its page deleted; homes move to `score-editor` ⇒ the editor's Settings.
- [ ] Failing tests: "lists Title and credits, Music, How the editor works in order"; "Layout opens its page and
  Back returns to the list"; "Recording holds Click while recording".
- [ ] Implement; commit.

### Task 3: Key signature from a bar; Time signature's Customize; Tempo's beat, number and words

**Files:** `KeyPicker.tsx` + page (From bar stepper, 1 = the start), `TimePicker.tsx` (Customize: beats over beat
unit, two boxes), `TempoPopover.tsx` → `TempoPicker` (Beat ♪ ♩ ♩. 𝅗𝅥 · Beats a minute − n + · Words), the editor's
`tempo` action carrying words.
- [ ] Failing tests per Review Focus 1–3.
- [ ] Implement; commit.

### Task 4: Staff "Hide staff (it still plays)"; gate, docs, main

- [ ] The staff's show row worded "Hide staff (it still plays)" (3.23) wherever a staff is shown or hidden.
- [ ] typecheck, lint, full test, build; screenshots 390, 320, 1280; ADR 0115 line; CLAUDE.md; push branch and main.

## Not in this plan

- 3.22 an editor's built-in song: Changes and Publish in the song's Settings — the Songs plan (ST17), where the song's
  Settings are rebuilt.
- Note input's Replace · Insert and Palette side cards — round 4 (they need the palette's side as a setting).
