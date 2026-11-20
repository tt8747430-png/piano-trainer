# Settings index: every place a learner changes a setting

## Source

- Owner, 2026-11-20: "how much sense does it make to make such separate pages for the each settings: why dont we do
  such things like the app settings in such popup window: and why when we swirch a settings page alit also changes
  the path in the url: the claude.ai doesn't make that."
- Owner, 2026-11-20: "make an index for the each settings sp that you dont miss anything".
- Owner, earlier: "the settings switch between the pages flicker".

## The rulings as they stand

1. **Settings never changes the address.** Opening Settings, moving between its places and closing it leave the
   page's own address. On a laptop the place the dialog shows is held in the history entry's state, so Back steps
   back through the places and × closes; on a phone each place stays its own page in the app's history (an
   installed app shows no address). This changes `CLAUDE.md`'s "what you look at is in the URL" for Settings' places.
2. **A thing's Settings opens over its page, never as a page of its own.** This covers a song's, a lesson's, a
   course's and a progression's Settings. On a laptop it is the app Settings' window (a centred dialog over the page,
   its places in a nav where it has more than one); on a phone it is a tall sheet with its pages inside, Back at the
   top. Its route goes, and a link to it opens the window.
3. **A sheet keeps its height between its pages** (done, `Sheet`'s `holdTallest`, 2026-11-20).

## The index

Form today: P = a page with its own route, D = the laptop's Settings dialog, S = a phone bottom sheet,
C = a laptop card hung under the gear, F = a laptop popover at its control.

### App Settings (Profile › Settings, the sidebar's account menu, ⌘,)

| Place                                       | Route today                                         | Phone | Laptop | Address on a laptop                             | To do |
| ------------------------------------------- | --------------------------------------------------- | ----- | ------ | ----------------------------------------------- | ----- |
| General (and Page layouts)                  | `/settings/general`, `/settings/general/layouts`    | P     | D      | page's own (fixed 2026-11-20; was `?settings=`) | —     |
| Appearance                                  | `/settings/appearance`                              | P     | D      | page's own                                      | —     |
| Storage and backup                          | `/settings/storage`                                 | P     | D      | page's own                                      | —     |
| MIDI devices (Log, Timing)                  | `/settings/connect-piano`, `…/log`, `…/timing`      | P     | D      | page's own                                      | —     |
| Selection toolbar                           | `/settings/select-toolbar`                          | P     | D      | page's own                                      | —     |
| Swipe actions                               | `/settings/swipe-actions`                           | P     | D      | page's own                                      | —     |
| User guide                                  | `/settings/how-to-use`                              | P     | D      | page's own                                      | —     |
| Report a problem                            | `/settings/feedback`                                | P     | D      | page's own                                      | —     |
| About                                       | `/settings/about`                                   | P     | D      | page's own                                      | —     |
| Account (Profile, Email, Password), Privacy | `/settings/account…`, `/settings/privacy`           | P     | D      | page's own                                      | —     |
| Administration and its sections             | `/admin`, `/admin/$section`, `/admin/groups/$group` | P     | D      | page's own                                      | —     |

### A thing's own Settings (ruling 2)

| Thing                             | Opened from                                                | Route today                                                                        | Phone | Laptop | Board                                                              | To do                                                                                         |
| --------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----- | ------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| A song                            | song page ··· › Settings (`SongMore`), a library row's ··· | none (was `/songs/$pieceId/settings`)                                              | S     | D      | SongSettings, SongSettingsLaptop                                   | done 2026-11-20 (`SettingsWindow`), Publish a page inside it (`/songs/$pieceId/publish` gone) |
| A lesson (built-in or yours)      | lesson bar gear (`LessonLayout`)                           | none (were `/lessons/$lessonId/settings`, `/courses/$courseId/$lessonId/settings`) | S     | D      | Lesson, LessonLaptop, YourLessonSettings, YourLessonSettingsLaptop | done 2026-11-20 (THINGWIN, `SettingsWindow`)                                                  |
| A course (built-in or yours)      | course bar gear (`CoursePage`, `OwnCoursePage`)            | none (was `/courses/$courseId/settings`)                                           | S     | D      | Course, CourseLaptop, YourCourseSettings, YourCourseSettingsLaptop | done 2026-11-20 (THINGWIN, `SettingsWindow`)                                                  |
| A progression (an editor's draft) | editor bar gear and its Publish (`ProgressionEditor`)      | none (were `/practice/progressions/$progressionId/settings`, `…/publish`)          | S     | D      | ProgressionEdit, ProgressionEditLaptop                             | done 2026-11-20 (THINGWIN, `SettingsWindow`, Publish a page inside)                           |
| A folder or playlist              | the library's ···                                          | none: its menu and sheets                                                          | S     | F      | Folder, FolderLaptop                                               | —                                                                                             |

### A screen's own settings, in place (already sheets and cards; no address)

| Screen                                         | Gear                                   | Phone | Laptop        | Pages inside                      |
| ---------------------------------------------- | -------------------------------------- | ----- | ------------- | --------------------------------- |
| The Player                                     | `SettingsSheet` (ScoreBar)             | S     | C (score bar) | Piano, Pattern, view, Sections…   |
| The score editor                               | `EditorGear`                           | S     | C (score bar) | Score settings pages              |
| A run (walk, chromatic, progression, exercise) | `RunLayout`                            | S     | C             | Setup rises from the bar          |
| Chord player                                   | `ChordPlayerSettings`                  | S     | C             | Count-in, Volume, Time            |
| Scales                                         | `ScaleLayout`                          | S     | C             | On the staff                      |
| Intervals, a progression, Chord finder         | `SettingsGear`                         | S     | C             | —                                 |
| Metronome, Tuner, Circle of fifths             | `ToolPage`                             | S     | C             | Sound, Speed trainer, Silent bars |
| Exercise, Pattern                              | the bar's Piano button (`PianoButton`) | S     | C             | —                                 |
| The piano (any screen with keys)               | `PianoSheet`                           | S     | C             | Sound, Range, Labels              |
| Keyboard shortcuts                             | `ShortcutsHelp`                        | S     | C             | —                                 |

## Check before calling it done

- Every row above opened at 402 and 1710: the address before, while open, after each page inside, after closing.
- Every page turn inside a sheet or dialog watched frame by frame: no height snap, no blank frame.
- Every link that pointed at a removed route (`grep -rn "/settings'" src`) opens the window instead.
