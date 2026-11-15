# What the owner has asked for, by area

Standing rulings, latest words first where they changed. Read the area before changing it, then check the code: a point here
was either built or is still open. Add a ruling here the same day it is given and delete what it overrules (git keeps it; nothing is struck through). Quotes are the
owner's, typos fixed.

## Score editor

- **Loop round 35, the phone's printed title as the Editor board's:** 21 in the book serif over the lines (it was 24), 30 from a tablet up as the EditorLaptop board's 29 (2026-11-15).
- **Loop round 34, the keys under the sheet alone beside the docked panel (EditorLaptop):** on a laptop the keys run from the screen's edge to the panel's hairline, and the panel runs on to the screen's foot, as the board draws them; they no longer pass under the panel (2026-11-15).
- **Loop round 31, the tools stay in place, greyed, as Flat's (owner, 2026-11-15: "make the design exactly like the flat editor"; replaces R32-B's "only the tools that act on what is chosen are drawn"):** with no note chosen, Pitch, Articulations, Ornaments, Dynamics and the tempo marks keep every key in their place at 40%, disabled, "Choose a note" their tooltip; the phone's row the same; no line of text stands in their place (2026-11-15).
- **Loop round 30, the palette's section titles in the sans** (15, 600, ink), as the Editor boards draw them, no longer the book serif. The laptop bar keeps no title: the score prints it where it is edited, so the board's title beside Close would say it twice.
- **The editor's foot reaches the screen's edge, as Flat's:** what stands last (the keys, else the palette) runs on under the home indicator, its own paper filling the inset, instead of a bare band of page under it.
- **The keys as Flat's (owner, 2026-11-15: "it doesnt make ant sense for the keyboard to close like thet, make like the flat editor does"):** unfolding the palette no longer folds the keys into a "Keyboard" strip; they step aside under the open palette and come back as it folds, their own state untouched; the piano button beside the selection is their one switch, and hidden they leave nothing behind (the strip is gone from the editor).
- **The page view as Flat's (owner, 2026-11-15: "also the page view"):** the pages' canvas reaches the screen's edges with no rounded frame round it; each page's number stands at its head's outer corner, right on an odd page and left on an even one, as Flat and an engraver print it (the Player's pages too).
- **The palette as Flat's (owner, 2026-11-15: "why don't you make the design exactly like the flat editor"; `flat-score-editor` IMG_4449–4485 and the owner's 17:30 shots):** folded, the chosen category's tools in one row of bare glyphs in soft ink, the chosen on a sand wash; under them, at the sheet's foot, the categories as Flat's tab bar of signs (♩, ♭♯, >, tr, ppp, the barline, 𝄞, ♯♯, 4/4, the repeat, Aa) in a sand pill, each named in its tooltip, and the button that unfolds the palette beside it; unfolded, every section a ruled table of 44px cells in a hairline box, a wide key two cells. The tabs' short names are gone (en, ru). Canvas v204.
- **No fog at a strip's end (owner, 2026-11-15: "and such fog at the end of the stripe for scrolling is not good"):** the palette's category strip and its row of values scroll sideways with no fade at either edge; the next item is simply cut by the edge, as Flat's palette is (`flat-score-editor` 01–03).
- **Loop round 28, the quiet key name by Night:** a plain key's name is the key's own ink at 60%, not the page's soft ink, which vanished on a light key in the dark theme; "C3" reads on every keyboard, Day and Night.
- **Loop round 28, one keyboard as the boards draw it (owner, 2026-11-15: "the keyboard is not consistent across the app with new design"):** a plain key's name ("C4") is 12, medium, in soft ink, a lit or marked key's label bold in its own ink, on every keyboard (Practice, the Player, the editor); a white key is never narrower than the phone boards' 26 (about two octaves across a phone), the editor's keys included, which narrowed to 22 to hold both hands (2026-11-15).
- **Loop round 28, the editor's bar as its board (owner, 2026-11-15: "but the headers still dont match"):** no band of paper and no hairline; Close a 44 glass circle; Play · Edit one glass pill of 44 segments, 15px, Edit filled in ink; Undo, Redo and ··· together in one glass pill. The Player's title on a phone takes all the room its buttons leave, so "Words: John Newton · Music: New Britain" shows as the board writes it (2026-11-15).
- **The keys hold middle C when the caret has nothing (loop round 18):** with no note at the caret (a new score, an empty bar, a rest with no hand under it), the editor's keys centre on C3 to C5 as the Editor boards draw them, instead of sitting at the bottom of the score's span; with notes at the caret they still follow them.
- **Review your recording ported to its board** (canvas 195): Quantize's five values in one row (Segmented wraps five only past 20 characters, words, never values), and a flush group pads its switch rows 16 itself, so Hide raw notes and Hear notes no longer touch the card's edge.
- **The takes are drawn** (canvas 194, loop; the Takes board): the list (Play in a quiet circle, the name to its page, length and tempo, ··· with Review, Download, Delete at once with Undo), its empty state, and Review your recording as its page with Back in the header: the take as notes, the roll with its split point, Quantize as one row of five (1/4 1/8 1/16 1/4t 1/8t, never 3 + 2), Hide raw notes, Into ›, then Discard and Save to score. The editor's "Takes: 3" opens it.
- **The recording review's Back is in the sheet's header,** as every sheet's page (loop): the "‹ Back" row in its content and `SheetBack` are gone.
- **The recording review's Discard goes at once, with Undo** (R38, loop): the take is back on the Takes page with "Take deleted · Undo"; "Discard this recording?" is gone.
- **A take's Delete goes at once, with Undo** (R38, loop; the board's "Take deleted · Undo brings it back"): from its row's ··· and its page, "Take deleted · Undo" puts it back in its place; the "Delete this take?" dialog is gone. Toasts now sit above every sheet and dialog (z-60), so an Undo said from the Takes sheet is seen and pressed.
- **Loop round 24, R38 in the editor:** deleting an instrument (or hiding the piano) happens at once, "Deleted
  Voice · Undo" in its toast; Undo steps the score back and restores the staves' view; no question, no "Delete…"
  (2026-11-15).
- **The Editor board brought to the ruled tabs (loop, 2026-11-15, canvas 187):** the board still drew Notes ·
  Accidentals · Articulation · Dynamics · Lines · Bar · Text; it now draws the eleven the app holds, each item where
  `EditorPalette.tsx` keeps it (the slur and fingering in Articulations, the pedal in Dynamics, the octave lines in Pitch).
- **One home each, as Flat (2026-11-05):** "we can at the same time edit the time signature from the settings and from
  the palette which is strange". The time signature, key and clef are set in the palette's category, which their
  printed signs open; the title opens Title and credits; the gear holds only what the score does not print.
- **Only what applies (2026-11-05):** "show only the actions relevant at that time like the write as common in the 5/4
  is not relevant and is weird that it is shown but is disabled".
- **The palette as Flat's, its menus too (2026-11-05):** "this menu in the palette doesn't follow how the flat editor
  does this … as close as possible as the flat editor and its ui and its management and features". Every section in
  one scroll; Time signature as Flat's tiles with Customize; Key signature and Clef bare tables; Tempo in Measure.
- **Professional wording (2026-11-05):** "write professionally, not plain words": precise notation terms and concise
  sentences, as Apple, Flat, MuseScore and Dorico write them, in English and Russian.
- **A real notation app:** "proper scores, proper functions like a real music notation software". Like Flat's: "the same
  features and same music notation and same icons and styles". No hand separation, pattern adding or verse adding inside it.
- **Laptop:** a docked side panel and a note-entry toolbar, never a folded bar at the foot ("annoying and not movable").
  **Phone:** a bottom sheet that shrinks the score, usable as Sibelius, with no page overflow. All staves the same width.
- **Palette:** a real card that keeps its height between tabs and never flickers. Folded, one scrollable row; open, the
  sections as structured, animating well. Tools that only repeat a tap on the sheet go. Navigation and delete leave the note
  tools.
- **Menus:** names fit and say what they do. Bar length and clef change are not "Add". Text terms (dolce) read before
  opening. Real terms: crescendo. Each action its own meaningful icon, never one eye for all. Repeat icons fit.
- **Fingering** is an option where it belongs, never a palette mode.
- **Notation we have, as Flat has:** 64ths, tuplets, octave lines, glissando, every articulation and dynamic, repeats ×N,
  endings 3–4, page breaks, bar repeats, multi-bar rests, tempo changes, Roman numerals, free text, two-note tremolo, grace
  notes of both kinds. Shortcuts in every tooltip; the chord wizard.
- **Editing on the score:** everything printed is editable there. No staff selector. A note chosen, then a value tapped,
  changes that note, and the edge between editing and adding is obvious. Delete goes back note by note. Drag a note up and
  down. Chords typed, or chosen with the app's full chord interface.
- **Staves** are plain: add, remove, rename, hide. Hiding never deletes notes; a toggle never clears the score. A song can
  be a single staff.
- **Every song is editable.** Where something cannot be, the learner is told why.
- **Recording:** the learner chooses what plays along and what shows. The pedal prints one mark per press.
- **The editor's draft (canvas 135, 2026-11-11):** "no roles, no edit mode": a built-in song's original is edited by an editor as a draft under a Publishing pill with Publish…, Versions and Discard changes; what reaches every learner asks first.
- **The tempo's pickers say their name once (loop 22, 2026-11-15):** Beat and Tempo text stand at the row's start, so
  their pickers show the value alone (♩, None), in the editor's Tempo sheet and the New song sheet alike.

## Pickers and tempo

- **Time signature:** Current and Pickup columns, numbers stacked large on staff lines as wheels; a cut or common switch; ✗ ✓
  at the bottom right. Every meter, such as 2/2, 3/2, 5/4, 6/4, 7/4, 3/8, 9/8.
- **Key:** a key-signature grid like the music editors', 1–7 sharps over 1–7 flats, the chosen tinted. **No circle of fifths
  as a picker.** C♯/D♭ written as the reference apps write them.
- **Clef:** a bottom sheet with a grid of every clef and its 8va, 8vb, 15ma, 15mb.
- **Tempo:** a large accent circle with BPM and its word, beat units below; hold and swipe to a full-screen ruler, Largo to
  Presto.
- **One control each,** one key picker, one stepper and menu style.

## Player and editor together

- **Loop round 32, a key down and the chosen note's keys in sky:** the boards' piano paints a key down `#85B8DC` (`--key-down`), the score's selection colour; the app had painted it and the editor's chosen keys honey, the one action's colour. Every keyboard now (2026-11-15). The editor's credits line reaches 44 under the title (it was 38).
- **Loop round 32, the Keyboard button wears one glyph:** the keys, whatever the place shows; its caption says 3D, 2D or Off (it had swapped to a hand or a crossed eye). The Player boards drew a grand piano there and now draw the keys too, the one piano glyph (2026-11-15).
- **One score in two modes:** "I don't like how the header looks with this bar under the header". One designed header, the
  same transport at the foot, Edit straight from the Player, nothing jumping.
