# R39-6 · Scales and keys, redesigned

Premium here means a page that reads like the scale books (the run engraved with its fingers, crossings marked), with
the key's facts and chords one tab away, and the run playing at a tempo you can step.

## The rulings as they stand

- "fingerings as the printed books give them, more kinds, Hanon 1–20, a tempo ladder": fingering by hand from the
  books for every major and white-key minor, the honest note where none is standard; twenty scale kinds in five
  families; Hanon 1–20 and the tempo ladder under Practise this scale.
- "The tabs say what is in them": Scale (7 notes) · Chords (I–vii°) · Key (2 flats).
- "Every control says what it belongs to; octaves are a stepper; formulas are computed": Tonic, Scale, On the staff,
  Hands, Octaves (− 1 octave +), Direction; the notes and steps computed from the scale.
- "No finger numbers on or under keys": fingers are on the staff and in the table, never on the keys.
- "Every Practice page has its own Settings page": the gear opens Scale settings (Fingering: As the scale · From the
  thumb; Rhythm; Count-in; All piano settings ›).
- Today's bar of four icons goes; the gear is the only control at the right of the bar.

## Today

`src/pages/scales` → `widgets/scale-explorer` (`ScaleExplorer`, `ScaleChoice`, `RunView`, `ChordsView`, `KeyView`,
`ScaleFingering`, `TempoSlider`, `PlayUpDown`, …); strings `practice.ts` `scales.*`, kinds `music.ts` `scaleKind`.
Four icon buttons in the bar, the tabs, C ▾ Major ▾, a Formula of degree names, Structure, Fingers · Degrees · Steps,
the run on a grand staff with the left hand resting, Hands, a floating Play over the content, fingers under the keys
(`drawings/today-scales-*.png`).

## Will build (canvas row 3)

Phone: Tonic (root grid) · Scale (sheet by family); the scale card (name in serif, notes, steps, the run engraved with
its marks, scrolling sideways at two octaves); the tabs; Scale: On the staff (Fingers · Degrees · Steps), Hands (Right ·
Left), Octaves stepper, Direction (Up · Down · Up and down); Chords: Triads · Sevenths, seven chord cards by numeral,
symbol and notes (a tap sounds it and lights it), Walk the chords ›, an empty state for scales not of seven notes; Key:
the signature engraved with its name and count, Relative, Parallel, Beside it on the circle, the circle with this key
lit; Fingering by hand; Practise this scale (Hands together, Tempo ladder, Hanon 1–20). Play up and down with the tempo
(− 72 BPM +) sits above the keys. Laptop: three columns, the keys across the foot.

## History

- 2026-11-08: drawn (canvas v4); waiting for the owner.

Sources: the ABRSM scale books' fingerings; Hanon, *The Virtuoso Pianist*; Piano Companion's scale page; musicca's
scale and key-signature pages.
