# Engraving and layout against LilyPond, MuseScore 4 and abcjs

2026-10-23. The question: how does the sheet we draw (a Performance → `notate` → Score → `scoreToMei` → Verovio 6.3
in a worker, lines and pages broken by us, chord names and labels as HTML over the SVG) compare with LilyPond, the
reference for engraving, and with MuseScore 4 and abcjs?

## Sources

- LilyPond source, read on GitHub: `scm/time-signature-settings.scm` (beaming by meter, fetched 2026-10-23),
  `lily/spacing-spanner.cc`, `lily/spacing-basic.cc` (duration spacing, see ADR 0077), `scm/define-grobs.scm`
  (grob defaults), and the Notation Reference: _Horizontal spacing_ (§4.5), _Line breaking_ and _Page breaking_
  (§4.3), _Flexible vertical spacing_ (§4.4), _Automatic beams_ (§1.2.4), _Automatic accidentals_ (§1.1.3).
- MuseScore 4 Handbook (_Layout and formatting_, _Beam properties_, _Format → Style_), from knowledge: the network
  check reached GitHub only.
- abcjs documentation (_Line wrapping_: `wrap.minSpacing`, `maxSpacing`, `preferredMeasuresPerLine`), from knowledge.
- Elaine Gould, _Behind Bars_ (beaming, rests, cautionary accidentals), from knowledge.

## How each lays music out

|                            | LilyPond (2.24)                                                                                                                                   | MuseScore 4                                                                       | abcjs                                                                        | Ours                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Note spacing               | By duration: `spacing-increment` 1.2 spaces each doubling over the common shortest (`shortest-duration-space` 2.0), optical corrections for stems | Ratio ~1.5 per doubling (Style → Measure → Spacing), min note distance 0.5 sp     | Proportional, then stretched to the line                                     | Verovio's (`spacingLinear` 0.25, `spacingNonLinear` 0.6): close to LilyPond's curve                                       |
| Line breaking              | Optimal (Knuth-style) breaker over every break point, penalising stretch and compression                                                          | Greedy: fills a system, then justifies                                            | `wrap`: tries counts round `preferredMeasuresPerLine` within min/max spacing | Within a chart line: as few lines as fit, then the most even (`breakLine`, ADR 0074); a chart line always starts a system |
| Last line                  | Justified (`ragged-last` off)                                                                                                                     | Justified unless short (`lastSystemFillLimit` 0.3)                                | Stretched up to `maxSpacing`                                                 | Justified (ADR 0074)                                                                                                      |
| Pages                      | `page-breaking` optimal, systems spread over the page (`ragged-bottom` off)                                                                       | Systems top down, stretched to fill (`Vertical justification`)                    | No pages                                                                     | **Systems dealt top down, spread to the page's foot but the last, a gap +10 spaces at most (fixed)**                      |
| Beaming                    | By meter: 4/4 eighths in 4+4, 3/4 eighths over the bar, 2/4 and x/8 by the beat, shorter by the beat, triplets by the beat                        | 4/4 and 3/4 as LilyPond; per-meter beam groups in the time signature's properties | By the beat (`beamPattern` aside)                                            | **Was by the beat; now as LilyPond (fixed)**                                                                              |
| Accidentals                | `default`: per staff, per octave, to the bar's end; `piano`, `modern` styles add cautionaries                                                     | Per staff and octave; courtesy only by hand                                       | Per staff and octave                                                         | Per staff, letter and octave to the bar's end (`printedAccidentals`): LilyPond's `default`                                |
| Two voices                 | Voice 1 stems up, 2 down; rests moved apart                                                                                                       | Same                                                                              | Same                                                                         | Same: the higher voice's stems up (`separateVoices`); Verovio places the rests                                            |
| Bar numbers                | At each system's start, not the first                                                                                                             | Each system's start                                                               | Optional                                                                     | **Each line's first, in the Player and the editor (fixed)**; every bar still a button                                     |
| Clef, key, time at a break | Each system's clef and key; a change at a break also printed as a cautionary at the line's end                                                    | Same                                                                              | Same                                                                         | Each line its clef and key; time only where it changes; **a change at a break printed at the line's end (fixed)**         |
| Chord names                | `ChordNames` over the staff, ♯ ♭ glyphs, kept off notes by skylines                                                                               | Chord symbols over the staff, autoplaced off notes                                | Over the staff                                                               | HTML over the staff by onset, shrunk where crowded; **ASCII # and b (fixed)**                                             |

## What we looked at