- **One gear per screen** (Flat's), Edit beside the title,. Settings never scattered over four menus.
- **Transpose** works exactly the same in both: semitones, the key it lands in, Apply to key or chords, a preview. No circle
  of fifths.
- **Floating controls** hide when the learner taps elsewhere, reliably. Nothing traps a click.

## Sheet, selection and playhead

- **Names:** Page view, Vertical scroll, Panorama.
- **Quality:** always sharp at every zoom. The page view looks printed: margins, line breaks, chord sizes. Study real scores,
  LilyPond and abcjs. Verovio, the owner's choice.
- **The page canvas** floats in infinite space, dragged and pinch-zoomed. Vertical scroll takes the full width, every line
  equal.
- **Selection:** tight to the notes, padded from neighbours, the same everywhere; one note of a chord can be chosen; a range
  is exactly the bars chosen; it works from the keyboard. A note clicked in the Player jumps to that note.
- **Two marks:** what is chosen and what is playing are separate; playing is one line across the staves in sight.
- **Chord names** are not cluttered or too big; a long chord never breaks the layout.

## Player views and settings

- **Loop round 39, Parts' hand tiles as the board's PART:** 40 square at 4 corners, the hand 24 in its deep paint (brick #9A4B3A, lilac #6A5988) on its wash, by Day and by Night; it was 10 corners and the light paint, faint on the wash by Night (2026-11-15).
- **Loop round 39, the gear's Share link and ··· as the PlayerApp board:** white circles with a 6% ring and a 1px shade (`0 0 0 1px`, `0 1px 2px` at 8%), not the floating elevation (12% and a 3px 8px shade); by Night the hairline alone (2026-11-15).
- **Loop round 35, Arrangement or Accompaniment (owner, 2026-11-07; the PlayerApp board):** the gear's head is two radio cards, each holding its own choice in 48-tall rows: Arrangement, the song's own pattern, with its Level; Accompaniment, played from the chords by a pattern you choose, its Pattern › opening the Accompaniment page (the pattern and its hands, Inversion, Swing), no longer a row of its own and no longer heading itself twice. Choosing Arrangement or a level brings the song's own pattern back; choosing Accompaniment opens its page (2026-11-15).
- **Loop round 35, the gear's Arrangement card (owner, 2026-11-07; the PlayerApp board):** what you play heads the Player's Settings under the song: the Arrangement card, chosen, its Level row under it, Easy · Simplified · Original, easiest first (Simplified greyed with its reason where it changes no chord), and a Scoring row (your own version, the piano alone, with the voice) where the song has more than one; the Version page and its row are gone. A radio card without a picture takes no tile (2026-11-15).
- **Loop round 34, no double gap in Player settings:** an empty column for the screen's own choices stood between the song's head and the first group, so they stood 41 apart; empty, it now takes no room, and they stand the sheet's 20 apart (2026-11-15).
- **Loop round 34, Play wears the board's metronome (`METRO`):** the Practice button and its Play card draw the board's case, pendulum and bar (`PlayAlongIcon`), not Lucide's metronome; Wait keeps the hourglass (2026-11-15).
- **Loop round 34, the laptop's keys button says Piano:** the sheet it opens, by name, as the PlayerDesk board; a phone's caption keeps the mode (3D, 2D, Off) (2026-11-15).
- **Loop round 34, the laptop's transport names the hands in full:** Both hands, Right hand, Left hand (Обе руки…) beside the picture, as the PlayerDesk board; a phone keeps Both under it (`captionWide` on the bar's button) (2026-11-15).
- **Loop round 33, the Player's bar band as its board:** 12 over the buttons and 8 under them, a 64 band under the status bar (it was 8 and 4, 56); the editor's floating bar keeps no band (2026-11-15).
- **Loop round 29, the laptop's views pill as the PlayerDesk board:** a 44 glass pill padded 4 holding four 112 × 34 segments at 14, 600 (Sheet · Diagrams · Grid · Lyrics), the shown filled in ink; the one pill (`ViewPill`) takes a size, the editor's Play · Edit keeping its 44 segments.
- **Loop round 25, the Practice sheet's Tempo heading (PlayerApp):** the tempo and the metronome sit under "Tempo", the group's caps label, as the board heads them; the tempo face stays the Metronome's one dial (2026-11-15).
- **Loop round 25, radio cards as the boards' (PlayerApp's mode tiles, CARDV):** the chosen card in a honey wash ringed 2px in the deep honey, its dot honey with a white tick, the others white with a ringed dot; Wait · Play stand side by side, 14 round with 44 by 40 tiles, and cards holding rows (the 3D piano) stack, one `RadioCards` (2026-11-15).
- **Loop round 25, the Settings' head as the board's (PlayerApp):** the song's tile with its two notes, its title 17 bold over "G major · 3/4 · 80 BPM" in 13, Share link and ··· white circles lifted a little, Edit score 44 tall with 12 corners in 15 semibold (2026-11-15).
- **Loop round 25, the transport's groups as the board measures them (PlayerApp, PlayerDesk):** three glass groups 56 tall, 4 inside, 8 apart, every button 48 tall (‹ › 44 wide, Play 48) on a phone from 390px; on a laptop each picture stands beside its word in 15px semibold, 12 before and 16 after (2026-11-15).
- **Loop round 25, the transport floats over the music (the board's PlayerApp):** its three glass groups stand over the music's foot with no band or hairline under them, the music running on beneath to the screen's edge and scrolling clear of the keys' window, else of the transport; the R31-P row at the foot is gone (2026-11-15).
- **Loop round 24, the title in the bar, no floating circles (owner, IMG_6045–6056: "the titles doesnt look good and should be in the headers ... no settings in the view buttons. floating buttons with backroung doesnt make sense"; canvas v201):** the Player's bar is a band of paper with its hairline: Close and the gear plain icons, the song's title (the page's heading) and who wrote it beside Close; the views a pill in the middle from 640px, on a phone one button wearing the view shown that opens the four as a menu. A view button only shows its view. No view prints the title any more (lines, across, pages, Grid, Diagrams, Lyrics); a printed score keeps its own (2026-11-15).
- **Loop round 24, the loop's grips drag across lines (owner, IMG_6045–6056: "the drag holders to loop doesnt work"):** a grip was held to its own line, and a phone lays one or two bars to a line, so it could not move; now each line marks its bars, a grip follows the finger over the whole score (the window keeps the drag when the grip moves to another line), the start from the first bar to the loop's end and the end from its start to the piece's last bar, and the click a drag ends with is swallowed. The score's scroller keeps 12px each side so the end grip's tab is never cut (2026-11-15).
- **Loop round 24, the piano a window over the music (owner, IMG_6045–6056: "piano should also be floating and draggabble and resizeble from all the angles"; canvas v202):** the keys, 3D or 2D, are a rounded, lifted window over the music's foot above the transport (the phone's 8px from each side, the laptop's 1100 wide and centred, as the board draws them), never a docked row. Its grip along the top moves it (the arrow keys too; a double tap puts it back); a handle at each corner and on the left, right and bottom sizes it. Each screen size keeps its own window; the music scrolls clear of it and the first tip sits above it. The keys' dock setting no longer acts in the Player; the divider is gone (2026-11-15).
- **Loop round 24, the Parts sheet (owner, IMG_6045–6056: "hands settings should be refactored"; the board's Parts, R43 canvas 119):** the transport's hands open Parts: a card for each hand, the right first, with its picture in its paint, its name and a switch for whether you play it (one stays on), its volume (how loud the app plays it when you don't; 0, not at all) and, on the hand you don't play, Dim. Left · Both · Right, Hear the other hand, Player settings › Hands and the other hand's Hide are gone: the volume and Dim say it all, in one home (2026-11-15).
- **No pedal under silence (loop round 18):** music with no chord symbols and no pedal marks is pedalled bar by bar only where a bar sounds a note; a new song's empty bars, or a bar of rests, carry no Ped. and no pedal is held.
- **Loop round 24, no explanation under a pattern:** the Accompaniment page's Pattern row is its name alone (a
  mix still says "Left hand changed"); the Pattern list shows each pattern's two hands as bars, as the hands' lists
  do, with a line only for why one cannot be chosen ("Needs a melody staff"); what a pattern is stays in Pattern's ⓘ
  (2026-11-15).

- **Loop round 19, the Player's Piano sheet to its board (r43, `KBVALS`):** the 3D card holds Angle (Seat · Above) and Hands on the keys, and Range follows the cards: Fit the song · 61 keys · 76 keys · 88 keys (C2–C7, E1–G7, A0–C8), each kept in the Player's own settings. Every segmented control is the board's SEG: each segment as wide as its words, never wrapped, the room left shared (2026-11-15).

- **Loop round 17, nothing under the bar:** the progress line along the score's head is gone, as the Player's boards draw none; the bar stands bare over the paper (2026-11-15).

- **Loop round 15, chord symbols raised as the boards set them:** over the staff, in the Player and the editor, and in the engraving, a symbol's numbers and alterations are raised (G⁷, C♯m⁷♭⁵) and its accidentals printed as signs, one splitter (`symbolParts`) shared with the symbols in a line (`ChordText`) (2026-11-14).
- **Loop round 14, who wrote it under the title, as the boards print it:** one quiet line, "Words: John Newton · Music: New Britain" in 13px, centred under the Player's title and at the right of the editor's and a printed page; a built-in song's credits fill the score's lines where it has none, so every song prints them (2026-11-14).

- **Layout's one home in the Player is its view's settings (loop round 11, the Player board's view sheet):** the
  board draws Layout as the Sheet section's first row, before Show; the floating pill over the score is gone from the
  Player. The three layouts stay (Songscription's Endless tall). The editor keeps its gear's View on a phone and the
  pill beside its docked panel.
- **The tip that teaches (loop, 2026-11-13):** the first tip says what a
  learner cannot guess ("Tap a note to start from there, then press Play"), never what the Play button already says.
- **Songscription's score page is a Player reference (2026-11-11):** "will this help you", "ok document this": the owner's saved copy, read for its controls, is written up in `.scratch/r39/plan/player-reference-songscription.md` with five proposals for the Player canvas (Endless tall, tempo by dragging, the song's keys only, shortcuts beside their names, Reset in the Key sheet). The export itself never enters the repo: it shows the owner's account and carries a recorded song.
- **Musicca's chord player page, read (2026-11-11):** the owner's export of musicca.com/chord-player is compared with our Chord player in `.scratch/r39/plan/practice-chord-player.md` (Reference): Variation per section, Time signature, Download as audio, beat ticks and edge-dragged lengths, typed chords, draggable chords. Exports stay out of the repo.
- **A sheet's height is checked, not assumed; a tiny target the tap ignores becomes the real target (R43, canvas
  122):** "the piano settings in the player are not correct height and the rows don't have enough place". Rows shrank
  in a flex sheet and the sheet ran under the bar. Every sheet's children are `flex: none`; a phone sheet stops below
  the bar. Played through's 18-wide bars practised four at a time anyway, so the four became the button. The Chord
  player got the one Piano sheet and the same live 3D code, and the Player got Night through the Chords page's map.
- **One thing, one markup, imported by every page that has it (R43, canvas 121):** "merge them and make proper one
  piano settings". The Player's and the Chords page's piano sheets had drifted (Angle on one, Hands on the keys and
  the Range strip on the other). Now `piano_sheet.py` draws the one Piano sheet for both; only the choices follow
  the page (a chord's octaves, a song's own piano).
- **Measure before saying a turn is done (R43, canvas 120):** "did you check the paddings, the spacing and all other?".
  A screenshot is not a check. Each publish runs `spacing_measure.js`, `layout_check.js` and the hit-area count on every
  board the turn touched, and the report quotes the numbers.
- **A menu is named by what it holds, from the references, not the owner's draft word (R43, canvas 119):** "research
  and what professional terms should we use and dont take my advice as such". Hands became **Parts** (Yamaha,
  Synthesia, Flat). The rows are Right hand and Left hand, not "Piano left hand", and the hand's picture is the same in
  the bar and the menu. Honey chips for on/off became switch rows.
- **One icon, one meaning, defined once (R43, canvas 118):** "why the icons of the play mode differ in the drawer and
  in the toolbar". A mode's picture is one map read by every place that shows the mode; Play is a metronome, Wait an
  hourglass, everywhere.
- **A style carried over means every sheet and control, not the bar alone (R43, canvas 117):** "but you didnt do the
  proper refactoring of the settings of the buttons of the styles and so on". The Player's sheets now use the Chords
  kit throughout: centred title and Done, green switches, plain groups, radio cards with a check, Keyboard as Chords'.
- **The Player speaks the Chords page's language (R43, canvas 116):** "update the player with the same style updates
  and instructions". The transport as three glass groups, ‹ ▶ › the tinted one, each symbol over its
  value on a phone; Transpose the Chords page's Key (letters, ♭ ♮ ♯ on the chosen letter, spelled by direction, Back
  to the written key). A pattern settled on one page is carried to every page that has the same thing.
- **The end of a run says what happened and what next** (2026-11-07, the redesign skill's evidence of care): Played
  through, the score with its comparison, each bar's slips, Practise bars n–m, Play again, the next step. Drawn (v149).
  At the end of the song only, not after a loop ("song only").
- **No Song information and no Song page row in the Player** ("no song information", "no song page in the settings"). Built in loop round 1 (2026-11-13), with My recordings, How did I play, Voice commands, the Rhythm game and
  the Tuner gone from the Player; the recording's Tuning is a chip on the song page's fact line.
- **A settings drawer holds settings; its acts sit in its head** ("the first two three settings should be more
  distinctive", "feels like a bottom bar and not like settings drawer", "still not good. research more"): the song at
  the drawer's head with Share link and ··· (Print · Export), as Chordify's ⋮; settings under headers below.
  Never a row of icon buttons in a drawer, never acts listed among settings.
  Edit score takes the whole row under the song's name, Share link and ··· beside the name, never Edit inside ···
  ("the edit button is too hidden", "the edit button takes the whole row"); no section
  headings over the drawer's groups ("i don't like the headings or titles of the settings sections").
- **Settings a learner understands, ordered by what matters to them;** the sheet's View settings usable; nothing reserves
  a band above the keyboard, nor a tip; proper pedals, not a lever at the keys' corner (piano sites as the reference);
  the Player smooth with many notes (the Fantaisie hung). Build the approved mockup whole, "not only half" (2026-11-05).
  `/settings/player` gone, the gear the Player's settings' home.
- **Proper pianos, proper pedals (2026-11-05):** "i need proper pianos with proper pedal and implementations" (musicca,
  piano.org). Built in R33: ivory and ebony keys with felt and depth everywhere; the sustain held, latched (a lit
  indicator) or the score's, every key under it released together with a real damper; soft quieter and darker,
  sostenuto as a piano's; the Player's
  piano settings stay in its sheet. Record and Mark not repeated on the keys (the editor's Record, the Chord finder).
- **Songscription's keyboard (2026-11-05):** "it doesn't still look good with these, and this rail at the bottom, look
  at the songscription piano implementation"; "i don't want finger number under the keyboard and no piano roll yet".
  Built in R34: the rail gone, the keys slim and edge to edge, the chord held; no piano roll.

- **The Player's Pace and metronome (2026-11-07, canvas R37):**
  - Modes are Wait and Play only, no Follow, no group titles.
  - Sheet settings have no Your marks switch: the learner's own marks always show, and are removed by deleting them.
  - The transport's menu is Practice, never Pace. It holds Wait · Play, the metronome, and the loop. A song's recording has no settings anywhere in the Player: it
    plays along, and a wrong start is fixed in the content.
  - The Song gear has two radio cards: Arrangement (its Level) and Accompaniment
    (Pattern ›). Versions and accompaniment are separate, one plays. Rejected: "As written", a switch over version
    tiles, one mixed list. Names are the trade's: flowkey's levels, Smart Pianist's Accompaniment and Pattern. No Voicing or Swing; the accompaniment is not in
    Practice.
  - The Player's Pattern page is a library: Search; place chips at the top (All, Favourites, Recently used, each
    book, Mine; the owner likes them); a Sort and filter page (Sort by, Level, Texture, Feel,
    Reset · Show n) with its count on the button and removable chips; folders that fold by their header (Recently
    used and Favourites open, each book closed, its groups inside, Mine's own folders), Close all / Open all; rows with roll, hands line, level, Listen, heart. Never chips by
    kind, stars or cards two a row.
  - The Player keeps Sections, Print and Share link. No My recordings, no How did I play, no Voice commands, anywhere; no Tuner in the Player.
  - The metronome is Flat's: one Off · Count-in · On choice under the tempo, and Metronome sound › opens a page
    (sound list with a check, Volume, Back). A choice with its own list opens a page, as Flat's Playback options do.
  - No cursor or scrolling settings at all, neither a switch nor choices (rejected twice). The cursor moves by
    note and the score scrolls when needed; a scroll by hand shows a Back to the music pill.
  - No ask-on-open, no skin tone (one neutral hand), no resume-following setting.
  - The tempo belongs to the metronome, in BPM with − + Tap and its marking, Score tempo to go back.
  - One setting never disables another.
  - The meter and accents come from the score: no beat squares, no subdivision in the Player.
  - Sounds named for what they are, and every one plays.
  - References are sheet-music players, never recording software.
  - No pedal setting: "remove it". Playback pedals as marked or automatically.
  - The sheet's Show chips are the app's names. No cursor setting.
  - The full list is in `.scratch/r37/plan/pace-and-settings.md`, "The rulings as they stand".
- Every Chordify feature but guitar. Plain which view a setting belongs to; Layout is the sheet music's alone.
- **Diagrams** animate; strip and diagrams swipe by themselves, the page never moves; no odd scroll bar; a swipe goes to the
  next chord.
- **Taps on chords** move the player there and open no dialog.
- **Settings:** a song with written staves plays its staves; patterns, inversion and voice leading belong to a chord chart
  alone; "Melody" goes. A section can have its own pattern. Old settings nobody needs go.
- **Drum grooves:** Chordify's.
- **The Practice sheet's tempo and metronome are one group (loop 22, 2026-11-15):** under Wait · Play, one white card,
  the tempo's steps with BPM over them, then Metronome Off · Count-in · On, a hairline
  between, as Scale settings' rows; the steps tighten to fit a 393 phone.
- **Player settings › Playback keeps its gap (loop 22, 2026-11-15):** the metronome's card and Speed training's stood
  touching; the page is a column with the sheet's 16 between its cards.

## Song page

- **A song's Settings, a section, the takes and a take draw their states (2026-11-15):** Settings: Published, and Offline (Publish greyed under the ochre line "You’re offline. Publishing needs a connection.", the app's words); a section on one chord (its card says G, one Learn row, no One change at a time); Takes: No takes yet; a take: Playing from bar 4, Bars 3–10 kept, Deleted. One kit part, `SHOWSTATES`, hands each board's list to the States box.
- **A song's page draws its states in the States box (2026-11-15):** Never played (one honey Practise the column's width, no bar map, as the ruling for a song before its first play), A long title (Fantaisie-Impromptu in C♯ minor, Op. 66 takes two lines before it is cut, its cover's title an ellipsis) and No chord symbols (the Chords and progressions go; Sections lead), phone and laptop.
- **Loop round 41, the cover 4 under the bar on a phone, as the Song board:** the board's page starts 4 under its 44 bar (`padding: 4px 16px`); the app's cover stood 24 under it. Now 4, as Settings' list; the laptop keeps its 24 (2026-11-15).
- **Loop round 28, the song page's type as its board:** the facts' values (G major, 3/4, 80 BPM) 17 at 600, the title's tracking -0.01em, as the Song board draws them.
- **Loop round 25, Learned as the board's LEARNED:** in a song's and a lesson's bar a 34-tall pill in its 44 target, 14 semibold, ringed in the line while off, the grass wash with a grass ring once learned, never a solid green (2026-11-15).
- **Loop round 25, a song's Settings as its board:** Library holds Folder, then Favourite, a switch running the ♡'s own command ("В избранном"), then Duplicate and Archive (2026-11-15).
- **Loop round 25, a song's ··· as the board's SONG_MORE:** the bar ends in More, not a gear: Edit score, Settings, Share link, Export… and, apart, Archive (or Restore), each the command its Settings page runs; Archive stays in ink, since it is undone in its toast (2026-11-15).
- **A section's page as the Section board draws it (loop round 19):** a compact head card (`2 ×` large, then "Verse · bars 1–8" over its chords), no song tile and no progress bar; each group a settings group (its name in small capitals, its ⓘ at the heading's far end, as every settings group now); plain rows with no tiles, "Learn **G**" with the chord bold, its holds ("0 of 3") or Done in the learned green at the end; one column of 42rem on a laptop.

- **The cover column as the board draws it (loop round 19):** on a laptop from 1280 wide the song page's first column is 520px (the SongLaptop board's `grid-template-columns: 520px`), its gap 48; below that it keeps 24rem, the room a 1024 screen has.

- **A long value takes two lines, then an ellipsis (loop round 18):** a row's value (a song's long title in its Details) wraps between words as before and stops at two lines, as every title does.

- **Loop round 16, an item's Settings in plain rows (the SongSettings, YourCourseSettings and YourLessonSettings
  boards):** a song's, a course's, a lesson's and a progression's Settings carry no coloured tiles; what acts there and
  then (Duplicate, Archive, Share link, Reset progress) is a row in the link's blue, 16 regular, as the kit's action row
  everywhere; a row that opens a choice says its value at its end with a chevron (Folder, Export… MusicXML, MIDI). The
  app's Settings keep their tiles, as the Settings board draws them (2026-11-15).

- **Loop round 16, the first page prints its chords (the Song board's cover):** each chord symbol over its bar, the
  Player's label row at the cover's size; a song written as chords alone shows its accompaniment under them, no tune
  invented (2026-11-15).
- **Details titled as Chords and Sections are (loop round 16, the SongLaptop board):** one section title, 20px bold,
  over the Details card (`SettingsGroup heading`); a course's read-only Level row as tall as Genre's, a hairline between.
- **The song page, its settings and its editing redone,** on phone and laptop: details (words, music and harmony, level,
  genre, language, tags) edited as properties, not the inline editor; card styles intuitive, showing what they change in
  the real list, as memory-palaces' pinned cards and presets; the groups pages work and look right (2026-11-05).

- **Progress as the song's bars (canvas 125, 2026-11-11):** sixteen cells under the two plays, played in copper,
  the next bar outlined; no "Tap one to hear it" line.
- **Calm:** too much at once is wrong. Learned at the header's right.
- No "Learn the song step by step" card. A song with no sections must not look odd. Descriptions short or behind ⓘ.
## Library, adding, publishing

- **A folder, Archive and Trash draw their empty states in the States box (2026-11-15):** Empty folder ("This folder is empty", its line from the app, New song), Nothing archived and Trash is empty, each the one empty state, phone and laptop.
- **Every library's states in its States box (owner, 2026-11-15: "all the states should be properly made like the chords page does in this box outside of the phone frame"):** My songs, Progressions, Accompaniment, Finger technique and Jazz vocabulary, phone and laptop, draw Loading (the page's shape in sand rows, fading), Nothing found (the one empty state: the search mark, "No songs match “Chopin”", how to look again, Clear search) and, for My songs, Library empty ("Your library is empty", New song and Archive; search, chips and the laptop's folders go with nothing to search). The Continue shelf leaves while a search or filter is on, and the laptop's column heads leave with the rows (2026-11-15).
- **Loop round 41, Songs' list named and its folders even, as the Songs boards:** at Home a phone heads every song "Songs" with its count, as the laptop's table and both boards do (it said All songs on a phone alone); Shared with me and a shared folder stand 64 among the folders, as the board draws them, where they took Practice's 80 (2026-11-15).
- **Loop round 40, a favourite's heart red, as every board paints it (#B84A3E):** a library row's ♡ rests faint (#B4AAA0) and fills red once chosen; a song's or pattern's ♡ in its bar fills red with no sand wash under it; the small mark in Select is red. One `--heart` token, by Night the crimson's light shade (2026-11-15).
- **Loop round 40, a song's, course's and lesson's Settings as the SongSettings board:** the head 8 under the bar, the cover 64 (was 56, 24 under), its groups 16 apart as Settings' are (they stood 28 apart); the Chord player's Settings the same, its second column's first card level with the first's (2026-11-15).
- **Loop round 38, an empty state's way on at the boards' 48:** Try again, To Songs, New group and every honey way out of a said state stand 48 tall, as `EMPTY` draws them; a quiet one (Clear) stays 44.
- **Loop round 34, a library row 64 as its board writes it (canvas v209):** the boards' `LIB_ROW` wrote 64 but drew 80 (content-box, its padding added); it is border-box now, so Songs and the Practice libraries draw the 64 the app's standard Spacing has; Roomy stays the learner's 80 (2026-11-15).
- **Loop round 33, a song's Play never moves:** before a first play the song page drew Play as a lone floating button (in a laptop's far corner, over the cadence row on a phone); now it stands where the boards draw the play row, under Key · Time · Tempo, one honey "Practise" the width of the column, which Continue · From the start replace once played. One chord diagram app-wide: the dotted keys the Player's Diagrams board draws, also on the song page (its board had washed keys) (2026-11-15).
- **Loop round 32, the laptop library as the SongsLaptop board:** the Places pane runs the screen's height from its top, the title, search, Sort and filter, Archive and New over the table alone; a table's rows are 56 tall (was 71), their picture 40 with corners 9, 16 from the name (2026-11-15).
- **Loop round 32, Sort and filter wears the boards' two sliders, Settings the gear:** one glyph each, app-wide and on the canvas (the places' boards had drawn the sliders for Settings too); a learner's lesson and course menus' Settings wear the gear (2026-11-15).
- **Loop round 31, the laptop's table holds the folders as the board's:** one table, its column heads on top, then Folders and Songs each a folding group (16 bold, its count soft); a folder a row of the table, its tile and name under Title, "23 songs · 4 learned" under Composer and key, its ···; a folder's subfolders head its table the same way (2026-11-15).
- **Loop round 31, the laptop's pane as the board's (owner, 2026-11-15: "features that the artifact doesnt have"):** Songs' pane is 240 wide with its line, Places and Folders in the soft caps; the places (All, Favourites, Learning, Learned) by their words alone, the open one bold on its wash; each folder a 10px dot of its paint and its count, on the places' edge; Shared with me closes the folders and opens Groups. Archive moves to the bar as on a phone and Trash stays in ···, so neither is a row of the pane. Every library tree (Practice's books too) takes the board's rows: 40 tall, 15, 9 corners (2026-11-15).
- **Loop round 26, Archive acts at once and looks like its board (R38):** archiving a song, a folder or what Select chose happens at once with Undo in its toast, never asked first (the old "Archive …?" and "Hide … from this folder?" are gone); Restore all and each Restore are the board's 44 sand pills, a row's ··· in Soft Ink; Trash's Empty Trash the same pill in crimson (2026-11-15).
- **Loop round 26, Explore's failure as its board's Failed:** Try again is the screen's one honey pill, never a sand one; Offline keeps its sand My songs and Nothing found its sand Clear search (2026-11-15).
- **Loop round 24, a folder's Card style as the board draws it (owner, IMG_6045–6056: "remove all things that you didnt refactor ... all the features that the artifact doesnt have like the card style"; CSTYLE):** the preview on its sand card (Phone · Laptop, the folder's own rows), then Presets (Plain · Soft · Bold · Paper) and Layout (List · Grid · Covers) bare under their headings, Card contents, and a last group of Apply to… and Reset to default. Each change takes effect at once; the style editor's corners, borders, shadows, colours and padding, the bar's reset and the docked Apply are gone from the library (a lesson block keeps its editor) (2026-11-15).
- **Loop round 24, folders look like folders, a chosen row is never cut (owner, IMG_6045–6056: "the select borders are clipped, and this doesnt look as folders"):** a folder's tile is the board's STACK, two pages of music, one tilted over the other, on the folder's paint, in its row, its page and the laptop's tree; a folder chooses its paint alone, its picture being its pages. In Select a chosen row takes a soft fill, no inset ring, so nothing square pokes past the card's rounded corners (2026-11-15).
- **Loop round 24, one empty state (the board's EMPTY):** a 64 mark on sand, an 18 bold title, a 15 line, its way on a 48 pill; Songs, the practice libraries and Your lessons all use `Said`, and the second kit part (`EmptyState`) is gone. A search that finds nothing says how to look again: "Check the spelling, or try a song’s title or its composer." (2026-11-15).
- **The Trash leaves Archive; Home's Card style goes (owner, 2026-11-15: "what the trash does in the archive",
  "features that the artifact doesnt have like the card style"):** Songs' ··· is Select and Trash; Archive holds
  only what was archived. Card style is a folder's alone, from its Settings, as the board draws it.

