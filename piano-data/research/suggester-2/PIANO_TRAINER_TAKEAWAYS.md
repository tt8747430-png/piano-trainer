# Takeaways for a TypeScript web piano trainer

Concrete things Suggester 2 does that a web trainer for chords, scales, progressions, a score editor and practice could adopt. Each item names the source detail and how to do it in TypeScript. Data you can load directly is in `data/`.

## A. Data model and theory core

1. **Two-level intervals.** Keep `Interval` (46 spelled intervals: name, semitones, generic number 1–13, display symbol) separate from semitone math. Spelling (♭5 vs ♯4) then survives transposition. Load `data/intervals.json` as a `const` table and type it with `as const`.
2. **Formula-based chord types.** Model every chord as `{ intervals: Interval[]; omittable?: Interval[] }` with the root implicit — exactly `data/chords.json` (64 types). Matching with "tolerate omitted intervals" lets a detector accept C13 without 5th/9th/11th.
3. **Spelled notes with a convenience rank.** Use 49 spelled notes (`Cbbb`…`Bsss`) plus a Good/Acceptable/Bad/VeryBad rating; pick the enharmonic spelling of a scale by computing both flat-hinted and sharp-hinted versions and keeping the one with the fewer/milder accidentals (Suggester's `mostConvenientScaleFor`). Offer a "Hide complicated enharmonic scales" toggle, default on.
4. **Scale catalogue.** Ship the 31 scales of `data/scales.json` (modes, harmonic/melodic minor family, blues variants, pentatonics, exotic scales). Each has an English and French title, so i18n comes for free.
5. **Scale degrees with three renderings.** Degree objects carry caret (`1̂`), upper-case and lower-case Roman numerals, including ♭/♯ degrees up to 12 (`data/scale_degrees.json`). Use them for ear-training answers and for labelling piano keys ("Show scale degree when picking note").
6. **Notation system switch.** English letters vs fixed-do (Do Ré Mi…) as one formatter setting.

## B. Suggestion features to reuse in lessons

7. **Chord palette by category.** For a chosen key, generate every chord type on every scale note that fits the scale, then group by class: Triad, Suspended triad, Seventh, Suspended seventh, Added note, Extended, Dyad, Monad. Add the chromatic groups: secondary dominants (root + P5, dominant 7th), tertiary dominants (root + P5 + P5), secondary supertonics (root + M2, m7), secondary leading tones (root + M7, °7), tritone substitutes (only for dominant 7ths), Neapolitan (♭II), augmented sixths on ♭VI. This is a ready-made syllabus: "functional harmony level 1…5".
8. **Function labels.** Store a `role` on each chord (SecondaryDominant, TertiaryDominant, …) and render Roman numerals with `V/x`, `V/V/x`, `ii/x`, `vii°/x`, `subV`, `N`, `It+6`, `Fr+6`, `Gr+6` — handy for quiz feedback ("this is V/V").
9. **Classic progressions library.** Import `data/classic_progressions.json` (28 progressions in 7 groups) and realise steps against the current key with four step kinds: diatonic triad, diatonic seventh, explicit degree + quality, degree of the parallel major (for modal mixture like the Andalusian cadence), semitone offset. Use it for "play along in all 12 keys" drills.
10. **Closest-voicing helper.** For each next chord, enumerate inversions/octave shifts (and open voicings) and choose the candidate with the smallest total semitone movement from the previous chord (Suggester keeps candidates under 20 semitones). Show this as a "smooth voice leading" hint on the keyboard.
11. **Borrowing and modulation helpers.** Offer related keys (parallel, relative, dominant, subdominant, parallel modes) as a picker; when the user changes key mid-piece, insert a key-change marker instead of rewriting the piece. Ask "apply to whole piece?" like Suggester does.
12. **Text input for chords.** Accept "A, Bm, G7, Cmaj7, F#m7b5, Bbdim7" and Roman numerals (I, ii, iii7) when a key is set. Support the aliases Suggester accepts (`min`, `m7b5`, `hdim`, `Maj`, `mM`, `aug`, `dim`, `N`, `sub`, `/` for slash bass). Return per-token errors ("Could not recognize …").

## C. Detection and practice

13. **Chord detector from held keys** (Web MIDI or on-screen piano): run the formula matcher over all roots, prefer matches that use the lowest note as root, then list inversions/slash chords. Show "This chord could not be identified." when empty.
14. **Melody → scale detector:** from the set of pitch classes played, list every scale containing them, sorted by smallest scale first (or by match ratio). Good for improvisation exercises.
15. **Song → key detector:** score each scale by the share of song chords it contains (`matchingRatio`); show "Best matches" and "All results".
16. **MIDI triggers.** Map a MIDI key to a chord (Suggester's trigger set) so a learner can play progressions with one finger; warn on conflicting mappings.
17. **MIDI feedback guard.** Detect bursts of incoming notes that mirror outgoing ones and cut MIDI input with a clear message (Suggester's "MIDI Feedback was detected").

## D. Score/progression editor

18. **Song items list.** A flat ordered list of items: chord event (chord, duration or fine duration, arpeggiation override), key marker, section marker (title, play count, collapsed, colour from an 11-colour palette), text marker, rest. It is simple to render, reorder and serialise to JSON (see DOCUMENT_FORMAT.md).
19. **Global chord modifiers.** A small panel (octave shift, inversion shift, rootless, arpeggiation override) applied to every suggested chord before it is previewed or inserted.
20. **Context menu set.** Copy the verbs: Play from Here, Transpose…, Semitone/Octave shift up/down, Invert upward/downward, Set rootless, Change duration, Cut/Copy/Paste above/below, Duplicate, Insert section/text/rest, Delete.
21. **Undo with titled operations.** Name every undoable action ("Undo Move Items") as Suggester's UndoStack does.
22. **Exports.** Text (header "Time Signature:", "Tempo: … BPM", section/rest/text markers), MIDI file with a separate bass track and optional sustain-pedal style (better for notation software), embed chord names as meta events, and audio via an offline render (OfflineAudioContext). Drag a chord out as a `.mid` file.

## E. Playback

23. **Pedal vs hold arpeggiation.** Two playback styles: sustain pedal (CC64) vs holding keys; arpeggio modes Off/Up/Down/Skip-up/Skip-down with a step length; mono/poly voices; "double the root of triads" and "play bass" switches (both on by default).
24. **Humanisation.** Small random timing offset and velocity variation around a base velocity (Suggester defaults 0.25 and 64).
25. **Quantised previews and count-ins.** Preview on next bar/beat/immediately; play the song with 1/2/4-bar count-in.
26. **Instrument set.** Piano, two electric pianos, organ, strings, synth strings, two pads, four guitars, ukulele. For the web, the CC0 FM electric piano (`exported/fulltines-lite`) can be converted directly; pick verified-licence banks for the rest.
27. **Time signatures** with numerator 1–16 and denominator 2/4/8/16; tap tempo.

## F. UI and learning flow

28. **Panel-based workspace.** One main list plus a switchable tool panel (Suggestions, Degrees, Borrow, Classic, Modulation, Standard chords, Builder, Detector, Text input, Alter) works well on desktop and collapses into a sheet on phones.
29. **Empty states that teach.** E.g. "Suggestions are shown here when a scale is selected", "Or just start with chords. You can pick a scale later."
30. **8-card onboarding** with staged animation (title → content → continue button) and a "tool without a document" mode for quick lookups.
31. **Guitar mode toggle** that swaps keyboard cells for chord diagrams — the same idea works for "piano roll vs staff" or "keyboard vs fretboard" views.
32. **Music font.** Use Bravura Text (SMuFL) for note, rest and accidental glyphs in labels (`exported/BravuraText`, OFL 1.1).
33. **Motion budget.** 0.25 s ease for state changes, 0.5 s spring for panels and the "fly into song" effect; symbol transitions for play/pause.
34. **Colour tokens.** Accent blue (#0088FF), orange (#FF8300 light / #FF9F0B dark), mint (P3 0,0.647,0.51 / 0.231,0.808,0.631), light yellow/orange for warnings — define them as CSS custom properties with dark-mode overrides.
