# Round 29 plan: rounds 3–4 (the piano, the sound, songs, the editor, the Player)

Items, in build order: A26, A27 (round 3); T (Transpose, D20), A28, A29, A34, A40, A35 (the part still
open), A37 (round 4). A36 is done (audit `part-a2.md`); nothing in D20 reopens it.

Screenshot sizes everywhere below: **390×844** (phone upright), **844×390** (phone on its side),
**1280×800** (laptop), light and dark, into `.scratch/r29/shots/after/`.

## Corrections to earlier descriptions

1. **`audit.md` A1 row:** "already one widget … the Player's and the editor's files only wrap it with
   their own state | checked, no change". Wrong for D20. They share a trigger and the − key + row, but
   do different things: the Player's moves at once, with no "key signature" and "chord symbols"
   switches. It saves the key as an absolute tonic, so it overrides the editor's Transpose (see T).
   Correct to: "two behaviours over one widget; the Player's is rebuilt in round 4 (T)".
2. **`progress.md` A5 row:** "D20: Transpose is not a circle, it matches the editor's". That reads as
   done. It is open. Correct to: "D20: Transpose is not a circle; the Player's is to work as the
   editor's (round 4, T)".
3. **`compliance/part-a1.md` A5:** "Transpose stays ± steps (`widgets/transpose`)" is listed as
   CONTRADICTS. D20 reverses it: ± semitone steps are right. Only the editor's key signature is
   still in question (see A34 owner's question 1).
4. **`key-picker/spec.md` §3:** "`KeyPicker` — a key (… the editor's key signature, Transpose, …)".
   Strike "Transpose".
5. **`piano-sampler/spec.md` §2:** "never more than ±1.5 semitones". With a root every minor third
   (A0, C1, D♯1 … A7, C8: 30 roots) the nearest root is at most **±1 semitone** away. Correct to ±1.
6. **`piano-sampler/spec.md` §4:** "outside the precache". `vite.config.ts` precaches
   `**/*.{js,css,html,svg,png,ico,woff2,m4a,wav}`, so 15–25 MB of `.m4a` under `public/samples/piano/`
   would be downloaded at install. Add `'samples/piano/**'` to `globIgnores` and serve them by
   the runtime route alone.
7. **`piano-sampler/spec.md` §3:** "the `mf` layer's 30 files are fetched and decoded". As written,
   that layer alone can exceed 80 MB. Decoded PCM is 4 bytes a sample. 30 stereo notes of 8 s at 48 kHz
   are 30 × 8 × 48 000 × 2 × 4 ≈ 92 MB. Correct to: mono files, length caps (below), decoding per note
   on first use, and an LRU limit on decoded bytes (A27).
8. **D15 "credited on the About page":** the app has no About page. The about text is the footnote of
   Settings' Help group (`settings.about.madeWith`, `widgets/settings-screen/ui/SettingsList.tsx:122`).
   The credit goes there (A27).
9. **`compliance/part-b.md` B7 / `editor.scoreSettings.hearNotes`:** "Hear notes as you edit" is the
   app's own phrase. D20 renames it "Play notes while editing" (the term other editors use), on one page only (A40).
10. **`staves-play-show/spec.md` and `audit.md` A35:** Daisy fields is a piece written in degrees
    (a chart). The prompt's A34 bullet "upper staff in a bass clef with the octave sign (Daisy
    fields)" therefore asks about the **editor's drawing of a chart's pattern notes**, not about a
    written score's clef. It is described as such in A34.

---

## Round 3: the piano and the sound

### A26: the on-screen piano
- **Source:** prompt lines 1024–1042 (Part A 26). Standing rules 15 (selected style) and 21 (icon with
  name). D20 "Settings": the piano's own settings page is On-screen piano (`/settings/on-screen-piano`),
  which stays app-wide.
- **Today:** the rail (`features/live-keyboard/ui/LiveKeyboard.tsx:129–155`) is two `RailGroup`s:
  KeyZoom (‹ ›), Note names (glyph "C"), Chord names (glyph "Cm7", `ChordNamesToggle.tsx`), Typing (⌨),
  MIDI sound, Glissando (≈), Pedal (glyph 𝆮, `PedalToggle.tsx`), then the fold chevron ⌄
  (`rail.fold` "Hide the keys"). `RailButton` draws an icon or a glyph with no name in sight. Pedal holds
  are counted per source (`live-voice.ts` `pedalHolds`). Space lifts on blur and unmount. The toggle
  lifts on unmount only. Sostenuto and soft are parsed (`parse-message.ts`) but not shown. Keys stack
  the letter, degree, finger and name (`Key.tsx:134–160`).
