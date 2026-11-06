# R30 Songs, Player and Editor: the owner's brief (2026-11-05), before Practice

Practice waits until this is finished.

## Songs
- Review every menu and popup so each one makes sense; review all settings for duplicate actions; refactor the settings
  UI across the Songs pages.
- The new view does not show which songs have no folder, and other filters are missing.
- The My songs / Explore switch at the top leaves half the row empty; find something better that fits our UI.
- Card style editor: refactor and review it. Its cards hang above all the controls while scrolling (bug).
- Song page: ✎ always opens the score editor. The song page's own editor moves into Settings as "Edit song page".
  Refactor the song page's settings with a professional structure and actions.

## Player
- The Tools panel and the display settings (sheet view) don't make sense; they sit in the toolbox and in Settings at once.
- Refactor each stave's settings (how it is shown and played), Accompaniment under Chords, and Swing. Each goes in its own
  section or subpage, as Playback is. Refactor all settings.
- Piano: refactor the component, its icons, the "show some keys" feature and its settings. The on-screen piano's settings
  open the general Settings instead of a subpage (bug). Make a real sustain pedal, not the bar under the keyboard.
- The piano and bottom toolbar sit in a box that takes too much room; the tips there take room too and are never
  remembered as dismissed.
- Too many toolbars: the toolbar, the floating toolbar and the floating one on top. They duplicate actions; the metronome,
  the modes and tempo are not intuitive. Refactor them.
- The versions chooser (Original, Simple, Easy) isn't clear. Refactor every Player popup.
- Transpose has no preview, unlike the editor's.

## Score editor
- The palette at the bottom, with odd placeholders: make it float and match Flat's palette as closely as possible.
- Remove the duplicates (bar length vs time signature). Build the custom time signature as instructed. Refactor every
  palette tab. No regressions; build what is missing.
- Top toolbar: the rounded corners poke out of the toolbar and the buttons overlap. Use one gear, not two settings
  buttons, and refactor their popups.
- Title and credits get their own subpage in Score settings. Make it clear that the music settings are subpages. Remove
  the settings duplicated between "How the editor works" and the palette.

## Process
- A mockup for each, and each mockup checked by impeccable at least twice.
- Wait for the owner's images, compare them with my own screenshots, and learn how to test the UI better.
