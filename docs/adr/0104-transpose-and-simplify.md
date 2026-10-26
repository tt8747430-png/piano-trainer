# ADR 0104 — Transpose and Simplify in the Player's tools row

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0102 (the tools row: two tools after the View),
  ADR 0099 (no Transpose or Simplify, the Setup's key transposing), ADR 0022 (a piece's kept params) · **Spec:**
  [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §4

## Context

Chordify's toolbar has Transpose beside the View. Its button shows the key ("F"), or how far it was moved ("(−1)")
in the accent colour. Beside it, Simplify "replaces complicated chords with simple major and minor chords", greyed
where a song has none.

Our key was a field in the Setup sheet: a letter, then an accidental. A learner had to open a sheet to see the key,
moved it by letters rather than by steps, and could pick a spelling no signature prefers (C♯ major, seven sharps,
over D♭'s five). Nothing played a song's chords simply for a learner who knows only triads.

## Decision

- **Transpose, after the View.** Its value is the key the music is in, as printed (`C♯`, `B♭m`), in the accent once
  moved from the song's key. Its popover holds:
  - − and +, a semitone each, as far as the music moves the short way: −5 to +6, as its written notes move
    (`transposition`);
  - the key it lands in, named, and how far that is from the song's key ("−1", "+2", or "The song's key");
  - Reset;
  - where the piece's recording falls silent (it plays in the song's own key alone), an ⓘ beside its heading.
- **A key is spelled by its simplest signature** (`transposedKey`, by the key's one rule, `tonicSpelling`): B, not
  C♭; D♭, not C♯. Where two signatures write six, F♯ major and E♭ minor, as the walks through the keys spell them.
  The song's own key stays as it is written.
- **The URL** keeps the key as the Player's kept `key`, per piece (ADR 0022). The Setup's key field goes: one place
  each.
- **Simplify, after Transpose,** a switch, pressed while on. Every chord is played and shown as its plain triad on
  its root (`simplifyChord`):
  - minor where it has a minor 3rd and no major 3rd, a diminished chord too; major otherwise (augmented, suspended);
  - a slash chord's bass and every added note dropped;
  - a chord held on where the next in its bar simplifies to it (C then C/E is C for both), as a lead sheet writes it
    once;
  - a bar of no chord stays as it is, and a bar written note by note keeps its notes: its chord symbols alone are
    simplified.
- **Simplify changes the music, not the view.** `arrangePiece` simplifies the chart before arranging it
  (`simplifyChart`). The Performance changes, and with it every view, the sheet's chord symbols, Song information,
  Wait mode and Export to MIDI. The song's page, its sections and their lessons read the piece as written.
- **Greyed where nothing would change** (`isSimpleChart`), its reason its tooltip: "No chord to simplify".
- **A kept param,** `simple`, false when absent.
- **A song written in degrees** keeps its Chord size in the Setup. While Simplify plays triads the field is greyed,
  its ⓘ saying why.
- **A piece's Player alone.** A progression's, a walk's, the chromatic walk's and an exercise's key or root stays in
  their Setup: there it chooses what is practised, not a piece's transposition. A progression's chord size already
  chooses its chords.
- **The row's room.** On a phone held upright the View, Transpose and Simplify share the row equally, a name cut
  short where it has no room and the key whole. On a phone on its side they stand in the bar's row (ADR 0102), Wait
  mode's line keeping its words beside the end group, and share the room left, each cut short in proportion.

## Consequences

- **`shared/lib/music`:** `transposedKey`, `transposition` and `TRANSPOSITION_RANGE`, which the walks through the
  keys and `transposeNotes` now use; `simplifyChord` and `isSimpleChord`. The table has no power chord, so a chart
  cannot write one; the rule would make it major.
- **`shared/lib/arrangement`:** `simplifyChart` and `isSimpleChart`.
- **`features/practice`:** the choice's `simple`; `arrangePiece` simplifies; `simplifies` says whether it would.
- **`widgets/practice-player`:** a `PlayerTool` takes a value, kept whole, and a tooltip; pressed, the muted fill.
- **`pages/player`:** `TransposeTool` and `SimplifyTool` in the layout's `tools`; `PieceSetup` without its key.
- **`app/routes`:** `simple` in `PLAYER_KEPT`; the walks keep the Player's own defaults, with no Simplify.
- **`styles/theme.css`:** the bar's columns on a phone on its side.
- **No store changes:** `pt-views` remembers `simple` as it remembers any param.