- **Loop round 16, a laptop's search in the bar (the SongsLaptop and ProgressionsLaptop boards):** the search box
  288 wide and Sort and filter beside it stand in the bar before New, not a row of their own over the table; a phone
  keeps its row under the title (2026-11-15).

- **Loop round 16, Explore's search says what it finds:** "Search songs and patterns" as the Explore board writes it,
  never the bare "Search"; it fits a 393 phone in Russian (2026-11-15).
- **Canvas 192, Groups:** the board's + New group shows only where a group can be made, not signed out or
  offline, as the app already does (2026-11-15).

- **Canvas 191, Explore offline says it once:** "You’re offline" over "Explore needs the internet. Your own songs
  are all here." and My songs (was a title that said the same as its line); ru «Нет подключения к интернету»
  (2026-11-15).
- **Learning is what was started (loop round 17):** the Learning place and chip hold the songs opened in the Player and not yet learned, as the board's Progress column says "Learning"; a song never opened is in neither place, and an empty Learning says "No songs you are learning here yet." (2026-11-15).
- **A place is not a filter (loop round 17):** Favourites, Learning or Learned chosen alone shows no "Shown n of 93 · Clear filters"; the notice speaks only for a search or the sheet's filters.
- **The key never cut off (loop round 17):** in the laptop's table a long credit ("New Britain (American folk tune)") wraps to a second line, so the key at its end stays read.

- **Every page behind the library (canvas 133, 2026-11-11):** "you missed so many features": Explore with its shelves and
  states, a public song (rating, Add to my library, Report), Groups and a shared folder, a folder's Settings and Card
  style, Archive and Trash, a song's Settings, Publish and a section's page, each reached from where the app reaches it.
- **Practice's remaining pages (canvas 134, 2026-11-11):** "no edit mode for the pages": a progression and a pattern each get an editor with Draft, Settings, Publish and Discard; a trainer gets its setup, run and Results; a song's Check; a take's page; a setup sheet over the Player for a walk, chromatic, a progression and an exercise; every Practice gear opens full settings.
- **Notation and states found wrong in a pass (canvas 136, 2026-11-11):** the quiz's grand staff had clefs off their lines, filled heads with no stems and a verdict naming an inversion the staff did not show; a progression called V to vi a 3rd down. Music on a canvas is checked as music. Profile gained its guest and loading states.
- **Rows show their music (canvas 124, 2026-11-11):** a song's row shows its first notes, a folder a stack of pages
  with "23 songs · 4 learned"; no Open all; on a laptop quiet Places and the folders list; every target 44.
- **The library, drawn (R39-1, 2026-11-08):** Continue first (big engraved covers, "Bar 9 of 16"), folders as compact
  rows, then every song with its cover, "Composer · Key · Level" and a heart; one Sort and filter with its count. The
  laptop's table shows only columns that hold something, and its Add sits in the bar, since a floating + covers the
  table.
- **"A real library"** like Mindscape: built-in folders and the learner's, nested to any depth; a real archive in the header,
  folders archivable; deleting a folder deletes its songs. Move works at any depth.
- **Filter by key.** No "Chords I know" or "With chords" chips. Swipe actions on rows. Drag into folders and onto the Archive,
  by finger and mouse.
- **The + adds:** "the add menu for me means add something". New song, Record, Import, New folder. The Public library is a
  place, never an add option.
- **New song, Flat's:** its name, staves as tiles, the key grid, time tiles, Create pinned. "Make" was a non-word; a second
  Customize sheet was wrong; a clipped strip of meters was wrong.
- **Every New … is a proper sheet:** "the new lessons and new courses still have the old ui with just the text".
- **Imports keep everything:** tuplets, any tempo, tempo and meter changes; what cannot be held is listed, never dropped.
- **Noji's way:** one Export… sheet (MusicXML, MIDI, Share link); Publish its own page; search, chips, shelves, the full list.
- **Two bar buttons, one Sort and filter (loop, built to canvas 133):** on a phone My songs' bar holds the Archive and
  ···, Select inside ···; one Sort and filter beside the search, the sort first in its sheet; the place chips All ·
  Favourites · Learning · Learned under it, never repeated as removable chips or in the button's count.
- **Rows as the canvas draws them (loop, built to canvas 133):** a List place's rows in one card with hairlines, in
  Select too; Folders and the songs headed with their count and folding; a folder "23 songs · 4 learned" with a
  chevron; a song its small cover (its first notes on a printed staff), "Composer · Key", a ♡ one tap; More only under
  a mouse, a finger has the swipe and the long press; Shared with me a row at the foot of Folders. On a laptop the table is
  cover and Title · Composer and key · Progress, the places pane gains Learning and Learned, and an empty place says
  so ("No learned songs here yet") with Songs as its way out.
- **New is one dial (canvas 169, loop, 2026-11-13):** "proper floating actions for the new lessons or courses or also
  other things": every library creates from one honey +, at the bottom right (owner, 2026-11-15: "the new floating
  actions should be on the right"), a card of rows on a phone, New ▾ in the bar on a laptop; Songs: New song, Record, New folder, Import, New group; a Practice library: its New and New folder.

- **Loop round 13, a song's place:** the Player keeps where each song stopped and the bars played through; the song
  page then shows the canvas's Continue from bar N (honey) and From the start (sand), the bar map in copper with the
  next bar ringed, "Bar 1 · Played n times · m minutes · Bar N". Chords are
  the board's white cards (2026-11-14).
- **Loop round 15, the laptop's table as the board's:** Progress says where a song stopped part way, "Bar 9 of 16" as Continue says it, before Learning and Learned; the column shows once any song has one of the three (2026-11-14).
- **Loop round 18, the Songs board back to its rulings (canvas 188):** the place chips All · Favourites · Learning · Learned (no Recently played); a folder row a stack of pages in its paint, its count, a chevron, no heart. (2026-11-15).
- **Loop round 14, Songs' Continue as the board's shelf:** Home opens, on a phone and a laptop, with the songs left part way, the latest first: a sideways shelf of cards 132 wide (170 on a laptop), each its first page in small (title in serif, who wrote it, the clef and its first notes), its title, a 3px copper meter and "Bar 9 of 16"; a song's place now keeps its bar count (2026-11-14).
- **A public song opened offline (loop 23, 2026-11-15):** it says what Explore says offline, "Explore needs the internet.
  Your own songs are all here.", and its way out is My songs; Explore, which also needs the network, was a dead end.

## Learn and the editors

- **Learn and a level draw their states (2026-11-15):** First visit (nothing learned: every level 0 of n, Continue becomes "Start · Foundations") and Foundations learned (every lesson ticked, the meter full, "Review · Foundations"), phone and laptop.
- **Loop round 38, a course counts its lessons:** "0 of 7 learned" beside "7 lessons", as the Course board's "3 of 8 learned" (it counted the guided songs too, "0 of 9"), on the course's page and wherever Continue names a course.
- **Loop round 37, Your lessons' first run in the boards' pills:** New lesson the honey pill, New course the quiet one, 44 tall and bold (they were a rounded square and an outlined one).
- **Loop round 34, a level counts its lessons truly:** Learn's level row said "13 lessons" where Foundations holds 11 lessons and two practice steps (a scale, a chord family), while each lesson reads "Lesson 7 of 11"; the row now counts the lessons, its "0 of 13" the steps learned, as the level's page (2026-11-15).
- **Loop round 34, a lesson wears the board's closed book (`BOOKI`):** `LessonIcon` on Continue, a level's lesson steps, a course's current lesson, Your lessons, New lesson and Publish, where Lucide's open book with lines stood; a book of exercises keeps its open book (2026-11-15).
- **Loop round 34, a stage's paint in the Learn board's order:** Beginner sage, Intermediate sky, Advanced honey, Professional lilac, as `coursesHome` paints its shelves (it was sky, grass, lilac, sand); one `STAGE_PAINT`, so the covers, a course's page and the editors change together (2026-11-15).
- **Loop round 32, Tools as the icon wherever the bar is not Practice's:** a lesson's bar on a laptop said "Tools" where its board draws the metronome alone; now the word stands only on Practice's bar, the icon everywhere else at every width, its name in its tooltip (2026-11-15).
- **Loop round 32, the lesson's bar and its "After:" as the boards:** one gear for Settings on every board (the places' two-slider mark became the Practice pages' cog the app wears); the Tools wear the metronome (its case and pendulum, the Metronome's page picture) wherever they show as an icon, never a grid; a lesson's prerequisites read "After: 7 · Chord functions…", numbered along the level or course, each its own 44px link in a row that wraps whole (two had broken into a sentence with a 44px gap between its lines) (2026-11-15).
- **Loop round 30, the Courses' shelves as the board's:** a shelf's name 4 in from its card's edge (was 12), 6 over the card, the shelves 16 apart on a phone and 20 on a laptop (2026-11-15).
- **Loop round 27, a place's title and its progress as the boards set them:** the large bar title (Learn, Courses, a level, Profile) is 28 bold at -1% tracking, line height 1.15, as the boards' TOP draws it (was 26 and tighter); a meter's count ("Beginner · 0 of 13 learned") is 13, the boards' status (2026-11-15).
- **Static counts in plain figures (loop round 20):** a level's "0 of 13 learned", its chapters' 0/3, Learn's levels and the progress meters set their numbers in Onest's plain figures; its tabular 1 left a gap ("1 3"). Songs' and Profile's static numbers follow (Explore's count, Continue's "Bar 9 of 16", Profile's stats, a streak, a run's results); The kit's static counts follow (a fold's and a tree's count, a fact card, a bar number over the score). Tabular figures stay for values that change in place (a tempo, a timer).

- **A course's count stays whole (loop round 19):** "0 of 13 learned" never breaks over two lines (it did in Russian at 402); Next gives way, cut short. A tile's number (a lesson's, a numbered row's) is set in plain figures: Onest's tabular 1 split "10" into "1 0". The lesson line keeps the level board's 44px tiles, 68px rows (canvas 164: a course's line is a level's).

- **Loop round 17, a lesson's place reaches 44:** "Lesson 7 of 11 · Foundations" opens its level from a 44-tall reach
  (6 over the line, 20 under, into the title, which takes no tap); it was 42 (2026-11-15).

- **Loop round 23, Continue's lines as the board:** the eyebrow and the lesson's line 13/16, the title 22 at 1.15, so a
  two-line title sits as tight as the board's; the level rows measured equal (80, 8/12, 16/14) (2026-11-15).
- **Loop round 21, a course's row keeps its counts:** the LearnCourses board draws a short line of what it teaches;
  the courses' summaries run two to four lines, so in its place they ended every row in an ellipsis. The row keeps
  "4 lessons · 6 songs · 4 weeks" until each course has a line that short (2026-11-15).
- **"A library, not a path":** levels as chips ("why is it called a journey when it is not a journey anymore"). No days
  practised on Learn.
- **Real editors:** "an endless editor like a simple text editor but with all of our features like the obsidian app does",
  no edit-and-preview split. The toolbar floats, distinct from the bar.
- **Open:** "maybe the page enters the edit mode and not a new page … look the same like it looks in preview".
- **Manage as a library:** group, drag, add; "not just text reorder and no ui".
- **Lessons:** several staves show as one score. A takeaway per section, a page a section on a phone, progress and
  prerequisites, SATB on voicings. More content: rootless voicings, locked hands, modulation, slash chords, cadences.
- **Canvas 128:** a level's lessons are one line of tiles in order, learned in sage with a check, the next ringed in
  honey with "Next", checks as rounded squares; still a library (chips, every lesson opens), and no days practised here
  (2026-11-11).
- **Canvas 130:** a course is edited in place as a lesson is (Done · Publish…, properties as chips, lessons with a
  grip and Remove with Undo, Add lesson as a New sheet); Learn's Courses get the same Edit mode and New course; a
  lesson's and a course's Settings and Publish are pages with Back (2026-11-11).
- **Canvas 164:** "refactor also their lessons pages and controls and features and the editing … and their
  settings": a course's name in its bar and two columns on a laptop, its lessons the level's line; Learned a labelled
  pill; Settings titled in the bar, Reset progress with Undo, Delete asking, no line under a row (2026-11-13).
- **Canvas 165:** "organizing my lessons and cources … the new lessons or new courses actions … their settings":
  the learner's own get a library page (search, kinds, sort, courses folding to their lessons, ⋯ per row, +), one
  New sheet for a lesson or a course, and Settings whose rows say their value and open in place (2026-11-13).
