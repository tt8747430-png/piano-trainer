# Chordify for piano: its diagrams, its toolbar, its sound, a learner's library

Date: 2026-10-26 · Decisions: [ADR 0101](../../adr/0101-chord-diagrams-on-one-keyboard.md),
[ADR 0102](../../adr/0102-the-players-tools-row-and-its-view.md) (later rounds add theirs) · Follows:
[chord views and song lessons](2026-10-25-chord-views-and-song-lessons.md) (ADR 0099, 0100).

The owner: every Chordify feature but the guitar's (capo, tuning, the tuner, the instrument choice, left-handed),
Transpose and the like included; the Diagrams view working as Chordify's does; the View's choices made plain (the
sheet music's layout read as if it were every view's). The memory-palaces repository (the owner's Mindscape) may
lend code where it has it.

## 1. What Chordify does

Sources:
- the owner's 22 screenshots of the iOS app (`piano-data/reference-apps/chordify/`);
- the song page the owner saved, with its embedded data and its strings;
- Chordify's own scripts, read for how features behave; none of their code is copied;
- the support articles "How to use Premium features", "What are Song Lessons?" and "Lyrics on Chordify";
- the blog posts "Chordify for Piano: 7 Tips", "Introducing Chords over lyrics view" and "Chord progression of
  the month";
- the App Store listing.

chordify.net itself answers 403 to every tool here (a bot check), so nothing was read off the live site.

### 1.1 The song screen

- **Header:** Close, the title, ♡ (favourite), ⋮ (More).
- **Toolbar row under the header:**
  - `VIEW ▾`: named by the view, so `PIANO ▾`, `GRID ▾` or `OVER LYRICS ▾`;
  - `TRANSPOSE`: its button shows the key ("F"), or "(−1)" in the accent colour once moved;
  - `CAPO`: greyed for the piano;
  - `SIMPLIFY`: "replaces complicated chords with simple major and minor chords", greyed where a song has none.
- **Transport panel at the foot:** to the start; play or pause; the tempo ("100%", the BPM under it); Volume;
  `3, 2, 1..` (the count-off); Loop; the video.
- **The web player's views:** Chords over lyrics · Chord diagrams · Chords grid. With Chord diagrams chosen, a
  second control stands beside the views, "Diagram view mode": **Animated · Summary**. A view a song cannot show is
  greyed with "this view is currently unavailable for this song"; a song without words shows Chord diagrams with
  "Chords over lyrics unavailable".
- **"Pick your view"** ("Choose how you want your chords to be presented"): the views, a preview, "Show this when
  opening a song.", and "Start jamming".
- **More:** Add to setlist, Adjust view settings, Share chords…, Export to PDF, Export to MIDI, Add to Offline
  Mode, Report inaccurate chords, Song information.
- **Song information:** the chord summary, the tempo (BPM) and the song's frequency (Hz).
- **Adjust view settings** ("Customize how this view looks"): the view and the font size, − and +.

### 1.2 Diagrams (Animated)

- **The diagrams:** the chord sounding and the next, side by side and the same size (each about half the width).
  The next is all grey, its name under it grey.
- **One keyboard for every chord:** F to B, 11 white keys, with the chord's tones folded into the octave F3–E4.
  - E reads G♯3 B3 E4.
  - C♯m reads G♯3 C♯4 E4.
  - C♯m7 reads G♯3 B3 C♯4 E4.
  - G♯sus4 reads G♯3 C♯4 D♯4, two dots side by side.

  So a song's chords stand in one place and move by a key or two.
- **Dots:** dark on a white key, white on a black key.
- **Choosing an inversion:** each chord has its options, paged "1/N" with arrows, and the one chosen is kept for
  that chord in that song: "Whichever shape you pick for a given chord will continue to show up for that chord
  throughout the song" (7 Tips). The owner set D minor to A–D–F.
- **The beat strip under them:**
  - every beat is a cell, and a thick line starts each bar;
  - a chord is named only in the beat where it changes;
  - no chord is a rest sign;
  - the beat sounding is a filled square, with two empty cells leading so it stands third from the left.
- **The words under the strip:** the line sung in ink, the next in grey; between sung lines a dash whose dot runs
  to the next line ("karaoke-style lyrics in diagram view").
- **While it plays** the header and the toolbar step aside.

### 1.3 The other views

- **Over lyrics:**
  - the strip on top, then the song's chord diagrams pinned in a row;
  - section names in spaced capitals;
  - chord chips over the words, the line sounding dark;
  - a chord line played several times shown once with "x3";
  - the text resizable;
  - on a computer, hovering a chord shows its diagram.
- **Grid ("Overview"):**
  - the whole song's chords at once, bar by bar, the beat sounding filled;
  - a Lyrics button shows the words under it;
  - it fits portrait and landscape.
- **A chord tapped anywhere** opens its sheet: the diagram large, "C♯m⁷ chord", Close and Play.

### 1.4 Sound and time

- **Tempo:** 100% is the song's, in 5% steps from 50% to 200%.
- **Count-off:** one bar counted down in large numbers at the song's tempo, a click on each beat with the first
  accented, then the music.
- **Volume:**
  - a Song slider and a Chords slider (the chords as a simple piano part), with a "max volume" button;
  - the tip: "Turn the Song volume down and the chord volume up to only hear the chords", for instance after
    transposing.
- **Loop:** drag over the beats; it repeats until it is turned off.
- **End of a song:** "Well done! Would you like to play it again …?" Inside a setlist: "Ready for the next song? It
  will be opened automatically unless you want to play again."

### 1.5 Library

- **My library:** Favorites, History, Uploads, Edits and Setlists. Favourites are a setlist of their own.
- **A setlist:**
  - create, rename, duplicate, delete (asked first; it cannot be undone), make public;
  - search in it, add songs by search, reorder;
  - reached from the song page's "+" ("Save to setlists") with "Create new setlist" in it;
  - played song after song.
- **Offline mode** keeps the chords, the diagrams, the metronome and the chord sound.
- **Upload** works out the chords of one's own audio.
- **The 7 Tips:**
  - choose songs by the number of chords (3–5 for a beginner) and search songs by the chords you know;
  - the key is shown in the Transpose area.

### 1.6 Export

- **MIDI:** time aligned (two tracks, the chords and their bass) or fixed tempo (for notation software), the tempo
  in the file name.
- **PDF and Print:** the chords as on screen, the transposition with them, the chord diagrams on the last page.

### 1.7 Song lessons

- **Each section:** its lessons and their progress; the whole song's progress on its overview.
- **A chord lesson:** done once the chord is played correctly **three times**.
- **Transitions:**
  - the whole sequence "to the tempo" with the metronome, its tempo 50–200% from the metronome button;
  - or one change at a time, without the tempo at first.
- **Strumming:** the pattern seen and heard on one chord, its current stroke lit, slowed down at will.

### 1.8 The toolkit

- a metronome: BPM by −10, −1, +1 and +10; 4/4, 3/4 or 1/4; beeps, clicks or a drum beat; a visual beat;
- live chord detection through the microphone;
- a chord trainer;
- a tuner (the guitar's);
- How to use.

## 2. Round 1 — Diagrams as Chordify's (ADR 0101)

1. **One keyboard.** Every chord diagram is drawn on the same keys, **F3 to B4** (11 white keys): the Diagrams
   view, a chord's sheet, the chord summary (Over lyrics, the song's page, Song information) and a section's page.
   A section's learning keys under the chord's sheet (`ChordLearning`) show that range too. `KeyDiagram` is drawn
   on the range its caller gives; `diagramRange` no longer draws chord diagrams.
2. **The chord's place on it** (`diagramChord`), by default. Each tone sits at its key from F3 to E4: the tones
   folded into that octave, as Chordify draws them.
   - **A slash chord whose bass is one of its tones** (C/E) has that tone lowest: the inversion its symbol names.
   - **A slash chord whose bass is not one of its tones** (C/B♭) has its bass at its key from F3 to E4, drawn as a
     ring, and the chord's tones close above it, from its first tone over the bass.
   - **A chord of five notes or more** (ADR 0035) folds the same way, its root not lowest and no ring.
   - **What it drops:** the old rule, the right hand's voicing as the Player plays it with the bass it leaves to
     the left.
3. **An inversion per chord.** A chord of three or four notes can be drawn in each of its inversions (Root · 1st ·
   2nd · 3rd, close, every key from F3 to B4) that fits the keys.
   - **Choosing it:** a chord's sheet chooses with the kit's `InversionChoice`. An inversion that does not fit is
     greyed and says so; a slash chord or a chord of five notes or more has the choice greyed with its reason.
   - **Keeping it:** the choice is kept for that chord in that song. It is a new saved store, `pt-diagram-
     inversions` (`entities/diagram-inversion`, by piece id and symbol as played, in the backup), written through
     `features/choose-diagram-inversion`. Choosing the default's inversion again forgets the choice.
   - **Where it shows:** every diagram of the chord in that song shows it.
   - **What it leaves alone:** it changes the diagram, not what the Player plays: Wait mode takes any inversion
     (it checks pitch classes).
   - **Where there is nothing to keep it by** (a walk, a progression, an exercise), the sheet has no choice.
4. **The Diagrams view, Animated:**
   - the chord sounding and the next, side by side and the same size, each up to half the room (28rem at most);
   - the next greyed as the kit mutes it;
   - its symbol under each, the sounding one in ink and the next muted;
   - no third or fourth chord at any width;
   - where no chord sounds yet, the next alone saying it is next, as now.
5. **The beat strip** (Over lyrics' and Diagrams'):
   - a chord is named only in the beat where the chord changes: a bar that goes on with the chord before it is not
     named again;
   - where the music turns to no chord (a bar of none), its first beat shows a rest sign (𝄽 in the music font);
   - the rest as now.
6. **The words under the strip:**
   - the line being sung, its words in ink as the music reaches them and the rest muted, word by word (by each
     syllable's tick where the line has them, else by segment);
   - no bar under it;
   - the next line muted under it;
   - between lines that sing, a dash in the line's place whose dot runs to the next line's first word, the next
     line under it.
7. **Summary, Diagrams' second mode** (ADR 0102 adds its switch):
   - the beat strip;
   - the song's chord summary as diagrams in a grid: two a row on a phone held upright, three from a tablet's
     width, four on a laptop;
   - the chord sounding marked (its card outlined and its symbol in ink);
   - each card opens its sheet.

   `ChordDiagrams` takes `mode: 'animated' | 'summary'`, animated by default, until Round 2's setting feeds it.
8. **The keys at the foot, in the chord views:**
   - **in Listen mode** they mark the chord sounding as its diagram draws it, its keys kept in sight;
   - **in Wait mode** they mark what Wait mode waits for, as now.

   A tune's notes are heard, not marked, there.
9. **Tests:**
   - the fold gives Chordify's keys for E, C♯m, C♯m7 and G♯sus4 (§1.2);
   - D minor's 2nd inversion is A3 D4 F4;
   - A major's 2nd inversion does not fit;
   - C/B♭ has its ring;
   - a five-note chord is folded;
   - the strip names a chord once over bars that repeat it;
   - the words light as the beat moves;
   - the summary marks the chord sounding;
   - a choice kept shows on another screen of the song.

## 3. Round 2 — The View by view, and the Player's tools row (ADR 0102)

1. **The tools row.** Under the Player's bar, one row at every size, as Chordify's toolbar:
   - **The View, named by the view shown** with a chevron ("Diagrams ▾"), opens the View menu. Round 3 adds
     Transpose and Simplify after it.
   - **How it looks:** quiet text buttons, each its icon, its name and, where it has one, its value. They are
     equal widths on a phone held upright and packed to the row's start from a tablet's width.
   - **The Player's bar after it:** Close · Practise|Edit … MIDI · Setup · More. The eye leaves the Player's bar;
     the editor's View stays the eye in its bar, as it shows the score alone.
2. **The View menu, the Player's**, top down:
   - **"Show the music as"** with an ⓘ that names each view in a line, over the four tiles.
     - **Greyed tiles:** a view the music cannot show is greyed, its reason its tooltip. Chords over lyrics needs
       words; Diagrams and Grid need chord symbols.
     - **Falling back:** a saved view the music cannot show falls back, Chords over lyrics to Diagrams and Diagrams
       or Grid to Sheet music. The setting stays for the songs that can.
   - **Ask each time a song opens:** a switch (`scoreView.askOnOpen`, off), Chordify's "Show this when opening a
     song". On, a piece's Player opens with its View menu open.
   - **The view shown's section,** headed by its name, holding only its own:
     - **Sheet music:** first its **Layout**, Pages · Scroll down · Scroll across, with an ⓘ ("On A4 pages as
       printed; in lines one under the other, scrolled down; or in one line, scrolled across"); then Staves, Chord
       symbols, Chord positions, Lyrics, Finger numbers and Note names.
     - **Diagrams:** first its **Mode**, Animated · Summary (`scoreView.diagrams`, animated), with an ⓘ; then
       Lyrics.
     - **Chords over lyrics and Grid:** none yet; Round 7 adds theirs. A view with nothing of its own has no
       section.
   - **"Every view":** Keys.

   **The editor's View** (the eye): Layout, Staves and the sheet's switches, then Keys; no tiles and no view
   heading.
3. **Names.** The layout reads Pages · Scroll down · Scroll across (was Pages · Scroll · Panorama), and in Russian
   «Страницы · Прокрутка вниз · Прокрутка вбок». The values kept are unchanged.
4. **While Diagrams plays** the bar and the tools row step aside, as the dock does while the music is read. They
   come back when it stops, or at a tap on the screen's free room.
5. **`pt-settings` v10**: `scoreView.diagrams`, `scoreView.askOnOpen` (ADR 0038: a new version, no migration).
6. **Tests:**
   - the row names the view and opens the menu;
   - each view's section holds its own and nothing of another's;
   - a greyed tile, and the fall back;
   - Ask each time opens the menu;
   - the editor's menu has no tiles;
   - the bar steps aside while Diagrams plays.

## 4. Round 3 — Transpose and Simplify

1. **Transpose** in the tools row, its value the key the music is in (C♯, B♭m).
   - **Its popover:**
     - − and +, a semitone at a time;
     - the key it lands in;
     - how far from the song's key ("−1");
     - Reset to the song's key.
   - **Spelling:** a key is spelled as its signature is simplest.
   - **Where it lives:** it replaces the key field in every Player Setup that has one. It is kept per piece as the
     key is now (ADR 0022).
   - **A recording** plays in the song's own key alone, and the popover says so where it is silent.
2. **Simplify** in the tools row, a switch, pressed while on.
   - **What it does:** every chord is shown and played as its plain major or minor triad on its root: minor where
     it has a minor third, major otherwise. A slash chord's bass and the added notes are dropped.
   - **Greyed** with its reason where the song has nothing to simplify.
   - **Kept per piece** as a kept param.
   - **On a song written in degrees** its Chord size stays in the Setup; Simplify on plays triads whatever it says.

## 5. Round 4 — Sound: count-in, volume, tempo

The Player has a metronome and a count-in already: the Setup's practice toggles, `metronome` and `countIn`.

1. **The transport gains Sound** (a speaker), its popover holding:
   - **Count in:** one bar counted down large over the music at the tempo playing, a click each beat with the
     first accented;
   - **Click:** the metronome while playing;
   - **Volume, each a slider:** the right hand, the left hand, the staves over the piano, the recording and the
     click;
   - **"Only the chords":** the recording down and the piano up.

   The two switches leave the Setup's How it plays: one place each.
2. **Tempo:** the learner's speed from 50% to 200% of the song's, in 5% steps, where the tempo popover offers
   speeds. `TEMPO_RANGE` follows.

## 6. Round 5 — The learner's library

1. **`pt-library`:** favourites, ordered, and setlists, each with an id, a name and its pieces in order. It joins
   the backup.
2. **Favourites:**
   - a ♡ in the song's page bar and "Add to favourites" in the Player's More;
   - shown as the first setlist, "Favourites", which cannot be renamed or deleted.
3. **Setlists:**
   - a page each (`/songs/setlists/$setlistId`): its songs in order, reordered by drag (memory-palaces'
     `useSortableList`, `moveBlock` and `order.ts` engine over dnd-kit);
   - renamed in place (its `EditableTitle`'s behaviour), duplicated, deleted (asked first), and added to by
     search;
   - Play: the first song, then each song's end offers the next. It opens by itself unless played again.
   - "Add to setlist", from the Player's More and the song's page More: a sheet of the setlists with "New setlist".
4. **Songs** opens on the learner's library:
   - Favourites, the setlists and Recently played (from what is practised now);
   - "Songs I can play": tick the chords you know, and the songs that use only those are listed.

   A song's row says how many chords it has.

## 7. Round 6 — Share, print, MIDI, song information, sections

1. **Share chords** for every song: a link; one's own songs carry their music, as now.
2. **Export to PDF / Print:**
   - the view shown as it reads (Over lyrics with its words, the Grid, or the sheet music's A4 pages);
   - the transposition and Simplify with it;
   - the chord diagrams on a last page.
3. **MIDI:**
   - the tempo in the file name;
   - with a recording, "Time aligned" next to "Fixed tempo".
4. **Song information:** the song's frequency where a recording has its own tuning (A = 440 Hz otherwise), and a
   word where it is not 440.
5. **Sections:** a Sections button in the Player, a list of the song's sections; one tapped takes the cursor there.

## 8. Round 7 — Chords over lyrics and the Grid

1. **Over lyrics:**
   - its section gains the chord diagrams pinned under the strip (a switch) and the text size (− and +, kept);
   - on a computer a chord hovered shows its diagram;
   - a line of chords played again in a row shows once with ×N.
2. **Grid:** a Lyrics switch, the words under the beats they are sung on.

## 9. Round 8 — Song lessons by Chordify's rules

1. **A chord lesson** is done once the chord is held three times, its count shown (1 of 3).
2. **A change in time** opens the Player in Listen with the click on.
3. **One change at a time** opens it in Wait mode.
4. **A pattern lesson** loops a bar of the pattern on one chord, its notes lit as they sound.

## 10. Round 9 — Progressions and the songs that use them

1. **A progression's page:**
   - its chords as diagrams (the same as the Player's);
   - "Songs with this progression", found in the songs in any key, each opening at the bars where it is.
2. **A song's page** names the progressions it uses.

## 11. Round 10 — Metronome and How to use

1. **Metronome**, a Practice page:
   - BPM by −10, −1, +1 and +10, and tap tempo;
   - 4/4, 3/4 or 1/4;
   - clicks, beeps or a drum beat;
   - the beat shown.
2. **How to use:** a short guide from Settings, in both languages.

## 12. Not built, and the owner's decisions

- **The guitar's:** capo, tuning, the tuner, the instrument choice, left-handed.
- **Not needed:**
  - Add to Offline Mode, since every song and its recording already work offline;
  - Report inaccurate chords, since there is no server and Edit corrects them in place;
  - Generate Lyrics (AI on Chordify's servers), since the words are typed in the editor.
- **The owner decides:**
  - accounts and sync across devices (a Supabase project; memory-palaces' sync cannot be lifted in pieces);
  - YouTube play-along (online only, each song's link and its bar 1);
  - importing audio for its chords, and detecting chords through the microphone (one sound-analysis engine; less
    sure than Chordify's servers).

## 13. Each round

1. Test first (`tdd`).
2. Run `npm run typecheck && npm run lint` and the tests the change reaches.
3. Take screenshots at a phone held upright (390), under 360 (320), on its side, a tablet and a laptop; fix
   what they show.
4. Write the ADR and the glossary rows; CLAUDE.md is updated at the merge.
5. Commit each fix; push the branch, then main; report briefly.
