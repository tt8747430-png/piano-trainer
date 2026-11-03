# Chords, Scales and keys: how good references do it (R29 research)

Answers the owner's feedback in `../owner/feedback-chords-scales.md`. Facts only; each was checked against theory.
Where a source was thin (Russian jazz terms) the note says so.

## 1. Choosing a chord by its name (C4, C1)

**What the references do**
- **A flat list of names on a root.** pianochord.org lists 28 chords for C, by name: C, Cm, C7, Cm7, Cmaj7, CmM7, C6, Cm6, C6/9, C5, C9 … Cdim7, Cm7b5, Caug7 (no inner groups). https://www.pianochord.org/c.html
- **A grid of qualities beside a root.** iReal Pro's "…" opens a grid of about 42 qualities "from triads and sevenths through altered dominants, sus chords, and minor-major chords"; typing a symbol works too (Cm7 → C-7). https://www.irealpro.com/learn/chord-symbols
- **Root on one side, type on the other.** Easy Piano Chords: root list left, 20 chord types right. PG Music's Piano Chord Dictionary: choose a root, then the chord. https://www.pgmusic.com/pianochorddictionary.features.htm · https://mwm.ai/apps/easy-piano-chords/477997631
- **Wheels: root, quality, extension, bass.** GarageBand's chord editor; slash bass is its own wheel. https://support.apple.com/guide/garageband-iphone/chsab9d1c4c/ios
- No reference builds a chord by choosing "which 7th". All of them name the finished chord.

**Recommendation**
- Top: the chord's name, big. Under it a **Root** strip (12 spelled notes, scrolls sideways).
- Then a **Chord** grid of symbol chips under five family tabs. Each tab holds at most 8 chips, 4 to a row, so a phone never scrolls the picker:
  - **Triads:** C · Cm · C° · C+ · Csus2 · Csus4 · C5
  - **Sevenths:** Cmaj7 · C7 · Cm7 · Cø7 · C°7 · Cm(maj7) · C7sus4 · C+7
  - **Sixths & add:** C6 · Cm6 · C6/9 · Cadd9 · Cm(add9) · Cadd4 · Cadd♯11
  - **9 · 11 · 13:** C9 · Cmaj9 · Cm9 · C11 · Cm11 · C13 · Cmaj13 · Cm13
  - **Altered:** C7♭9 · C7♯9 · C7♯11 · C7♭13 · C7♭5 · C7♯5 · C7♭9♯11 · C7alt
