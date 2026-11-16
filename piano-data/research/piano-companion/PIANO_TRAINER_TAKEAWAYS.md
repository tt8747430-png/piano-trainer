# Piano trainer takeaways

Concrete items a TypeScript web piano trainer can adopt. Each item names the source doc or data file. "Adopt" = copy the behaviour. "Improve" = the app has a weakness worth fixing.

## Theory data you can use directly

1. **Adopt the chord dictionary as data.**
   * Load `data/chords.json` and use the 89 rows with `inDictionary: true`.
   * Each row has the formula, degrees, interval names, five symbol styles and a difficulty number.
   * Keep the `id` scheme (base × 100 + alteration index) if you want to interoperate with the app's saved data (`recent_chords`).
2. **Adopt the symbol styles.**
   * International, Jazz (−, Δ, ø), French (7M, 5+), Asian (M7, aug), Brazilian (7M(9), m7(9)).
   * Pick the style automatically from the UI language and a "jazz" interest, like `ChordSymbols.Resolve`: fr → French; ja/ko/zh → Asian; pt → Brazilian; else International.
   * `chordSymbol()` in `chord-detection.ts` renders all five.
3. **Adopt spelling from the major scale of the root.**
   * Chord tones = major-scale degree of the root + degree accidental, so C♯ major is C♯ E♯ G♯, not C♯ F G♯.
   * `chordToneSpellings()` does this.
4. **Adopt the spelling tie-breaks.**
   * Prefer the root spelling whose key has fewer accidentals (D♭ over C♯).
   * On a tie, minor-type chords go to the flat side (E♭m) and others to the sharp side (F♯).
   * Name a non-chord bass with flats in flat keys.
   * See THEORY_ENGINE.md §11.
5. **Use the 27 "popular" scales as the default set.** Keep the other 1,000 behind a filter: tags Common / Jazz / Blues / Arabic / Indian / Other, and note-count filters 2–12. Data: `data/scales.json`.
6. **Show scale step patterns two ways**, as the app does: degrees ("1, 2, ♭3, …, 8") and half/whole glyphs (◐ = 1 semitone, ◉ = 2, ◉◐ = 3).
7. **Multilingual names come free.**
   * `data/localized_theory_names.json` has chord and scale names in 41 locales, including Russian.
   * Note-name systems: English, German (H, B, Cis/Es), solfège (Do Re Mi; French Ré; Russian До Ре Ми), Japanese ハニホ, Korean 도레미, numbers.
   * Note: the app's default note names for Russian are still C D E.

## Recognition ("what am I playing")

8. **Use `nameChord()`, not the app's live lookup, for a trainer.**
   * It works on pitch classes, handles inversions (C/E), omitted 5ths and 9ths (C7(no5)) and foreign basses (C/A), and ranks by a difficulty table.
   * It has a level system (Beginner caps difficulty at 4). You can tie this to your user's skill.
9. **Improve on `findChordByFormulaPart`:**
   * It matches exact voicings, so E-G-C only finds C/E when inversions are enabled.
   * It returns enharmonic twins (C and B♯).
   * Its "Sevenths" filter excludes dominant and minor 7ths.
   * Keep only its useful idea: listing every chord that *contains* the held keys (a "complete the chord" browser).
10. **Adopt the 1.0 s settle delay** before naming chords from MIDI input. Name immediately for single clicks if you prefer. Source: `StartThrottledSearch(1.0)`.
11. **Copy MIDI hygiene:**
    * treat Note-On with velocity 0 as Note-Off;
    * accept all channels;
    * fold the lowest note into octave 0 before matching.

    Source: SOUND_AND_MIDI.md §4.

## Practice features

12. **"What comes next" suggestions.**
    * `suggestNextChords()` is a small model you can show after each chord: 7×7 functional weights, a root-motion bonus (up a 4th +0.35, up a 2nd or 6th +0.2), +0.05 per common tone, −0.12 for 7th chords, summed over the 24 major/minor keys.
    * It is deterministic and cheap.
    * After C it gives F, Am, Dm, G, Em …
13. **Progression drills.** Use the 45 mode-tagged patterns in `data/progressions.json` (I–V–vi–IV, Dorian i–IV, Mixolydian I–♭VII–IV …) as exercises in any key.
    * Fix the app's spelling quirk: it spells ♭III in C as D♯ because it always resolves black keys with sharps.
