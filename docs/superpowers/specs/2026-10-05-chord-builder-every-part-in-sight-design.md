# The chord builder: every part in sight

- **Date:** 2026-10-05 · **Follows:** ADR 0030 and `2026-10-05-practice-by-subject-design.md`
- **Decided without a review gate:** the owner asks for decisions, not menus (memory: decide and continue).

## What the owner said

After Practice by subject the owner read the app again against the chord trainer's builder (nine screenshots:
root, accidental, quality and size as menus; **Suspension** as chips; **Add Tones** as six chips, several at once;
inversions as chips; the notes, a staff, the keys and the chord's name) and asked: "why don't we have all these
options like added notes and so on", "fix all such type of issues", and look at Apple's layout guidelines.

Read against that reference, the builder has three faults:

1. **An added tone is one of eight, behind a pop-up, on a triad only.** A 6/9 is its own entry because two tones
   cannot be added; a 7th chord adds nothing (`m7(add11)` and `7(add13)` cannot be built).
2. **Alterations sit behind a pop-up too.** DESIGN.md's rule ("several of many are a pop-up, never a grid of chips")
   hides five choices that fit on one line.
3. **A pop-up button under a printed name says the name twice** ("Scale" over "Scale Major", "Start on" over
   "Start on C"), on every explorer.

And one of layout: a phone spends 116px of gaps round the pinned keyboard before the chord's name.

## What success looks like

Every part of a chord is on the page and one tap away, in the order a chord is built: root, triad, size, 7th, added
tones, alterations, inversion, hands. A tone that does not apply is not there. Nothing is named twice.

Assumption (mine): the suspension stays a triad (Major · Minor · Dim · Aug · Sus2 · Sus4), not a second control
beside the quality as the reference has it. A suspended tone takes the 3rd's place, so "minor" and "sus4" together
is no chord: two controls would make dead combinations that one control cannot.

## 1. Added tones are a set, at every size they apply

```ts
export const ADDED_TONES = ['add2', 'add4', 'add6', 'add9', 'add11', 'addS11', 'add13'] as const
interface ChordParts {
  readonly triad: Triad
  readonly size: BuiltSize
  readonly seventh: Seventh
  /** In `ADDED_TONES` order; only those `addedOf` offers. */
  readonly added: readonly AddedTone[]
  readonly alterations: readonly Alteration[]
}
```

**What a chord may add** (`addedOf(parts)`), by what chord dictionaries name:

| Chord | Adds |
| --- | --- |
| Major triad | 2, 4, 6, 9, 11, ♯11 |
| Minor triad | 2, 4, 6, 9, 11 |
| Sus4 triad | 6, 9 |
| A 7th chord over a major triad | 13 (`7(add13)`, `Maj7(add13)`) |
| A 7th chord over a minor triad | 11, 13 (`m7(add11)`) |
| A 7th chord over a diminished triad | 11 (`m7♭5(add11)`) |
| A minor 9th | 13 (`m9(add13)`) |
| Everything else | nothing |

A 7th chord adds only a tone its stack skipped: its 9th added is the 9th chord, an 11th over a 9th is the 11th chord,
and a 13th over a major 9th is the 13th as the builder already writes it (no 11th over a major 3rd). An 11th is never
added over a major 3rd in a 7th chord, as it is left out of the 13th.

**Tones on one key, an octave apart, are one choice:** add2 or add9; add4, add11 or add♯11. The one chosen last
stays, as a ♭5 and a ♯11 already do. An added 13th and a ♭13 are one degree: the one chosen last stays.

**Names.** A 6th is written before anything else (`6`, `m6`, `6sus4`), with the 9th as `6/9`; the other added tones
follow in brackets, a major triad's single one bare: `Cadd9`, `Cm(add9)`, `C(add2,add4)`, `C6(add11)`,
`Cm6/9(add11)`, `C7(add13)`, `Cm7(add11,add13)`, `C7♭9(add13)`. The table's name wins where it has the chord.

**The URL.** `added` holds the tones as their ids joined in order (`add6add9`; '' for none), read by one pattern as
`alter` is. An old `added=six` reads as none: no reader for the old spelling.

**The Chord finder** names from the same parts. A 7th chord with an added tone ranks after the stacked chord it is a
part of: `C E B♭ A` is still C13 with its 5th and 9th left out, "Also: C7(add13)". A 6/9 may still lose its 5th.

## 2. The builder shows every part

The fields, in a chord's order, each under its name: **Root** (the note picker) · **Triad** · **Chord size** ·
**7th** · **Added tones** · **Alterations** · **Inversion** · **Hands**.

- **Toggle chips** (the kit's `ToggleChips`): several on-or-offs of a few, all in sight. A row of 44px chips that
  wraps; off, soft ink on card paper in the control line; on, ink on sand in an ink line (the toggle's pressed
  face). A group named for a screen reader, each chip a pressed button. Added tones read by their number (2 · 4 · 6 ·
  9 · 11 · ♯11 · 13), alterations by their sign (♭5 · ♭9 · ♯9 · ♯11 · ♭13).
- The Choosing Rule changes with it: **several of five or fewer are toggle chips; the pop-up that checks several
  stays for long lists** (a trainer's Custom lists, the chromatic walk's chord types).
- Still only what applies is offered: a triad shows no 7th and no alterations; an 11th chord no added tones.

## 3. A pop-up button names itself once

`Dropdown` and `MultiDropdown` take `bare`: the button shows its value alone, and keeps its name for a screen
reader. Every pop-up under a `Labelled` name is bare (Scale, Start on, Rhythm, the Progression). A pop-up standing
alone in a row (a trainer's Level, the Player's lists) keeps its label inside, as the HIG's pop-up button does.

## 4. Layout (Apple's HIG: Layout, read for this pass)

- **Group by nearness, not by boxes:** 8px between a name and its control, 20px between fields, 32px between a
  page's parts; the pinned keyboard is one part, so the gap above and under it is one part's, not two.
- **What it is** reads as one band: the name, its words and its tones at the left; the staff beside them; the page's
  honey Play and its soft second at the right, all on one centre line from 1024px, stacked in that order on a phone.
- **Content first on a phone:** the tabs sit 16px over the keys.

## Build order

1. The parts: `added` a set, `addedOf`, the clashes, the names, the URL, the finder's rank (test first).
2. `ToggleChips` and the builder's fields; `bare` pop-ups on every explorer.
3. The band and the gaps; one look at laptop and phone widths; DESIGN.md, PRODUCT.md and CLAUDE.md.

## Testing

`chord-parts.test.ts` and `chord-params.test.ts` first, then `chord-finder.test.ts` (the rank), the route's search
test, and the Chords screen test through `renderApp` (chips pressed, the URL written, the chord named).
