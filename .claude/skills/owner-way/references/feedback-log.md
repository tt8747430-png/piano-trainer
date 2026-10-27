# What the owner has asked for, by area

The owner's feedback from every session, condensed and grouped by area. Read the section for an area before changing it. A point here was either built or is still open; check the code, CLAUDE.md and the ADRs before assuming which. Quotes are the owner's own words, typos fixed.

## Contents
- Score editor: layout and palette
- Score editor: editing on the score
- Signature pickers and tempo
- Header, tools row and transport (Player and editor)
- Sheet layout and engraving
- Selection and playhead
- Player views (Chordify)
- Player Setup and settings
- Song page (overview)
- Song library
- Lessons
- Metronome
- PWA and touch
- Process

## Score editor: layout and palette
- It must feel like a notation app: Sibelius for iPhone, then Flat and Dorico ("we want a real editor").
  - **Removed:** the hand separations, pattern adding and verse adding inside the editor.
  - **Wanted:** "proper scores, proper functions like a real music notation software".
- **The palette:**
  - It floats over everything as a real card. It reserves no blank space, doesn't change height between tabs, and doesn't flicker.
  - It has its own place apart from the keys. The keys must not jump from over it to under it.
- **The folded palette** is "all controls in a row that is scrollable". Opened, it shows the sections as structured. Switching sections animates well.
- **What stays in the palette:** remove the tools that only duplicate what a tap on the interactive sheet does. Move the redundant actions (navigation back and next, delete) out of the note tools.
- **Menus:**
  - Names fit, are aligned, and say what they do.
  - "Bar length" and clef change are not "Add" actions, because they change rather than insert. Put things where they belong.
  - The text terms (dolce …) must be understandable before opening.
  - The Lines menu needs a better name. Use real terms: crescendo, not "get louder". Start and end options that look like duplicates mislead.
  - Repeat icons must fit.
- **Icons:** each action has its own meaningful, aligned icon, never one eye for all of them. The octave-shift and menu icons must read clearly.
- **Fingering** is an option where it belongs, not a palette mode. The fingers menu must be intuitive.
- **Mobile:** mobile needs a layout as usable as Sibelius, with no page overflow and no odd scrolling. All staves are the same width. The keyboard folds as it does everywhere else in the app.
- **Editing values:** a note chosen, then a value tapped, changes that note. The edge between editing and adding new notes must be obvious.

## Score editor: editing on the score
- **Edit in place:** everything printed is editable on the score: title, tempo, notes, clefs, key, time, staff names, chords, lyrics and fingering.
- **No redundant UI:** no upper/lower staff selector, because a click on the staff chooses it.
- **Deleting:** Delete goes back note by note (1 2 3 4: delete at 4, then 3 …).
- **Moving notes:** drag a note up and down on the staff, with all the intuitive direct manipulation.
- **Chords:** typed as text, or chosen with the app's full chord interface, not a limited list.
- **Staves:**
  - Staves are just staves: add, remove, rename and hide them, with no special "melody" option.
  - Hiding a staff must never delete its notes, and toggling a staff must never clear the score.
  - A song can be a single staff with no piano.
- **New songs:** a new song can be customised (which staves) through a separate dialog rather than one overloaded dialog.
- **Editable songs:** every song is editable. Where something can't be edited, the learner is told why.
- **Recording:** the learner chooses what plays along and what is shown.
- **More notation:** add more of what music notation offers, such as notes shifted an octave (8va) and the rest.
- **Transpose:** with semitones, the key it lands in, Apply to key or chords, and a preview.

