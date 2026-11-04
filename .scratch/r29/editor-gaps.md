# The score editor against Flat's and Dorico's palettes (A34 item 6)

One row per option in Flat's notation palettes and Dorico's Write-mode panels, by group. "have" is in the
editor today, "differs" is there in another form (the note says how), "missing" is not built. Checked
against the code on 2026-11-04 (`pages/score-editor/ui/EditorPalette.tsx` and its keys).

## Notation (Flat: Modes, Duration; Dorico: Notes panel)

| Option | State | Note |
| --- | --- | --- |
| Note input on / off (Editing mode) | have | Editing mode menu: Replace, and the modes of ADR 0114 |
| Durations 1/1 … 1/64 | have | 1/1 to 1/32 in the toolbar; 1/64 in Flat only |
| 1/64 | missing | the kernel's values stop at 1/32 |
| Dot, double dot | have | |
| Rest | have | |
| Tie | have | |
| Insert (shift later notes) | missing | A40 item 2 builds `entry: 'replace' | 'insert'` |
| Tuplets 2–9 | have | ⇧2–⇧8, nine by its key |
| Custom tuplet n:m | missing | `TupletCount` is 2–9 over the meter's own base; n:m needs the kernel's `Tuplet.numbase` free. Left (kernel change in `shared/lib/notation/values.ts`) |
| Grace note: appoggiatura, acciaccatura | have | 9, ⇧9 |
| Voices 1–4 | missing | the editor writes one voice a staff (ADR 0096) |
| Cross-staff (move to staff above / below) | missing | needs a note's staff apart from its hand in the draft and MEI `@staff`; left |

## Pitch (Flat: Pitch and representation)

| Option | State | Note |
| --- | --- | --- |
| Sharp, flat, natural | have | |
| Double sharp, double flat | have | in the accidentals menu |
| Respell (enharmonic) | differs | ⇧J, not J: a bare letter plays the piano (CLAUDE.md, Keys) |
| Up / down a step, a half step, an octave | have | |
| Octave lines 8va, 8vb, 15ma, 15mb | have | |
| Courtesy accidental, bracketed | missing | |
| Note head shapes (x, slash, diamond) | missing | A40 item 4 adds shapes as a score setting, not per note |

## Articulations

| Option | State | Note |
| --- | --- | --- |
| Staccato, staccatissimo, accent, marcato, tenuto, fermata | have | |
| Slur | have | |
| Fingering | have | typed over the note |
| Up-bow / down-bow, harmonics | missing | string marks; the app is the piano's |

## Ornaments

| Option | State | Note |
| --- | --- | --- |
| Trill, mordent, lower mordent, turn, inverted turn | have | |
| Tremolo 1–3 strokes | have | |
| Two-note tremolo 1–3 | have | |
| Arpeggio plain | have | |
| Arpeggio up, down | have | built in A34 (`NoteMarks.arpeggio: 'up' | 'down'`) |
| Glissando | have | |
| Trill line (tr~~~) | missing | |

## Dynamics

| Option | State | Note |
| --- | --- | --- |
| ppp … fff, sfz, fp, sf | have | |
| Crescendo, diminuendo hairpins | have | |
| Pedal down, up, change | have | |
| Cresc. / dim. as words | have | Text › Tempo changes and expressions |

## Text

| Option | State | Note |
| --- | --- | --- |
| Lyrics | have | |
| Chord symbols | have | |
| Roman numerals | have | |
| Free text | have | |
| Tempo change | have | A34: a popover at the caret, Save and Delete |
| Expression words (dolce, rit., m.d.) | have | |
| Rehearsal marks | differs | a section's name prints at its first bar |

## Clefs

| Option | State | Note |
| --- | --- | --- |
| Treble, bass, alto, tenor, soprano, mezzo, baritone, sub-bass | have | 17 clefs |
| Octave clefs 8va/8vb/15ma/15mb | have | drawn as Bravura's own glyphs (A34) |
| Percussion clef | missing | no percussion staff |
| This bar only · To the end · Whole staff | have | A34 |

## Barlines and repeats

| Option | State | Note |
| --- | --- | --- |
| Single, double, final | have | |
| Start / end repeat, repeat ×N | have | |
| Endings 1–4 | have | |
| Segno, coda, To Coda, Fine, D.C., D.S. (and al Fine / al Coda) | have | |
| Dashed, tick barlines | missing | |

## Measures and layout (Flat: Measures and brackets; Dorico: Layout)

| Option | State | Note |
| --- | --- | --- |
| Add, remove, split, join bars; bar length | have | Bar |
| Swing | have | |
| Line break, page break | missing | |
| Brackets and braces | differs | the piano's brace is drawn; no choir bracket |
| Multi-bar rests | missing | |

## Key and time signatures

| Option | State | Note |
| --- | --- | --- |
| Key signature grid, Major · Minor | have | A34, the fifteen signatures |
| Time signature tiles, Other, Pickup, Apply to | have | A34 |
| Time signatures beyond 12 beats, units 1, 16, 32 | missing | the kernel's `Meter` is 1–12 over 2, 4, 8 |

## Built in A34 from this list

- Arpeggio up and down (Ornaments).

## Missing and left, with why

- Custom tuplets n:m and cross-staff notes: both change the kernel's note model (`shared/lib/notation`,
  `entities/piece` notation strings) and the MEI writer; each is its own task.
- Meters beyond 12 / units 1, 16, 32: the kernel's `Meter` type and tick grid.
- Voices, line and page breaks, multi-bar rests, courtesy accidentals, trill lines, percussion: not in
  today's brief; listed so the next round can pick them.