- **Will build:**
  1. **Rail controls, in this order on every page.** Each is a `RailButton` with a Lucide icon and
     its name under it in `text-[11px]`. A toggle uses the selected style: a filled chip and
     `aria-pressed`.
     1. Zoom: two buttons, icons `ZoomOut` and `ZoomIn`, labels "Smaller keys" and "Larger keys" (as
        today). The visible name under the pair is "Zoom".
     2. "Note names": icon `CaseSensitive`. A three-way cycle with the value under the name: "C" (every
        C) · "All" · "Off". Professional term: note names (Dorico "Note names").
     3. "Chord names": icon `Music2` (not a "Cm7" glyph). An on/off toggle. Term: chord symbols. The
        visible label is "Chord names", the tooltip "Show the chord symbol of the keys held".
     4. "Computer keys": icon `Keyboard`. An on/off toggle. Today's tooltip "Typing" becomes "Play from the computer keyboard".
     5. "MIDI sound": icon `Speaker`. An on/off toggle, shown only while a MIDI keyboard is connected
        (as today). Tooltip: "Sound the MIDI keyboard".
     6. "Glissando": icon `MoveHorizontal`. An on/off toggle. Tooltip: "Slide across the keys to play
        them".
     7. "Sustain": an icon drawn for the pedal (`PedalIcon` in `shared/ui/icons/pedal-icon.tsx`, a
        pedal seen from above, 24×24, currentColor). It replaces the 𝆮 text glyph. A latching toggle.
        Term: sustain pedal (damper pedal).
     8. "Hide": icon `ChevronDown`, the name "Hide" in sight. It folds the keys. When folded, the button
        is "Keys" with `ChevronUp`.
     What the rail holds stays chosen in On-screen piano settings (`RailControlsField.tsx`, a checklist
     in the order above). Reset is in that page's ⋯.
  2. **Labels on keys: only what the page needs.** New pure function
     `keyLabels(page: KeyLabelNeeds, typing: boolean): readonly KeyLabelKind[]` in
     `shared/ui/piano-keyboard/key-labels.ts`. `KeyLabelKind = 'letter' | 'degree' | 'finger' | 'name'`.
     Rule: at most two at once. The computer-key letter shows only while Computer keys is on and the
     piano has focus. The finger shows where the page shows fingering (Scales, Exercises, the Player
     with Fingering on). Then the degree where the page marks a scale or chord (Scales, Chords). The note
     name shows only where Note names is on. `Key.tsx` reads the list instead of drawing all four.
  3. **The pedal on screen.**
     - A **pedal bar** under the keys (`shared/ui/piano-keyboard/PedalBar.tsx`, props
       `{ sustain: boolean; sostenuto: boolean; soft: boolean }`): three thin segments, labelled
       "Sus." "Sost." "Soft" when down. It is lit in the take roll's pedal-lane colour (`--pedal`
       token). It is the same whether the toggle, Space or a MIDI foot holds it. It reads
       `audio.pedals()` through `usePedal(kind)`. The Sostenuto and Soft segments show only when a MIDI
       keyboard has sent CC 66 or 67 in this session.
     - **Let up on leaving.** New hook `useLiftPedalsOnLeave()` in
       `features/live-keyboard/model/use-lift-pedals.ts`. On `visibilitychange` to hidden, on route
       change (`router.subscribe('onBeforeNavigate')`), and when a dialog or sheet opens (it observes
       `[data-state=open][role=dialog]`), it lifts the sources the screen holds: the toggle and Space.
       It never lifts the MIDI foot, which the next CC 64 sets.
     - The toggle lifts only its own hold (as today). Space lifts only its own. The pedal stays down
       while any source holds it. No source lifts another's.
     - Restrike: one voice per key is already in the audio (16190d53). A test on the live voice proves it.
  4. **Feel.**
     - At 320 px wide the key size defaults to two octaves (C3–B4), each white key at least 22 px. The
       existing `keySize` "Fit" uses that minimum.
     - Swipe on the keys: the existing Glissando switch decides. Off, a swipe scrolls. On, it plays.
     - The rail never overlaps a key. It is its own row above the keys (the `RailGroup` row gets
       `flex-none`, and the keys' area starts under it).
     - One height on every page: `--keys-height` is set once in `PianoKeyboard.tsx` from key length
       (Long/Short) and the screen. The pages' overrides go (grep `--keys-most` overrides in pages).
- **Files:** `features/live-keyboard/ui/{LiveKeyboard,ChordNamesToggle,NamedKeysToggle,TypingToggle,PedalToggle,GlissandoToggle,KeyZoom}.tsx`,
  `shared/ui/piano-keyboard/{RailButton,Key,PianoKeyboard}.tsx`, new `key-labels.ts`,
  `PedalBar.tsx`, `shared/ui/icons/pedal-icon.tsx`, `features/live-keyboard/model/use-lift-pedals.ts`,
  `shared/i18n/locales/{en,ru}/common.ts` (`rail.*`).
- **Not in this item:** the Player's pedal lamp and its Ped. marks (done, d205cf49). Sampled sound
  (A27). Which tools the Player's bar holds (B10).
- **Done when:**
  - `KeyboardRail.test.tsx`: "shows every control's name under its icon, in one order on every page";
    "draws the pedal as an icon, not the 𝆮 glyph"; "marks a toggle on with the selected style
    (aria-pressed)".
  - `key-labels.test.ts`: "shows the letter only while computer keys play"; "never stacks more than two
    labels"; one case per page kind.
  - `PedalBar.test.tsx`: "lights the same whether the toggle, Space or a MIDI foot holds the pedal";
    "shows sostenuto and soft once a MIDI keyboard sends them".
  - `use-lift-pedals.test.tsx`: "lets the toggle's and Space's holds up when the page hides, a dialog
    opens or the route changes"; "leaves the MIDI foot's hold alone".
  - `live-voice.test.ts`: "a key struck again under the pedal sounds one voice".
  - Screenshots: Chords, Scales (with fingering) and the Player at all three sizes, plus 320×693 for
    key width.

### A27: the Player's piano sound (the sampled grand, D15)
- **Source:** prompt lines 1043–1075 (A27). D15 (lines 369–388). The audit found every other A27 bullet
  done (`part-a2.md` 82–88). Open: the sampled grand and the before/after recordings.
- **Today:** every note is three oscillators (`shared/api/audio/web-audio.ts`, `partials`, `holdNote`).
  There is no `public/samples/`, no `smplr`, and no sampler. The service worker precaches every `.m4a`
  and `.wav` (`vite.config.ts:93`).
- **Will build:**
  1. **The sample set to ship.**
     - Source: Salamander Grand Piano V3, Yamaha C5, recorded by Alexander Holm, CC-BY 3.0. The 48 kHz
       24-bit FLAC release has 16 velocity layers, sampled every minor third.
     - Kept: **30 roots** (A0, C1, D♯1, F♯1, A1 … F♯7, A7, C8) × **4 layers**: Salamander v4 → `p`, v8 →
       `mp`, v12 → `mf`, v16 → `f`. 120 files.
     - Encoding: AAC-LC in `.m4a`, **mono**, 44.1 kHz, 96 kb/s. Every phone and laptop plays it from
       the speaker as mono anyway. Stereo would double the decoded memory.
     - Length caps by register, then a 60 ms fade to silence: A0–B2 **10 s**, C3–B4 **6 s**, C5–C8
       **3 s**. The scheduled decay model (`string-decay.ts`) is near silence by then.
     - Sizes: 96 kb/s ≈ 12 KB/s. One layer ≈ (10 notes × 10 s + 8 × 6 s + 12 × 3 s) × 12 KB ≈ 2.2 MB.
       Four layers ≈ **9 MB**, inside D15's 15–25 MB with room to spare. If the spike's listening test
       finds 96 kb/s too thin in the bass, use 128 kb/s ≈ 12 MB.
     - Layout: `public/samples/piano/<layer>/<root>.m4a` (`mf/Fs3.m4a`).
       `public/samples/piano/manifest.json` lists `{ root: midi, layer, file, bytes }` for each.
       `public/samples/piano/SOURCES.md` gives the source URL, the licence, the credit line and the
       script's command.
     - Made by `scripts/piano-samples.mjs` (ffmpeg: `-ac 1 -ar 44100 -c:a aac -b:a 96k`, `atrim` to the
       cap, `afade=out`). The source FLACs are not committed.
  2. **Credit line**, in the Help group's footnote (`settings.about.madeWith`), en: "Piano: Salamander
     Grand Piano by Alexander Holm (CC BY 3.0)". The licence name links to
     `https://creativecommons.org/licenses/by/3.0/`. ru: "Фортепиано: Salamander Grand Piano, автор
     Alexander Holm (CC BY 3.0)". Also in `public/samples/piano/SOURCES.md`.
  3. **The player.**
     - **Spike, one commit:** try `smplr` (MIT, pinned to an exact version) with our manifest as its
       sample map. Keep it only if all three pass: (a) it starts a note at an AudioContext time we
       pass; (b) we drive the damper: one voice per key, release on our pedal lift and on note-off;
       (c) it loads a (root, layer) only when first asked. Record the result in ADR 0034.
     - **Otherwise, our own:** `shared/api/audio/sampler.ts`:
       `createSampler(context: BaseAudioContext, load: SampleLoader, budget: { bytes: number }): Sampler`.
       `Sampler` has `ready(key: Midi, velocity: number): boolean`,
       `start(key: Midi, velocity: number, at: number, gain: number): SamplerVoice | null`
       (null while not loaded) and `decoded(): number` (bytes).
       `SamplerVoice` has `release(at: number, seconds: number): void`.
       Playback rate is `2 ** ((key − root) / 12)` from the nearest root, at most ±1 semitone. Velocity
       picks the layer (p < 0.35 ≤ mp < 0.6 ≤ mf < 0.85 ≤ f) and scales gain inside it.
     - Release: 0.25 s at C5 and above, 0.6 s at C3 and below, linear between.
     - The sampler sits behind the existing `AudioOutput` (`play`, `press`, `release`, `pedal`
       unchanged). `web-audio.ts` asks the sampler first. If a note's buffer is not ready, the
       synthesised voice plays that note (only while loading, or offline before the download).
  4. **Loading and memory (≤ 80 MB decoded).**
     - `SampleLoader` (`shared/api/audio/sample-loader.ts`) does `fetch` then `decodeAudioData`, per
       (root, layer), and only when first needed.
     - Order: when a Player or keyboard page opens, the `mp` layer for the roots that page's range needs.
       Then `mf` for those roots. Then `p` and `f` when first struck. Fetch is not decode: the other
       files are fetched into the cache in the background, idle, one at a time.
     - Budget: a mono 44.1 kHz buffer costs 176 KB a second. All four layers of all 30 roots ≈ 4 × 204 s
       × 176 KB ≈ 144 MB, so not everything stays decoded. An LRU over (root, layer) frees the
       least-recently struck buffers outside the page's range once `decoded()` passes 80 MB. On page
       leave, buffers outside the next page's range are freed. A Player page with a two-layer working
       set uses about 30–50 MB.
     - The first note sounds within a second: the `mp` root nearest middle C is loaded first.
  5. **Offline cache.**
     - `vite.config.ts`: `globIgnores` gains `'samples/piano/**'`.
     - `runtimeCaching` gains `/samples/` → `CacheFirst`, `cacheName: 'samples'`,
       `CacheableResponsePlugin({ statuses: [200] })`, `RangeRequestsPlugin`, no expiration.
  6. **Storage and backup** (`pages/settings/ui/StoragePage.tsx`), a group "Piano sound":
     - row "Piano samples", value "9.1 MB of 9.1 MB on this device", or "2.3 MB of 9.1 MB";
     - action row "Download for offline", with progress "Downloading… 40%";
     - danger row "Remove piano samples", with a `ConfirmDialog`: "The piano plays a simple synthesised
       sound offline until you download them again."
     Sizes come from `manifest.json` and `caches.open('samples')`.
  7. **Velocity:** scheduled notes keep their 0–1 velocity. Live MIDI maps through `midi.touch`.
  8. **The check:** record before and after on the Fantaisie-Impromptu's opening (needs the owner's
     file, see the question), Amazing Grace (written pedalling) and Lightly Row (no pedalling). Put the
     recordings in `.scratch/r29/sound/`.
