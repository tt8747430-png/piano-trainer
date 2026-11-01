# ADR 0111 — Learning a song: its page introduces it; its sections teach it by Chordify's rules

- **Status:** accepted · **Date:** 2026-10-24 · consolidated 2026-10-27

## Context

A song's page was cluttered with its chart and a grid of its chords. Chordify's "Learn the song" teaches a song by its
sections: each chord until it is played right three times, the sequence in time with the metronome, one change at a
time without the tempo, the pattern on one chord. The owner wanted the page calm ("I don't like the descriptions") and
no card on top.

## Decision

- **The song's page** (`PieceView`) says what the song is, in this order: its bar (Back, the title, Edit, Settings);
  **The song**, one card: its facts in a line, **Practise** (a full-width honey button opening the Player as it was
  left), then Learned and ♡ in their own row; its note; its chords once as diagrams, with the library's progressions
  it uses as quiet chips (ADR 0112); its sections as rows in their paint, only where it has more than one. The page
  plays nothing and has no keys, no floating button and no More.
- **The song's Settings** (`/songs/$pieceId/settings`, Noji's deck settings): one list of grouped rows, a value at
  each row's end or a way on. Music (Edit the score); In your library (Favourite, its folder, Archive or Restore);
  Share (Export…, Share link, **Publish in library**, a page of its own at `/songs/$pieceId/publish`: the
  description, the row as others see it, Publish or Update, Unpublish); an editor's original (Edit the original, its
  draft's status and menu); and apart, Delete or Reset to the original, asked first. A study has no library rows.
- **A section's page** (`…/sections/$section`) teaches it:
  - **Chords**, open: each learned by **three holds** in its sheet: its keys held together on a MIDI keyboard or the
    sheet's keys, every key let go since the last. Each hold is heard (an accented click) and seen ("1 of 3").
  - Then three folds, closed until asked for, each with an ⓘ: **In time** (the Player in Listen, looped over the
    sequence, the click on for that visit), **One change at a time** (Wait mode on the bars two chords span) and
    **Pattern** (a bar of it on one chord, the keys out for that visit, each note lit as it sounds).
  - A row names what it plays (`Em · C · D`, `Em → D/F♯`), checked once done. One change alone is its sequence's.
- **Progress is what was played.** `pt-progress` keeps the lessons done by key (a chord held three times; a Wait-mode
  pass over a run of bars, which the Player records for any loop or the whole piece) and the holds counted so far.
  A section's lessons are computed from the music as the Player plays it, so a chord the learner's version changes
  is a new lesson. Listen does not hear the learner: a sequence, a change or a pattern is done in Wait mode.
- **The whole piece's Learned mark** stays the learner's own: lessons never set it.

## Consequences

The visit's `click` and `keys` are never remembered (ADR 0038). Judging a pass in Listen by what a MIDI keyboard plays
along is not built: it would need timing windows the Player does not keep.

## History

- 0098 — A song's page introduces it (2026-10-24).
- 0100 — A song is learned by its sections (2026-10-25; the learning card removed 2026-10-26).
- 0111 — Song lessons by Chordify's rules: three holds, in time with the click, one change in Wait mode (2026-10-27).
- r21 — The title in the bar's row; Edit a pull-down (your version, an editor's original); Learned in the bar;
  Favourite in More; Practise the floating action; key, time and tempo one line of chips (2026-10-30).
- r26 — The page's bar Edit and Settings; Practise, Learned and ♡ in the song's card; More and the floating Practise
  gone; everything done to a song on its Settings page, publishing on a page of its own (2026-11-01).
- r27 — New song in Flat's three steps (its name; its instruments: the piano and voices by family, counted with
  − n +, found by Search; Fine-tune: the tempo's note and number, bars, key, time with C, ¢ or your own). Publish in
  library one screen for songs and patterns, Noji's: its link with Copy, View in library, its saves, Unpublish and
  Publish new version at the foot, why publish in a sheet (2026-11-01).