- Each chip carries a one-line name in ⓘ ("Half-diminished seventh, also Cm7♭5"). Every one is a `ChordParts` the engine already builds. Cadd2 is not a chip. It is Cadd9 with D inside the triad (same pitch classes: https://en.wikipedia.org/wiki/Added_tone_chord), so it shows as a voicing of Cadd9.

## 2. Professional names

| Ours | English (textbooks, pro apps) | Russian |
|---|---|---|
| Add a tone | **Added-note (added-tone) chords**; group label "Sixth and add chords" (iReal Pro) | аккорды с добавленными тонами (с добавленной секстой, ноной) |
| Root position / 1st inversion | **Inversion**: root position, 1st, 2nd, 3rd inversion; the bass written as a slash chord, C/E | **Обращение**: основной вид; трезвучие: секстаккорд, квартсекстаккорд; септаккорд: квинтсекстаккорд, терцквартаккорд, секундаккорд |
| Voicing | **Voicing**: close position, open position, drop 2, drop 3, shell, rootless (A, B) | Classical: **расположение** (тесное, широкое, смешанное). Jazz books keep "drop 2", "shell" and "rootless" in Latin; I found no fixed Russian names |
| Left hand plays | **Hand split** / two-handed voicing; jazz: "left-hand voicing" | распределение между руками; левая рука: … |
| ♭9, ♯11 | **Altered tensions** (alterations); 9, 11, 13 are **tensions** or extensions | альтерация, альтерированные ступени; джаз: «напряжения» (tensions) |

Sources: https://en.wikipedia.org/wiki/Added_tone_chord · https://www.irealpro.com/learn/chord-symbols · https://ru.wikipedia.org/wiki/Обращение_аккорда · https://en.wikipedia.org/wiki/Voicing_(music) (drop-n is the n-th voice from the top lowered an octave) · https://ledutu.com/en/learn/jazz/rootless-voicings/ (A: 3-5-7-9, B: 7-9-3-5) · https://people.uncw.edu/russellr/ShellVoicings.html · https://ftp.lgaki.info/virtual/bakalavr/dnevnaya/musikalnoe_iskusstvo/musikovedenie/garmoniya/lekcii.pdf (тесное/широкое).

**Translation traps for `ru`:** never call C6 "секстаккорд", which in Russian means a triad's 1st inversion; write "аккорд с секстой (C6)". English *relative* key is Russian **параллельная**, and English *parallel* key is Russian **одноимённая** (https://bigenc.ru/c/parallel-nye-tonal-nosti-46031b).

## 3. Where inversion, voicing, hands and alterations go (C7, C8)

**What the references do**
- Scaler 2 puts voicing and performance in their own section of the window, beside the chords: Voice Grouping (inversions, octave range, open voicing), and per-chord settings in Edit mode. https://www.soundonsound.com/reviews/plugin-boutique-scaler-2
- GarageBand opens a separate editor with one wheel per dimension (root, quality, extension, bass) and Done. https://support.apple.com/guide/garageband-iphone/chsab9d1c4c/ios
- iReal Pro opens a popover grid from "…" beside the field and keeps the main view clean. https://www.irealpro.com/learn/chord-symbols

**Recommendation**
- **Phone:** under the chord on the keys, one row **Play it as: Root position · Close · One hand ›**. It opens a bottom sheet titled **Voicing** with three segments: **Inversion | Voicing | Hands**. Each option is a drawn mini-keyboard (as C7 and C8 already draw them), and the sound plays as you pick. The sheet starts half-height, so the chord stays visible above it.
- **Laptop (≥64rem):** the same three groups sit in a right-hand **side panel** that stays open, like an inspector, so the chord and its options are both on screen.
- Alterations are not part of the voicing. They are chord identity, so they stay in the Chord grid's **Altered** tab. Added tensions on top of a chord (13 on C7) belong to the existing **Colour notes** card.

## 4. A chord page's Settings (C9)

**What the references do**
- MuseScore: **Chord symbols** style, *Standard* or *Jazz* (superscripts, MuseJazz); note spelling *Standard* or *German* (B/H). https://musescore.org/en/handbook/2/chord-symbols
- Songtive: one switch over the keyboard, **Notes · Degrees · Intervals**. https://www.songtive.com/en/scales/d-major
- Piano Companion: fingering for both hands, staff/keyboard size 1×–3×, keyboard or note notation. https://blog.songtive.com/?p=416 · https://apps.apple.com/us/app/piano-chords-scales-companion/id598574333

**Recommendation** (names are short nouns, each with one plain line under it):
- **Labels on keys:** None · Note names · Fingers · Intervals (1 3 5 ♭7). One choice, because the labels compete for the same key.
- **Fingering style:** Numbers on keys · Hand drawing.
- **Chord symbols:** Standard (Cmaj7, Cm7♭5, Cdim7) · Jazz (CΔ7, C–7, Cø7, C°7).
- **Broken chord:** Up · Up and down. Its speed follows the tempo. "Down" alone is rarely taught, so drop it.

## 5. Scale page vs key page (S8, S12, S1)

**What the references do**
- Hooktheory's key cheat sheet (D major), in order: Key signature, About the key, **The 21 most popular chords in D major**, **Popular chord progressions**, **Songs in D major**, **Relative keys** (B minor, A Mixolydian, E Dorian, G Lydian, F♯ Phrygian, C♯ Locrian). Cheat sheets exist for major, minor and the five other modes, and none for pentatonic or blues. https://www.hooktheory.com/cheat-sheet/key/d/major
- muted.io's D major page: keyboard with hand labels and Play (up and down), **Diatonic chords** (keys 1–7 play them, with inversions and 7ths), common progressions, a degrees table, songs, formula. https://muted.io/d-major-scale
- Songtive: notes, a Notes/Degrees/Intervals keyboard, relative and parallel key, **Chords in the key of D Major**, progressions, and "Other scales on D" (modes, pentatonic, blues…). https://www.songtive.com/en/scales/d-major
- Musicca groups scale types: Major · Minor (natural, harmonic, melodic) · Pentatonic (major, minor) · Blues · Modes (7) · Chromatic · Whole-tone · Other (diminished, bebop, harmonic major, Hungarian minor). https://www.musicca.com/scales

**The distinction:** a **scale** is a row of notes you practise: fingering, octaves, formula. A **key** is a home note and its family of chords that a piece is written in: signature, chords, progressions, songs, neighbouring keys. Only major and minor (and the modes) make keys. A pentatonic or blues scale has none.

**Recommendation**
- One page, titled with what you chose, and two tabs: **Scale** (to play it) and **Key** (to understand music in it). The **Key** tab appears only for major, minor and the modes. For a pentatonic or blues scale the page has no tabs.
- The bar's **D major ⌄** opens a picker with **Root** as 12 spelled notes in piano order. Each black key offers both spellings (F♯ / G♭), and the less usual one is marked. **Type** is a grouped list:
  - **Major and minor:** Major · Natural minor · Harmonic minor · Melodic minor
  - **Pentatonic and blues:** Major pentatonic · Minor pentatonic · Blues
  - **Modes:** Ionian (= major) · Dorian · Phrygian · Lydian · Mixolydian · Aeolian (= natural minor) · Locrian
  - **Other:** Chromatic · Whole-tone · Diminished (half-whole, whole-half)
- No key-signature grid. The signature is shown on the Key tab as a fact.
- Rename S1's "On the keys" to **Show on keys: Notes · Fingers (RH) · Fingers (LH) · Degrees**.

## 6. The chords of the key (S4, S5, S7)

**What the references do**
- Names: "Diatonic chords in D major" (muted.io), "Chords in the key of D Major" (Songtive), "Most popular chords in D major" (Hooktheory, ranked by use). https://muted.io/d-major-scale · https://www.songtive.com/en/scales/d-major · https://www.hooktheory.com/cheat-sheet/key/d/major
- Each chord is shown with a Roman numeral (I ii iii IV V vi vii°) and its letter name. The 7th-chord set is Dmaj7 Em7 F♯m7 Gmaj7 A7 Bm7 C♯ø7. https://www.piano-keyboard-guide.com/d-major-scale.html/amp/
- To hear a chord, you tap it or press keys 1–7 (muted.io). No reference has a "walk" mode.

**Recommendation**
- Make this the first section of the **Key** tab, titled **Chords in D major**, with a **Triads · Sevenths** switch. One row of 7 cards, each with its numeral, name and function (Tonic, Supertonic … Leading-tone; in Russian Т, S, D and the steps). Tap a card to play it. A long press opens it in Chords.
- Replace "Walk the chords" with one button, **Play in order**. Its options sit in a small sheet, all visible at once:
  - **Chords:** Triads · Sevenths
  - **Order:** I to vii · I to vii and back · I–IV–V–I (the primary chords)
  - **Played:** Together · Broken
  - Tempo stays in the transport.
- Drop S5's per-card inversion and voicing (the owner wrote "not the best"). Voicing is Chords' job, and the card links there.

## 7. Chords that contain a note (S6, S10)

**What the references do**
- Harmonising a melody starts from the chords that contain the melody note. I, IV and V together cover all seven degrees, and ii, iii and vi give more choices. https://iastate.pressbooks.pub/comprehensivemusicianship/chapter/11-1-introduction-to-harmonizing-a-melody-theory-exercises/ · https://www.hearandplay.com/main/harmonizing-melodies
- Reverse chord finders list every chord that contains the notes you enter. https://www.pgmusic.com/pianochorddictionary.features.htm · https://app.soundgrail.com/reverse-chord-finder

**Recommendation**
- In the Key tab, a section titled **Harmonise a melody note**. Seven note chips sit on top (D E F♯ G A B C♯, each with its degree); there is no "Keys play" mode switch.
- Pick a note and list the key's chords that hold it, each with the note's role. For **A** in D major: **D** (A is the 5th) · **F♯m** (A is the 3rd) · **A** (A is the root). With Sevenths on, add **Bm7** (A is the 7th).
- Primary chords come first. Tap a chord to hear it with the note on top.

## 8. Progressions and modes on a key page (S9)

**What the references do**
- Hooktheory draws its progressions from the TheoryTab song database and shows counts and example songs (e.g. the most popular, 1,385 tabs). Its levels are Beginner (I ii iii IV V vi), Intermediate (inversions, secondary dominants) and Advanced (borrowed chords). https://www.hooktheory.com/theorytab/common-chord-progressions
- muted.io and Songtive list a few common progressions in numerals plus letters. https://muted.io/d-major-scale · https://www.songtive.com/en/scales/d-major
- Modes appear two ways. Hooktheory shows **relative** modes: same notes, another home (E Dorian, G Lydian… under "Relative keys"). Songtive shows **parallel** modes: same home, other notes ("Other scales on D"). https://www.hooktheory.com/cheat-sheet/key/d/major

**Recommendation**
- Show each progression with its source. Use our songs ("I–V–vi–IV · in 6 of your songs") or name it with its standard name: ii–V–I, the 50s progression (I–vi–IV–V), Pachelbel's. Show no progression without a source.
- Show modes once, as **Same notes, other homes**: B minor, E Dorian, A Mixolydian… (relative). Each opens that scale. Parallel modes live in the picker's **Modes** group.
- Under **Neighbouring keys**: Relative minor (B minor) · Parallel minor (D minor) · Dominant (A) · Subdominant (G).

## 9. Scale playing options (S1, S3)

**What the references do**
- Exam syllabuses name the run by **hands** (separately / together, an octave apart), **motion** (similar / contrary, contrary from the unison tonic), **octaves** (1–4 by grade) and **touch** (legato / staccato). Up and down is assumed, never an option. https://www.scribd.com/document/445011182/ABRSM-Grado-7-pdf · https://uae.mtbexams.com/wp-content/uploads/2021/09/MTB-Piano-Grade-1-Scales-2021-.pdf
- Teachers' guides practise each direction on its own and hands separately before together. https://pianoscales.org/speed-trainer/major-scales.html · https://piano-practice-ai9.pages.dev/
- Practice apps keep the metronome and count-in apart from the scale's shape. https://apps.apple.com/app/id6755628178

**Recommendation**
- Under the scale, a row **How to play: Right hand · 1 octave · Up and down ›** opens a sheet named **Practice**, in this order:
  - **Hands:** Right · Left · Together
  - **Motion** (only with Together): Similar · Contrary
  - **Octaves:** 1 · 2 · 3 · 4
  - **Direction:** Up and down · Up only · Down only
  - **Start on:** the tonic, or any degree
  - **Rhythm:** Even · Long-short · Short-long · Groups of 3 · Groups of 4
- The **tempo** sheet holds only the tempo and count-in. Direction never sits in it.
- Fingering standard ("As the books" / "From the thumb") stays in Settings.
- Russian: отдельно каждой рукой / двумя руками, в прямом / в расходящемся движении, вверх и вниз, legato / staccato.