- **Not in this item:** the metronome's samples (D16, round 2). The pedal events and decay (done).
  Audio export (A29).
- **Done when:**
  - `sampler.test.ts` (fake context): "picks the nearest root, at most a semitone away, for every key
    A0–C8"; "picks the layer by velocity"; "one voice per key"; "releases at note-off, and under the
    pedal at the lift"; "frees the least-recently struck buffers past the budget".
  - `piano-samples.test.ts` (node, reads `public/samples/piano/manifest.json`): "30 roots × 4 layers,
    every file present, mono, under 15 MB together".
  - `vite-config.test.ts`: "precaches no piano sample; serves `/samples/` cache-first".
  - `StoragePage.test.tsx`: "shows the samples' size and downloads them for offline"; "asks before
    removing them".
  - `web-audio.test.ts`: "plays the synthesised voice for a note whose sample is not loaded".
  - Measured: Safari's memory timeline on an iPhone, the Fantaisie played through, decoded audio
    ≤ 80 MB. Recorded in `progress.md`.
  - The three before/after recordings.
- **Owner's question:** the Fantaisie-Impromptu file is still not in `musicxml/fixtures/`. Put both of
  your Fantaisie files in `src/shared/lib/musicxml/fixtures/` (or say they may be committed). Default:
  check against Amazing Grace and a Chopin-like pedalled fixture we write.

---

## Round 4: songs, the editor and the Player

### T: Transpose (D20, the owner's correction)
- **Source:** D20 (prompt lines 408–410): "no circle of fifths for it. The Player's Transpose works as
  the music editor's does (the same control and the same result); today the Player's is broken".
  It replaces A5's "circle of fifths for Transpose". See also feedback-log lines 65, 86 and 315 ("with
  semitones, the key it lands in, Apply to key or chords, and a preview"; "the same in the Player and the
  editor").
- **Today, read in the code:**
  - **One widget, two behaviours.** `widgets/transpose/ui/TransposeTool.tsx` draws the trigger
    (`ArrowUpDown` icon, the key as a symbol) and the popover's "− [key it lands in] +", the semitones
    ("+2"), and Reset. The range is −5 to +6, the short way (`TRANSPOSITION_RANGE`).
    - **Editor** (`pages/score-editor/ui/EditorTranspose.tsx`): adds "Apply to key" and "Apply to
      chords" switches with ⓘ, a preview of the first line, and a **Transpose** button. The button
      writes the draft (`transpose(draft, semitones, applies)` in
      `features/score-editor/model/settings.ts:103`) as one undoable edit. It opens at 0 each time.
    - **Player** (`pages/player/ui/TransposeTool.tsx`): no switches, no preview, no button. Each − or
      + moves the music at once. The key is saved in the URL as an **absolute tonic**
      (`changeSetup({ key })` → `?key=Db`). `resolveChoice` (`pages/player/model/player-search.ts`)
      reads it into `choice.tonic`. `arrangePiece` → `arrange` (`shared/lib/arrangement/arrange.ts:582`)
      moves the staves, the written hands and the chords from `chart.key.tonic` to that tonic. That path
      works, and the tests in `pages/player/ui/TransposeTool.test.tsx` pass on Lightly Row.
  - **What is broken:**
    1. **The Player overrides the editor (the defect).** `key` is a kept param (`PLAYER_KEPT` in
       `app/routes/player-search.ts:130`), and the remembered view stores it as a tonic (`key: 'B'`).
       Example: Lightly Row (C) is transposed in the Player to B. Then the editor's Transpose writes the
       song up a tone, to D. Practise (`ScoreEditToggle.tsx:34`, which navigates with `search: {bar}`)
       fills `key: 'B'` back in from the remembered view (`viewToOpen`, `app/routes/remember.ts`). The
       Player plays and shows B, and labels it "B major, −3". The written D is lost in the Player.
       Pressing Edit in a transposed Player opens the editor in the written key, with nothing saying
       so. The two Transposes never agree.
    2. **Not the same control.** The Player has no "key signature" or "chord symbols" choice. The editor
       has both.
    3. **The recording falls silent** in any key but the song's own (`recordingInKey`,
       `use-player.ts`). Only an ⓘ inside the popover says so. With the recording as the song's main
       sound, Transpose seems to stop the music.
    4. **Wrong key name on imported minor songs.** A C♯-minor file without `<mode>` reads as E major
       (A28/A29). The trigger then says "E", and every landing key is named as a major.
