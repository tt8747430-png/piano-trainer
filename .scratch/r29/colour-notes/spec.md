# Spec: the chord's colour notes (A33)

> **2026-11-03:** where this spec and [`../plan.md`](../plan.md) differ, the plan is newer and wins (prompt D20). Map of round 29's files: [`../README.md`](../README.md).

## Problem
Added tones (add2…add13 chips), alterations (♭5 ♭9 ♯9 ♯11 ♭13 chips, `alterationsOf` in `chord-parts.ts`) and
Available tensions (`ChordTensions` over `tensions.ts`, groups by quality only, chips that only play) are three
controls for one idea. Tension groups ignore the chord's degree in a key.

## Decision
1. **Model** (`shared/lib/music/colour-notes.ts`, replacing `tensions.ts`; `chord-parts.ts` keeps building
   a chord from parts):
   ```ts
   type ColourGroup = 'chord' | 'tension' | 'avoid'
   interface ColourNote { interval: Interval; label: string /* '9', '♯11', 'add9' */; group: ColourGroup;
                          spelled: SpelledNote; alters?: Interval /* ♭5 replaces 5 */ }
   colourNotes(chord: ChordParts, inKey?: { key: Key; degree: Degree }): ColourNote[]
   withColour(chord: ChordParts, add: Interval): ChordParts   // adds or alters, keeps a valid chord
   ```
   Without a key: today's quality rules (avoid = a minor 9th above a chord tone, as now). With a key: the
   tensions are the scale's notes above the chord at that degree (Dm7 as ii of C: 9, 11, 13; Em7 as iii: 11,
   ♭9 and ♭13 avoid; Dm7 as vi of F: 9, 11, ♭13 avoid), alterations offered on dominants regardless.
   The chord symbol is written from the resulting parts by the existing `chordSymbol` (C9, C7♯11, Cadd9,
   C7♭9♯11) — no new spelling code.
2. **One panel** on Chords (`widgets/chord-explorer/ui/ColourNotes.tsx`): groups Chord tones · Tensions ·
   Avoid, each chip a toggle that adds the note to the chord (keys, symbol, sound) and plays the chord with
   it on top; the added ones selected (R15's style). The Added tones and Alterations controls are removed.
   With `key=` and `degree=` in the URL (from Scales' Harmony or Progressions' links), the groups follow the
   degree, and a one-line context "as ii in C major" sits in the panel's heading.
3. **URL**: `colour=9,#11` (replacing `add=` and `alt=`); the route's search validator reads the old names
   nowhere.
4. **Links, one owner each** (A33's table): Harmony's chords and Progressions' chords link into Chords with
   key and degree; Progressions' Voicing uses the Chords page's voicing list and pictures; the Quiz's
   Cadences drill opens the cadence in Progressions.

## Tests
- Chosen colour note is in the chord's keys, its symbol and its scheduled sound.
- Dm7: tensions differ as ii of C and vi of F; Em7 as iii of C avoids ♭9.
- Every voicing name in Progressions is one of Chords'.
- The URL round-trips `colour=`.

## ADR
0046 (the kernel: chords' colour notes) and 0052 (Chords' page).
