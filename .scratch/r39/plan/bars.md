# Bars and their glass

Every screen's top bar, on the phone and the laptop, the Player's and the editor's included.

## The rulings as they stand

- **Every bar button is glass, and a bar has no band** (owner, 2026-11-16: "why the header in the player has
  background and the buttons are not glass? I want consistency and all the buttons should be glass"). Its buttons
  float over the page in the kit's glass: the one fill, 20px blur, the ink ring and the soft shadow. No white band and
  no hairline under it; where content scrolls under a bar, a scroll edge fade keeps it legible. Apple: "Reduce the use of
  toolbar backgrounds … use a ScrollEdgeEffectStyle when necessary to distinguish the toolbar area from the content
  area."
- **Glass is for controls only** (owner, 2026-11-16: "look and research the apple Liquid Glass guidelines for when
  the buttons should be together or not"). Apple: "Liquid Glass forms a distinct functional layer for controls and
  navigation … Don't use Liquid Glass in the content layer." A card, a cover or a list row is never glass.
- **Back or Close stands alone, at the leading edge.** Apple: "Group navigation controls and critical actions like
  Done, Close, or Save in dedicated, familiar, and visually distinct sections." Back and Close are the symbol, never
  the word. Apple: "Prefer the standard symbols for each, and don't use a text label that says Back or Close."
- **Buttons share one glass when they belong together by function** (View and Settings; Undo, Redo and More), and
  More is last in its group. Apple: "Group toolbar items logically by function and frequency of use."
- **At most three groups in a bar:** leading (Back or Close, then the title), centre (a view switch, a mode such as
  Play · Edit), trailing (the screen's actions, More last). Apple: "Minimize the number of groups … aim for a
  maximum of three."
- **A text button never shares glass with a symbol button.** It gets its own capsule, set apart by a fixed gap.
  Apple: "Placing an action with a text label next to an action with a symbol can create the illusion of a single
  action." This covers Edit, Done, Save, Create and Publish.
- **One prominent action at most,** trailing, in honey (Done, Create, Save). Apple: "Only specify one primary action,
  and put it on the trailing side of the toolbar."
- **Symbols carry no ring of their own inside the glass.** Apple: "Borders … aren't necessary because the section
  provides a visible container."
- **The Player and the editor share one bar, and one switch between them** (owner, 2026-11-16: "proper way to switch
  from the player to editor not like this two different controls in the editor and in the player"). Close leading in
  glass; Play · Edit centre, one glass capsule, the mode shown in ink, each half 65 wide so nothing moves; the screen's
  own group trailing (the Player: View and Settings, on a laptop the four views beside Settings; the editor: Undo,
  Redo, More). Both bars are the kit's `MODEBAR_P` / `MODEBAR_L` and `MODESW`, the trailing column held to the
  editor's width, so the switch stands on the same pixels in both (phone 116 from the edge, top 62; laptop centred).
  The title is printed on the score in the book serif at its regular weight, as the editor prints it; the Player's
  other views print the same head. The song sheet's Edit score is gone: the bar's Edit is the one way in.
- **A title stays short and sits after Back or Close,** 8px from its glass. Apple: "keep the title under 15
  characters long so you leave enough room for other controls." A song's name may run longer and ends in an ellipsis.

Sources: Apple Human Interface Guidelines, Toolbars (updated 16 December 2025 for Liquid Glass), Materials (Liquid
Glass), read 2026-11-16.

## History

- 2026-11-16 (replaced 2026-11-17, loop round 62: every bar button its own 44 glass circle, 8 apart, as every board draws it): icons side by side in a bar shared one glass capsule on every board (`index.py`, `_glassgroups`): the song's Favourite and More, Songs' Archive and More, the Chord player's Undo, Settings and More, a lesson's Metronome and Settings, the theory pages' Settings and Piano, Learn's Search and MIDI keyboard, Profile's bell and Settings; text buttons (Learned, Edit) keep their own capsules in the same glass.
- 2026-11-16: the Player's bar drops its band; Close is glass, View and Settings share one glass; the laptop's Close,
  Settings and view switch use the same glass. Then the rules above, from Apple's guidelines, held against every board.
- 2026-11-16: the kit's `TOP` centred its title between the bar's sides; it now leads after Back or Close, 8 from its glass, on every board that draws it.
- 2026-11-16, loop round 61: the round-54 glass bar had been a hand edit to the built boards and a rebuild lost it; now `player/r43_player.py` (`onebar`) builds it, the editor and the Player take one switch from the kit, and the song sheet's Edit score went.