- **Will build:** one Transpose with one model, in the Player and the editor.
  1. **The control**, the same popover in both (`widgets/transpose/ui/TransposeTool.tsx`), in order:
     - heading "Transpose" with ⓘ: "Moves every note by semitones. The key signature and chord symbols
       follow unless you turn them off.";
     - stepper: − button "Down a semitone", the key it lands in ("D major"), + button "Up a
       semitone". Under the key, "+2 semitones" or "The song's key" at 0. Range −5 to +6 (Flat, MuseScore
       and Dorico's "closest" direction). Arrow keys ±1 while focused;
     - switch row "Transpose key signature" (Dorico and MuseScore: "Transpose key signatures"), default
       on. Off: the signature stays and the moved notes print with accidentals;
     - switch row "Transpose chord symbols" (MuseScore: "Transpose chord symbols"), default on. Off:
       the symbols print as written. The sound still follows the notes, the same as with a capo;
     - Reset button "Reset" (greyed at 0).
     The editor's popover adds its preview of the first line and its **Transpose** button, which writes
     the score (unchanged). The Player's popover adds no button: the score behind it is the preview, and
     it changes at once.
  2. **The Player's state is relative.** In the URL: `transpose=<−5…6>` (absent at 0), `tkey=0` only
     when the key-signature switch is off, `tchords=0` only when the chord-symbols switch is off. `key`
     leaves `PlayerSearch`. The pre-release rule: no reader of the old `?key=`.
     - `PLAYER_KEPT` keeps `transpose`, `tkey` and `tchords`. A remembered "+2" means 2 semitones from
       whatever key the song is now written in. An editor's write therefore always shows in the Player,
       moved by the learner's offset.
     - `resolveChoice` computes `tonic = transposedKey(pieceKey(piece), transpose).tonic`.
     - `PracticeChoice` gains `signature: boolean` and `chordSymbols: boolean`
       (`features/practice/choice.ts`).
  3. **The arrangement honours the switches.** `ArrangeOptions` in
     `shared/lib/arrangement/arrange.ts` gains `keepSignature?: boolean` and
     `keepChordSymbols?: boolean`.
     - `keepSignature`: `Performance.key` and the bars' section keys stay the chart's. The notes are
       moved and spelled by `transposeNote` as today. `notate`'s accidentals then print what differs
       from the kept signature.
     - `keepChordSymbols`: each `PerformedChord.symbol` is the written chord's `chordSymbol`. Its
       `tones` and voicing are moved, so it sounds in the new key.
     - `arrangePiece` passes both from the choice.
  4. **The editor uses the same words.** `editor.transpose.key` "Apply to key" becomes "Transpose key
     signature". `editor.transpose.chords` "Apply to chords" becomes "Transpose chord symbols". The
     ⓘ texts are shared. Its draft function `transpose(draft, semitones, applies)` is unchanged.
  5. **The trigger**, the same in both: icon `ArrowUpDown`, name "Transpose", then a value.
     - Player: the key it plays in, in the accent while moved. Label "Transpose: D major, +2".
     - Editor: the written key.
  6. **What moves (Player):**
     - notes on every staff: always;
     - key signature: with the first switch;
     - chord symbols on the score and in Diagrams, Grid and Chords over lyrics: with the second switch;
     - the on-screen piano's keys and Wait mode's expected notes: always, as the notes move;
     - a connected piano: always, as the notes move.
  7. **The recording, made visible.** When transposed, the Staves list in Setup shows the recording
     row greyed with "Plays only in D minor, the song's key". The popover keeps one line under the
     stepper: "The recording is silent in another key." No pitch-shifting.
  8. **Editing from a transposed Player.** The Edit pencil opens the editor on the written key. The
     editor's Transpose trigger shows a dot and its popover a line "In the Player: +2 (D major)". There
     is also a button "Use this" that preloads +2 into the editor's stepper. Nothing is written until
     the editor's Transpose button is pressed.
  9. **Shared links** (`features/share-song/model/played-as.ts`) carry `transpose` instead of `key`.
- **Files:** `widgets/transpose/ui/TransposeTool.tsx` (new props `signature`, `chordSymbols`,
  `onSignature`, `onChordSymbols`, `note?: ReactNode`), `pages/player/ui/TransposeTool.tsx`,
  `pages/player/model/{player-search,use-player}.ts`, `app/routes/player-search.ts`,
  `features/practice/{choice,arrange-piece}.ts`, `shared/lib/arrangement/arrange.ts`,
  `pages/score-editor/ui/EditorTranspose.tsx`, `features/share-song/model/played-as.ts`,
  `shared/i18n/locales/{en,ru}/{player,editor}.ts`. Amend ADR 0105 and ADR 0115.
- **Not in this item:** a circle of fifths (D20: none). Pitch-shifting the recording. The key picker
  (A5).
- **Done when:**
  - `remembered-views.test.tsx`: "after the editor writes the song a tone up, Practise plays it in the
    written key plus the learner's offset" (this fails today).
  - `TransposeTool.test.tsx` (Player): "offers the same controls as the editor's: stepper, Transpose
    key signature, Transpose chord symbols, Reset"; "keeps the key signature when it is turned off,
    printing accidentals"; "keeps the chord symbols as written when that is turned off, sounding the
    moved chord".
  - `arrange.test.ts`: "keepSignature leaves the Performance's key and section keys as written";
    "keepChordSymbols prints the written symbol over the moved tones".
  - `player-search.test.ts`: "reads transpose −5…6, and nothing else".
  - `ScoreEditorPage.test.tsx`: "the editor's Transpose names the switches as the Player's do".
  - Screenshots: the popover in the Player and the editor side by side at all three sizes, on Amazing
    Grace +2 with each switch off.
- **Owner's question:** does "the same result" mean the Player's Transpose should also **write** the
  song (the editor's Transpose button, making the learner's version)? Default: no. The Player plays and
  shows the song moved and keeps that per song. Writing stays the editor's. Both use one control, one set
  of words and one relative offset.

### A28: the song page of an imported or own song
- **Source:** prompt lines 1076–1127 (A28). Rules 12, 15, 23 and 28. Part A 11 and 38.
- **Today:** `pages/piece/ui/PieceView.tsx:101` hides Learned for own songs
  (`own ? null : <LearnedButton>`). Key read without `<mode>` as major (`shared/lib/musicxml/read.ts:712`).
  `piece.sections.noLessons` "No chords to learn" per section. `TempoText` writes ♩ in 2/2.
  `PieceFacts`/`PieceFactLine` as their own chip style. `PieceAbout.tsx` has the "Scale: G major" link
  and the About ⓘ. There are two credit models: `credits` (content, `CREDIT_ROLES`) and `header`
  (`score-header.ts`: subtitle, composer, lyricist, arranger). `SongEdit.tsx:84` "Edit the music".
