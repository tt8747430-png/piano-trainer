# R67 Practice port: report

Plan: check each ruling of `port.md` § Practice against the app's code; build what is missing from the board's
generator, value for value; one commit per task; two browser passes on every route changed (402 and 1710, Day, en).

| #   | Ruling | App file | State |
| --- | ------ | -------- | ----- |
| 1   | The Chord player asks for no gesture alone | `widgets/chord-player/ui/{ChordTile,ChordPlayer,KeyChords}.tsx` | built, c0c720ff: tap selects, tap again opens; a key chord tapped replaces the chosen chord |
| 2   | The Chord player's layout is the learner's | `widgets/chord-player` | left: panels placed, sized, minimized and hidden in an Edit layout, saved and reset in Settings, is a feature of its own (a panel engine and a Settings home, the registry Agent A's), not a value port |
| 3   | Feedback never lifts the keys | `widgets/trainer-board/ui/TrainerBoard.tsx` | built, 63e1e578 |
| 4   | A pattern's grand staff at reading size | `widgets/pattern-music/ui/PatternStaff.tsx`, `pages/pattern` | built, 79644a66 |
| 5   | A progression's chords on the staff at reading size | `widgets/progression-explorer/ui/ProgressionExplorer.tsx` | built, 79644a66 |
| 6   | The interval leads Intervals | `widgets/interval-explorer/ui/IntervalHero.tsx` | built, 79644a66 |
| 7   | An exercise's score leads its page | `pages/exercise/ui/ExercisePage.tsx`, `model/opening-bars.ts`, `features/play-example/ui/FittedRow.tsx` | built, c8519d6c |
| 8   | A laptop group's rows one height | kit `GroupRow` | built for the exercise (`EndRow`, 4 padding); the kit's own `segr` row is Agent A's: kit need |
| 9   | A practice run's Setup groups by heading | `widgets/player-setup` | left: Agent B's files |
| 10  | No layer past the screen | `pages/metronome` | built for the Metronome (Subdivision is a sheet now, b8a63c3b); the popover cap is the kit's `Popover`: kit need |
| 11  | No button squashed in a full sheet | kit `Button` | left: kit need (`min-height`) |
| 12  | No row cut in two in Practice | `widgets/practice-library/ui/LibraryTable.tsx`; kit `PractiseRows` | built, 8516c1c1 (Focus heads the exercises' column, Progressions' Key: Major or Minor); Chords' Practise rows as two columns on a laptop are the kit's `PractiseRows`: kit need |
| 13  | Headings by proximity on an exercise | `pages/exercise/ui/ExercisePage.tsx` | built, c8519d6c: sections 24 apart, a heading 8 over its group |
| 14  | A run's progress is grass; the tempo ladder a row of tempo's group | `pages/check`; the run's Player and Setup | built for the Check (63e1e578); the chord run and its Setup are Agent B's |
| 15  | The Check's prompt stands centred over the keys | `widgets/trainer-board`, `pages/check` | built, 63e1e578 |
| 16  | The Practise rows' play circles are quiet | kit `shared/ui/PractiseRows.tsx` | left: kit need (sand circle, ink triangle) |
| 17  | The Chord player's two columns share a top | `widgets/chord-player/ui/KeyChords.tsx` | done: its heading carries no top margin |
| 18  | An editor's form has one label style on one edge | `pages/pattern-editor`, progression editor; kit `NameField` | left: the field's label is the kit's `NameField`: kit need |
| 19  | A run's Setup on a laptop holds every row | `widgets/player-setup` | left: Agent B's files |
| 20  | An exercise's choices sit at the row's end | `pages/exercise/ui/EndRow.tsx` | built, c8519d6c |
| 21  | The practice libraries lose their Places pane | `widgets/practice-library` | built, 8516c1c1, 56726544 |
| 22  | A progression's keys in the chord-tone paints | `features/play-example/model/marks.ts` (`voicedShown`) | done: the keys already carry the chord-tone marks |
| 23  | A chord run's music on the paper | the Player's run | left: Agent B's files |
| 24  | A run's results, tidied | the Player's results | left: Agent B's files |
| 25  | Spacing on the scale across Practice | `pages/practice/ui/PageCard.tsx`; kit chips | done: the cards carry two lines, no empty third; the chips' 36-in-44 is the kit's: kit need |
| 26  | The Metronome's settings in one home | `pages/metronome/ui/{MetronomePage,MetronomeSettings}.tsx`, `widgets/tool-page` | built, b8a63c3b |
| 27  | A drill's Root is the one root picker | `widgets/player-setup` | left: Agent B's files |
| 28  | Check's Hint reaches 44 | `widgets/trainer-board/ui/TrainerBoard.tsx` | built, 63e1e578 |
| 29  | A pattern's style chips reach 44 | `pages/pattern-editor/ui/PatternEditor.tsx` | left: the hands' figures are dozens of long names; as chips they ran several screens, so the menu stays (the kit's chips are 44 already) |
| 30  | A run's Setup opens from its button | `widgets/player-setup` | left: Agent B's files |
| 31  | Every gap on the scale | every file above | built in the files changed; the rest are the kit's or other agents' |

Pickers and tempo: the section in `port.md` lists no ruling since the last port.

## Notes
