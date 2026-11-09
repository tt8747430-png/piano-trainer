# Chords: research for the redesign (2026-11-09)

Two research passes run after the owner's "research properly using fire crawl … a redesign of all the menus and
settings and the piano settings". Local paths are under `piano-data/reference-apps/`. Decisions are in `chords.md`.

## Settled with the owner before this research (grilling, rounds 1–2)

- The page is for one chord at a time; several chords on the staff are secondary.
- The 3D piano with the hands is the main picture, on by default; the flat keyboard is a setting.
- Pressed keys are coloured per chord tone (root, 3rd, 5th, 7th), not per hand. The stage paints a pressed key in its
  hand's colour (`stage.ts`, the `paints.hand[by.side]` lerp), so this needs an option on the stage.
- Fingering is shown by the 3D hands and the staff's numbers; no separate hand diagram.
- Hands are chosen from one button beside Play (Both · Right · Left).
- Settings have two homes: the chord (root, type, voicing, inversion) and the piano (Off · 3D · 2D, range, labels).
- The owner sees the 3D piano in the published canvas; "it is not that good hands".

## Hand models

- The models are the WebXR generic hands (MIT, Amazon): 1,360 vertices, 2,314 triangles, 25 joints, no textures. The
  material already has sheen, nails, an environment and shadows.
- No better hand was found that is both rigged to the WebXR joints and clean to ship. MANO and SMPL-X forbid commercial
  use (mano.is.tue.mpg.de/license.html); Meta's licence could not be read; Mixamo warns against serving raw models.
- CC0 sources: MakeHuman/MPFB ("The exported models end up being licensed CC0"), Blender Studio's Human Base Meshes.
  Both need cutting at the wrist and a rig built to the 25 WebXR joint names in headless Blender (`pip install bpy`
  is available; Blender is not installed), then the pose table re-tuned. Estimate 3–6 days; risk at the knuckles.
- Polishing the current mesh: subdivide offline (keeps weights), taper the fingers and slim the palm by bone scale,
  softer contact shadows. About a day; it smooths, it adds no anatomy.

## How chord tools choose and show a chord

- Root first, then type, in five sources (chord-trainer, new-app, Ultimate Piano, musicca, pianochord.org).
- Controls show their value as words: chord-trainer's row of pop-up buttons `C · Natural · Major · Triads`; Ultimate
  Piano's `ROOT C · TYPE Major`; Chordify's `PIANO ⌄ · TRANSPOSE · SIMPLIFY`.
- Inversion: chips (chord-trainer), separate diagrams named as slash chords "C/E (1st inversion)" with each hand's
  fingering (pianochord.org), a stepper (Scaler). None uses a segmented control.
- Fingering per hand as numbers in text: "Left hand: 5-3-1", "Right hand: 1-3-5" (pianochord.org; Piano Companion).
- Hands and tempo are quick menus beside Play (flowkey 08, 09).
- Voicing is its own menu only in Scaler (Dynamic, Open, Drop 2/3/4).

## Piano settings in other apps

- Ultimate Piano (18): range as "Start octave" and "Octaves" with a "C2 – B5" readout and a miniature 88-key strip
  with the visible window lit. new-app: "Key Size" with the caption "Showing 36 keys (C3 – B5)".
- OnlinePianist: Sounds, Sustain, Visible Keys, Octave Shift, Transpose, letter notes, Metronome, MIDI.
- Yamaha Smart Pianist: a gear for the current function's settings and a global "Utility".

## Platform guidance (Apple HIG)

- Pop-up button: "a flat list of mutually exclusive options or states"; "Give people a way to predict a pop-up
  button's options without opening it."
- Segmented control: "closely related choices that affect an object, state, or view"; about five at most.
- Menus: keep them short; an ellipsis when more input follows.
- Settings: "prefer letting people modify task-specific options without going to your settings area."

## Two whole-page concepts proposed

1. **The name is the control:** the big chord name is three pop-up buttons read as one symbol (`C` `maj7` `/E`):
   root, chord type (common ones, then "More chord types…"), bass/inversion named in words. Facts rows, the staff,
   and a floating bar with Play, Hands, Voicing and the piano gear.
2. **The chord shelf:** a docked panel is the chord's one home: a root strip, a grid of chord-type tiles, and
   inversions and voicings as small keyboard thumbnails; collapsed it shows the name, Play, Hands and the gear.

## Not read

Material 3's menus page, pianochord.io, Scaler 2's manual (Scaler 3's guide was read through an extraction, 116
Firecrawl credits in one call), flowkey's and Chordify's help centres (search snippets only), musicca's Settings
pop-up. No source was blocked by a bot check.
