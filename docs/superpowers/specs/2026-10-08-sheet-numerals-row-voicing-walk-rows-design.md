# The sheets' numerals, a row's hands, and the walks as rows

- **Date:** 2026-10-08 · **Follows:** ADR 0031 and the review of the jazz cadence against the course's two sheets
  («Оборот 2-5-1», «Мышление ступенями»)
- **Decided without a review gate:** the owner asks for decisions, not menus (memory: decide and continue).

## What the owner said

After the review's fixes (a pop-up that reported a choice nobody made; the cadence's minor version) the owner read
what was left alone and said: "continue with the left features". Four were left, each a place where the Progressions
page cannot do what the sheets teach:

1. **A 6th chord cannot be written.** The sheet: "a 6th chord can stand for any major 7th" (C6), and "the tonic is
   often a 6th chord" in minor (Cm6). `Dm7 G7 C6` typed is "This progression can't be read".
2. **The sheets' own degrees are not read.** They write a Roman numeral and the chord's structure: `IIm7 – V7 –
   Imaj7`, `Im7 IVm9 Vsus4`. Neither those nor their chords (`Dm7 Gm9 Asus4 Dm7`, `Dm9 G9 CMaj9`) are read: a
   numeral holds a triad and one of five 7ths, nothing else.
3. **A row plays a 9th chord's five notes in one hand.** The sheet's 9ths are four notes over the bass: Dm9 is
   F A C E, G9 is F A B D, CMaj9 is E G B D. And in B♭ and B the tonic lands with its root on top (D F A B♭), where
   the sheet's rule is "common tones stay, the rest move down".
4. **The sheet's exercise walks are one tap too far.** The page offers the key and one walk (round the circle of
   fifths); the others are in the Player's Setup.

## What success looks like

Whatever the sheets write in the field is read, shown as chords and played: a degree with its structure, or the
chords themselves. A row sounds as the sheets voice it. Every walk the Player has is a row on the page.

Assumptions (mine):

- A bare upper-case numeral stays a major chord, as the library writes its gospel climb (`VII III VI`): `II V I`
  typed is D G C. The sheets' bare degrees (the key's own chords) are written `ii V I`.
- The page writes numerals one way (lower case for a chord with a minor 3rd): `IIm7` typed is read, and written
  back as `ii7` under its chord.
- The Player's own voicings stay the patterns' (its Setup has the inversions); the library's lines stay as they
  are; so does the minor ii–V–i's ♭9 (the owner's to change).

## Decisions

### 1. A numeral carries its chord

`Numeral` is a degree, a shift and a **chord quality of the table** (`{ degree, shift, quality }`), in place of a
triad and a 7th. A plain triad (major, minor, diminished, augmented) grows with the chord size as before; any other
chord is played as written.

- **Read:** a Roman numeral, then what a chord symbol writes after its root.
  - Upper case takes any spelling the table reads: `V7`, `IMaj7`, `I6`, `Vsus4`, `V9`, `V7♭9`, `III+`, and the
    sheets' `IIm7`, `IVm9`, `IIm7♭5`, `Im6`.
  - Lower case is a chord with a minor 3rd, its suffix without the `m`; a diminished one by its mark: `ii`, `ii7`,
    `i6`, `i6/9`, `ii9`, `ii11`, `iMaj7`, `iMaj9`, `vii°`, `vii°7`, `iiø7` (or `iiø`), `iiø9`.
- **Written:** one way. The twelve chords of the table with a minor 3rd are lower case with the tail above; every
  other is upper case with the table's suffix. An augmented dominant is now `III7#5` (`III+7` is still read).
- **A chord typed** is its numeral whatever its quality (`numeralOf`): `Dm7 G7 C6` is `ii7 V7 I6`;
  `Dm7 Gm9 Asus4 Dm7` in D minor is `i7 iv9 Vsus4 i7`.
- The URL keeps its form (`ii7-V7-I6`); every URL read before is read the same.

Alternative left out: a second, upper-case writing for the page (as the sheets print it). Two writings of one line
would name one progression twice; the library, the lessons and saved views hold the first.

### 2. A row's hands

`voiceLead` (the row of the Progressions page, a lesson's progression, a passing chords way):

- **A chord of five notes or more leaves its root to the bass:** the hand plays the rest (a 9th chord's 3rd, 5th,
  7th and 9th), the first chord from middle C, each next in the inversion nearest the one before.
- **The bass sits under the hand:** the root between C3 and B3, an octave lower where the hand reaches down to it.
  The hand is no longer kept off an inversion because the bass sat on its lowest key, so B♭Maj7 after F7 is
  B♭ D F A.

### 3. The walks as rows

Under **Practise in the Player** the page lists "In C major"; under **Through the keys** one row for each walk of
`KEY_WALKS`, named as the Setup names it (Up by semitones … Round the circle of fifths). Since the page now names
the walk, `walk` leaves the progression Player's kept params (ADR 0022): "In C major" opens the key alone, and a
lesson's link that names no walk plays none.

## Where it lives

- `shared/lib/music/numerals.ts` (the model, reading, writing, `numeralChord`, `numeralOf`) and
  `chord-symbol.ts` (`readQualitySuffix`, the table's suffix lookup, shared with the numerals).
- `shared/lib/music/voice-lead.ts`.
- `widgets/progressions/ui/ProgressionPractice.tsx`; `app/routes/player-search.ts` (`PROGRESSION_KEPT`).
- No new strings: the walks' names are `player:keyWalk.*`, the group's is `learn:progressions.throughKeys`.

## Tests

- Kernel: every table chord on a degree is written and read back; the sheets' lines read; a 6th; the growth and the
  written chords as before; `numeralOf` over any quality; the sheet's 9th shapes and the B♭ cadence in `voiceLead`.
- `widgets/progressions/model/typed-progression.test.ts`: the sheets' degrees and chords.
- `ProgressionsPage.test.tsx`: `Dm7 G7 C6` typed; a row for each walk; "In C major" names no walk.
- `app/remembered-views.test.tsx`: the tool's link is played the learner's way, in the key alone.

## Docs

ADR 0032 (amends 0020 and 0022), CONTENT.md and UBIQUITOUS_LANGUAGE.md (numerals), CODE_STYLE §8 (a row's hands),
CLAUDE.md.
