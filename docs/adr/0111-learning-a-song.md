# ADR 0111 — Learning a song: its page introduces it; its sections teach it by Chordify's rules

- **Status:** accepted · **Date:** 2026-10-24 · consolidated 2026-10-27

## Context

A song's page was cluttered with its chart and a grid of its chords. Chordify's "Learn the song" teaches a song by its
sections: each chord until it is played right three times, the sequence in time with the metronome, one change at a
time without the tempo, the pattern on one chord. The owner wanted the page calm ("I don't like the descriptions") and
no card on top.

## Decision

- **The song's page** (`PieceView`; Apple Music's album page, MuseScore's score page): its bar (Back, the title with
  ✎, which opens the score editor, Learned, Settings); the song (its cover, a tap changing its picture and paint, ♡ on
  its corner; who wrote it and its book; one line of facts: key, time, tempo, level, genre, language; what is said of
  it, two lines and More); its music (its sections where it has more than one, the learner's practice, its chords
  and the library's progressions it uses); and **Details**. Play floats. From 64rem the song and its Details are the
  left column (24rem) and the music the right; on a phone Details follow the music.
- **Details** (`SongDetails`, Notion's properties): each property a row of its name and value, a tap editing that one
  in a popover beside it on a laptop or a sheet on a phone (`Picker`), each change kept at once. Title and
  Description, an own song's or an editor's (the editor's into the song's draft); Composer, Lyricist and Arranger,
  written into the score's own lines (`withSongCredit`: the header's composer, lyricist and arranger, the content's
  credit it stands for gone), so the page and the score print the same; Level (a course's song's is its course's,
  read only with ⓘ), Genre, Language (Instrumental for a song without words), Tags (Notion's multi-select: the
  library's other tags offered as one types, Create for a new one). On one of the app's songs a learner reads its
  credits; nothing is edited in a mode of the page's own.
- **The song's Settings** (`/songs/$pieceId/settings`, Noji's deck settings): the song at its head; Library (Folder,
  Favourite as a switch, Duplicate, Archive or Restore); Share (Publish with its state, a page of its own at
  `/songs/$pieceId/publish`; Share link; Export…); and apart, Delete or Reset to the original, asked first. A study has
  no library rows.
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
- r28 — The song's page in Edit, where its words are the learner's (an own song) or an editor's (the app's): its title in the language shown, who wrote its music and words (properties), what is said of it, and Edit the music; Settings, then Edit at the bar's end. Elsewhere the pencil opens the learner's version of the score (2026-11-01).
- r28 — Who wrote a song lives in one place: its score's composer and lyricist (`header`), written from the page's Edit or the score's Settings, printed under its title and shown in place of the content's music and words credits (`shownCredits`) (2026-11-02).
- r30 (S4, S5) — The song's page: its ✎ beside the title puts the page in Edit in place (`?edit=true`), Learned (named;
  the check alone on a phone) and Settings in the bar, ♡ on its cover (its picture and paint, or its key), Play floating.
  Song details are never printed: level, genre, language and tags (the library's `songDetails`), cover; its title and
  about are an own song's or an editor's. Who wrote it is the score's alone (`SongFacts` lost Music and Words); Edit says
  so and links to the score. Settings › Details and Colour and picture go. Your practice: the day played last and the
  takes (2026-11-05).
- r32 (R32-C) — The page's Edit mode and Settings › Edit song page go: Details is a list of properties edited where
  they stand (a popover on a laptop, a sheet on a phone), the credits among them, written into the score's lines; a
  tap on the cover changes it. The laptop's page is two full columns. Settings gain Favourite as a switch
  (2026-11-05).