- **Canvas 167:** "this piano doesn't look like the piano … from the piano player or chords play": one piano, the
  app's keys, on every board; New a choice of two (the dial on a phone's +, a menu elsewhere), each its own short
  sheet; popovers carry facts (a legend's swatches, shelves with counts), never a line under a control (2026-11-13).

- **Loop round 13, the lesson's foot and contents:** one bar for both ways of reading, the canvas's SECBAR (‹ a
  clear 52px circle, "In this lesson · Section n of N" opening the contents, the honey › and Done on the last); on a
  laptop no bar: "In this lesson" stands at the lesson's left in view as it scrolls, each section's number in a
  24px circle; its head the canvas's: "Lesson 3 of 11 · Foundations" in the eyebrow's rust, the title, what it
  teaches, After: its links. A course's page is its board's: the cover band in its level's paint, what it teaches,
  its facts as chips, "0 of 9 learned · Next: …" over a meter, the honey Start course; no card (2026-11-14).
- **Loop round 14, a level's line as the board's PATHROW:** each lesson a 68-tall row, its tile 44 round with its number in 15px bold, 4 in from the gutter, the title 16 over its detail, Next a 26-tall honey pill; a chapter's name on the gutter with its count in 13px; the goal 15px; 16 between chapters. Courses and Your lessons wear the same row (2026-11-14).
- **Loop round 15, a group's label as the board's CAPS:** 13px semibold, 4% tracking, 16 tall, 6 over its card, the same on every settings page, Search's groups and the Chord player's; Settings' groups 16 apart (2026-11-14).
- **Loop round 16, the tools on a laptop as their boards:** the Metronome's, the Tuner's and every tool's page start on the Back button's edge and fill the width, the tool beside its settings; no centred block (2026-11-15).
- **Loop round 16, Profile on a laptop as the board's:** two equal columns from the title's edge, 32 apart, filling the page; never a centred block that leaves the title alone at its left (2026-11-15).
- **Loop round 15, Profile's tiles hold any time:** the units at the label's 13 under figures of 22, and from ten hours the time in hours alone ("12 h"), so "9 ч 45 мин" fits a 393 phone's third; the board's 24 does not fit the real face (2026-11-14).
- **Loop round 16, a scale's name as a musician writes it:** the title's picker shows the name as it follows its tonic, "G major", "D Dorian" (`scaleName`), its menu keeping the list's names; a long name (half-whole diminished) wraps inside the screen instead of being cut (2026-11-15).
- **Loop round 16, a level's side as the board's LVSIDE:** "Levels" in the soft caps every group wears, each level a 52-tall row with 10 corners, its name 15 over its book 13, the count 13 in still figures (2026-11-15).
- **Loop round 16, Learn's course covers as the board's COURSECARD:** 128 tall, 12 by 14 inside, the shelf 11px bold at 6% in soft ink, the title 19 in the serif in ink, its line 13 on 1.35; 168 wide on a phone, 18 apart on a laptop; the paint stays its level's (2026-11-15).
- **Loop round 18, the editor's credit line reaches 44:** "Music: Traditional" under the title opens Title and credits from a 44-tall reach grown into the room under it, never over the title's (2026-11-15).
- **Loop round 18, a lesson's head 28 above its first section,** as the board's document spaces head and sections (was 16) (2026-11-15).
- **Loop round 15, a lesson's words as the board's:** each section's heading in the sans, 22 bold, tracked 1% tighter; its text 17 on 1.55; 12 between a section's parts; the title 30 on 1.15; the editor's document the same, so Edit looks as it reads. The docked keys stay: one fold shared by every reading page, no ruling removed it (2026-11-14).

## Practice

- **Intervals' Compound shows the compound intervals (2026-11-15):** the Simple · Compound tab changed nothing (the tiles stayed P1–P8), a control with no visible effect; Compound now lists P8, m9 … M14, P15 with their semitones (12–24), names them (Perfect twelfth, Double octave), widens the phone's keys to two octaves and gives the staff room for the ledger lines; "Sounds like" says "A perfect fifth, an octave wider". States: Playing, Every interval in turn, Compound intervals.
- **Scales and keys draws its states (2026-11-15):** Playing, F♯ major with six sharps and a minor pentatonic; every page with a Play shows Playing in its States box. Two faults the states found are fixed: a long scale's name (minor pentatonic) was cut, and now takes its own line under the tonic; "No standard fingering for this scale" was said of F♯ major and the black-key scales, which have one, and is said now only of the scales that have none (pentatonics, blues).
- **The Metronome draws its states (2026-11-15):** Playing, 40 BPM and 7/4 with accents and rests, phone and laptop; an accent beat's number is light on its ink bar (it was soft ink on ink, unread).
- **The Tuner draws its states (2026-11-15):** In tune (the needle in the green band, the words in grass), 18 cents sharp, Nothing heard (the note a soft dash, "Listening", the needle at rest in the line's colour; the page does not move between them) and No microphone (the app's words and Try again), phone, laptop and Night.
- **Loop round 41, the Metronome's tempo as its board's TEMPO:** the number keeps the font's own line height, so its word (Allegro · BPM) stands 2 over it as drawn, where a dropped leading-none had set it 1.5 and pushed the word 16 off; on its page the word stands 13 under the bar's buttons, as the board's 14 (it touched them). The Player's tempo, the same TempoSteps, keeps its place (2026-11-15).
- **Loop round 39, Scales' Hands as its board's HANDSSC:** the round Hands piece is its picture alone, the two hands or one, its name spoken and in its tip (it carried a "Hands" word the board does not); `FloatingPiece`'s word is optional for this (2026-11-15).
- **Loop round 39, the boards' washes and a progression's tiles:** the paint washes are the kit's, PEACH #F3D2C8, SKY #D3E5F2, SAGE #DCE9D6, HONEY #F6E7C8, LILAC #E4DCF1 (the tonic tile, the Chords and Progressions pictures were a paler peach); the role tiles take 14 corners and sit 4 in from the column, 8 apart, as `r62_progression.py`'s TILES62 (2026-11-15).
- **Loop round 36, the Check as its board:** Close and "Check: Minor blues" in the bar, the rounds' bar with "Round 1 of 4" beside it, the tally as two chips (right in grass, wrong quiet), the prompt centred 40 in the book serif, the keys at the screen's foot and under them Show answer · Clear · Check, one row of 50-tall pills on the sand (Check the honey, Clear dimmed until a key is chosen), their words wrapping rather than cut in Russian; the floating Check and the link-buttons are gone, in a trainer's run too (one board) (2026-11-15).
- **Loop round 33, the chosen fill is the boards' ink:** a chosen tile, row check or octave cell filled umber `#4B4038` where every board fills it `#332921` (`INK`); the one selected fill is ink by Day now, Night unchanged (2026-11-15).
- **Loop round 26, the tools against their boards:** Metronome, Tuner and Circle of fifths match; round glass buttons in a bar stand 8 apart as the boards draw them, on every page that has them (Scales, Intervals, Chord finder, a progression); bare bar icons still touch; a picker's field (Spelled in, every key picker) wears the soft hairline, not the control line (2026-11-15).
- **Loop round 24, the tools' parts 16 apart on a phone, as the boards' `body` (14):** the Chord finder's tones and Also read as, the Metronome's beats and its settings, the Tuner's dial and Reference pitch (they were 24, the Metronome's 52 with a reserved line); "Keep counting" is a pill over the beats while a bar is silent, taking no room (2026-11-15).
- **Loop round 24, a library row's level as its board:** on a phone, Accompaniment's, Exercises' and Progressions' rows carry their level at the right, "Level 1" as Learn numbers the levels, and the line under the name is what it plays alone; the laptop table keeps the stage in words, as the Level filter names it (2026-11-15).
- **Loop round 24, the Progressions library's bar as its board:** no gear; a progression's settings (names, voicing, inversion) stay on its own page's gear, one gear for them (owner, IMG_6045–6056: "remove all things … that the artifact doesnt have") (2026-11-15).
- **Loop round 24, an interval's ⓘ as its board's INFO61:** a 20px glyph in a 44px reach, 12 clear of the name (it was 16px, tight against the title) (2026-11-15).
- **Loop round 24, Scales as its board:** the page opens with both hands, each on its staff with its fingering line under the run (the board's Right hand and Left hand lines and its two-hand Hands button), and the exercises' heading names the scale, "Practise G major in the Player", as the Chords page names its chord (2026-11-15).
- **A chord in the left hand (loop round 22, the Chords board's Hands menu):** Hands offers Both hands, Right hand and Left hand; the left hand holds the close chord an octave under the right's, on the bass staff, with its own fingering and the 3D left hand. Kept in the URL (`hands=lh`) as the others.

- **Show names what it keeps (loop round 22):** a Practice library's Sort and filter ends "Show 54 progressions" (exercises, patterns), as Songs' "Show 93 songs", never "Show: 54"; the same foot, wrapping its two buttons where the words need the room.

- **Round pieces where the boards draw them (loop round 19):** an exercise's Key and Listen, Scales' BPM and Hands, Intervals' From and Play all, and a pattern's Loop and Practise are 56 round glass pieces, as the Exercise, Scales, Intervals and Pattern boards measure (the Chords board keeps its 72-wide pieces for Voicing and Hands); a word too long for the circle (Тональность) widens it into a pill rather than spill out.

- **Practise in the Player wears the keys (loop round 17):** the floating Practise on the Progression, Scales and Pattern pages is the keys glyph (`KeysIcon`), as the Progression board's `PRACTI` draws it; the dumbbell is gone from the app.

- **The keys show their computer letters only once typed on (loop round 17):** every board draws the on-screen piano plain on a laptop; the letters that play each key appear after the learner first types a key or moves the octave (Z, X), the hidden UI shown when it is wanted. One piano, so the Chord finder, the Chords page, the Player and the editor alike.

- **Scale settings ported** (loop, canvas 196): the gear on Scales and keys opens the sheet in place; the run's Fingering, Start on, Compare with, Rhythm (in the board's order) and the Chords view's size, inversion, keys play, played as and tempo leave the page for it; On the staff › shows what is written (Off, or the layers on) and opens its one home in Settings. The practise rows now follow the staff, as the board.
- **Scale settings is the gear's sheet, in place** (canvas 196, loop): the view's choices leave the page for one sheet: Fingering (As the scale · From the thumb), Start on, Compare with (A43, kept), Rhythm; the Chords view's size, inversion and what the keys play; then On the staff › to its one home in Settings. The board's Count-in goes: Play scale is a listen, a count-in before it does nothing.
- **A scale's keys carry their names alone** (loop, the Scales board): the tonic rose, the rest sand, each key its note's name (G A B C D E F♯); no degree numerals and no fingers on the keys, which the staff carries. One `scaleShown`, so Scales and keys, a key's view and the examples change together.
- **Chords' practise rows show their music, one chord or several** (loop, canvas 193): Inversions shows the rotations (C E G B · E G B C · …) and Arpeggio its notes (C E G B C …), as the app does; the board's "Root position, 1st, 2nd" and "Two octaves" were words where the music fits.
- **Loop round 21, the Chord player's bar across the gutter:** Style · Key · Tempo · Repeats and Play span the
  phone's width as the board's DOCK (560 at most), not hugging their contents (2026-11-15).
- **Loop round 21, the Metronome's slider as tall as its thumb:** its row 28, the beats 20 under it, as the board's
  range input (the beats sat 4 under the thumb) (2026-11-15).
- **Loop round 20, the overview as Learn under its bar:** Theory starts 4 under the bar, the sections 14 apart,
  as the Main board draws it (was 14 under the bar) (2026-11-15).
- **Rows show what they hold (loop round 11, the Practice board's `pic`):** each place of Practice wears a small
  picture of its music instead of a glyph: the chord's keys lit, a scale on a staff, a leap, I IV V, a bass under its
  pattern, a Hanon bar, swung eighths, a chord sheet, the Metronome, the Tuner's needle, the finder's lens, the circle.
  Tools in the bar is a filled pill (`PAGE_PICTURES`, one set, on the rows and the laptop's cards).

- **The Chord player next, every feature, timings the learner's (2026-11-13):** "continue with the chords player
  … make all of its features … starting from whatever chord … count in … duplicating the chord … when I reorder
  something and it has wrong timings accept the edit with this exclamation sign … and not change all the other
  chords timing automatically … auto scroll … easier timing adjustment. look at the musicca … the chord sheet is
  not being saved … the drag and drop bug, research the memory palaces drag and drop … connecting to the midi piano
  Yamaha Genos". An edit never retimes other chords; a bar that no longer adds up is marked ! and kept. "and also dragggin into other sections should be possible": a chord drags into any section, empty ones too. "set the transitions for the sections … two times the verse … a b c or d … the endings and the intro": the sheet sets the Genos's Intro, Main per pass, Fill-in and Ending by Section Control; unset sends nothing; never chords. "the chords player should support these controls also of the Operating Style Playback": Start/Stop, ACMP, Sync Start, Sync Stop, Intro I–III, Main A–D with fill-ins, Auto Fill-in, Break, Ending I–III with rit., Fade in/out, OTS Link, as the Genos panel names and lights them, each message from the Data List. Spec
  `.scratch/r39/plan/practice-chord-player.md`.
- **A key's tonic rose, its notes honey sand (loop round 17, 2026-11-15):** the Scales and Exercise boards paint the tonic as a chord's root and the other notes sand; the app's `--key-tonic` and `--key-scale` follow (brick and yellow washes, full paint when sounding), never yellow and sky.
- **Scales and keys in the Chords page's shape (loop, 2026-11-14):** one piano, one bar, one picker shape across Practice: keys edge to edge at the top, the name as its pickers (tonic ⌄, scale ⌄), Scale · Chords · Key, the run with its fingers, Practise in the Player rows, one floating bar Tempo · Play scale ⌄ · Hands. Never Formula chips, a Structure line or a Fingers · Degrees · Steps switch beside the staff. Spec `.scratch/r39/plan/practice-scales.md`.
- **A progression's page in the Chords page's shape (loop, 2026-11-14):** the keys at the top, the name with its ♡ and Key, the role tiles and the staff, Practise rows through the keys, Passing chords, Songs; one floating bar Loop · Play ⌄ (chord size, approach chords) · Practise. Never Chord size or Approach chords as fields, or the keys docked at the foot. Spec `.scratch/r39/plan/practice-progressions.md`.
- **The Metronome in the Practice pages' language (loop, 2026-11-14, canvas 179):** Back · Metronome · Settings as glass buttons; Allegro · BPM over −10 −1 120 +1 +10; the slider; the beats as tall tiles, filled to their level (accent ink, beat grey, silent empty), a tap cycling them; one group of rows (Time signature stepper, Subdivision, Sound, Speed trainer, Silent bars); one floating bar Tap · Start. On a laptop the tempo and beats on the left, the rows on the right. Never an ⓘ in the bar, Rhythm and Practice aids headings, or a capsule round Tap tempo and Start.
- **Loop round 19, the Metronome's gear (canvas 190):** Back · Metronome · Settings as ruled; the gear opens Metronome settings in a sheet: Flash on the beat (a honey wash over the screen on each beat, opacity alone, none under reduced motion) and Volume (10 to 100%, every click and drum scaled). Count-in left the board: a metronome alone has nothing to count in to. A tool page no longer stretches its rows: the settings sit 24 under the beats, as on the Tuner, Chord finder and Circle of fifths (2026-11-15).
- **The Chord finder in the Practice pages' language (loop, 2026-11-14, canvas 181):** Back · Chord finder · Settings · Piano as glass; the keys edge to edge at the top, the input; the name large with what it is in words and Spelled in as a progression's Key; its notes as tiles with their degrees; one group: Also read as, Played, In these keys; one floating bar Clear · Play · Chords. Empty: Play a chord, how, three chords to try. Never a MIDI button or four icons in the bar, a Speed dial, or a card round the name.
- **Loop round 19, the Chord finder to its board (canvas 181):** the bar is Back · Chord finder · Settings · Piano, glass, the gear before the Piano (every tool page's gear glass); Piano opens the one Piano sheet (Show the piano, Sound, MIDI keyboard; its 3D/2D cards only where the hands are offered), never a sustain pedal or a keys toggle in the bar. Empty: Play a chord, "Hold three or more keys, here or on your piano". Under the name its root and kind, inversion and numeral in the key spelled in ("A minor 7th · vi7 in C major"; a close voicing goes unsaid). Tiles name the chord tone (root, 3rd, 5th, 7th; ru прима, терция…), an altered 5th or tension keeps its sign. Also read as lists only the other readings. A bar's title keeps 8 from its buttons (2026-11-15).
- **Loop round 19, the piano wears the board's keys (`KEYSI`):** one glyph for the piano everywhere it is shown or opened (the Piano buttons, the Player's keys view, the editor's keys, a MIDI keyboard, a lesson's play-it): a keyboard seen from above, never Lucide's grand piano (2026-11-15).
- **Loop round 19, one Piano button on every Practice page (TOP60):** Scales and keys, Intervals, an exercise, a pattern, a progression and the Chord finder end their bar with Settings then Piano, both glass (`PianoButton`, `SettingsGear variant="glass"`); Piano opens the one Piano sheet. The sustain pedal and the keys toggle left these bars; Space and a MIDI pedal still hold the sustain. An exercise and a pattern have no gear, as their boards draw (2026-11-15).
- **The Circle of fifths in the Practice pages' language (loop, 2026-11-14, canvas 182):** Back · Circle of fifths as glass; the wheel large (majors outside, their relative minors inside, the chosen key and its neighbours lit); G major in the serif, 1 sharp · relative E minor; Chords in the key as seven tiles, each plays; one floating bar Play the chords · Scales. On a laptop the wheel left, the key right. Never signatures or enharmonic twins crowded on the wheel, an ⓘ in the bar, or a page with no key chosen.
- **Loop round 19, a scale wears stairs (canvas 182's `SCALESI`):** Scales and keys is one staircase icon everywhere (its tile, a level's scale step, the Circle's Scales piece), never a bar chart; the honey piece grows past 176 to its words, so Сыграть аккорды keeps its ▶ (2026-11-15).
- **The Tuner in the Practice pages' language (loop, 2026-11-14, canvas 180):** Back · Tuner as glass buttons, no gear; the note large (A₄), how far in words (6 cents flat, In tune in grass) and its Hz; the needle on an arc ±50 cents with the in-tune band; Play or sing a note; one group, Reference pitch − 440 Hz +; on a laptop the reading left, the row right. Without the microphone the app's words and Try again. Never a floating bar, Temperament, Show or Note names settings the app does not have.
- **A pattern's page in the Chords page's shape (loop, 2026-11-14):** the keys at the top, the name with its ♡, its bar on the staff, The hands, Used in, one floating bar Loop · Play ⌄ (Play over) · Practise. Never a star or the keys at the foot. Accompaniment's library holds patterns only: the books' Course in Learn and Songs in Songs links went. Spec `.scratch/r39/plan/practice-accompaniment.md`.
- **Intervals in the Chords page's shape (loop, 2026-11-14):** the keys edge to edge at the top, the name with its ⓘ, its notes on the staff with Sounds like, Simple · Compound over the 13 tiles (the chosen one in ink), one floating bar From · Play P5 ⌄ (Ascending, Descending, Harmonic) · Play all, Interval settings behind the gear. Never a keyboard pinned at the foot or honey on a chosen tile. Spec `.scratch/r39/plan/practice-intervals.md`.
- **Intervals' keys and the fade under the bar, to the board (loop, 2026-11-15):** the two keys named by their notes (C, G) in the root's rose and the 5th's sage, as `r61_intervals.py` paints them; the fade under the floating pieces is 112px (was 148), opaque only under the pieces, so a page that fits the screen (Intervals' last row of tiles) is never half hidden. A4 and d5 stay two tiles: C–F♯ and C–G♭ are spelled apart; the full name stays "Perfect fifth".
- **Intervals' fourteen tiles, to the app (loop, 2026-11-15, canvas 197):** the board's tiles are the app's fourteen, A4 and d5 apart, each named in words (Augmented fourth, Diminished fifth); the upper note is spelled from the interval's letter step, so d5 from C is G♭ on the keys, the staff and "C up to G♭", A4 is F♯. The staff draws its accidental as a path (a text glyph inside a repeat never painted). The chosen tile's semitones keep their contrast by Night.
- **One piano, painted and sized as the boards (loop, 2026-11-15):** a chord tone, a key's tonic and its other notes wear their full paint at rest, as every board's keys (`calmKeys`) draw them; sounding, the key sinks under the felt. The hands keep their wash at rest (the Player). A page's pinned keys stand 150px on a phone and 180 on a laptop, whatever their width, with no divider: the resize divider is the Player's and the editor's alone (R34). The 3D keys take the same paints.
- **Intervals' and Scales' laptop in two columns (loop, 2026-11-15, canvas 197):** on a laptop the keys are a card (16 corners, a hairline ring) heading the first column, 20 over the name and the music; Intervals' size and tiles, and Scales' sections, stand in a column beside them (420 and 400), 40 apart, 4 under the keys' top. On a phone the keys stay pinned edge to edge on top. `PinnedKeyboard column` is the one switch.
- **The boards' keys by Night (canvas 198, 2026-11-15):** the Night pass had turned the boards' white keys into the night card, as dark as the black keys; a white key now has its own white in `calmKeys`, drawn by Night as the app's dusk key (#D4D0CB). The app was right; the drawing is brought to it.
- **A progression's page opens on a chord (loop, 2026-11-15, its board):** one chord of the row is chosen, the first until another is tapped; its tile keeps the ink ring while nothing sounds and its keys show, so the keys are never blank on arrival. The keys keep the chord-tone paints (DESIGN.md, the paints: chord tones only on the keys), not the board's paint of the chord's function; a lesson's rows and Passing chords' cards choose nothing.
- **An exercise's page in the Chords page's shape (loop, 2026-11-15, canvas 185):** the keys at the top with the first position lit, the name with its ♡, its first bars on the staff with what it trains, The exercise as one group (Number, Hands, Rhythm, Next key, Tempo and its ladder), How to play in words, one floating bar Key · Start · Listen, Exercise settings behind the gear. Never the hand drawing with finger numbers. Spec `.scratch/r39/plan/practice-exercises-quiz.md`.
- **The Chord player as Musicca's (2026-11-14):** "make the ui of the chords like the musicca does"; "one tap on the chord selects it and plays from there … double click opens this chord settings"; "the currently played chord should be selected like this"; "the drag so change the timing like the musicca does"; the dock "doesnt stand above the content like pinned above the keyboard"; "improve the genos actions bar". Chords are boxes as wide as their beats with beat ticks, a tap selects, a double tap opens Musicca's dialog, the edge drags the length; the dock floats over the keys on every size; the Genos strip shows every control without scrolling. Never a strip that scrolls sideways or cuts a group. Spec `.scratch/r39/plan/practice-chord-player.md`.
- **Following the Genos, as built (loop, 2026-11-14):** Follow a MIDI arranger in the Chord player's Settings; the Genos's Start, Stop and clock lead the sheet in silence; each section's Intro, Main each time through, Fill in or Break and Ending go out as Section Control at the bar before; the strip carries only what the Genos takes over MIDI (Start/Stop, Intro, Main, Break, Ending); ACMP, Sync Start/Stop, Auto Fill, Fade and OTS Link are left out until a message for them is found. Spec `.scratch/r39/plan/practice-chord-player.md`.
- **A shared chord sheet is live, the chord playing too (2026-11-14):** "I also mean live updates meaning the chords being played online … what chords is currently played". Share makes the sheet an online sheet (an account needed; View only or Can edit); every copy with the link takes each save, merged bar by bar, and lights the chord, beat and keys another copy is playing. Never a link that carries the sheet's text, never chords sent to a copy that is playing itself. Spec `.scratch/r39/plan/practice-chord-player.md`.
- **Chord sheets saved, synced and migrated (2026-11-13):** "I want to be able to save the like this as chord sheets
  and sync to my account and also the older ones should be able to migrate to this new structure effortlessly". A
  section is bars of chords, saved as text (`kind xN vN: C | F:2 G:2`) and synced; old sheets read into bars. The one
  exception to "no migration": a learner's chord sheets are never dropped by a shape change.
- **No Quiz page (2026-11-13):** "no quiz page". The Quiz page, My gaps and every list of trainers go (Practice,
  Search, Intervals' Train your ear, Progressions' Test yourself); a trainer opens only from the lesson that practises
  it, at `/practice/trainer/$trainerId`, Back to Practice. Never a Quiz or trainer list beside a topic's page.
- **Practice lives on its topic's page; results after a run; history in Profile (canvas 160, 2026-11-11):** a grilling settled it: "remove the quiz page completely", no Chord trainer, "i dont want this from c to am, i dont understand what this is", "I like shuffle better than random order", "i want this history but not in the practices page". A page studies a thing and practises it in the Player; a run ends in a full-screen results page (every chord marked right, wrong, early or late by its ms, your best beside it); every run is kept in Profile › Practice history. Exercises is a group (Finger technique, Jazz vocabulary), never a page called Exercises under a heading that does not fit it. Never a separate trainer or quiz beside the topic's page.
- **Every board opened before a publish (canvas 157, 2026-11-11):** "the progressions page is broken": its phone list, and Accompaniment's and Exercises', had been empty since a generator reused a helper's name. Before each publish, every board the change can reach is opened in the runtime, not only the ones drawn this turn; generator helpers carry their file's prefix.
- **Real exercises, named as the books name them (canvas 156, 2026-11-11):** "see a chord and play it doesnt make any sense… the names are very bad… real practices that do make sense": a trainer's exercises come from the owner's books (Piano Chords Practice, 400 Piano Chord Progressions), each named for what is played ("Major seventh chords in all inversions", "The I–IV–V–I cadence") and shown engraved; never invented drill names, "Start here", "Find more" or options a pianist would not say ("inversions up and back"). the theory pages are Theory, never Harmony; no Up next, recent practice or progress the app cannot stand behind; a sheet's groups never shrink to fit.
- **Chosen is filled, not chosen is white (R42, canvas 153; owner 2026-11-13: "yes" to the ink fill):** "when It is white its means not selected and when selected it should change color": every chosen chip or tile wears the chosen fill in ink with an umber tick (`DESIGN.md`, the Neutral Choice Rule); an unchosen one is plain white. Honey stays the screen's one main action. Never mark the unchosen with a word ("Stays") or a fainter look.
- **Fingers are a label the learner can pick (R42, canvas 151):** "I want to have a fingerings option in the piano labels": finger numbers on the keys are allowed when chosen in Labels, never by default. "keep all, transpose all is not clear": a list of checkboxes says what ticking means in its heading ("Chords to transpose"), counts "n of m" and offers Select all / Clear all; never a verb pair that reads as two actions.
- **A drill names the chords it plays (R42, canvas 150):** "practice it chromatically or diatonically. how can I do this": a row with "or" in it hides a choice; each way of moving a chord through the keys is its own row, showing its first chords. Diatonic means the key's own chords, from the key the chord belongs to.
- **Chords checked against the owner's books (R42, canvas 149):** "read this whether our chords are correct", "fix all": a chord's notes are checked against Chord Theory for Piano and Piano Chords Practice before it is drawn; ♯11 chords sit with the alterations; a chord is drawn as played, the app's table keeps it stacked in full. The theory book's interval table counts semitones from 1 (a minor 3rd as 4); never copy its numbers.
- **A chord list reads like the chord finder (R42, canvas 148):** "make better the sheets consistent with the chords finder so that first the chord names and then the their full name. and make also the chords in the chord finder filterable": everywhere a chord is chosen from a list, the symbol comes first, then the full name, then the mark; a long chord list has the group chips on top. Never a name before its symbol.
- **One way to choose on a page (R42, canvas 145):** "we also dont have consistency in the page. different controls for selecting": every list of options on a screen is the same row (checkbox for several, radio for one, name,example; the meaning line replaced by canvas 158) with the same group heading; and the result of the choices is shown where the learner looks first (your deck: count and chords).
- **No invented presets (R42, canvas 144):** "what is the meaning of easy roots or white keys or all roots. I dont like this": a list the learner can tick needs only Select all; named shortcuts that need explaining go.
- **A bar carries only what works on its page (R42, canvas 142):** "what Is the meaning on the piano settings in the header in this page": a header copied from a sibling page keeps nothing that does nothing here; Random chords shows no keys, so no piano button.
- **A multiple choice looks like one (R42, canvas 140):** "what is this chose chords… what is with this show another… in a key is also not very understandable": several things picked from a list are checkboxes with "Select all" and "n selected", never coloured tiles; no button that only demonstrates (Show another); no filter that needs a second choice to mean anything (In a key).
- **Choosing chords is choosing chords (R42, canvas 139):** "make proper chords choosing… select all the chords and also filter them by type like these scrollable chips on top of the drawer": a set of chords is picked from one list of every chord, filtered by chips, with Choose all per type, never through modes ("From a key or Chord types") or a Triads/Sevenths switch. An inversion is named by the note at the bottom and shown.
- **One segmented control and stepper, 44 high (canvas 127, 2026-11-11):** a choice of two or three in a settings
  group stands under its label, full width; the Player's segmented control everywhere.
- **Overview five across (canvas 126, 2026-11-11):** on a laptop the cards run five across with Search beside Tools;
  every subtitle whole on a phone.
- **An accidental belongs to one letter; a move is spelled the way it goes (R42, canvas 115):** "the selects flat or
  sharp or natural only change the current key and not all of them"; "why when transposing from c i go to d flat and
  not to c sharp, fix this and all such issues". Up in sharps, down in flats, unless that key does not exist; chords
  spelled from the new key's scale, never a double accidental where an enharmonic root avoids it. Walk all twelve keys
  both ways in the runtime before saying spelling works.
- **What is printed for one chord is printed for all (R42, canvas 114):** "why the fingers are only on the selected
  chord, it should be on all". Selection colours a chord; it never decides what the staff prints.
- **A name sits over its notes; the default is quiet, the exception marked (R42, canvas 113):** "the chord name and
  the chord alignment is still not correct. and the empty state is looking weird. and i dont like now that other
  chords are not colored"; the Key drawer "can be more intuitive and simple". Centre a symbol on its notehead, not its
  hit area; keep every chord's paints and ring the chosen one; an empty state keeps its room and offers one way on;
  in a multi-select where all are on by default, mark the one turned off. Test taps on iOS Safari's terms: no text
  selection or grey tap box, and nothing in a scroller paints over a sheet.
- **A chosen chord looks chosen, not pressed; a key carries the chords you pick (R42, canvas 112):** "clicking on the
  chord, feels more like clicking on a button that on a chord and look how our real app does this"; "d remains d and
  not d flat f for example must remain f and not f flat"; "this is a transpose for the key ... we need to find a way to
  take the chords as well". On a staff, what is chosen is coloured in the ring as the app's score does, never a filled
  bar; the clef opens Key where it prints; Key lists the
  chords to transpose. Never: a label over the clef, words explaining a signature, a switch for showing the key.
- **A chord's name changes it, the rest plays it; one picker for every key and root (R42, canvas 111):** "when I click
  on the chord name ... I will get this next chord drawer to change the chord but clicking anywhere else would just
  work as now"; "it uses different controls with different features"; "I dont like how the staff jumps"; "the e should
  remain e and not e sharp disabled"; "the keys should change chromatically like on the keyboard". One Key drawer (− / +
  half steps, letters and ♭ ♮ ♯); Remove in the drawer that changes the chord. Never: a second layout for one chord, a
  disabled letter, a staff that scrolls on a tap, − / + round the circle of fifths.
- **An action sits beside what it acts on; a chosen suggestion leaves its list (R42, canvas 110):** "make more clear how
  this buttons ... relate to the chords"; "when I add a chord from the list it disappears ... like filter chips"; "I
  dont like how we need to switch these d flat of C sharp in written as row"; "+ or − buttons also in the key
  signature". Never: an enharmonic switch row, "First chord on", a wrapped list of chord symbols.
- **The musician's word, suggestions not pickers, nothing cut (R42, canvas 109):** "diatonically is more clear than in
  the key"; "these are only suggestions and I dont want another chord picker beside the all chords page"; "the staff
  is clipped ... make sure this doenst happen". Never: a plain paraphrase of a musician's term, a second chord picker,
  a chord symbol in capitals, text or a drawing cut by its box, text showing through behind a floating bar.
- **Nothing moves under the finger; the whole chord is the target (R42, canvas 108):** "I dont like such controls or
  options that change the ui so radically"; "only this pill is clickable and not the whole chord". Chords on a staff
  are bars of a lead sheet, each bar one button; a row that comes and goes keeps its place; no "Back to …" links.
  Never: pills or chips for chords on a staff, a control that appears and pushes the layout, a disabled section hidden
  rather than dimmed.
- **A chord's root is a letter and ♭ ♮ ♯; a keyboard only for moving to a key (R42, canvas 107):** "it is interesting
  for transpose but not for picking a chords"; "I dont like the split note between the C sharp and d flat"; the key
  signature "like the transpose": a ♭/♯ stepper. Never: a black key split into two names.
- **One picker for every root and key (R42, canvas 106):** "there is not possibility to
  switch between like the c sharp or d flat"; "it just lists all of this keys without good structure". One picker for
  every root and key. Never: a staff that shrinks as chords are added ("getting smaller and smaller"); a list of tiles
  that repeats the chord ("move cmaj7 to cmaj7").
- **Both hands follow pianochord.org's recipe (R42, canvas 104):** four of its pages sent without words. Left hand
  root and 5th from C2 to B2; right hand the 3rd and 7th in close position, starting on the note that moves least
  between chords; the bass of a slash chord in the left hand.
- **A chord in two hands is split, never doubled (R42, canvas 103):** "the two hands still dont work like it should
  like the cm11 chords are not correct". One hand stays inside a ninth (5th, then 9th left out; pianochord.org's Cm11
  is C E♭ F B♭); Voicings are grouped by source (Music theory, Jazz
  piano, Gorshkov's course), the Voicing button names the chosen one ("Close position", never "Close"), and the
  staff carries its own Add (an empty place) and Transpose (the key over the clef), with no buttons above it.
- **No explanation line under a chord's name (R42, canvas 102):** "is it good that this text is there. I dont know if
  it is very good there: C major seventh · Close voicing". A line that repeats the pickers goes; the name in words is
  the type picker's tooltip and spoken name.
- **A canvas is grouped by page and by device (canvas 100):** "group the screens by page and by device and not so
  scattered", then (canvas 101) "put them in a row like the all the flows screens pages in one row for phone then
  the dark mode and after that the same for laptop". One canvas page per area; on it four rows: the flow's phone
  screens in its order, their Night boards, the laptop screens, their Night boards. `.scratch/r39/canvas/index.py`.
- **The hidden UI is part of the design (R42, canvas 99):** the dashboard video. Every icon-only control has a
  tooltip on a pointer; rare actions sit low on the spectrum of explicitness, never on their own page; a first run
  is sequenced. Each report names the one decision only Piano Trainer would have made (Tim Gabe).
- **Scan first (R42, canvas 98):** two transcripts on edges and emphasis. A value row shows its value grey at the
  default and in ink once changed; every control has hover, pressed and focus. Kept as the `scan-first` skill, read
  with `seven-questions` on every screen.
- **Every screen answers the seven questions (R42, canvas 96):** "check this" (a video's seven things: one focal
  point, a spacing scale, hierarchy by weight and colour, one accent, real content, matching details, motion from
  where the user acted). Never set a chord symbol in capitals (E♭m7 becomes E♭M7, another chord). Every layer moves
  from where it was asked for, eases out and leaves at once. Night is drawn from the app's dark roles, never inverted.
- **Missing states are drawn in the app’s own words (R42, canvas 94):** "continue with missing states". Read the
  `en` strings and the code first: sound never "fails" here (offline, a lighter piano plays), so that state was not
  invented. A state is reached from a dashed States tool outside the screen, never by a fake control in the product.
- **Outside skills are kept, rewritten for the canvas (2026-11-10):** "save all this figma skills and add them to be
  loaded from the Claude.md. and rewrite them to our Claude design match. dont remove them rewrite to Claude design":
  nine skills installed under `.claude/skills/`, their Figma mechanics replaced by the generator, the kit and the
  runtime checks; `CLAUDE.md` lists when each loads. Never drop a pasted skill because it names another tool.
- **A pasted review skill is run as a review; "implement all" builds every finding (R42, canvas 90):** the owner
  pasted outside skills (UX writing, an interface review, Figma-only ones) with no words; each was applied read-only
  to the Chords canvas and none installed. Then "implement all you proposals". Before publishing, measure what a
  review would: 44px targets, a switch that is one named control, Escape and focus in sheets, one type scale.
- **A short yes is a ruling; build it the same turn (R42, canvas 89):** "3. intervals is good. .4. yes": Intervals
  became a fourth Labels option (keys and staff), and several chords are written with their key signature. A fourth
  choice in a segmented row needs shorter names on a phone ("Note names" became "Notes"); check a long staff with
  six sharps and five chords, not only C major.
- **A fault in the 3D hands is the app model's, fixed there with a test (R42, canvas 88):** "something is not
  correct with the third finger in the model": reproduce at 3× in the runtime, find the finger at fault (it was the
  resting 4th, not the 3rd), fix `piano-hands` and rebuild the canvas bundle; never patch the canvas copy alone.
- **What matters is on the first screen (R42, canvas 87):** "the staff is very important and now the user needs to
  scroll to see it fully": before a publish, check that the page's main pictures are whole above the fold on a
  phone; make room by dropping what repeats them (a facts card beside a staff that says the same) and drawing only
  what is in use (one staff for one hand).
- **A choice opens a real drawer (R42, canvas 86):** "I want the chord edit options to get real drawers": no
  floating menu under a control on a phone; a bottom sheet with grabber, title and Done, the pick applied at once
  behind it; a titled popover on a laptop.
- **Off is a switch; a sub-choice lives in its parent's card (R42, canvas 85):** "I dont want a fourth option I
  want to be able to show them from the 3d keys options … research more how a off options should be made": never
  "Off" as one more tile beside the views, and never a combination ("3D with hands") as its own option. A switch
  turns the thing on or off (Apple HIG, NN/g); the chosen radio card holds its own switch.
- **Text never touches its control's edge (R42, canvas 85):** "these piano table options still have padding
  issues. use proper skills": the layout check fails any label under 6px from its control's edge; a row whose
  segments do not fit beside its label puts the label above.
- **A setting works in every view, and a tappable thing looks tappable (R42, canvas 84):** "I dont like the labels
  settings and that they are only available in 2d": Labels (Note names · Degrees · None) now draw on the 3D piano
  too;
  "make the chord that it is editable more clear": the name's parts are filled pills with chevrons.
- **Look at it before it is sent (R42, v82):** "can you look at the websites before you send them … paddings and
  voicing button placed weirdly": a bar's button ran off the screen's edge because only the changed part was
  screenshotted. Every publish: the layout check in every changed state, then the eye on the whole screen, the
  floating bar and the edges, phone and laptop. A floating group is symmetric around its main button.
- **A button is named for what it opens, not its value (R42, v81):** "on the close voicing it looks like a close
  button": the bar's Voicing button showed "Close". Check every value a control can show for a word that reads as a
  command (Close, Open, Off, Back, Clear).
- **Ask, then draw the choices side by side (R42, v80):** after 25 rounds of guesses on Chords, three rounds of
  numbered questions (a recommendation with each, "yes" accepts) settled the page's job, the 3D piano, key colours,
  fingering, hands and settings homes in minutes; the look, which talk cannot settle, went up as two working designs
  to pick from. Research is capped at about 50 Firecrawl credits a round.
- **A canvas feature is proven where the owner sees it (R42, v79):** "the 3d piano doenst work": it ran in the local
  runtime and failed in the published page. Test a board under a policy that allows no connection (CSP
  `connect-src 'none'`); inline assets are parsed, never fetched.
- **Hands is a menu button, not a row (R42, v79):** "I dont like the hand controls and settings": no segmented row
  or cards on the page; one button by Play opens Both · Right · Left (flowkey). A choice about sharing notes between
  hands is a voicing.
- **Use the app's real thing, never a redrawing of it (R42, v78):** "DONT you see how awful this looks … proper
  implementations like the 3d piano does": six rounds of drawn hands were rejected; the Player's 3D hands, run
  live in the canvas, were the answer. When the app already has the component, the canvas runs it (bundle it with
  Vite into the board), and its settings reuse the component's own control (Left · Both · Right).
- **Hands belong at the keys (R42, v77):** "I dont like it, be creative and think outside of the box", of a hand
  diagram beside the staff, however correct its numerals: the hands lie under the keyboard and each finger reaches
  its key (flowkey, the courses app). When a correct drawing is still rejected, change where the thing lives, not
  its styling.
- **Research until the convention is known, then draw it (R42, v76):** "make proper implementation of the finger
  numbers colors and research more", "you didn't research enough": one saved page was not research. Finger numbers
  are upright bold numerals in fingertip circles (Hoffman, Faber, Pianote), never italic, never floating badges.
  Before drawing a teaching diagram, view how at least three teaching sources draw it and cite them.
- **Research the owner's material first, then one decision (R42, v74):** "research more first and use the piano
  data and its transcriptions and examples": the staff ties the notes two chords share and traces the ones that
  move; Practise rows are the teachers' drills (blocked, broken, 12 keys; each change, then the whole). Cite file and
  timestamp; say what no source gives (seventh-chord inversion fingering).
- **Name the result, not the mechanism (R42, v73):** "what bass only means": each hand shows the chord it plays
  (G + B♭maj7).
- **Transpose is one tap away and moves everything (R42, v73):** "transpose chords easier": the key in the staff's
  header opens half steps and twelve keys; every chord on the staff moves, spelled for the new key.
- **A floating group is centred as one (R42, v72):** "why this is looking so not centered": a button beside a
  centred button pulls the pair off centre; centre the group.
- **Hands play the whole chord; Split is the bass and the upper chord (R42, v71):** "when I select the left hand I
  want all the notes … both then … c e g and c e g in both hands … gm9 the g in the left hand and the BbMaj7 in the
  right". the learner's courses (Gorshkov) before the web.
- **Several chords, every action covers them (R42, v71):** the chord list is a checklist of what the staff shows;
  Play plays them all in the chosen mode.
- **A control shows what it does (R42, v70):** "be more creative and clear … ux ui best principles": R.H./L.H.
  chips and a 123 toggle were not understood; No abbreviation or bare icon where a word and the result fit.
- **A hand alone plays the chord, fingered (R42, v69):** "I want to play the c major chord in left hand with its
  fingerings and not c g c". A setting named for a hand plays the chord in that hand; reduce only past what a hand
  holds. A setting lives where its effect shows.
- **Adding a chord suggests the next one (R42, v69):** "you could improve it. be creative": the key's chords, likeliest
  first, voice-led.
- **Voicings checked against the owner's transcripts (R42, v68):** "check that our current are correct are match
  the researches": every voicing cites a transcript; Rootless on a dominant takes the 13th, not the 5th. Added
  Spread, So What, Kenny Barron, Upper structure, greyed where the chord does not take them. "leave out the alt".
- **Scales in every key with a key signature (R42, v68):** 15 per scale, spelled for the key, never D♯ major.
- **The hand setting changes the voicing, as pianists do (R42, v67):** "what relevance have the hands settings in
  … nineth chords and bigger … research the transcriptions". Research the owner's transcripts before the web.
- **Several chords on one staff (R42, v67):** "select more than one chord to be shown on the staff": names over the
  staff, + to add, × with Undo, All chords in order in the Play menu.
- **Play centred, alone, honey kept (R42, v63–v64):** "the play button is too appealing … centered", then "no
  revert the play button color": Play is one centred capsule in its honey tint.
  v66: "now the names get cut off": a bar label is never truncated; measure the longest name in the runtime.
- **Chords' settings live where they act (R42, v62):** Hand and Fingering in the Chord sheet after Voicing; the
  keyboard button at the header's right;.
- **No tab switch for the inversion; invent from the music (R42, v58):** "I dont like this tab switch, be more
  creative and think outside of the box". An inversion is a rotation, so it is a ring of the notes turned by tapping
  a note into the bass slot. Rejected for it so far: segmented track (v26, v57), ‹ › (v22), stepper pill (v52),
  pull-down (v56), ring (v58: "not understandable how it moves"). v59's moving stack: "it still moves too much". The
  inversion is a still choice of the bass note (v60): controls stay put, only the selection changes. v61, "better": each choice
  shows its result (a small staff of the chord it makes), and the slash in the name wears the bass note's colour.
  v62: the small staffs and the "Bass note" header rejected ("I dont like … remove them"); the plain row stays.
- **Choices one tap away, named by what they give (R42, v57):** "make the inventions easier to switch". A pull-down
  that hides a few related choices is two taps too many: show them side by side, each with its result (Root Cmaj7 ·
  1st Cmaj7/E). Notes are set as a theory table sets them (note over role), not dots with words. Research outside
  sites too (musictheorylessons.net), not only piano-data.
- **A heading is text, not chips and pills (R42, v56):** "I dont like inversions and the chips how they look". the notes a line of text with their roles; the ♭ in a chord
  name set as music. Never ‹ › for the inversion, never filled note chips.
- **No filled button inside a bar; groups of glass, one tinted primary (R42, v54):** "I dont like how this yellow
  button looks inside this toolbar. research the apple guidelines". Apple iOS 26: grouped glass items, the one
  primary action prominent in its own group, trailing.
- **Arrows sit beside the words they change; one action with a choice of how is one split button (R42, v52):** "the
  inversions can be interpreted as go to next chord … I'd put the play together with the arpeggiate". [▶ Play chord | ⌄] with Block chord · Arpeggio.
  v53: "the keyboard settings should be like separate from this play chord": the bar is the sound only.
- **The title is the button, without a ⌄ (R42, v51):** "remove the arrow on the big chord. it just works but without
  this arrow down".
- **Show the choices, don't hint at a gesture (R42, v46):** "the chord root switch looks interesting but you could
  improve it and make more clear". The chosen letter opens into its spellings (D♭ D D♯), each a tap; replaces
  tap-again cycling and its marks. **Rejected:** "no I don't like this". v47: one row, tap again, the chosen letter
  naming the next spelling. Never widen a segment into sub-buttons. v48: "this icon look like reset and is
  misleading": the chip reads "or C♯"; no turn arrow for a choice (it means reset or reload).
  v49: "now it can be interpreted as the c can be called c sharp": a pointer under the chosen letter reads "Tap
  again for C♯". Name a hidden gesture's action in words; a glyph or "or" is read as something else.
  v50: "is this a permanent or just a tooltip": a tip, gone for good once the gesture is used.
- **A chord sits where a chart puts it (R42, v45):** "why some chords like the f sharp are shown one octave lower".
  Root position starts in the octave from middle C for every root; no hidden register rule.
- **A chord root is spelled, a key is one of twelve (R42, v41):** "how can we though get chords like d flat or sharp
  or g flat or a sharp". The chord is spelled from the written root. v42: "some options are weird like c flat or e
  sharp". v43: "make just one row and when clicking multiple time on one note it will change": one row C to B;
  tapping the chosen letter again steps ♮ → ♯ → ♭, only the spellings a chart writes. Never extra rows for ♯ and ♭.
- **An extra note is a chord with a name, picked from the one list (R42, v39):** "I dont like this add a note how
  this looks, and is not understandable". No add-on chips beside the chord list, no avoid notes struck through; C7♭9
  is a row in Altered, as iReal Pro lists qualities.
- **A setting lives with the picture it changes; one label per key (R42, v38):** "I dont like these fingering
  settings … where can we put them". What a key reads is one choice (Synthesia's Key Labels: Names · Fingers ·
  None), in the Keyboard panel; the staff's finger numbers under Staff (Roland's notation settings); the hand that
  plays is its own row, not a fingering option.