- **Will build:**
  1. **Learned on every song.** Remove the `own` condition. In one row under Practise: "Edit score"
     (outline), "Learned" (outline toggle, `aria-pressed`), ♡ "Favourite" (icon toggle). Own songs'
     progress counts on the Profile through `pieceStepId` (as built-in ones).
  2. **Minor without `<mode>`.**
     - New `inferMode(fifths: number, notes: readonly { midi: Midi; startTick: Tick; staff: number }[],
       title?: string): boolean` in `shared/lib/musicxml/infer-mode.ts`.
     - A minor score is likely if most of these hold: the lowest note of the first bar is the relative
       minor's tonic, or its 5th; so is the last bar's; the raised 7th of the minor (B♯ in C♯ minor)
       appears; the title says "minor", "moll" or "минор".
     - `read.ts` calls it only when `<mode>` is absent. MIDI keeps `keyOfNotes`.
     - The song's Settings has a "Key" row as its correction: a `MenuPicker` of the major and its
       relative minor on the same signature.
  3. **Sections without chords.** `SectionCard` shows "Bars 1–16 · 0:40 · Both hands · ●●○". The
     line "No chords to learn" goes. The chord line shows only when the section has chords.
  4. **Tempo in the meter's beat.** `TempoText` uses `beatUnit(meter)`: 𝅗𝅥 = 80 in 2/2, ♩. = 60 in
     6/8, or the piece's own `tempoUnit`.
  5. **Head of every song page**, as a score's head:
     - title (h1), then subtitle;
     - one credits line in the byline style, roles printed as on a score:
       "Words by John Newton · Music: NEW BRITAIN, American folk tune";
     - then the about text: two lines clamped, with a "More" text button that opens it in place.
       ADR 0111 is amended: a paragraph is allowed;
     - then one facts row of chips, one chip style (`shared/ui` `FactChip`, Part A 8): "Key C♯ minor"
       (a link chip to `/practice/scales?root=C%23&kind=minor&show=key`, no arrow), "Time ¢",
       "Tempo 𝅗𝅥 = 80", "Level Easy ●○○".
     - "Scale: … →" and "About this song ⓘ" go (`PieceAbout.tsx` deleted; its link moves into the Key
       chip).
  6. **Laptop layout** (≥ 64rem): two columns. Left (reading width, 40rem) holds the head, the facts
     and the overview card. Right holds Chords, Progressions and Sections. Below 64rem, one column.
  7. **The metadata editor** (the pencil, in place, `pages/piece/ui/SongEdit.tsx`), in order:
     - "Title" (text, placeholder "e.g. Amazing Grace"), "Subtitle" (placeholder "e.g. Hymn");
     - "Credits": rows added from a button "Add credit" (a menu of roles): Composer, Lyricist, Arranger,
       Translator, Tune name (ⓘ "A hymn tune's own name, printed in capitals"), Source or collection,
       Year, Copyright. Each row has a name field and a remove (×);
     - "About" (multiline, counter "0/500");
     - "Level" (segmented: Beginner · Elementary · Intermediate · Advanced, the same scale as Learn's
       levels);
     - "Genre or style" (text with suggestions);
     - "Language of the words" (menu: none, English, Russian, …);
     - "Tags" (chips with an add field);
     - bar actions: "Edit score" and "Done".
     ru terms: композитор, автор слов, аранжировка, перевод, название напева, источник, год, авторские
     права.
  8. **One model for credits.** `ScoreHeader` becomes `SongCredits` in
     `entities/piece/model/song-credits.ts`:
     `{ subtitle?; composer?; lyricist?; arranger?; translator?; tune?; source?; year?; copyright? }`.
     The content's `credits` (`CREDIT_ROLES`) is mapped to it by `creditsOf(entry): SongCredits`. Own
     and learner saves carry it. `pt-pieces` version is bumped, with no migration.
     - The same fields are in the score's Settings (Score group) and in New song's first step: one store
       field each.
     - On the engraved title block: composer and arranger on the right (arranger under composer),
       lyricist and translator on the left, tune under the title.
     - MusicXML: `<creator type="composer|lyricist|arranger|translator">`, `<rights>` for copyright,
       `<work-title>`/`<movement-title>`, `<encoding-date>` untouched. Read back by
       `shared/lib/musicxml/read.ts`.
- **Not in this item:** Explore and publishing (B3, B6). The pencil's permission rules (B4).
- **Done when:**
  - `PiecePage.test.tsx`: "an own song has Learned and Favourite in the row under Practise"; "the Key
    chip opens the key's scale"; "no arrow link, no About ⓘ; the about text shows two lines and More";
    "a song without chords never says No chords to learn".
  - `infer-mode.test.ts`: "a C♯-minor file without mode reads as C♯ minor (B♯, bass C♯)"; "a file in E
    major stays E major"; "the title's 'in C♯ Minor' decides a tie".
  - `tempo-text.test.tsx`: "writes the half note in 2/2 and the dotted quarter in 6/8".
  - `SongEdit.test.tsx`: "adds credits by role and removes them"; "Edit score opens the editor".
  - `song-credits.test.ts`, and `music-xml.test.ts`: "writes and reads composer, lyricist, arranger,
    translator, rights and work-title".
  - Screenshots: the Fantaisie-Impromptu (own) and Amazing Grace pages at all three sizes, and the
    editor open.

### A29: imports and exports (what remains)
- **Source:** prompt lines 1128–1170 (A29). The owner's feedback 2026-11-03: "Imports keep everything:
  tuplets, any tempo, MIDI tempo and meter changes".
- **Today:** done: pedal events in MusicXML and MIDI, MIDI tempo and meter changes (c6500150), and
  `.mxl` import. Open, with places in the code:
  - MusicXML minor without mode (A28);
  - dynamics and words ignore `<offset>`;
  - beams not read;
  - MIDI velocity dropped (`song-of-midi.ts:221–226`);
  - split at middle C (`SPLIT = 60`, line 28);
  - key changes dropped (`file.keys[0]`);
  - no pickup;
  - one "verse" section;
  - Import sheet counts only;
  - one file at a time;
  - no .mxl/PDF/audio/take export;
  - no round-trip suite or app fixtures.
