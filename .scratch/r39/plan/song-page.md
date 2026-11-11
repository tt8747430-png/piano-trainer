# R39-2: a song's page (`/songs/$pieceId`)

## Premium, for this area

Beside Apple Music's album page and forScore's score info: the music is the picture (the first bars, engraved, as the
cover), one clear next act (Continue from where you stopped), and everything else quiet and in one order.

## Rulings (feedback-log "Song page", "Player views and settings")

- Calm. Play in the floating actions, Edit beside the title, Learned at the header's right.
- No "Learn the song step by step" card; a song with no sections must not look odd; descriptions short or behind ⓘ.
- Details are edited as properties. A loss that can be undone happens at once with Undo (R38).

## Today (shots `.scratch/r39/drawings/today-song-*.png`)

- Phone: the title wraps in two lines beside four round buttons (Edit, heart, Learned, gear); the credits show twice
  (Words/Music beside the cover, then Composer/Lyricist in Details); Key, Time, Tempo and Level as chips; Progressions
  as tall pills; the floating Play covers Details' first row.
- Laptop: the left column holds everything; the right half below the chords is empty.
- Files: `src/pages/piece/ui/PiecePage.tsx`, `PieceHeader.tsx`, `PieceFacts.tsx`, `PieceChords.tsx`,
  `PieceProgressions.tsx`, `SongDetails.tsx`, `YourPractice.tsx`, `SongCover.tsx`.

## Will build (drawn, canvas [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 2)

1. Bar: Back; at the right **Learned** (a toggle that fills when on), the **heart**, **···** (Edit score, Song settings,
   Share, Export…, then Archive, which goes at once with Undo). The song's name appears in the bar once the title
   scrolls away.
2. The **cover**: the first bars engraved on white, the title in serif with the words' author, like a score's first page.
3. The **title** in serif with **Edit** (a pencil) beside it, opening Title and credits (Title, Words by, Music).
4. One **byline**: "Words by John Newton · Music: New Britain…". Credits are not repeated in Details.
5. **Key · Time · Tempo** as one row of three facts. Level lives in Details.
6. **Chords**: mini keyboards with the chord's keys tinted; tap one to hear it (it turns honey). Then the progressions
   as rows: name, Roman numerals, ›.
7. **Your practice**: "9 of 16 bars played through", the line, "6 times · 42 minutes in all · last today".
8. **Details**: Level, Genre, Language, Tags (unset reads "Add tags").
9. Floating: **Continue from bar 9** with its progress line and the round **Play**. The page ends with room under it.

Laptop: the same parts in two columns: the song (cover, title, byline, facts) on the left; Chords in one row of six,
then Your practice and Details side by side on the right. The floating bar is centred under the content, and Title and
credits opens as a dialog.

## Canvas 125 (2026-11-11): progress drawn as the song's bars

- **The bar map:** under Continue from bar 9 and From the start, sixteen cells, one per bar: played in copper, bar 9
  outlined as next, the rest sand; "Bar 1 · Played 6 times · 42 minutes · Bar 16" beneath. It replaces the thin line and
  "9 of 16 bars", so the learner sees where in the song they are, not a percentage.
- **No explanation line:** "Tap one to hear it" goes from Chords; each chord card already says Hear G to a screen reader.
- **Learned** is 44 high to tap, 34 to see.
