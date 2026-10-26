# ADR 0108 — The chord views made even, still and tappable: Over lyrics, the Grid, Diagrams

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0099 (Chords over lyrics, the Grid, a chord
  tapped), ADR 0101 (the Diagrams view's pair and strip), ADR 0102 (the View by view: Chords over lyrics and the
  Grid gain their own sections) · **Spec:**
  [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §1.3, §8

## Context

Chords over lyrics showed the song's chord summary once at the top of its column, where it scrolled away with the
first lines; its words had one size; a line of chords repeated stood once for each time it was written, and once
for a repeat however many times it was played. The Grid had no words. Neither view had a section of its own in the
View.

The owner's phone showed two more faults. In Diagrams the view scrolled sideways under its strip: a scroll bar
ran under it, the first diagram was cut at the left edge and the strip's last chord at the right; the pair and the
strip jumped from beat to beat. In the Grid a hymn's one-beat pickup stood as a narrow cell glued to the next bar
with "1/4" under it, its first rows ended early at different places, and the right edges were ragged: rows followed
the chart's written lines, each as long as its bars.

Chordify's Over lyrics pins the song's chord diagrams in a row under its strip, resizes its text ("Adjust view
settings": the font size, − and +), shows a chord's diagram when a computer's pointer rests on it, and writes a
chord line played several times once with "x3". Its Grid has a Lyrics button that shows the words under the beats.

## Decision

- **Chords over lyrics' own section in the View**, under its name:
  - **Diagrams pinned**, a switch (on by default): the chord summary in a smaller row under the beat strip, held
    at the top with it as the song scrolls, the chord sounding outlined in ink and scrolled into the row's sight,
    the others' names muted. Off, the view shows no diagrams; Song information and the song's page keep theirs.
  - **Text size**, − and +: the words and their chips at 80, 90, 100, 115, 130 or 150% of their own size, every
    length of a line in `em`, so a chip grows with its words. A line still wraps a segment (a chord over its words)
    whole; a segment wider than the line wraps its words inside it, never cut. The strip and the pinned diagrams
    keep their size. On a narrow menu the − size + wrap under the name.
- **Hover.** Where the device hovers with a fine pointer (`(hover: hover) and (pointer: fine)`, the theme's own
  hover), a chip rested on shows its chord's diagram, in the inversion the piece chose, in a small popover over it
  (the kit's tooltip). A touch is unchanged: it opens the chord's sheet.
- **×N.** A line of chips alone (no words) played again straight after itself, in its repeat (`|: … :|`) or
  written again in the same section with the same chords on the same beats, is shown once with `×N` at its end; a
  screen reader hears "Played N times". The line counts as playing, and its chip sounding is filled, in any of its
  copies. A line with words is never folded: each verse is shown.
- **The Grid's own section:** its **Lyrics**, the View's one Lyrics switch (`scoreView.lyrics`, the sheet's and
  Diagrams' too). With it on, each bar's words stand under its beats, small, verse by verse, a beat's words from
  its cell to the next sung beat's, wrapping there; a bar's name says its words (verse 1).
- **Greyed with its reason.** Where the music has no words, the Grid's and Diagrams' Lyrics switch is greyed, its
  ⓘ saying "The music has no words".
- **Diagrams: the view stands still, the strips move.**
  - Nothing in the Diagrams view scrolls; in Summary only the cards scroll down. The strip and the pair run into
    the screen's gutters on a phone held upright and fade there, so nothing is cut hard at an edge.
  - While Listen plays, the beat strip follows its clock frame by frame (`stripShift`, `beatThrough`): the beat
    sounding's middle a third of the way in as it starts, sliding on to the next beat's place as it ends.
  - The pair holds still until half a beat before the change, then slides, eased, with the clock (`pairSlide`):
    the next into the place of the one sounding, the chord after it in from the right, out of reach and unseen
    until it moves. The pair is clipped to two diagrams' room.
  - Taken to a beat or a chord while nothing plays, the strip and the pair slide there in 300ms.
  - Under reduced motion all of it stands still at each beat.
- **Diagrams: the pair is swiped, the strip scrubbed** (the owner: "the diagram moves to next, not just tapping";
  "the chord strip … should be swipable, but not the whole page"). Only the two move: both are `touch-pan-y`, so a
  page's gesture up and down still works and one sideways never moves the page, swipes back through the history
  or pulls it aside; a sideways wheel on them is the view's (its default prevented), an upright one the page's. No
  scroll bars. Built on `@use-gesture/react` and `motion`, as the kit's `SwipeRow` is, over pure, tested models.
  - **The pair** follows a finger, a mouse or a trackpad one to one (`pairSwipe`), a rubber band (iOS's, 0.55) past
    a whole diagram and towards an end with no chord; the chord before is drawn in from the left as it goes right.
    Let go past a third of a diagram, or with a flick (0.35px a millisecond, the way the drag went, after 8px), it
    springs on and the cursor goes to the next chord (to the left) or to the first chord of the change before
    (`chordBefore`, inside a loop's bars); a flick turned back, or towards an end, springs back (`pairRelease`). A
    trackpad's swipe goes one chord a gesture, the rest of its scroll going nowhere. Once the music stands on the
    chord swiped to, the pair settles into its slots as a step does (300ms). ← → still step the Player.
  - **The strip** moves under the hand and, let go, glides on with the flick's speed, slowing as a scroll view does
    (an exponential decay, its time constant 325ms, `glide`); it settles on the beat whose middle is nearest its
    mark, a third of the way in, where the glide would come to rest (`stripRelease`, `beatAtMark`), never past its
    first or last beat, and the cursor goes there. Past its ends it gives like a rubber band (`stripDrawn`). While
    Listen plays a drag takes the strip from the clock; let go, the music goes on from the beat chosen, the strip
    held on it until the clock stands there. A tap still goes to the beat tapped; a click at a drag's end is none.
  - **Never fighting the clock.** Both are drawn as the clock's place plus an offset that eases to nothing: the
    pair's `--slide` (the clock's) and `--swipe` (the hand's) add up; the strip's base is the clock's place (or the
    beat sounding) and a tap's 300ms slide, a glide and a drag are its offset (`useStripMotion`). Every frame is
    written straight to the element, with no render.
  - Under reduced motion nothing glides or springs: let go, it snaps.
- **A chord tapped goes there, in every chord view.** A diagram of the pair, a card of Diagrams' summary, a pinned
  diagram, a chip over the words and a beat of the strip take the Player's cursor to that chord, sounding it while
  nothing plays, as the Grid's beats do. A pair's diagram goes to its chord; a card or a pinned diagram goes to
  where its chord next starts from the beat sounding, else where it first does (`chordNear`). The view slides or
  scrolls to it. No chord view opens a chord's sheet: that is the song page's and Song information's summary, and
  a laptop shows a chip's diagram on hover.
- **No tap trapped.** A chip's reach past its face stops within the room between lines, so it never takes a tap
  meant for the line over or under it; the diagram coming in is inert.
- **The Grid, even and calm** (a lead sheet's):
  - Every row has the same beats (`gridColumns`: as many whole bars of the music's commonest length as the screen
    holds, two 4/4 bars or two 3/4 bars on a phone held upright), every beat as wide, so beats and barlines line
    up down the chart.
  - A section's bars run on from row to row as written, a bar never split (`gridRows`); each section starts a row.
    The chart's written lines no longer break rows.
  - A pickup takes a whole bar's place, standing at its end, the beats before it blank; the beats after a
    section's last bar are blank, its closing barline before them. A short bar elsewhere takes its own beats.
  - A short bar's length is shown by its beats alone: no "1/4" under it. A bar where the meter changes still names
    the new meter under it.
  - A chord is drawn as large as its room: its beat and the empty beats after it in its bar.
- **`pt-settings` v12** holds `scoreView.pinned` and `scoreView.textSize`; a save of another version starts afresh
  (ADR 0038).

## Consequences

- **`entities/settings`:** `TEXT_SIZES`, `TextSize`, the two fields, version 12; `index.html`'s theme boot reads
  version 12.
- **`widgets/chord-views`:** `foldRepeats` and `ShownLine` (`model/repeated-lines.ts`), `gridWords`;
  `soundingChip` marks a folded line's copies; `ChordsOverLyrics`, `LyricRow` and `ChordChip` take the text size,
  the pinned row and the hover diagram; `GridView` its words; `BeatStrip` takes the clock
  (`model/strip-place.ts`, `model/use-every-frame.ts`); `ChordDiagrams` slides its pair (`pairSlide`,
  `chordNear`); `ChordView` opens no sheet. The swipes: `model/swipe.ts` (`rubberBand`, `pairSwipe`,
  `pairRelease`), `strip-place.ts`'s `glide`, `stripEnds`, `stripDrawn`, `beatAtMark` and `stripRelease`,
  `chordBefore`; `usePairMotion` and `useStripMotion`; the pair is `ChordPair` over `PairDiagram`.
- **`widgets/chord-chart`:** `ChordChart` and `BarButton` take `words` (`BarWords`, `BeatWords`); `gridColumns`
  and `gridRows` replace `rowsOf`; `chartBar` says `short`, and its `signature` only where the meter changes;
  `CellChords` takes its `span`.
- **`widgets/chord-diagrams`:** `ChordSummary` follows the music with `sounding`, drawn smaller, and a tap on it
  goes to the chord (`onChord`) where its sheet would open.
- **`widgets/score-view-menu`:** `LyricsFields`, `GridFields`; `ViewSwitch` greyed with a `reason`; `ViewSection`
  takes whether the music has words.