- **Will build**, each in its own commit:
  1. **MusicXML directions at their tick.** `applyDirections` in `read.ts` places dynamics, wedges and
     words at `measureTick + position + offset`. A direction between notes, over a rest, or after the
     last note becomes a mark event at its own tick. The model has `marks` per note today, so these go
     to `Song.directions: { tick, staff, kind, text? }[]` (new, `entities/piece/model/types.ts`). The
     notation prints them at their tick.
  2. **Beams kept.** Read `<beam number="1">begin|continue|end`. Store `beam: 'begin' | 'continue' |
     'end'` on the note. `notation/beams.ts` uses written beams where present, else its own rule.
  3. **MIDI velocity.** `spelled` keeps `velocity`. Song notes gain `velocity?: number` (0–1). A
     dynamic mark is written where a bar's mean velocity changes by ≥ 16 (p ≤ 48 < mp ≤ 64 < mf ≤ 80 <
     f ≤ 96 < ff).
  4. **Hand split by shape:** `splitHands(notes): { rh; lh }` in
     `features/song-files/model/split-hands.ts`. Chords at one onset split at their widest gap (no hand
     spans more than a 10th). Continuity carries each voice to the hand that held the nearest previous
     note. 60 is used only as a tie-break.
  5. **MIDI key changes:** every `file.keys[i]` becomes a section key at its bar.
  6. **Pickup:** if the first onset is beyond tick 0, or the first bar's notes fill less than its
     length while the last bar is short by the same, bar 1 is a pickup of that length.
  7. **Sections from markers:** MIDI meta 0x06 markers name sections. With no markers: one section with
     no name (heading empty), never "verse".
  8. **What a file couldn't keep:** `ReadSong.unread` becomes `{ kind, bar, detail }[]`. The Import
     sheet lists "A trill in bar 12", grouped by kind, then a button "Open at bar 12".
  9. **Several files at once:** the picker takes `multiple`, and a drop takes every file. They are read
     in turn, with one summary: "3 songs imported · 1 not read (file.pdf: not a score)". A title already
     in the folder asks: "Replace" · "Keep both" · "Cancel" (a `ConfirmDialog` with three actions).
     Imports land in the open folder, else Home (rule 16).
  10. **Export**, in the one Export… sheet (`features/song-files/ui/ExportSheet.tsx`), rows in order:
      - "MusicXML (.musicxml)";
      - "Compressed MusicXML (.mxl)": new `writeMxl(xml: string): Uint8Array` in
        `shared/lib/musicxml/mxl.ts`, a zip with `META-INF/container.xml`;
      - "MIDI (.mid)";
      - "PDF": the print view through the browser's Save as PDF, `SongPrint`;
      - "Audio (.wav)": an offline render of the performance through the sampler with
        `OfflineAudioContext`, `shared/api/audio/render-audio.ts`
        `renderAudio(sounds: readonly Sound[], seconds: number): Promise<Blob>`;
      - "Share link".
      My recordings (`TakeRow`) gets "Export as MIDI" and "Export as audio".
  11. **Round trips and fixtures.**
      - `src/shared/lib/musicxml/fixtures/` gets one short piano file each from MuseScore 4, Flat,
        Dorico 5, Finale and Sibelius. The owner provides them, or we make them with free trials /
        MuseScore.
      - `round-trip.test.ts`: every library song → MusicXML → read gives the same notes, marks, pedal,
        chords, lyrics, sections, key, meter and tempo. Every song → MIDI → read gives the same notes,
        hands, pedal and dynamics within the grid.
  12. **Compare with Flat and MuseScore:** import the five fixtures in each. Each thing they keep that we
      lose becomes a row in `audit.md`.
- **Not in this item:** the A28 metadata itself (only its MusicXML fields are written there).
- **Done when:** the tests above, plus:
  - `read.test.ts`: "a dynamic over a rest keeps its tick"; "a written beam is kept".
  - `song-of-midi.test.ts`: "keeps velocity", "splits a left hand rising over middle C to the left",
    "keeps key changes", "finds a pickup", "names sections from markers, else none".
  - `ImportSheet.test.tsx`: "lists what was lost and where, and opens at its bar"; "imports several
    files with one summary"; "asks Replace, Keep both or Cancel".
  - `ExportSheet.test.tsx`: "offers MusicXML, .mxl, MIDI, PDF, audio and Share link".
  - Screenshots: the Import sheet with losses and the Export sheet at all three sizes.
- **Owner's question:** send the five editors' export files (or the two Fantaisie files) for
  `fixtures/`. Default: make them with MuseScore 4 and Flat's free tier.

### A34: the score editor against Flat
- **Source:** prompt lines 1330–1386 (A34). `owner/63–64`, 66, 69, 70. D20 Words.
- **Today:** the palette (`pages/score-editor/ui/EditorPalette.tsx`, `palette-icons.tsx`,
  `sign-pictures.tsx`) draws its glyphs at mixed sizes. Key signature: `KeyPicker.tsx` is a sign grid with
  "Switch to natural". Time: fixed lists (`NewSongSheet.tsx:53` `TIMES`, `TimePicker.tsx`; 4/4 twice).
  Tempo: `TempoPopover.tsx` with a drag. New song's steps are three bare dashes. The transport covers the
  last system. There are mixed gutters, tooltips over the bar's text, and no engraving skeleton.