14. **Chords in a key.** Build exercise sets from the "chords in scale" sections: diatonic triads, diatonic 7ths, secondary dominants (V/x, V7/x), secondary leading-tone chords (vii°/x, viiø7/x), and borrowed chords from 9 parallel modes with the source-mode label. Source: THEORY_ENGINE.md §7.
15. **Fingering hints.** `buildVoicing()` + `assignFingering()` give a ≤ 5-note, ≤ 14-semitone voicing with right- and left-hand finger numbers.
    * Costs come from ideal finger-pair spans plus thumb-on-black and semitone-crossing penalties.
    * Display the fingers with the app's colours: 1 #F66E52, 2 #4E7D86, 3 #4DB18F, 4 #B11AFF, 5 #BB9E81. Right hand = squares, left hand = circles. Source: COMPONENTS_LAYOUT_MOTION.md.
16. **Chord of the day / spaced exposure.**
    * Quality ladder: maj, min, 7, maj7, m7, sus4, 6, add9, m(maj7), dim.
    * Unlock by skill level: 2 / 5 / 8 / 10 qualities.
    * Rotate keys C G D A E F by day.
17. **Flashcard distractors** (`DistractorGenerator`). Wrong answers are:
    * first, same root with another quality and the same note count;
    * then, the same quality on a nearby root (±2 to ±5 semitones);
    * never two options with the same pitch-class set.

    Good multiple-choice design.

## Keyboard, staff and sound

18. **Keyboard geometry to reuse.**
    * Engine A: 4 octaves from C4, three size modes (white 10×30 / 20×60 / 40×120; black 5×20 / 10×40 / 20×80).
    * Black-key horizontal offsets: C♯ .33, D♯ .65, F♯ .33, G♯ .51, A♯ .66.
    * Full 88-key view: black keys 9/23 of the white width and 17/29 of its height; zoom steps 7/10/12/14/21 white keys.
    * States: normal / pressed (green) / root (red).
    * Source: COMPONENTS_LAYOUT_MOTION.md §1.
19. **Pitch-class colour wheel** (optional "colour notes" mode): C red #FF0000 … B #CC00AA, all 12 values in `data/colors.json`.
20. **Staff.**
    * Bravura (SIL OFL) is exported in `export/bravura` with its metadata JSON. Use it with SMuFL code points in SVG or canvas.
    * Chords are drawn as whole notes, scales as quarter notes.
    * Stems turn down above B4 (treble) or D3 (bass).
21. **Sound.**
    * Block chord = 1 beat at 90 BPM (≈ 0.667 s), velocity 100.
    * Arpeggio = 1 note per beat at 160 BPM (0.375 s).
    * Clicked keys use velocity 120. A slash bass plays an octave lower at velocity 70.
    * The bank is a GeneralUser GS subset with 12 piano velocity layers. Check the truncated licence before shipping it. Source: SOUND_AND_MIDI.md, RESOURCES_AND_LICENCES.md.
22. **Metronome without samples.**
    * Square-wave clicks: accent 1100 Hz, beat 800 Hz, subdivision 1600 Hz.
    * Triangle-wave cross-rhythm clicks: 660 / 520 Hz.
    * Range 30–250 BPM, up to 12 beats per bar.
    * Easy to rebuild with WebAudio oscillators.

## UX patterns

23. **Two ways to search one dictionary:**
    * by name, with tolerant symbol parsing: maj/Δ/M, min/−/m, ø → m7b5, 69 → 6/9, slash basses;
    * by keys, on an on-screen or MIDI keyboard.

    The type filters are a segmented control: All, Major, Minor, Dim, Aug, 7, 9, 11, 13. Source: THEORY_ENGINE.md §12.
24. **Keep motion minimal.** The app animates almost nothing: panels switch with duration 0, and only the paywall carousel slides (0.24 s, ease-in-out). Search is debounced at 0.5–1.0 s. Snappy beats decorative.
25. **Gating lessons.**
    * The app gates inversions, more than 2 clicked keys in reverse lookup, saving and exporting, and longer progressions.
    * MIDI input bypasses the 2-key limit. If you gate anything, gate at the data layer, not in one input handler.
    * Source: UI_FLOWS_AND_MENUS.md §9, `data/gating.json`.
