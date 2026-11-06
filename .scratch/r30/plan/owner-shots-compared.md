# The owner's 12 phone shots compared with mine (2026-11-05)

My shots missed the bugs below because they were taken:
- in a browser tab, with no status bar or home-indicator insets;
- at the top of the page only;
- before the score had drawn;
- on short built-in songs only;
- with no sheet or dialog open.

The harness now does all of these (`shots.mjs` acts and `scroll`, safe-area insets, standalone mode, waiting for the
score) and checks each shot with `inspect.js`.

| # | Owner's shot | What is wrong | Why my pass missed it |
| - | ------------ | ------------- | --------------------- |
| 1 | Card style, at the top | Presets: the chosen tile's grey block doesn't match the tile; Night wraps alone onto a second row; the Medium label spills out of its segment | Never opened Card style at phone width |
| 2 | Card style, scrolled | The sticky preview covers Presets, Border and the steppers; the card behind shows cut words ("Border 1 px") | Shot at the top only |
| 3 | A lesson's chord sheet | The backdrop's blur stops above the sheet, so a band of the page ("Last chorus") shows sharp between them | No sheet opened over a scrolled page in the shots |
| 4 | Export sheet | Fine on its own, but Share link is in Export and also in Settings › Share (two ways to one action) | No review across popups |
| 5 | Player at rest | The view pill covers the score's title; the transport covers the bass staff; the tip takes a row; the piano's toolbar sits in a grey box with Zoom's label under two icons and Sustain cut; empty band under the tab row | Shot before the score drew; no insets |
| 6 | Song Settings | The section heading slides under the bar half cut ("In your library"); Publish's status wraps to two lines; Reset progress stands alone with its line outside the card | Shot at the top only |
| 7 | Versions sheet | The tutorial-like layout: Piano solo / Piano and voice each with three versions; Simplified greyed with no reason; descriptions wrap | Sheet never opened |
| 8 | Player, Page view | The page is cut by the transport; two frames (grey and white) around the page | Page view never shot on a phone |
| 9 | Editor, Settings sheet | Done overlaps the cloud (save) mark; the tab row covers the first row ("Hide empty staves" cut); chevrons sit after the text, not at the row's end; the palette shows under the sheet | Editor not shot signed in, sheet never opened |
| 10 | Player again (iPhone 15 Pro) | As 5 | — |
| 11 | Editor | The zoom pill sits under the view pill, both cut; the palette is docked with an empty band under it; the note row scrolls off the right | Editor's floating pills not checked for overlap |
| 12 | Fantaisie-Impromptu | The pedal's "Ped." badge covers the toolbar; held keys stay lit (hanging) after their notes end; keys outlined and filled in two blues; the toolbar is scrolled ("om") | Never played an imported score with pedal marks |