## Signature pickers and tempo
- **Time signature** ("as close as possible", the owner's example):
  - Current and Pickup columns, the numbers stacked large on staff lines as wheels slid up and down.
  - A cut or common time switch that draws ¢ or C across both rows.
  - ✗ ✓ at the bottom right.
- **Key signature:**
  - A bottom sheet, its grid 1–7 sharps over 1–7 flats, signs only, the chosen one tinted.
  - "Switch to natural" and an "all the parts" switch.
- **Clef:** a bottom sheet, its grid of every clef: treble, the C clefs and bass, each with its 8va/8vb/15ma/15mb.
- **Tempo:**
  - A large accent circle with the BPM and its tempo word, the beat units below it.
  - Hold and swipe to a full-screen ruler of tempo words, Largo to Presto.
- **Meters:** add every missing one, such as 2/2, 3/2, 5/4, 6/4, 7/4, 3/8 and 9/8.

## Header, tools row and transport (Player and editor)
- **One look:** the Player and the editor are one score in two modes, and controls must not jump between them.
- **The header:** "I don't like how the header looks with this bar under the header". Make the bar and the tools one designed header.
- **Navigation:** the same transport at the bottom in both modes.
- **Edit:** reached straight from the Player, without going back.
- **Transpose:** the same in the Player and the editor.
- **Clicks:** nothing traps a click (the canvas zoom toolbar once did). Check every overlay.
- **Floating controls:** the Player's and the editor's floating controls hide when the learner taps elsewhere, and auto-hide works reliably.

## Sheet layout and engraving
- **Names:** "Panorama" (was Scroll across), with better names for scroll down and Page layout. The view toggles need a better design.
- **Quality:** the page layout is always sharp on every screen and at every zoom, never pixelated. Note names read well.
- **The page canvas:** floats in an infinite space, dragged and pinch-zoomed. Its zoom controls hide when not used.
- **Vertical scroll:** takes the full width, every line the same width, with no room reserved for hidden chords.
- **Page view:** looks like a real printed score, with correct margins, line breaks, chord sizes and numbers. Study real scores from the data, and LilyPond and abcjs.
- **Engine:** Verovio, chosen by the owner, sharp in every layout.
- **Chords:** names aren't cluttered or too big when there are many.

## Selection and playhead
- **Tight selection:**
  - It covers only the notes chosen, padded from their neighbours, and never empty space.
  - It is the same in the Player and the editor and in every layout.
- **Chords and ranges:** one note inside a chord can be chosen. A range covers exactly the bars chosen, not the whole section.
- **The keyboard:** selection works with the keyboard too.
- **Notes clicked in the Player:** jump to that note, not the next ones.
- **Two marks:** what is chosen and what is playing are separate. Playing is one line across all the staves in sight, as other editors draw it, and it never jumps between staves.

## Player views (Chordify)
- **Features:** every Chordify feature except guitar: transpose, simplify, the views, chords over lyrics, diagrams, the grid, lessons.
- **The views:** make it plain which view a setting belongs to. Layout is the sheet music's alone.
- **Diagrams:**
  - Animated. The strip and the diagrams scroll and swipe by themselves, and the page never moves.
  - No odd scroll bar.
  - A swipe goes to the next chord, as well as a tap.
- **Taps on chords** (diagram, chord over lyrics, beat) move the player there and never open a dialog.
- **Chord sizes:** a long chord (Fm, slash chords) never breaks the layout.

## Player Setup and settings
- **Plain words:** the settings must be understandable: How it plays, swing, the first chord's position and Nearest.
- **Melody:** say where it comes from and let the learner choose its source. "Tune" meant nothing.
- **Hand patterns:**
  - Make plain how a hand's figure relates to the pattern above, and what choosing one does.
  - A section can have its own pattern, not one for the whole song.
- **Explanations** go in ⓘ popups.
- **Old settings:** remove the old settings and actions nobody needs.

## Song page (overview)
- **Calm:** too much information at once is wrong. Play is near the top, and the key's scale isn't at the bottom.
- **Placement:**
  - Play in the floating actions.
  - Edit beside the title in the header.
  - Learned on the right of the header.
- **Removed:** the "Learn the song step by step" card.
- **Chords:** a song with no sections must not look odd. A chord chart shows only when the sheet music is off.
- **Wording:** the owner dislikes the descriptions, so keep them short or put them behind ⓘ.

## Song library
- **One library:** "a real library" like Mindscape and memory-palaces. The built-in songs sit in their own folders, and the learner makes folders, nested to any depth.
- **Archive:**
  - A real archive in the header, not in Settings.
  - Folders can be archived too.
  - Deleting a folder deletes its songs.
- **Filters and sort:** a filter by key. No "Chords I know" or "With chords" chips.
- **Dialogs** with a text field stay above the phone keyboard, as memory-palaces does it.
- **Moving:** Move works properly, into folders nested to any depth.
- **Layout:**
  - Nothing clipped, an even grid on wide screens.
  - Icons don't jump when Select mode starts.
  - The ⋯ button shows its own hover.
- **Swipe actions** on rows.
- **Toasts** disappear as they should.

## Lessons
- **Multi-staff:** a lesson with several staves shows them as one score, never as separate pieces.

## Metronome
- **Layout:** like the owner's example: the BPM large with −10 −1 +1 +10, a slider, Tap tempo, sound and meter, one Play, the beats as squares.

## PWA and touch
- **No browser chrome:** in the installed iPhone app, no browser bubbles, loupe or callouts. It should feel like a real app.
- **The keyboard:**
  - Can be swiped while a key is held (non-glissando), so the piano mini-map isn't needed.
  - Folds the same everywhere.

## Process
- **The loop:** improve and review in a loop until the usage runs out, and resume on "continue".
- **Commits:** one proper commit per finished task.
- **Tests:** "you don't need to run tests for each commit, only when round finishes".
- **Agents and merging:** "merge their branches with your branch and then test", never each separately. Agents test only what changed. After the merged suite passes, merge to main.
- **CI:** disabled, local tests only.
- **Context:** compact at about 300k tokens.
- **References:** read the docs of the reference apps (Dorico help, Flat help, Chordify support pages). Look for libraries rather than hand-rolling what exists.
- **Content:** transcribe songs note for note and check them again before merging. Credit Bobrova's material ("n.b.") to Bobrova.