Rendered with Playwright (Chromium) at 393×852 and 1280×800, Scroll and Pages, in the Player (`/play/<id>`) and
the editor (`/edit/<id>`): Lightly Row, Amazing Grace (3/4), Мир, душа, храни `bz5` (4/4 eighths in both hands),
`bz2` (6/8, four sharps), The House of the Rising Sun (3/4, a pickup, the tune's staff). Screenshots were taken
before (`a-*`) and after (`b-*`) the fixes; they are not kept in the repository.

## Defects found

1. **Beaming against the meter (ours, fixed).** `bz5` bar 1 (`a-play-bz5-scroll-1280`): the right hand's four
   eighths on beats 3–4 drawn as two pairs, the left hand's three eighths as a pair and a flagged eighth. LilyPond
   beams both as one group (4/4: `(1/8 . (4 4))`). Amazing Grace's 3/4 eighths likewise; a run of triplets over two
   beats was one tuplet of six, unbeamed.
2. **The line's closing barline half clipped (ours, fixed).** Verovio centres it on the staff's last x, which was the
   SVG's edge (`a-play-amazing-scroll-1280`, the right edge): half its stroke was cut off.
3. **Chord names in ASCII (ours, fixed).** `C#m`, `F#m/D#` over `bz2` (`a-play-bz2-scroll-393`); engraved chord names
   print ♯ and ♭.
4. **A 6/8 tempo marked by the quarter (ours, fixed).** `bz2` reads ♩ = 58 where its tempo counts dotted quarters
   (♩. = 58, as LilyPond's `\tempo 4. = 58`), in the labels and in the MEI's tempo text.
5. **No cautionary key or time at a line's end (ours, fixed).** Each line is engraved alone, so a change starting
   a line had no courtesy signature at the end of the one before. Each line is now told what the next starts in
   (ADR 0087). Seen with Lightly Row's part B set to G for the check (not kept): the line before ends with ♯ on each
   staff, in the Player and the editor. The editor drew no section key change at all; it does now.
6. **Loose lines on a laptop (by design, remains).** A chart line is a system, so Amazing Grace at 1280 px holds four
   bars of three quarter chords across 1800 px (`a-play-amazing-scroll-1280`), where LilyPond's optimal breaker
   would put eight or more. The owner's rule (ADR 0074, the printed hymnals) keeps one chart line to a system;
   Pages (print size, ADR 0075) reads as a hymnal does.
7. **Every bar numbered in the Player (fixed).** LilyPond numbers each system's start; the Player now does, as the
   editor did (ADR 0087). Bars are still buttons, each saying its number to a screen reader.
8. **Pages not spread vertically (fixed).** LilyPond and MuseScore spread systems to fill a page (`ragged-bottom`
   off). Every page but the last now is, each gap growing by ten staff spaces at most (ADR 0087): `bz5`'s first
   page ends at its bottom margin, its second is ragged.
9. **Accidentals: none wrong.** Per staff and octave to the bar's end, a tie's continuation printing none, as
   LilyPond's `default` style. Its `modern` style's courtesy accidental in the next bar is **left out**: the
   editor notates each line alone, so the first bar of a line could not know the bar before it, and the editor and
   the Player would print different courtesies. Doing it means notating the editor's piece whole and cutting the
   score into lines, as the Player does.
10. **The dotted quarter in the tempo is small.** Noto Music's combining augmentation dot (U+1D16D) sits low and
    small at label size; readable, not a print's.

Spacing within a bar, stems and rests in two voices, ties, slurs, hairpins and the staff's size on a phone (0.72 at
least, ADR 0074) read as a notation program's: Verovio does those as LilyPond does, and we pass it nothing that
overrides them.

## What we changed

- `shared/lib/notation/beams.ts`: `beamPlan` and `barStartOf`, LilyPond's beam groups by meter, triplets by the beat;
  `scoreToMei` writes its beams and tuplets (ADR 0084).
- `shared/lib/music`: `printedSymbol` (♯ ♭ in a chord name over a staff), `tempoNote` (♩ or ♩.); used by the Player's
  `SheetLabels`, the editor's `LineLabels` and the MEI's tempo.
- `shared/ui/score/score.css`: the score's SVG no longer clips its edges, so a line's closing barline is whole.
- `shared/lib/notation/mei.ts`: `MeiOptions.next` (`NextLine`), a courtesy key, time or clef after a line's last
  barline, written as a page break, the next `scoreDef` and an empty measure Verovio needs to draw it; the Player's
  `scoreLines` and the editor's `createLineSheets` hand each line the next line's start (ADR 0087).
- `widgets/sheet-music/ui/SheetLabels.tsx`: the line's first bar alone numbered.
- `shared/ui/SheetPage.tsx` with `PAGE_STRETCH` (`shared/lib/sheet-views.ts`): pages but the last filled to their
  height, the Player's and the editor's.

## What remains

- Loose lines on a laptop (6, by design), the small dotted quarter in the tempo (10), and the `modern` courtesy
  accidental (9).