- **A label on a key is one type step above its neighbour, not a headline (R42, v37):** "why the fingers numbers
  look so big". 14px on a white key over a 12px name.
- **A keyboard's settings are the Player's Keyboard panel, everywhere (R42, v36):** "I want like a piano settings like
  the player does. and in the header remain all other settings". The keyboard's button at the bar's end opens the
  tiles, Keys, and the piano's links; the gear keeps the page's own settings. Never mix the
  two in one sheet.
- **Fingering as printed charts set it (R42, v35):** "look at the examples where the fingering should be". Vita
  Piano: a number beside each note, right of the chord, the left hand on the bass staff; fingering changes with the
  inversion.
- **Test a canvas in its own runtime, not a look-alike (R42, v34):** "the settings arent working and the fingering
  still doesn't work". A local renderer showed both working; the canvas did not. Tap every control in
  `.scratch/r39/canvas/realrt.mjs` before saying it works.
- **A setting must earn its place; draw notation as engravers do (R42, v33):** "why do we need them … this setting
  is also weird". Piano gets the grand staff with no clef choice. A switch whose effect contradicts the page (a left-hand
  root under a slash chord) goes. - **Moved means removed from the old place too; a control lives on what it controls (R42, v32):** "you didn't
  remove the old settings". The keyboard's settings sit behind a keyboard button over the keys; a gear left with one
  group goes. Fingering
  belongs on the staff beside the notes, not in its own view.