- **Will build:**
  1. **Palette glyphs.** New `PaletteGlyph({ smufl: string; label: string })` in
     `pages/score-editor/ui/palette-glyph.tsx`. Each is one Bravura codepoint at 24 px on one baseline,
     centred in a 44×44 cell. The grid is `grid-cols-[repeat(auto-fill,44px)]`. Rows end cleanly: each
     group's cell count is a multiple of its column count, else the last row is centred. The same
     component draws clefs (each with its 8/15 from SMuFL's `gClef8vb` etc., not composed), key
     signatures, time signatures, barlines, tuplet marks (⌐3⌐ as `tuplet3` text in the music font)
     and "8va"/"8vb".
  2. **Key signature** (palette and score Settings): one grid of **15 cells**, 7♭ … 0 … 7♯, each drawn
     as its signature on a short staff, named under it "E♭ / Cm" (major / relative minor). C/Am first in
     the reading order, as Flat. Above it, segmented "Major · Minor", which sets the mode written to the
     score. "Switch to natural" goes. The selected cell has the selected style.
  3. **Time signature**: one control `TimeSignatureField` in `shared/ui/pickers/time-signature-field.tsx`,
     used by the palette, New song's step 3, the score Settings and the Metronome (A39):
     - tiles 2/4 3/4 4/4 C ¢ 3/8 6/8 9/8 12/8 5/4 7/8 3/2 2/2, engraved;
     - "Other": a number stepper 1–32 ("Beats") over a menu 1·2·4·8·16·32 ("Beat unit"), drawn as the
       signature it makes;
     - "Pickup" (a number of beats, 0 = none), shown beside it;
     - "Apply to": segmented "From this bar · Whole song" (palette only).
     Value type `Meter` (`music/time.ts`), unchanged.
  4. **Tempo popover** (Flat's), `TempoPopover.tsx` rewritten:
     - "Beat" menu: ♩ ♪ 𝅗𝅥 ♩. (compound meters default to ♩.);
     - "BPM" number field: typing, ↑↓ ±1, shift ±10, with − and + buttons that repeat while held;
     - "Tempo text" optional menu: Largo · Adagio · Andante · Moderato · Allegro · Presto, or custom.
       Printed with the mark;
     - ▶ button "Hear the tempo" (four clicks);
     - "Save", "Delete" (mid-song marks only).
     The same popover opens from the score's tempo mark, New song step 3 and score Settings. A tempo
     change mid-song is added from the palette's Text group, "Tempo change", at the caret. The drag goes.
  5. **New song's steps** (`pages/songs/ui/NewSongSheet.tsx`): a step bar with names "Title ·
     Instruments · Time and key". Instruments: each family's row has "+". After the first add it becomes
     "− 1 +" (one way). Step 3 uses `TimeSignatureField`, the key grid and the tempo popover. Labels:
     "Time signature", "Key signature", "Tempo", "Pickup bar", "Number of bars".
  6. **Flat/Dorico gap list**: write `.scratch/r29/editor-gaps.md`, one row per option in Flat's
     palettes and Dorico's: Notation, Pitch, Articulations, Ornaments, Dynamics, Text, Clefs,
     Barlines, Repeats, Layout. Mark each "have", "differs" or "missing". Build every "missing" known
     today:
     - "Respell" (enharmonic ♭⇄♯, key `J`);
     - cross-staff notes ("Move to staff above/below", ⌘↑/⌘↓);
     - grace notes: acciaccatura, appoggiatura;
     - tremolo: 1–3 strokes;
     - arpeggio: up, down, plain;
     - octave lines: 8va, 8vb, 15ma, 15mb;
     - tuplets: 2–9 and custom n:m.
     Each goes in the palette group Flat uses.
  7. **Clef on a chart's upper staff** (Daisy fields, `owner/63`). Check whether `arrange-draft.ts` chooses
     the bass clef with 8va because the pattern's right hand sits low. Rule:
     `clefFor(notes, staff: 'upper' | 'lower')` in `features/score-editor/model/clef-for.ts` keeps
     treble for the upper staff unless ≥ 70% of its notes are below G3. A clef change from the palette
     asks "This bar only · To the end · Whole staff".
  8. **Transport over margins:** `ScoreSheet` gets bottom padding `var(--transport-height)`. The band
     under the palette goes (the layout grid's last row is `auto`, not a fixed strip).
  9. **One gutter:** the app bar's ✕, the panel, the note toolbar and the pinned piano share
     `--gutter`. The note toolbar starts at the panel's left.
  10. **Tooltips:** `side="bottom"` for the top bar's tools and `side="top"` for the bottom ones. They
      are never over text.
  11. **Engraving skeleton:** `ScoreSkeleton({ systems: number; staves: number })` in
      `shared/ui/score/ScoreSkeleton.tsx`, staves at the final size with a "Bar 12 of 48" counter. The
      old drawing stays until the new SVG is ready (render to a hidden layer, swap). Used by the
      editor, the Player, lesson examples and Scales.
- **Not in this item:** the panels' tabs (A40). Customisable bars (B10).
- **Done when:**
  - `palette-glyph.test.tsx`: "every clef cell draws one SMuFL glyph at one size".
  - `KeyPicker.test.tsx`: "15 keys named by major and minor, C/Am included, no Switch to natural".
  - `time-signature-field.test.tsx`: "any n/unit; tiles; pickup; apply to".
  - `TempoPopover.test.tsx`: "types, steps ±1 and ±10, chooses the beat, saves and deletes".
  - `NewSongSheet.test.tsx`: "names its steps"; "one way to add an instrument".
  - `clef-for.test.ts`; `ScoreSkeleton.test.tsx`.
  - Screenshots: the editor with the palette open on each group, at all three sizes, the Fantaisie
    and Daisy fields.
- **Owner's question 1:** D20 keeps the circle of fifths "where A5 puts it", and A5 lists the editor's
  key. A34 asks for Flat's grid of 15 signatures. Which one is the editor's key signature? Default:
  A34's grid (Flat and Dorico do it that way). The circle stays on Scales and keys' Key tab.

### A40: the score editor's panels against Flat's
- **Source:** prompt lines 1524–1570 (A40). D20 "Settings" (the score editor has its own settings page
  from its own gear). D20 "Words".
- **Today:** one palette (`EditorPalette.tsx`), no tabs. Instruments on the score Settings
  (`widgets/instrument-list/ui/InstrumentList.tsx`), with add and remove only. Layout: staff size and
  bars per line on `/edit/$pieceId/settings` (`ScoreSettingsPage.tsx`). Recording:
  `features/record-take` plus `WriteTakePage.tsx`, separate from Flat's flow. "Hear notes as you edit"
  is on two pages.
- **Will build:**
  1. **Left panel with three tabs** (from 48rem; on a phone, the same three as segments at the top of
     the bottom sheet): "Notation · Instruments · Layout". `EditorPalette` becomes `EditorPanel` with
     `tab: 'notation' | 'instruments' | 'layout'` in the URL (`?panel=`, replace).
  2. **Notation:** the palette's groups in Flat's order and names: Modes (Editing; Duration "Replace" ·
     "Insert"; Rest), Pitch and representation, Articulations, Ornaments, Dynamics, Measures and
     brackets, Clef, Key signature, Time signature, Barlines and repeats, Text. `PALETTE_CATEGORIES`
     is renamed to match. Replace/Insert is built: `features/score-editor` gets `entry: 'replace' |
     'insert'`. Insert shifts later notes in the voice.
  3. **Instruments:**
     - an "All" switch (play all);
     - each staff a row: drag handle, name, "S" (solo, toggle), eye (show/hide), ⋯ (Rename, Change
       instrument, Move up, Move down, Delete…);
     - "New instrument" button;
     - sort menu "Score order · As added".
     Solo and eye are A35's Play and Show (the same `staves=` model in the editor).
  4. **Layout**, each group a fold with a live preview (the first page at 30%) beside it on a laptop and
     above it on a phone:
     - Templates: "Normal", "Jazz", "Save as template";
     - Pages: orientation "Portrait · Landscape"; page size "A4 · A3 · Letter"; margins in cm (four
       number fields); "Start page numbering at";
     - Staves: "Staff size" (mm, 5.0–9.0) and "Space between staves" / "Space between systems"
       (sliders with numbers). They replace today's five named sizes;
     - "Hide empty staves": "Never · After the first system · Always", each with a picture;
     - Measures: "Note spacing" (slider, Compact to Wide); "Measures per system" (stepper; "Auto");
     - Measure numbers: "Every measure · Every system · None"; "Count the pickup" (switch); "Start
       numbering at";
     - Note heads: colour "Default · Boomwhackers"; shape "Default · Note names · Solfège (Ti) ·
       Solfège (Si) · Shape notes"; "Fixed Do · Movable Do";
     - "Music font": Bravura · Petaluma · Leland, each with a sample;
     - Chord symbols: minor "m · −"; major seventh "maj7 · M7 · Δ7"; diminished "dim · °", each a
       picture. App-wide default in Settings › General "Chord symbols"; this is the score's override,
       shown "Default (m)";
     - Text styles: the score font and the size of title, subtitle, credits, tempo and lyrics;
     - foot: "Reset" and "Save".
     Saved in `PieceLayout` (`entities/piece/model/score-header.ts` grows; `pt-pieces` version bumped).
     Written to MusicXML `<defaults>` (page and staff size, scaling) where it has a place. Applied by
     `shared/ui/score` options to Verovio (pageWidth/Height, margins, spacingStaff, spacingSystem,
     font, mnumInterval, condense).
  5. **Recording from a MIDI keyboard**, one flow replacing Record take and Write a take:
     - in the bar, a MIDI popover: "MIDI input" (menu), "MIDI output" (menu), "Write while playing"
       (switch), "Record live MIDI" (button);
     - recording bar under the score: "Metronome" switch with its tempo, "Start countdown" (Off · 1
       bar · 2 bars), the device's name, and the line "Play to start recording. The take starts on
       your first note.";
     - then "Review your recording": the take as a piano roll under the engraved result; "Quantize"
       segmented 1/4 · 1/8 · 1/16 · 1/4t · 1/8t; "Hide raw notes" switch; a draggable staff divider
       ("Split point: C4"); select and "Split"; "Discard" and "Save to score".
     Built in `pages/score-editor/ui/RecordReview.tsx` over `features/record-take`. `WriteTakePage.tsx`
     is replaced.
  6. **The bar:** title with pencil, transport, metronome, loop, sound, MIDI, Edit menu, save state,
     Share. Under it, the note toolbar and at its right: delete, undo, redo, copy, cut, paste, zoom,
     layout, print.
  7. **The editor's own settings page** (`/edit/$pieceId/settings` is the score's; the editor's is
     `/settings/score-editor` today). Per D20 the editor's gear opens `/edit/$pieceId/editor-settings`
     with "Play notes while editing" (switch, renamed per D20), "Note input: Replace · Insert", and
     "Panel side: Left · Right". These are removed from the score Settings page, so each setting has one
     home.
- **Not in this item:** Explore or publishing (B3, B6).
- **Done when:**
  - `EditorPanel.test.tsx`: "three tabs, the URL holds the tab".
  - `InstrumentList.test.tsx`: "solo, show/hide, reorder, New instrument".
  - `LayoutPanel.test.tsx`: "each group changes the preview and saves with the score"; "Reset".
  - `RecordReview.test.tsx`: "quantizes to 1/8, moves the split, saves to the score".
  - `settings-homes.test.ts`: "Play notes while editing has one home".
  - Screenshots: each tab at all three sizes on the Fantaisie.
- **Owner's question 2:** Flat offers Templates. Should we ship "Normal" and "Jazz" only? Default:
  yes, plus the learner's own saved templates.

### A35: the Player's staves (the part still open)
- **Source:** prompt lines 1387–1420 (A35, last bullet). B7. D20 "Settings" (the Player's own page).
- **Today:** A35 is done apart from Display › Clef (`compliance/part-a2.md:132`). The Player's settings
  page (`widgets/player-settings/ui/PlayerSettings.tsx`) has no On-screen piano link row (R18).
- **Will build:**
  1. Display › "Clef" row on the Player's settings: menu "As written · Treble and bass · Treble
     only". Treble only puts the lower staff's notes an octave up on one treble staff, for learners who
     read treble. Implemented in `widgets/sheet-music/model/played-music.ts` as `clefs: 'written' |
     'grand' | 'treble'`.
  2. A link row "On-screen piano" (`RowLink`) to `/settings/on-screen-piano`, under Display.
- **Done when:** `PlayerSettings.test.tsx`: "Clef: Treble only draws one treble staff"; "links to
  On-screen piano". Screenshots of the settings page at all three sizes.

### A37: the chord views as Chordify does them
- **Source:** prompt lines 1425–1455 (A37).
- **Today:** `widgets/chord-views/ui/BeatStrip.tsx` scrubs the cursor while dragging
  (`useStripMotion`). Grid and Chords over lyrics `scrollIntoView` the line. `SummaryGrid` lists each
  chord once in first-sound order. A tap jumps to its next place (`chordNear`, `chords-from.ts:111`).
- **Will build:**
  1. **Browse, don't scrub.** `useStripMotion` drags and flings the strip without moving the cursor or
     the sound. A tap on a beat or chord calls `practice.jumpToBeatGroup`.
  2. **One follow rule** `useFollow(container, target, { enabled })` in
     `widgets/chord-views/model/use-follow.ts`, used by Diagrams, Grid, Chords over lyrics and the sheet:
     - keeps the playing line a third down, scrolling smoothly;
     - a manual scroll while playing pauses following, and a pill "Back to the playhead" appears
       (bottom centre). A tap returns, or it returns after the idle delay;
     - setting on the Player's settings page, Display: "Follow the music" (switch, default on) and
       "Return to the playhead after" (Off · 3 s · 5 s · 10 s, default 5 s).
  3. **Chordify gap list** in `.scratch/r29/chordify-gaps.md`: diagram size, timeline, loop by
     dragging a range, transpose (T above), simplify, chord summary, count-in, tempo, MIDI follow. Each
     is "have", "differs" or "missing", then built. Known missing: loop by dragging across the strip;
     diagram size "S · M · L" on the Player's settings.
  4. **Summary split**, under segmented "In this song · In order":
     - "In this song": each chord once, with its count ("×12") and small bar marks under it. A tap plays
       and shows the chord without moving the cursor. ⋯ lists its places ("Bar 5", "Bar 13" …), each a
       jump;
     - "In order": one card per change as played (repeats taken), in a wrapping grid with bar numbers
       and section names. The sounding one is marked and followed. A tap moves the cursor.
     `chordNear` goes. New `chordsInOrder(performance): OrderCard[]` and
     `chordsInSong(performance): SongChord[]` in `widgets/chord-views/model/chords-from.ts`.
- **Done when:**
  - `BeatStrip.test.tsx`: "dragging the strip never moves the cursor; a tap does".
  - `use-follow.test.tsx`: "pauses on a manual scroll and shows Back to the playhead; returns after
    the delay".
  - `SummaryGrid.test.tsx`: "tapping a card in In this song never moves the cursor".
  - `chords-from.test.ts`: "In order matches the strip's changes one for one".
  - Screenshots: each view, playing, at all three sizes.

---

## Open questions for the owner (with the default taken)
1. **T:** should the Player's Transpose also write the song (the editor's Transpose button)? Default: no.
   The same control, words and relative offset; writing stays in Edit.
2. **A34:** the editor's key signature: the circle (A5 via D20) or Flat's 15-key grid (A34)? Default:
   the grid.
3. **A27/A29:** the Fantaisie-Impromptu files and the five editors' exports for `fixtures/`. Default:
   make them with MuseScore and Flat, and check A27 on Amazing Grace.
4. **A40:** Templates: Normal and Jazz plus your own? Default: yes.
