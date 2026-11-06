# Four more references (2026-11-06)

## Piano Forte (mathisto/piano, pianoforte.mattkelly.io)

MIT. A static Vite and TypeScript app (PixiJS for the falling notes) with an iPad build, documented with the same
`impeccable` PRODUCT and DESIGN files we use. The closest product to ours, and the best-argued design. Captures:
`pianoforte-today-laptop-dark.png`, `pianoforte-read-laptop-dark.png` (the tab clicks after the first did not land;
its DESIGN.md is the fuller source).

- **Places:** Today (a generated plan of 5–45 minutes; a week strip; a quiet streak with freezes; a seven-day Start
  here), Songs, Read (sight-reading stages with mastery), Scales (stages, fingering on the staff), Theory (chord, key,
  interval, cadence and ear trainers, rhythm echo, pulse), Technique, Progress (accuracy over time, mastery, a Path of
  five levels with named pieces to reach).
- **Play:** Perform (count-in, accuracy, notes in a row) and Learn (wait, tempo ladder with Auto tempo, A–B loop,
  hands, hide played); Read through (30 s look, then one pass); Memorise (the score fades bar by bar, five stages);
  ghost of the last run; Compare with last time bar by bar; touch coaching (evenness, legato, voicing, written
  dynamics) in at most two plain lines.
- **Design (Urtext):** dark ink on warm paper in both themes; a near-black ground (Nocturne) or warm stone (Matinée);
  **one brass lamp colour that means only "play this, now"** (the one primary button per view, the cursor, the awaited
  note, the count-in); hands as terracotta and verdigris, differing by fill as well as hue; judgements as mint, pale
  mint, neutral, faded and crimson **with a glyph each** (●, ○, ▲, ▸, ×), checked for colour-blind distance; a serif
  (Newsreader) for what is announced and the names of music, the system font for the rest; one control height
  (40 px, 44 on touch), four radii; "copy is label, value, nothing else"; plan rows, song rows and stage rows one
  grammar; covers are the piece's own first bars engraved, not pictures.
- **Principles:** practice first; notation is sacred (colour and glow for state only); training wheels on by default
  that fade as mastery grows (note names fade as reading improves; judgement words go quiet as playing gets clean);
  timing honesty (calibrate the chain); skill over points (no points, ranks, lives; mastery that can fall; nothing
  locked); every library score credited.

## PianoPlayer (marcomusy/pianoplayer)

MIT, Python. **Automatic piano fingering** for MusicXML and MIDI: searches for a low-effort finger sequence for each
hand (`hand.py`, about 580 lines: a cost over finger stretch and position changes, looked ahead a few notes). Portable
to TypeScript in `shared/lib`. For us: **Suggest fingering** in the score editor (written as fingering marks the
learner can change) and fingering for scales and exercises that lack it. Not shown under the keys (the owner's ruling
stands).

## RoboPianist (google-research/robopianist)

Apache-2.0, Python and MuJoCo. A research benchmark where simulated robot hands learn to play pieces by reinforcement
learning. Nothing to port into a learning app; its MIDI set (with the PIG fingering dataset) is a research corpus, not
content for us.

## Piano Keyboard (felipefialho/piano)

MIT. Two octaves from C4, touch, mouse and computer keys, a PWA. Captures: `ffpiano-*.png`.
- Keys drawn by plain CSS: ivory with a slight top-to-bottom gradient and a bottom lip (`inset 0 -6px 0`), pressed
  keys sink 2 px with an inner shadow; ebony keys with a lighter front edge; **a red felt strip** above the keys.
- Each key carries its **computer key in a small keycap** and its note name under it; C4 and C5 in the accent colour;
  keycaps hidden on touch screens (`hover: none`).
- On an upright phone, **one octave only, full height**, with "Turn your phone sideways to play both octaves."

## freeappstore-online/piano (MIT), read 2026-11-06

A FreeAppStore template app: two octaves of oscillator keys (a triangle wave through a low-pass filter), an Octave
−/+ pair, a Sustain toggle, and computer keys (A–\ white, W–= black). Each key is a `<button>` with a CSS gradient and
an inset shadow while down. It has no glide (pointer up and leave only), no samples and no notation. **Nothing to port:** our keyboard
(`shared/ui/piano-keyboard`) already has key depth, glissando, sampled sound, pedals and letters.