- **A setting sits on what it changes; practice sits on the page (R42, v31):** "the staff settings are not very good
  … the practice in the player are too hidden".
  the ways to practise a chord are rows on its page. A bar holds one prominent action, trailing (Apple HIG).
- **The owner keeps some doubles (R42, v29):** "the chords choosing in both places was pretty good". Choosing the
  chord from its name and from the bar's first button stays; Ask before removing a double the owner liked.
- **Never: a practice page turned into a long builder of chip rows (R42, v27 undone):** "no, the previous layout
  directions were better". Chords keeps the keys, the chord, the views and a bar at the foot.
- **A page's bar holds its actions, not its settings (R42, v26):** "i dont like the bottom bar of the chords page …
  remove all the redundant things". What you choose sits on the thing
  it changes (the chord's name opens the chord;); what changes the
  display is behind the gear. One control per choice.
- **The app's tab bar is a symbol over a word (R42, v24):** "i don't like the bottom bar … of the app", after a
  words-only pill. Each tab the app's own icon over its name, the current place in a lens; a fade under the bar so
  content never shows below it. Corrected in v25 after reading the whole HIG page ("did you research the apple
  guidelines"): filled icons, and content peeks softly through the glass (scroll-edge blur), not a solid fade.
  Read a guideline in full before citing it.
- **Group by what a control changes (R42, v22):** "block chords or arpeggios change the player but they are in
  separate groups". A bar's capsules are subjects (the chord · its sound · the keyboard); a choice sits in the same
  capsule as the action it changes (Play beside Block or Arpeggio). Proximity, common region, similarity. A chord's
  inversion is written in its name as a slash chord (Cmaj7/E),.
- **Words beat symbols (R42, v21):** "make more clear", after a symbols-only bar. Every control shows a symbol and
  its current value in words (Block, Both hands), never a symbol alone except Play and Back.
- **A bar follows Apple's toolbar (R42, v20):** "apple guidelines provide more guides to toolbars". At most three
  groups, each a capsule with concentric items;
  text only where no symbol can say it (a chord's name); one tinted primary action. A switch of views is an
  equal-width segmented control of nouns, placed above what it switches.
- **Corners nest; a chosen tab contrasts (R42, v19):** "the inner corners doesn't match the roundness of the outer
  corners". An inner corner is the outer radius less the inset (a pill in a pill is a pill). The chosen item of a
  switch is filled in ink with white text, never a faint tint; tabs are named for what they show.
- **An icon alone is not enough (R42, v18):** "not all icons are very clear". A switch of views is words; a bar's
  buttons carry a caption under the icon; an icon draws what it does (stacked notes for a block chord, rising notes for
  an arpeggio). Only ‹ ›, Play and Back stand alone.
- **No setting twice on a page (R42, v17):** "we have now duplicate settings". Before publishing, list every control
  with its one home; a second control for the same choice goes (Chords: block or arpeggio one choice, the piano's
  settings only behind the Piano button).
- **A practice page can take the Player's shape (R42, v16):** "refactor the chords page from practice in the style of
  the songs player": Back · views · gear at the top, the views in the title's place (`TitleTabs`, owner 2026-11-13: "yes"), the keys edge to edge, the subject as the title, one floating bar
, sheets like the Player's. Spec `.scratch/r42/plan/chords.md`.
- **One canvas holds every place (v15):** "did you merge also the song player". The Player is a section of The ideal
  Piano Trainer, brought in whole with its R37 rulings, in the calm colours, opened by the song page's Continue and
  From the start; its Close goes back to the song. A place drawn elsewhere is merged, not left in its own canvas.
- **Calm is a language, not a layout (R41, drawn):** "i meant this minimalistic not that all the pages should look like
  it, refactor them properly and look at the example apps": the calm Chords page gives the tokens, the bare bar, grouped
  rows and the floating bar; each page keeps its own layout from its reference (iReal Pro's chart, Tenuto's answers,
  Soundbrenner's beats, Cleartune's needle, muted.io's circle, Flat's palette). Never one layout for every page.
  Spec `.scratch/r41/plan/songs-and-practice.md`.
- **Chords:** every chord type, fingering by hand and inversion, voicings to choose. Add, add2, add9 named as chords are.
- **Scales:** fingerings as the printed books give them, more kinds, Hanon 1–20, a tempo ladder.
- **Harmony:** draw the roles and moves on the chords (the Function · Root motion switch changed only letters).
- **Chord player:** Musicca's controls and options, with the best free sounds.
- **Metronome:** BPM large with −10 −1 +1 +10, a slider, Tap tempo, sound and meter, one Play; beats you set
  (accent, normal, silent), any meter, subdivisions, recorded sounds; one engine for the page, the Player and the quick
  metronome.
- **Practice ordered by relevance,** learning before tools, with a clear purpose; the Metronome's settings in place as
  Chordify's; the header's Tools a real menu, never a redirect; tools' settings never a single-option page or a redirect
  to app Settings; the Chord player simple, Apple-like, its drag and drop working (memory-palaces' fix); selection popups
  that say what is selected and why; the libraries editable like Songs, the built-in ones too; content kinds never
  mixed (patterns, method-book lessons, songs); Continue useful or gone; the sidebar like Claude's (2026-11-05).
- Grouped rows with a picture, a name and a line. **No strip hides options:** a key picker and menus.
- **Every Practice page has its own Settings page;** the app's Settings holds only what is app-wide.
- Every control says what it belongs to; "Root B" says of which scale; octaves are a stepper; formulas are computed; hands
  drawn as real hands; no half-empty top.

- **The libraries take Songs' row shape (loop, built to the Practice canvas):** Exercises, Accompaniment and
  Progressions show one search with Sort and filter (the sort first on a phone), place chips All · Favourites · Recently used · Mine,
  each book or style a heading with its count that folds, its rows in one card with hairlines: a 44px tile (a
  progression's opening, "I V", on its style's paint), the name bold over one line ("I – V – vi – IV"), the level, a ♡
  one tap; More only under a mouse. The chord chips and the description line left the rows; a progression's
  character is still found by the search. One `HeartToggle` for every library's ♡.
- **The overview takes the library's row shape (loop, built to the Practice canvas's Practice board):** each group a
  heading over one card of rows on a phone (`PlaceRow`: a 44px wash tile, the name bold over one short line, "Chord
  types, voicings, inversions"), large-tiled cards five across on a laptop; the bar's Tools (`ToolsButton`) beside
  Search on a phone. The books stay three rows (the library's places), not the canvas's merged Jazz vocabulary.
- **Loop round 18, the board's books as the app's (canvas 189):** the Practice board's Exercises are three rows, Finger technique · Barry Harris · Piano With Jonny, each with its count ("5 exercises"), as ruled; the merged Jazz vocabulary row is gone (2026-11-15).
- **The tiles in the board's paints (loop round 16, `r41_kit.py`'s `pic`):** the drills sage, the jazz books sky,
  the Chord player honey, and the four tools on the page's quiet fill (`plain`), the Tuner's needle in copper and
  the circle's C wedge in honey.
- **Accompaniment's rows in lilac (loop, 2026-11-15):** a pattern's row tile wears lilac, as the board's library draws it
  and as Accompaniment's own tile on Practice already did; it was yellow, one thing in two paints.
- **A pattern's keys show its chord (loop, 2026-11-15, `r63_pattern.py`):** a pattern's page marks C major's tones,
  C · E · G, in the chord-tone paints over its bar of C, as the board's keys do; a song tune stays unmarked. A key's
  name label ("C4") keeps one line.
- **A pattern's page as its board (loop, 2026-11-15, canvas 199):** its card holds the bar and one line of what it is;
  the longer description is The hands' ⓘ (owner: popups that show more with less UI). Used in is a small heading over
  one card of rows, as The hands, folded after five with Show all n; the big song cards went.
- **A library row's level in words (loop, 2026-11-15, the FingerTechnique board):** "Intermediate", as the Level filter
  names it, never pips and a number; on a phone it leads the row's line ("Advanced · Eight notes…") so a long Russian
  title keeps its width, in the laptop table its own column.
- **Recently used in the Practice libraries (loop, 2026-11-15, the Accompaniment and FingerTechnique boards):** the
  last eight rows opened, newest first, kept per library (`pt-practice-library` v3); a chip after Favourites and a
  place in the laptop's tree once anything was opened; at All the last three lead the page above Favourites. An
  exercise's, a pattern's or a progression's page marks it as it opens.
- **The Metronome's sound is a Woodblock (loop, 2026-11-15, the Metronome board):** the recorded block was named
  "Click"; it is named as the board and a drummer name it, "Вудблок" in Russian.
- **The Tuner at rest shows its A (loop, 2026-11-15):** before a note is heard, the reference note A₄ stands faint over
  "A4 = 440 Hz", where a grey dash read as a page still loading; the note heard replaces it in ink.
- **The Tuner without a microphone keeps its dial (loop 23, 2026-11-15, the Tuner board):** the A at rest and the
  needle stay; "The microphone is not available…" and Try again take the listening line's place, where the page had
  dropped to a line of text over nothing.
- **Keys named as the boards name them (loop, 2026-11-15):** where a page has no Labels setting (the Chord finder, a
  progression, a pattern) a chord's keys wear their paint and the note's name alone (`nameMark`), the degree left to
  the tiles and chips; and a page's keys grow to every key they light, never shrinking, so a chord found from A3
  keeps its root on the keyboard.
- **Scale settings is the board's one group of rows (loop 22, 2026-11-15, the Scales board's `SC_SET`):**
  Fingering a segmented row, then Start on, Compare with and Rhythm as rows with their value and a chevron, each
  opening its list; On the staff in its own group below. The labelled boxes it had were the old form, gone.
- **The Chord player's sheets in the same rows (loop 22, 2026-11-15, `r58_chordplayer`'s `CP_TAG`):** a section's
  sheet is one group (Section ›, Repeat with its stepper, Loop this section, Variation); its arranger sheet is the
  board's muted cards, Intro, Main each time through under its heading with the ⓘ, Ending, Into the next section.

- **The 3D piano plays (owner, 2026-11-15: "the 3d keyboard should also be interactive"):** on the Chords page and
  the Chord player, a press on the live 3D keys finds the key under the finger from the stage's own projection (a
  black key's top first, then the white key's), sounds it and holds it down in the pressed colour until the finger
  lifts, as the 2D keys do. The Player's 3D keys already sound on a press. One implementation in the shared stage
  (`piano_sheet.py`'s `HANDS3D`); the stage reports each key's corners (`pthands.bundle.js`, `__ptProj`).

## Sounds

The best free ones: CC0 (VCSL) for the metronome and kit, Salamander (CC-BY, credit in About) for the piano. Musicca's files
are reference only, but progressions are facts.

## PWA and touch

- **It feels like a real app:** no browser bubbles, loupe or callouts when installed.
- **The keyboard** swipes while a key is held, so no mini-map; it folds the same everywhere.
- **Fields stay above the phone's keyboard** as memory-palaces does it: field, label and buttons in sight, nothing jumping.
- **The Update button must work:** checked with two real builds.
- **Show what the device has:** Computer keys only on a computer.

## Navigation and bars

- **The laptop's keys a band too (2026-11-15, one piano):** Scales, Intervals, the Chord finder, a progression, a pattern and an exercise drew their laptop keys in a rounded card with a ring, inset in the page; each is now the band the phone and Chords draw, edge to edge under the bar across the whole pane (1462 wide, four octaves), the page's columns under it. The Chord finder also draws Nothing played as a state.
- **A Back on every page that is not a place, the glass circle (owner, 2026-11-15: "make proper back buttons where this is needed"):** every phone and laptop board was walked for its Back or Close; the last text links went: Administration's "‹ Settings" on a laptop and an Explore shelf's "‹ Explore" are the glass chevron beside their title, named for where they lead ("Back to Settings", "Back to Explore"), as a level's and Courses' now say "Back to Learn". The four places, Settings and Search keep none; the Player and editor leave by their bar's ✕ (2026-11-15).
- **One Piano sheet on every page with keys (2026-11-15):** the Practice pages' own Piano sheet (Keyboard 2D, Labels, Connect a piano: rows that led nowhere) is the one sheet's 2D part (`PIANO_SHEET_2D` in `piano_sheet.py`): Labels, then Sound and MIDI keyboard, in the same blocks, segments and rows as the Chords page and the Player; its 3D and 2D cards only where the hands are offered. Each choice shows on the keys: Note names or None there, None clearing the keys' names.
- **Nothing behind what floats (owner, 2026-11-15: "the floating buttons dont make sense when they have background, you should refactor the content properly so that it fits the floating buttons"; "the same for the headers"):** no fade or band behind the tab bar or a page's dock, and the bar is no band: its glass buttons float over the page, which starts under them at rest and scrolls beneath them; the bar's title belongs to the top of the page and fades as it scrolls under (a scroll-driven fade over 40px), the buttons alone staying. Every page ends with room for its floating buttons, so its last item rests clear of them.
- **One piano on every board (owner, 2026-11-15: "the keyboard is inconsistent across the app"):** the instrument wears `keyface`'s keys and stands edge to edge, never in a rounded card: a band at the top of a study page (Scales, Chords, Intervals), docked at the foot where the learner plays along (the Player, the editor, the Chord player, the Check, a chord run). The Check's keys left their inset card; the chord run's flat strip with no black keys became the real keys with the chord's tones lit. Only a diagram inside a lesson's card keeps a card.
- **One ⓘ on every board (2026-11-15, design-only consistency):** an explanation is the 20 ⓘ glyph in a 44 target (`INFOB`), and tapped it opens one small card anchored under it: paper, 16 corners, a ring and the float's shadow, 300 wide, 15 text, closed by a tap outside (`INFOTIP`), as Material 3's rich tooltip and HIG's popover. Settings' inline ink card with its 32 ✕, Pattern's 20px button and 288 card and Intervals' hand-drawn copy are gone.
- **One bar on every board (owner, 2026-11-15: "the headers" inconsistent):** every bar's buttons are 44 glass circles 8 apart (the kit's `IB`); Back is the same glass circle with a chevron at the leading edge, and a modal task (the Check, a chord run, Sign in) leaves by the same circle with a ✕ (`CLOSEB`), never a text "Close" or "‹ Explore" link; a word in the bar (Edit, Learned) is the glass capsule 44 tall (`TB`, `LEARNEDT`). A page under a page is 56 tall with its title 17 semibold, centred between insets as wide as the fuller side; a page that names itself large under the bar (a song, a lesson, a folder, the Chord player) has no bar title. A place keeps its large title at the leading edge (`TITLEBAR`). On a laptop the same bar, 40 in at its start (`LPAD`, `LTOP`). Apple HIG, Toolbars: "Use the standard Back and Close buttons … consistently implement it throughout your app". The Player's and editor's floating bar stay their own (`ScoreBar`).
- **Loop round 41, a list's lines take no room, as the boards' GROUP draws them:** the line between two rows is drawn over the row's foot (`rows-line`, `rows-hairline`, one utility for all 33 lists that parted rows with `divide-y`), so five 80 rows stand 400 and a 64 row stands 64, as the boards measure (they were a pixel taller each) (2026-11-15).
- **Loop round 38, a name at the boards' 24 on a phone:** a large title that is a name and may wrap (Your lessons and courses, a course, your own course; `named`) takes the step down `TITLEBAR` gives it, 24 to the 28 of a fixed page such as Courses, so Your lessons and courses reads on one line at 402.
- **Loop round 36, route states to AppLayers:** the ways on of Page not found, Something went wrong and a draft that will not open are the board's `BTN` pills (48 tall, bold, round), and an unknown address leads to Learn, as the board's Not found says. The deletion gate takes the welcome's box (22 corners, 24 above, a 20 title), as the board draws both.
- **Loop round 35, one section head (the boards' H2):** a section's name and its See all sit on one baseline in a row the name's height, See all reaching 44 without growing it, so Learn's Courses stands 14 under the Levels as the board draws it (it stood 23); Learn's Courses and Your lessons, Profile's sections and Explore's shelves share it (`SectionHead`, `SeeAll`), where three heads had been built three ways (2026-11-15).
- **Loop round 34, every bottom sheet 16 at its sides, as the boards' (BSHEET):** all 136 sheets on the boards hold their content 16 from the edge and the app's one sheet held it 20; the sheet's body and foot now sit at 16 (the style editor's preview bleeding by the same), and its head sits 4 closer to the content, so Search's field stands 23 under its title where the board draws 22 (2026-11-15).
- **Loop round 33, every sheet's handle as the boards' BSHEET:** 36 × 5 in the line colour (#DAD1C8, #453E38 by Night), where it was a 96 × 4 sand bar barely seen; one handle, so every sheet (2026-11-15).
- **Loop round 33, the phone's tab bar wears the board's filled icons:** Learn's cap, Songs' notes, Practice's metronome and the Profile's figure filled at 25, as the kit's TABBAR (Apple's HIG: filled symbols in a tab bar); the laptop's sidebar keeps Lucide's outlines; a signed-in learner's picture stays the Profile's tab (2026-11-15).
- **Loop round 29, a place's title tabs as the Songs board:** the view not in sight (Explore beside My songs) in the line's colour, 26 at 700 with -0.01em tracking, the chosen in ink; hover brings it to soft ink.
- **Search names a song as the library does (loop 25, PAL):** a song result shows its printed title, else its composer, under its title (Amazing Grace over "New Britain (American folk tune)"), from the one `entryAuthor` the library's rows use (2026-11-15).
- **The app's notices as the board's (loop 24, AppLayers):** on a phone they stack at the top under the status bar,
  12 in from each side; on a laptop at the foot's right, 28 in, 440 wide. A new version is an ink band 56 tall
  ("A new version is ready", Later, the honey Update pill; "Restarting…" alone once tapped). A save that failed
  is a crimson wash (`--alert`) in its deep ink: the line 16 bold, the help 14, Close and a deep Settings pill
  at its foot; the editor's unsaved notice wears the same (2026-11-15).

- **Loading is the page's shape, as the board's (loop 24, AppLayers):** while a screen's chunk loads, six sand
  blocks (36, 96, 24, then three 56) with 14 corners, 12 apart, fading from 90% to 40%, in place of a lone spinner
  (2026-11-15).

- **A screen that cannot open says why, as the board's route states (loop 24, AppLayers):** one `RouteState` for
  Page not found and Something went wrong: a 72 round mark (? on sand, ! on a crimson wash, the offline mark on
  honey), the title 22 bold sans, a 16 line saying why ("The link may be old, or the song or lesson was deleted.";
  "The screen could not open. Reloading usually fixes it…"; offline, "This screen opens once you’re back online"),
  then the ways on 48 tall (Back, Reload), centred in the screen (2026-11-15).
- **A toast is the canvas's TOASTS** (loop): ink, 14 round, 52 high, its line 15px in the sheet's colour, Undo in honey at its right; no ×, it goes by itself or by a swipe. By Night the toast is light and Undo the deep honey (`--toast-action`), since the board's honey on cream reads at under 2:1. It sits above every sheet and dialog (z-60).
- **Loop round 24, a sheet's page has its Back in the header:** across from Done, beside the title, never a lone
  chevron row under the header nor a sticky "‹ Back" over a list; one way in every sheet with pages (the editor's
  gear, the Player's settings and its lists) (2026-11-15).
- **Loop round 23, two-line rows as the boards:** a row's title over its detail is 16 semibold (Courses,
  Badges, Milestones, the song and lesson lists), a one-line row (Settings) stays regular (2026-11-15).

- **The learner at the sidebar's foot (loop round 20, LearnLaptop):** the Profile row and its gear stand at the
  foot of the laptop's sidebar whether or not recents show above them (were under Practice with none) (2026-11-15).
- **Search's suggestions as the board's link rows (loop round 19):** 48 tall, 10 apart, 12 at the chevron; a
  result keeps SROW9's 52 (2026-11-15).
- **The page under a sheet dims in warm ink, unblurred, as the board's BSHEET (loop, 2026-11-14):** every sheet, dialog and confirmation lays `--scrim` (ink at 28%, by Night near-black at 84%) over the page, never a black blur; Search's laptop panel wears the board's line and lifted shadow.
- **Floating actions at the bottom right (owner, 2026-11-15: "the new floating actions should be on the right"):** every floating action stands at the bottom right, over the tab bar on a phone, its menu opening up from it. One shape: the 56 honey + 16 in from the edge (`NEWDIAL` for a choice, `NEWFAB` for one thing, Groups' New group too, which was a pill of its own), 40 over the home indicator where no tab bar stands; Material 3: "the best place for the FAB is typically the lower right corner … easy to reach and less likely to cover important content". A page's tool dock (Play, Hands) is a toolbar, not a FAB, and stays centred; on a laptop New stays in the bar.
- **The tab bar floats, as the board's TABBAR (loop, 2026-11-14):** a glass capsule 64 high, 16 in from the phone's edges, over the home indicator, the current place on the chosen fill; a soft fade under it. The rail and the sidebar unchanged. A chosen chip is filled in ink (canvas 153), every `ChoiceChips`.
- **Ports copy the board's code, not its picture (2026-11-13):** "why dont you follow the design artifact and dont
  read its code how it implements and does things to create accurate redign of our app. the chords page doesnt look
  like the design at all, and the same with other components like the piano or the floating actions what is with
  this white border around the actions": every port reads the board's generator and its kit helpers and copies their
  values; the dock is the board's glass capsule (68 tall, 8 inside, 50px pills, the 52px honey circle), never an
  opaque white rim round grey pills.
- **The title is in the bar, never an empty bar over it (2026-11-13):** "I dont like that the header is occupied only by
  these two buttons no the right and the rest is just empty": the title sits at the bar's left, the actions at its
  right, one row, on every place and page, phone and laptop.

- **Compact bars:** "why the headers take like a half of the screen". One row.
- **Nothing under the bar:** "i dont like how this published is under the header it looks awful".
- **Titles are never cut;** two lines before an ellipsis.
- **Tabs that make a header taller are rejected;** a page's views sit in its content or take the title's place.
- **The Profile is a tab.** Settings opens from its gear on a phone and sits at the sidebar's foot under Search.
- **One place current:** "not such things as two highlights, this is bad ui".
- **One sheet shape, as R42 and the canvas draw it (loop round 10):** every bottom sheet's head is its title centred
  in the sans and Done at its right in the link's ink, on the page's paper with its cards white on it; the X and the
  large serif title are gone. Search's sheet is the first that shows it.
- **Search built to the canvas (AppLayers, 2026-11-13):** on a phone the app's bottom sheet (Search, its Close), fitting
  what it holds; on a laptop a panel over the screen with the keys said at its foot. A framed field with Clear; before
  typing, Recent searches as chips and three Suggestions (Continue: the next lesson, Chords, Metronome) in a card;
  results grouped in cards under small capitals, a bold title over a small grey line; Nothing found says so with
  Clear search. The list of every Practice page with icons and descriptions is gone.
- **A page's bar on a laptop centres its title (loop round 17):** seven of the nine laptop boards (Chord finder, Exercise, Metronome, Pattern, Progression, Tuner, Scales, Intervals) draw TOP stretched: Back at the start, the title centred, the acts at the end; only the Chord player draws LTOP. The bar keeps the centred title at every width.
- **Search is a palette,** never a page. **Back means up,** to where the learner came from, else the parent.
- **The pencil means one thing:** edit what the screen shows.
- **Search's palette has no line of keys under it (loop 23, 2026-11-15):** "Up and down move through the results…"
  stood under the laptop's results, an explanation under a control; it is the dialog's description for a screen
  reader alone now.

- **Every laptop screen adapts: the sidebar folds, Focus hides the rest (owner, 2026-11-15: "make the ui very
  adaptable like the main focus of the page and the other things can be easily hide or show … for every screen"):**
  the sidebar's head holds two 40px buttons after the name. Hide sidebar (Apple HIG, Sidebars: people can hide it;
  macOS puts the toggle at the window's top leading edge) folds it to a 76px rail of the same places, icons only, the
  profile its avatar (Material 3, Navigation rail). Focus hides the sidebar and every side panel (a tool's settings
  column, the library's Places, a list pane) so the page's one thing fills the window, as macOS full screen and
  Ulysses' distraction-free mode do; Exit focus, a glass capsule at the foot's leading corner, or Esc brings them
  back. No letter shortcut: a letter alone is the piano's. One implementation for all 61 laptop boards
  (`.scratch/r39/canvas/lapwin.py`, run by `index.py`).

- **On a phone the floating bar steps aside while reading (owner, 2026-11-15, the adaptable UI):** scrolling down a
  page past its first 56px slides the floating bar up and out (220ms, the app's one curve); the first move up brings
  it back. Apple HIG, Toolbars (hide bars on swipe so the content has the screen) and Material 3's top app bar (hide
  on scroll, return on scroll up). Under reduced motion it changes without moving. Every phone board with the floating
  bar (59), by `index.py`; the floating actions at the foot stay.

- **Sections fold on the overview pages (owner, 2026-11-15, the adaptable UI):** on Learn, Practice and Profile,
  phone and laptop, each section's heading is a disclosure (Apple HIG, Disclosure controls; Material 3's expandable
  list sections): a 44px button, the title and a chevron that points down when open and to the side when folded. The
  content goes, the heading stays, so the page becomes a short list of what can be opened again; See all stays beside
  it. `.scratch/r39/canvas/folds.py`, run by `index.py`.

## Actions and menus

- **Every confirm as the board's ASK (loop 24):** 372 wide on the page's paper, 20 corners, 20 in; the question 18
  bold sans at the start, its line 15 on 1.45; Cancel (sand) and the act as two equal 44 pills, a loss filled in
  crimson; no band under them. One primitive, so ConfirmDialog, the deletion gate and every ask follow
  (2026-11-15).

- **A New sheet opens with its name focused (loop round 18):** New song, a New folder, a New group and every `NewSheet` put the caret in their name field as they open, the phone's keyboard up, as iOS's New Folder does; the learner types at once instead of tapping the field first.

- **One way to each action:** "why are there duplicate buttons and actions".
- **Drag, never Move up or down:** "why dont drag and drop".
- **Short menu items.** **Change it everywhere:** "and not just in one place".
- **Floating buttons:** the main action a honey 56px circle, a second a raised 48px; a dial opens as a card of rows.
- **Cards whole:** "don't you see how bad this looks with these cut borders".
- **Undo instead of asking** (2026-11-07, "adopt also this"): a loss that can be undone happens at once with Undo in its
  toast; only what can't be undone, or reaches other people, asks first. Replaces "confirm before losing or hiding work".
- **A loss is shown as a loss** (2026-11-07, "i don't like your rejection", of leaving out loss framing): name what goes,
  by name or count, and let the way out name its cost; always true, never a fake countdown.
- **Filter chips show their counts** ("Advanced 6"); a chip with none is dimmed, not hidden.
- **Progress, by best practice** (2026-11-07, "use the best practices"): one practice record (time this week against
  last week, one bar per day on a value axis), a streak with milestones and rest days earned by practising (one per 7
  days, two at most), and the week shared in a group. Drawn, not built.
- **Only what works here:** "only the relevant actions and ui should be shown and not ui that doesn't work". A choice never
  moves you to another tab.
- **A menu leaves out what cannot be done** (loop, 2026-11-13, from "only the relevant actions"): no greyed item with a
  reason in a menu or a gear (Feedback before a take, Voice commands without a voice, Sections with one, Hide on the
  last staff in sight); an in-place control may still grey.
- **One icon, one meaning.** **One home per idea:** the page shows what you look at, its Settings how it always behaves.

- **In Edit, a row's Remove is a red minus, not a red word (loop, 2026-11-15):** the Courses page and a course in
  Edit drew "Remove" in red on every row, a column of red words that squeezed the titles to three lines. Each is now
  the iOS delete control, a 22px red circle with a white minus in a 44px target beside the drag handle, named
  "Remove <title>" with its tooltip (Apple HIG, Lists and tables: editing). Undo still follows in the toast.

## Profile and Settings

- **Administration's states in the States box, and its empty states the one empty state (loop, 2026-11-15):** Accounts with nobody found ("No account matches “zz”", Clear search), Content reports all dealt with (a tick: "No open reports"), removing an administrator asked, an error's stack open. The bare grey line in an empty card is gone from both.
- **Legal uses the laptop's width: an "On this page" contents beside the text (loop, 2026-11-15):** a 240 column of the document's sections, sticky, the one in view on sand, beside the 680 text (as a documentation page's contents); Terms of Service is its state in the States box. The Privacy Policy · Terms of Service switch spans the column (it clipped "Terms of Service").
- **Your lesson's and Your course's Settings show their states in the States box (loop, 2026-11-15):** Rename open, In courses open (a lesson), Deleted with Undo, Progress reset with Undo. The delete toast names the loss, "Lesson deleted" or "Course deleted", never a bare "Deleted".
- **Check a song shows its states in the States box (loop, 2026-11-15):** keys chosen, a wrong answer ("Not quite: it's C E G", the count at 1 wrong), a right answer, the answer shown, Results.
- **The score editor shows its states in the States box (loop, 2026-11-15):** the palette open, a rest chosen, a clef waiting for its place ("Treble clef: tap the score where it goes · Cancel"), the piano hidden, Score settings open.
- **Takes on a laptop is a list beside its review, not a page and a page (loop, 2026-11-15; the owner: "the empty space should be properly used"):** the takes in a 372 column, the chosen one on sand; Review your recording beside it in a card filling the rest (the take written out across two bars, the piano roll with its split point, Quantize, Hide raw notes, Into, Discard · Save to score). ··· keeps Download and Delete; Review left it, the review being always in sight. Focus folds the list away. The phone keeps its list and its Review page.
- **Your lessons and courses on a laptop: the list beside a pane for the one chosen (loop, 2026-11-15):** the list fills the window's width (it stopped at 900); a click on a row chooses it, on sand, as in Mail or Finder, and a 400 pane beside it shows the course or lesson: its picture, name, what it is, its line, Progress (1 of 4 learned) with its lessons ticked, then Continue: Warm-up before church (or Open) and Settings. Focus folds the pane away. The phone opens the page as before.
- **Courses on a laptop: the shelves side by side (loop, 2026-11-15):** Beginner courses, Intermediate courses, Chords and improvisation in three columns, Method books flowing under the first, every course in sight without a scroll (the list stopped at 860, half the window bare). Edit keeps the same columns with its red minus and handles, New course across the foot.
- **A practice run's results on a laptop: two columns (loop, 2026-11-15):** the verdict, its three figures, the personal best and Practise mistakes · Retry in a 400 column on the left; The run written out large beside it (six chords a line, 116 each, the marks under them). It was one 560 column in the middle of the window. The phone keeps its one column with the actions at its foot.
- **One piano, two places, one size each (loop, 2026-11-15; the owner: "one keyboard"):** the piano that shows (Scales, Intervals, Progression, Pattern, Exercise, Chord finder) stands at the page's top, 150 on a phone, 1462 × 180 edge to edge on a laptop, as it was; the piano you play stands at the foot, 112 on a phone and 170 on a laptop, flush with a hairline above, across its whole column. Brought to it: Check a song (phone 128, laptop a 760 card), a chord run (a 760 card), the Chord player (160, a rounded card), the score editor (132). On a laptop the run's staff and transport stay in a 760 column above the keys.
- **A folder on a laptop is the library's table (loop, 2026-11-15):** Church's songs under Title · Composer and key · Progress with the heart last, the window's width, as My songs draws its songs; Archived (2) closes the table. It was a 760 list of cards in the middle, another shape for the same songs.
- **A song's section on a laptop in two columns (loop, 2026-11-15):** under the 2 × Verse card, Chords and In time on the left, One change at a time and Patterns on the right, in a 1180 page; the whole section in sight without a scroll, Practise floating at the foot. The phone keeps its one column.
- **New pattern (and a pattern's Edit) on a laptop in two columns (loop, 2026-11-15):** the name and the hands' choices on the left; How it plays on the right, twice as tall as it was and kept in sight while choosing, Cancel · Save under it. It was one 640 column with the picture scrolling away.
- **A take's page on a laptop in two columns (loop, 2026-11-15):** the name, Play and the piano roll (drawn at 720 × 220 with its bar strip) on the left; Keep bars, Download and Delete in a 380 column on the right. It was a 720 column with the actions under the roll.
- **Edit progression on a laptop in two columns (loop, 2026-11-15):** Name, How it sounds and Style on the left; The progression and its Lines on the right, under the draft's pill. It was one 640 column.
- **An object's Settings on a laptop in two columns (loop, 2026-11-15):** a song's, a lesson's and a course's Settings set their groups side by side under the title: what it is on the left (Library; Read as and The lesson), sharing, progress and Delete on the right. One shape for every Settings of a thing; the app's Settings keep their sidebar and pane.
- **Publish on a laptop in two columns (loop, 2026-11-15):** why publish, Category and Description on the left; As others will see it, the rights box and Publish on the right, kept in view as the left scrolls, in a 1180 page. It was one column with the preview and Publish below the fold.
- **Archive and Trash as the library's table (loop, 2026-11-15):** on a laptop each is a 1180 table, Title · Composer and kind · Archived (or Deleted), Restore and ··· on each row, the page's one act (Restore all, Empty Trash) beside the title; on both sizes the Archive ends with a Trash · n songs row, which had no way in.
- **Search on a laptop is the sidebar's field (loop, 2026-11-15):** the Across the app board's laptop bar loses its second Search; the sidebar's Search (Ctrl K) opens the palette, and the page under it is Learn's two columns in a 1180 page. Learn's and Practice's laptop bars lose their dead Search button too; on a phone, with no sidebar, Search stays in the bar.
- **The Chord player's keys as every board's (loop, 2026-11-15):** on a laptop the playing piano runs the window's width at its foot, under the chart and the Style column (it stopped at the chart, 906 wide), and shows at least C2–C7 when the Range fits the chords, so its keys are the size of Check's, Scales' and the others'; the phone keeps its 2½ octaves at 112.
- **The Chord player's dock is its controls, the gear its settings (loop, 2026-11-15):** Key, Tempo and Repeats each open their own wheel (all opened Style), on a laptop a popover rising from the dock; Key rewrites the chart, the palette (D major chords) and the keys in the new key. Settings lose Transpose and Repeat the sheet, which the dock's Key and Repeats already are; the laptop's side column loses its second Style, the dock's.
- **A lesson's laptop bar as its phone's (loop, 2026-11-15):** Back and the lesson's acts, no centred parent name ("Foundations" sat in the bar above the lesson's own title and its line "Lesson 7 of 13 · Foundations").
- **One cover for a song and one for a folder, everywhere in Songs (loop, 2026-11-15):** a folder's page, its Settings, a song's Settings and Publish, the laptop folder table, the Archive and the Trash wear the library's covers (a song its first notes on a staff, a folder its stack of pages in its paint), where they wore a treble-clef tile or a key letter. Explore's cards and a public song's page show its first page in small (title, who wrote it, a staff) on the card's paint, as My songs' shelf, where a treble clef stood.
- **Recently used in every Practice library (loop, 2026-11-15):** Progressions' place chip, sort and list title said "Recently played" where Accompaniment and the Exercises say "Recently used"; one word now. Songs keeps "Recently played", which is what a song is.
- **Shortcuts only where there is a keyboard (loop, 2026-11-15):** the Across the app board's phone bar loses its Shortcuts button and sheet; the laptop keeps them beside MIDI.
- **Night for every area (loop, 2026-11-15):** My songs, a song's page, Explore, a folder, the score editor, a lesson, a course, Profile and Settings gain their Night boards, phone and laptop, from the one map in night.py; a cover's paper (a song's first notes, a folder's pages, a shelf's first page) is the night's card and its ink the night's ink, as the score's, where it stayed white. Settings' Appearance previews keep their own theme by Night: Light stays light, where it turned dark and matched Dark.
- **No earlier drafts on the canvas (loop, 2026-11-15):** the Player's "Earlier drafts" boards (and their Night) go: a legacy shape kept beside the ruled one, and the only place a rejected phrase ("Pulsing chords") still showed. Git keeps them.
- **No On-screen piano page (owner, 2026-11-15: "the on screen piano settings are also weird and doesnt seam necessary"):** the keys' choices live once, in the Piano sheet beside the keys (Keyboard, Labels); Key size, Pedals, Chord symbol, Note names on highlighted keys, Swipe gesture, Placement and Volume are gone (they repeated that sheet, showed no difference, or are the device's own volume). The grand's offline download is Storage and backup's Piano sound; the computer keyboard is General's. Settings' Piano group is MIDI devices alone, and the pages' "On-screen piano ›" rows are gone. No line explains under a control there either (Protect from clearing, Reset progress).
- **Loop round 40, the account pages' Google and Apple pills ringed as the SignIn board's SSO:** the soft hairline (the board's LINE) round each, where they wore the fields' darker control line; the fields keep it, for 3:1, and stay 48 tall as FIELD draws them (2026-11-15).
- **Loop round 37, Profile's guest head as its board:** the picture centred on the words, the title 22, the line 14/1.4, Sign in a 44 bold honey pill (it was a rounded square under a top-pinned picture).
- **Loop round 37, a switch row as its neighbours:** 16px and 52 tall, as the boards' toggle rows sit level with the link rows beside them (it was 18px and 56, so Favourite stood taller than Duplicate under it), everywhere a switch row is used.
- **Loop round 36, a run's results as the PracticeResult board:** Back alone in the bar, the run's name on the page (26, tightened), tiles of tabular figures over 13 labels, sections 20 apart on a phone, Retry a 52 bold pill at the foot. The board's run on a staff waits for runs that keep each chord; a trainer run keeps accuracy, streak and pace.
- **Loop round 36, a closed editor or Administration says so as the route states do:** a 72 lock on the sand, its line 17 semibold, what to do 48 tall, in every content editor and the Admin pages (it was a bare bold line) (2026-11-15).
- **Loop round 36, Legal as its board:** Privacy Policy · Terms of Service one switch over the page (the other replaces this one; Конфиденциальность · Условия in Russian, to fit), on a phone the title leaves the bar for the page, 30 bold, the date 13 under it, each section's heading 19 bold in the sans (the book serif is gone there) (2026-11-15).
- **Loop round 36, the account pages as the SignIn board:** Close (an X) in the bar, the title 32 bold in the sans at the head of the column, everything 16 apart; Google and Apple pills 50 tall (Apple "· Coming soon" in its words, no chip), the fields bare on the page with their labels 13 semibold, the honey action a 50 pill, Forgot password?, Create an account and Back to sign in in the link colour reaching 44, the Terms and Privacy links too. Field outlines keep the control line, for 3:1 (2026-11-15).
- **Loop round 34, Settings' values at the kit's 16 (canvas v211):** the Settings list drew a row's grey value (Match system, Up to date) at 15 where every other group's row draws 16; the board now draws 16, as the app's one row does (2026-11-15).
- **Loop round 34, Profile's tiles and week as the app has them (canvas v210):** the board squeezed a tile's icon to a sliver to keep "Songs learned" on one line; its icon now keeps its 15 and the name wraps to two lines, as the app's; the week card is "Last 7 days", the true name of a rolling week with today last (2026-11-15).
- **Loop round 30, Profile's sections 16 apart as the board's:** the learner, the week, the next badge, Badges and the rest stand 16 apart (were 28), on a phone and in each laptop column (2026-11-15).
- **Loop round 25, MIDI devices to its board:** MIDI keyboard a headed group of plain switch rows (no tiles, no ⓘ); Playing's Octave shift a − 0 + stepper at its row's end, Touch and Pedal segmented rows, Calibrate timing a plain link row with its value; Bluetooth and the MIDI log plain link rows with chevrons (2026-11-15).
- **Loop round 25, Report a problem to its board (P_REPORT):** Description in 13 semibold over a 12-cornered field on the card's white, its soft line, no resize grip, its example "What were you doing, and what happened?"; the footnote in 13; Send report a 50-tall pill, sand with soft ink until there is something to send. The footnote keeps what the report truly carries (2026-11-15).
- **Loop round 25, the User guide to its board (P_GUIDE):** each part a card whose head, its title in 17 semibold sans with the chevron at the far edge, opens it; one part open at a time, the first to begin with; the steps plain paragraphs, the tile icon beside each and the dividers gone (2026-11-15).
- **Loop round 25, About to its board:** the app's 56 tile with its name (20 bold) and version beside it on the page's left edge; Software update its own group, where it stands beside a dot (grass current, honey waiting, ochre at work) over Check for updates, or Install and restart when one waits; Licence in regular weight; Legal plain link rows. The acknowledgements keep each work's maker and licence, which their licences ask for (2026-11-15).
- **Loop round 25, Storage and backup's Device storage to its board:** the size used in bold over a bar parted into Songs and takes (sky) and Piano (green) with its legend; Protect from clearing a switch, on and still once the browser grants it, what the browser said in a line under the card (2026-11-15).
- **Loop round 25, Selection toolbar to its board (P_TOOLBAR):** the toolbar previewed on top as a selection shows it (a 60-tall pill, "2 selected" and the bar's icons in 44 circles, live as acts change), then the acts as rows of their name alone (60 tall, red −, the grip), Available with "All slots are in use" under its heading rather than in the card, Restore defaults and the footnote; the sections 16 apart (2026-11-15).
- **Loop round 25, Swipe actions to its board (P_SWIPE):** Songs | Folders, then the row as its leading swipe opens it (the first act's tray in its swipe paint, solid under white, beside Amazing Grace or a folder), then Leading swipe (right) and Trailing swipe (left), each a white group of First and Second whose value opens the side's acts and No action (a sheet on a phone, a popover on a laptop); emptying First moves Second up. The add, remove and drag list and Restore defaults are gone from this page; the footnote keeps Undo, true to R38 (2026-11-15).
- **The welcome as its board (loop 24, AppLayers):** a 22-cornered dialog on the page's paper, the app's own tile
  (72, the keys) over "Welcome to Piano Trainer" in 24 bold sans and its line in 16; Language in the soft caps
  over its two choices; Start playing (honey) over Sign in (sand), each a 50-tall pill the dialog's width; no
  footer band (2026-11-15).

- **Offline, the piano download waits and says why (loop round 18):** Storage and backup's Download for offline use is dimmed offline with "Needs the internet" (ru "Нужен интернет") beside it, as the board shows it only when it can run (`offCan`); it comes back the moment the network does.

- **Loop round 22, Notifications to its board (P9_NOTES):** groups headed in small capitals, rows 64 with the title
  medium (bold while unread) over a 13px time, soft hairlines; the empty state's one action, Practise now, to
  Practice (2026-11-15).
- **Loop round 22, a badge's and a milestone's pages to their boards (P9_BADGE, P9_MILE):** the medal 88, the
  name 26 bold sans, its tier line 15; How to earn it and Personal records in small capitals; Tiers and Milestones
  20 bold heads with their value at the right; tier rows 60 high with 36 medals, locked ones dimmed, the date
  reached in green; a milestone's picture a rounded square (12 in a row, 24 at its head); 44 marks in lists
  (2026-11-15).
- **Loop round 22, Profile's Streak and Achievements to their boards (P9_STREAK, P9_ACH):** Streak is the flame
  in a 64 sand wash beside "n day streak" (28 bold sans) and its line, the calendar, then Longest streak and Days
  this month as value rows on white (`GroupRows surface="sheet"`, the board's `bg=SHEET`); the records' figures
  22 bold sans, not the serif (2026-11-15).
- **Loop round 19, Settings' gaps as the board:** on a phone the list sits 4 under the bar and a page 8 under
  it, its groups 16 apart (were 24), as `GROUP`'s pages draw them (2026-11-15).
- **Loop round 19, the board's glyphs everywhere:** the keys glyph on every picture of the piano (a folder's, a
  course's, an avatar's, the guide's), the stairs on Profile's Scales, and Selection
  toolbar a bar of actions under rows, as the Settings board draws it (2026-11-15).
- **Settings on a laptop as its board (loop round 16, SettingsLaptop):** no bar; the list a full-height column,
  its hairline to the right, headed by a 28px Settings; the page beside it: Back (a page under a page) and its
  actions in one 44px row, then its 26px title.
- **Practice history built (loop round 10, canvas 160):** every practice run kept on Profile: the last three on
  Profile, all of them by day under a 30-day chart, each opening its results (Accuracy, In a row, Per answer, the
  personal best, Retry at that level). Timing, Tempo, the run on the staff and Practise mistakes wait for the
  trainer to keep each answer.
- **Built as drawn, no old shapes kept (2026-11-13):** "you should refactor with no backwards compatibility, you should do
  the design and ui as the design artifact says and as close as possible": each area's app is rebuilt to its canvas
  boards, measured against them. Settings first: rows 52 tall with a 30px solid square and a regular 16px name, group
  names in small capitals, the account card bold with its green sync line; on a laptop the same list is the pane, the
  page open lit, the page's title over its own column; General's Appearance three ringed screens, Language two ringed
  buttons. The laptop's tree of Settings is gone.
- **Pressure to practise (2026-11-12):** "I want to put pressure on the user": the streak holds the learner to daily
  practice (PRODUCT.md, principle 6), always true, never locking or charging. Replaces "no streaks as pressure".
- **Canvas 129 ("there are admin controls, no roles, no edit mode for the pages"):** Administration drawn in full in
  Settings; three roles; Edit mode is the page itself (Done · English | Русский · Publish…), Learn's level edited in
  place; Preview as learner (2026-11-11).
- **Settings refactored and audited:** a Back on every page (Customise select toolbar, About had none or a broken one);
  on a laptop the section list and the page scroll apart, as the libraries' panes; each preference checked for whether
  it belongs in app Settings or its screen's gear, View as a learner placed where it belongs; professional wording
  (2026-11-05).

- **Canvas 131:** Preview as learner moved to Settings › Account › Editorial access (with Role), its pill "Previewing as
  learner · Exit"; Administration a group of its own, hidden while previewing. Every Settings page drawn with its
  real strings; explanations behind ⓘ; a picture where a choice is visual (the keys' note names, the selection
  toolbar, a swiped row); Profile's pages and the sign-in flow drawn (2026-11-11).
- memory-palaces' Profile: the initial, three figures, Activity, badges. The Account is Settings' first row; Sign out and
  Delete are rows asking in a dialog.
- **Settings:** one column on a phone, two panes on a laptop; five kinds of row; destructive last, alone, red; pictures for
  visual choices ("these are very heavy to read").
- **Canvas 128:** Profile shows the week as one bar a day and the next badge as a ring; Settings rows carry coloured
  squares and grey values, Appearance is three small screens (2026-11-11).

- **Loop round 13, Profile to its board's colours:** the week's bars and the next badge's ring in the board's copper
  (today full, the other days at half), "Next badge" in the eyebrow's rust, the week card's 15px bold title and
  14/12 padding; a tile's figures outrank their units ("2 h 45 min" in a third of a phone) (2026-11-14).
- **Loop round 13, Settings' pictures:** as the board draws them: MIDI devices a plug (and so wherever MIDI is, the
  bar's MIDI button and Practice settings), User guide a closed book (an open book is a course), Report a problem a
  warning triangle (2026-11-14).
- **The account pages offline say one true thing (loop 23, 2026-11-15):** "You’re offline. Your account needs a
  connection." over Sign in, Create an account, Forgotten password and New password alike, where Forgotten password
  said Signing in needs one.
- **A week not yet played says what fills it (loop 23, 2026-11-15):** Last 7 days with nothing played shows
  "Play anything today and it shows here." centred over the flat days, instead of seven empty tracks alone.

## Words

- **Offline said one way (loop round 22):** "You’re offline. <What> needs a connection." everywhere a screen
  needs the network (Administration and Report a problem were "You are offline… requires an internet
  connection"); ru «Нет подключения к интернету. Для … нужна сеть.» (2026-11-15).
- **Professional wording, everywhere:** "refactor all the text and string and all names and write professionally, not
  plain words. write professional wording and sentences and not plain like you did before" — labels, settings, tips and
  empty states read like Apple, Chordify, Flat or MuseScore, in en and ru; this replaces the earlier "plain words" (2026-11-05).

- **The term a musician uses:** "check all the strings … use professional terms". Failed: Move smoothly, Between two chords,
  Starting position, Who wrote it, Through the keys, Hear notes as you edit, Tune, First chord.
- **Never a paraphrase, never an explanation line (canvas 158, 2026-11-11):** "why do you keep inventing bad and
  unprofessional names like in every key round the up by half steps and not chromatically or diatonically. check the
  contradicting instructions": Chromatically, Circle of fifths, Diatonically, Wait mode, Hands together, Inversions,
  Arpeggio, Alberti bass, Diatonic triads, Lead-sheet reading. Failed: In every key up by half steps, Round the circle,
  Through the key of, Waits for you, With the metronome, Missed chords come back, The four chords of a thousand songs,
  every "what it means in a line" under an option. The rules that invited it ("a name says what a control does",
  "familiar words over jargon", "plain questions", "one line on how it works") were rewritten or marked superseded.
- No ubiquitous-language glossary (2026-11-05): "i dont want the ubiquitous language anymore".

## Process
- **Design only; the canvas made consistent (2026-11-15):** "now you need to work only on the design and no app
  implementation at all. fix all the inconsistencies in the design. like the keyboard is inconsistent across the app,
  floating keyboard, the headers, the floating actions. the new floating actions should be on the right. and the
  settings are not correctly placed … all the states should be properly made like the chords page does in this box
  outside of the phone frame. when you think that you should refactor something … research for the official
  guidelines and professional designer resources": no app code until the owner says; one keyboard, one floating
  keyboard, one bar, one floating action (bottom right), settings in their homes, every board's states in the box
  beside its frame; each refactor cited from HIG, Material 3 or designers' resources.
- **The computer used properly (2026-11-15):** "all the ui should be properly made also on computer and the empty
  space should be properly used": no laptop board a phone column in an empty screen.
- **Design first, then build to it (2026-11-13):** "why are you improving the current app and not first make design
  and after that implement the design as close as possible. do like this": in a loop, each area is redrawn on the
  canvas and published before any change to the app; the app is then built to the drawing as closely as it can and
  checked against it at both sizes. Never a screen patched in the app with no drawing first.
- **No questions in a loop** (2026-11-13): "in the autonomous mode you don't ask questions to me, you work
  autonomously": a loop's report ends with what was decided, never a question.
- **No unintended shots of sign-in prompts, welcomes or tours** (2026-11-05): dismissed before every shot
  (`clearOnboarding`), shot only when needed or asked for (`ONBOARDING=1`).
- **Never a screenshot before the page has fully loaded** (2026-11-05): `scripts/settle.mjs` before every shot.
- **Mockups in the owner's frames:** the real iPhone 17 Pro (app, Safari, and the smaller iPhone) and the MacBook Air
  with a macOS Safari window; inspired by the example apps and sites the owner sends (2026-11-05).
- **A signed-in learner is never asked to sign in again** after an update (2026-11-05).

- **Mockups and questions:** whole-page mockups with a feedback box each worked.
- **Test every UI at least twice** (2026-11-05).
- **Impeccable twice on each page and each mockup,** as it is made, never only at the round's end: "each page and each
  mockup and not only at the end" (2026-11-05).
- **Plan before building:** generic descriptions led to wrong builds. "Did you read it every time you implement something."
- **"Why did you stop?"** three times: keep going until the list is empty. A message is not a stop.
- **The maximum principle:** "this spawns too many agents and eats up all the usage".
- **No tests in a loop** (2026-11-14): "dont run the tests, no test"; the build runs once at an area's end.
- **The references show what to add:** "didn't I add screenshots for you to add what we don't have".
- **Don't decide UI trade-offs silently:** "dont make such bad decisions for yourself".
- **No committed `.env`:** "WHY IS the .env commited to the git". That decision was the owner's.
- **Learners' data:** never read it.
- **Skills** come from their official source; superpowers is `obra/superpowers`.
- **Interrupting means wait:** take in the new message and continue from it.
- **Everything built, nothing left,** and documented in the docs (2026-11-05).
- **A command over 10 seconds runs in the background** (2026-11-05).
- **Context under about 450k tokens** (2026-11-05).
- **Supabase:** any database action is allowed, directly, with best practices (2026-11-05).
- **Real device sizes, researched:** "research also in the internet not only assume the browser gives you the right sizes"
  (2026-11-05).
- **Preserve the owner's edits** to these files when rewriting them (2026-11-05).
- **Latest words win;** keep the brief consistent when they do.
