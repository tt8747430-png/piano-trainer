# One progression per idea: both modes, no twins, lead-ins derived, the sheet's walk in sight

- **Date:** 2026-10-13 · **Follows:** ADR 0031, ADR 0040 and the owner's reading of the library against the 2-5-1
  sheet («Оборот 2-5-1», Упражнение 1, Шаг 2)
- **Decided without a review gate:** the owner asks for decisions, not menus (memory: decide and continue).

## What the owner said

"Why didn't you add this progression" (Шаг 2: Dm7 G7 CMaj7 Cm7 F7 B♭Maj7 …, each I turned into the next key's
ii), "why are there so many duplicated progressions", "why don't they derive from something", "why a separate
progression for major or minor when we can select C minor or C major", "check the progressions are correct and not
so many things we can configure in the Player".

## The audit

**The sheet's Шаг 2 was there, out of sight.** It is the jazz cadence walked down by whole tones (ADR 0023), but the
page named that row "Down by whole tones" and put "Down the circle of fifths: C F B♭" beside it, which is another
walk (Dm7 G7 CMaj7 Gm7 C7 FMaj7). The lesson linked it as "down by whole tones" too, beside a third link round the
circle that the sheet does not have.

**Twins: the same loop of chords, in the same key or heard from the relative minor.**

| Kept                         | Gone                                         | Why                                                                |
| ---------------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| Axis I–V–vi–IV               | Sensitive vi–IV–I–V, Minor pop i–VI–III–VII  | The Axis from its vi; in A minor all three are Am F C G            |
| 50s doo-wop I–vi–IV–V        | Emotional R&B vi–IV–V–I                      | Doo-wop from its vi                                                |
| Rock shuffle I–V–IV          | Gospel resolution V–IV–I                     | The same loop from V                                               |
| Complete cadence I–IV–V–I    | Basic rock I–IV–V                            | The same loop, I held across its end                               |
| Jazz cadence ii–V–I          | Classical standard I–ii–V–I                  | The same loop from I; triads are the Chord size                    |
| Authentic cadence I–V–I      | Dominant resolution V–I (at 9ths)            | The same loop; its 9th is the Chord size                           |
| 12-bar blues                 | Basic blues I7–IV7–V7                        | The 12-bar's three chords                                          |
| Round the circle             | Autumn Leaves ii–V–I–IV                      | Half the tune's A section; the whole is the minor key's circle     |

**One idea twice, once per mode** (ADR 0031's pairs): the jazz cadence and the minor ii–V–i, the ♭9 resolution and
its minor one, the complete and the minor cadence, the ii–V–I through the key and its minor version. The key's
Major · Minor already chooses the mode, so the pop-up listed each idea twice and a "Minor" style besides.

**Written out where a rule writes them:** secondary dominants (each chord of the key after its V), the ii–V–I to
every chord of the key, and round its circle (each chord after its ii–V). The rule is one choice for any progression.

**Corrected:** the gospel 7–3–6 (vii°–III–vi) was the minor ii–V–i into vi, a twin; gospel plays it on home,
7–3–6–2–5–1. Everything else was checked against the songs and the theory and is right: Let It Be, Yesterday (the
Chord Matrix's line), Clocks, Pachelbel's Canon, Wild Thing, Royal Road, Rhythm changes, Full turnaround, Fly Me to
the Moon, the ii–V chain, the 12-bar, the Andalusian, plagal and deceptive cadences, the gospel walk-up and Stack
Your Chords.

## Decisions

1. **A library progression is one idea with a line in each mode it has** (`major`, `minor`; one at least). The key's
   Major · Minor shows the line of that mode; choosing a progression keeps the key's mode where it has that line.
   `MODE_VERSIONS`, `otherModeVersion` and the Minor style go; the Andalusian cadence joins Classical. A pop loop's
   minor line is the same loop heard from its relative minor (the Axis's i–VI–III–VII, as musicians say); a cadence's
   is its minor-key version (ii°–V–i, i–iv–V–i, i–V–i, i–iv–V–VI, i–iv–i, i–VI–ii°–V). A key's common progressions
   are one list, each in the key's mode.
2. **The twins go** as the table says, and a test holds every two lines of the library apart as loops, in the same
   key or the relative one.
3. **A lead-in is a way to play any progression** (`withLeadIns`, the Progressions page's field "Lead into each
   chord": No · By its V · By its ii–V, URL `lead`): each chord after its own V, or its ii–V (ii° before a chord with
   a minor 3rd), written applied (`V/vi`, `ii°/vi`) but for the key's own tonic. A chord held, or already applied,
   takes none; a lead-in never repeats the chord before it. The three written-out entries go; the lesson's lines are
   written by the same rule.
4. **A walk's row says what it plays:** the chords of its first two keys, so the sheet's Шаг 2 reads on the page as
   on the sheet. The lesson names its steps as the sheet does: Шаг 2 is "down the circle of fifths, each I the next
   key's ii", and Exercise 2's two steps walk too.

Saved state: none changes shape. A remembered view holds numerals, which read as before.
