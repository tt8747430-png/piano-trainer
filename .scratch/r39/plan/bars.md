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
- **A title stays short and sits after Back or Close,** 8px from its glass. Apple: "keep the title under 15
  characters long so you leave enough room for other controls." A song's name may run longer and ends in an ellipsis.

Sources: Apple Human Interface Guidelines, Toolbars (updated 16 December 2025 for Liquid Glass), Materials (Liquid
Glass), read 2026-11-16.

## History

- 2026-11-16: icons side by side in a bar share one glass capsule on every board (`index.py`, `_glassgroups`): the song's Favourite and More, Songs' Archive and More, the Chord player's Undo, Settings and More, a lesson's Metronome and Settings, the theory pages' Settings and Piano, Learn's Search and MIDI keyboard, Profile's bell and Settings; text buttons (Learned, Edit) keep their own capsules in the same glass.
- 2026-11-16: the Player's bar drops its band; Close is glass, View and Settings share one glass; the laptop's Close,
  Settings and view switch use the same glass. Then the rules above, from Apple's guidelines, held against every board.
