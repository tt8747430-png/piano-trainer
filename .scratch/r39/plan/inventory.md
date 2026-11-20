# The canvas inventory

Every board, every layer it opens and every kit component, built by `checks/inventory.py` from the
boards themselves; run it after a rebuild. A layer is named by its `aria-label` (`{{x}}` is a name set by state).

## Pages, by area

### Songs

| Board | Layers it opens |
| --- | --- |
| Songs | menu: New; sheet or dialog: New playlist; sheet or dialog: New song; sheet or dialog: Import; sheet or dialog: Record |
| SongsLaptop | menu: Ana Popescu; menu: Sort; menu: New; menu: {{rowT}}; sheet or dialog: New playlist; sheet or dialog: New song; sheet or dialog: Import; sheet or dialog: Record |
| AllSongs | menu: New; menu: Sort; menu: {{rowT}}; sheet or dialog: New playlist; sheet or dialog: New song; sheet or dialog: Import; sheet or dialog: Record |
| AllSongsLaptop | menu: Ana Popescu; menu: Sort; menu: New; menu: {{rowT}}; sheet or dialog: New playlist; sheet or dialog: New song; sheet or dialog: Import; sheet or dialog: Record |
| Explore | menu: Order; sheet or dialog: Report this song? |
| ExploreLaptop | menu: Ana Popescu; menu: Order; sheet or dialog: Report this song? |
| Folder | menu: New; menu: Sort; menu: {{rowT}}; sheet or dialog: New playlist; sheet or dialog: New song; sheet or dialog: Import; sheet or dialog: Record; menu: Hymns |
| FolderLaptop | menu: Ana Popescu; menu: Sort; menu: New; menu: {{rowT}}; menu: Hymns; sheet or dialog: New playlist; sheet or dialog: New song; sheet or dialog: Import; sheet or dialog: Record |
| SharedFolder | — |
| SharedFolderLaptop | menu: Ana Popescu |
| Archive | menu: New; sheet or dialog: Apply style to; question: {{permT}}; question: Apply to all folders?; question: Delete “Hymns”?; menu: {{whoT}} |
| ArchiveLaptop | menu: Ana Popescu; menu: New; sheet or dialog: Apply style to; question: {{permT}}; question: Apply to all folders?; question: Delete “Hymns”?; menu: {{whoT}} |
| Trash | menu: New; sheet or dialog: Apply style to; question: {{permT}}; question: Apply to all folders?; question: Delete “Hymns”?; menu: {{whoT}} |
| TrashLaptop | menu: Ana Popescu; menu: New; sheet or dialog: Apply style to; question: {{permT}}; question: Apply to all folders?; question: Delete “Hymns”?; menu: {{whoT}} |
| Groups | sheet or dialog: New group; sheet or dialog: Join with a link; sheet or dialog: Choose a folder; sheet or dialog: Share with a group; question: {{rmT}}; question: Delete Choir accompanists?; question: Stop sharing Choir hymns? |
| GroupsLaptop | menu: Ana Popescu; sheet or dialog: New group; sheet or dialog: Join with a link; sheet or dialog: Choose a folder; sheet or dialog: Share with a group; question: {{rmT}}; question: Delete Choir accompanists?; question: Stop sharing Choir hymns? |
| Song | menu: Amazing Grace; sheet or dialog: Title and credits |
| SongLaptop | menu: Ana Popescu; menu: Amazing Grace; sheet or dialog: Title and credits |
| SongSettings | sheet or dialog: About this; question: Unpublish it?; sheet or dialog: Licence; sheet or dialog: Export |
| SongSettingsLaptop | menu: Ana Popescu; sheet or dialog: About this; question: Unpublish it?; sheet or dialog: Licence; sheet or dialog: Export |
| Section | sheet or dialog: About this; question: Unpublish it?; sheet or dialog: Licence; sheet or dialog: Export |
| SectionLaptop | menu: Ana Popescu; sheet or dialog: About this; question: Unpublish it?; sheet or dialog: Licence; sheet or dialog: Export |
| Editor | sheet or dialog: Amazing Grace; sheet or dialog: About publishing; sheet or dialog: Credits; sheet or dialog: Instruments; sheet or dialog: Add an instrument |
| EditorLaptop | sheet or dialog: Amazing Grace; sheet or dialog: About publishing; sheet or dialog: Go to bar; sheet or dialog: Credits; sheet or dialog: Instruments; sheet or dialog: Add an instrument |
| EditorDraft | sheet or dialog: Amazing Grace; sheet or dialog: Credits; sheet or dialog: Instruments; sheet or dialog: Add an instrument; sheet or dialog: Version history; question: Publish Amazing Grace?; question: Restore this version?; question: Discard changes? |
| EditorDraftLaptop | sheet or dialog: Amazing Grace; sheet or dialog: Credits; sheet or dialog: Instruments; sheet or dialog: Add an instrument; sheet or dialog: Version history; question: Publish Amazing Grace?; question: Restore this version?; question: Discard changes? |
| Takes | menu: {{moreT}}; sheet or dialog: Into |
| TakesLaptop | menu: Ana Popescu; menu: {{moreT}}; sheet or dialog: Into |
| Take | question: {{keepT}} |
| TakeLaptop | menu: Ana Popescu; question: {{keepT}} |

### The Player

| Board | Layers it opens |
| --- | --- |
| Player | — |
| PlayerLaptop | — |
| PlayerLoop | — |
| PlayerLaptopLoop | — |
| PlayerKeyboard | — |
| PlayerLaptopKeyboard | — |
| PlayerDone | — |
| PlayerDoneLaptop | — |
| PlayerHands | — |
| PlayerLaptopParts | — |
| PlayerViewSheet | — |
| PlayerLaptopSheet | — |
| PlayWalk | sheet or dialog: Setup; sheet or dialog: About this |
| PlayWalkLaptop | menu: Ana Popescu; sheet or dialog: Setup; sheet or dialog: About this |
| PlayChromatic | sheet or dialog: Setup; sheet or dialog: About this |
| PlayChromaticLaptop | menu: Ana Popescu; sheet or dialog: Setup; sheet or dialog: About this |
| PlayProgression | sheet or dialog: Setup; sheet or dialog: About this |
| PlayProgressionLaptop | menu: Ana Popescu; sheet or dialog: Setup; sheet or dialog: About this |
| PlayExercise | sheet or dialog: Setup; sheet or dialog: About this |
| PlayExerciseLaptop | menu: Ana Popescu; sheet or dialog: Setup; sheet or dialog: About this |
| PlayerPractice | — |
| PlayerViewDiagrams | — |
| PlayerViewGrid | — |
| PlayerViewLyrics | — |
| PlayerSettings | — |
| PlayerKey | — |
| PlayerDiagrams | — |

### Practice

| Board | Layers it opens |
| --- | --- |
| Main | — |
| Laptop | menu: Ana Popescu |
| Chords | menu: Play as; menu: Hands; sheet or dialog: Piano; sheet or dialog: {{nextTitle}}; sheet or dialog: Key; sheet or dialog: Voicing; sheet or dialog: Root; sheet or dialog: Chord type; sheet or dialog: In the bass |
| ChordsLaptop | menu: Ana Popescu; menu: Play as; menu: Hands; sheet or dialog: Piano; sheet or dialog: {{nextTitle}}; sheet or dialog: Key; sheet or dialog: Voicing; sheet or dialog: Root; sheet or dialog: In the bass; sheet or dialog: Chord type |
| PlayChord | — |
| PlayChordLaptop | menu: Ana Popescu |
| Scales | menu: Play; menu: Hands; sheet or dialog: Tempo; sheet or dialog: Tonic; sheet or dialog: Scale; sheet or dialog: Scale settings; sheet or dialog: Piano |
| ScalesLaptop | menu: Ana Popescu; menu: Play; menu: Hands; sheet or dialog: Tempo; sheet or dialog: Tonic; sheet or dialog: Scale; sheet or dialog: Scale settings; sheet or dialog: Piano |
| Intervals | sheet or dialog: {{name}}; menu: Play as; sheet or dialog: From; sheet or dialog: Interval settings; sheet or dialog: Piano |
| IntervalsLaptop | menu: Ana Popescu; sheet or dialog: {{name}}; menu: Play as; sheet or dialog: From; sheet or dialog: Interval settings; sheet or dialog: Piano |
| Progressions | menu: New; menu: {{rowT}}; sheet or dialog: Rename; sheet or dialog: Sort and filter; sheet or dialog: New folder |
| ProgressionsLaptop | menu: Ana Popescu; menu: {{rowT}}; sheet or dialog: Rename; sheet or dialog: Sort and filter; menu: New; sheet or dialog: New folder |
| Progression | menu: What it plays; sheet or dialog: Key; sheet or dialog: Progression settings; sheet or dialog: Piano |
| ProgressionLaptop | menu: Ana Popescu; menu: What it plays; sheet or dialog: Key; sheet or dialog: Progression settings; sheet or dialog: Piano |
| ProgressionEdit | sheet or dialog: About this; sheet or dialog: Publishing; question: Discard your changes? |
| ProgressionEditLaptop | menu: Ana Popescu; sheet or dialog: About this; sheet or dialog: Publishing; question: Discard your changes? |
| Accompaniment | menu: New; menu: {{rowT}}; sheet or dialog: Rename; sheet or dialog: Sort and filter; sheet or dialog: New folder |
| AccompanimentLaptop | menu: Ana Popescu; menu: {{rowT}}; sheet or dialog: Rename; sheet or dialog: Sort and filter; menu: New; sheet or dialog: New folder |
| Pattern | menu: Play over; sheet or dialog: {{name}}; sheet or dialog: Piano |
| PatternLaptop | menu: Ana Popescu; menu: Play over; sheet or dialog: {{name}}; sheet or dialog: Piano |
| PatternNew | sheet or dialog: {{name}} |
| PatternNewLaptop | menu: Ana Popescu; sheet or dialog: {{name}} |
| ChordPlayer | sheet or dialog: {{selSym}}; sheet or dialog: {{tagTitle}}; sheet or dialog: Share; sheet or dialog: Style; sheet or dialog: Key; sheet or dialog: Tempo; sheet or dialog: Repeats; sheet or dialog: Chord player settings; sheet or dialog: Piano; sheet or dialog: Chord sheet |
| ChordPlayerLaptop | menu: Ana Popescu; sheet or dialog: {{selSym}}; sheet or dialog: {{tagTitle}}; sheet or dialog: Share; sheet or dialog: Style; sheet or dialog: Key; sheet or dialog: Tempo; sheet or dialog: Repeats; sheet or dialog: Chord player settings; sheet or dialog: Piano; sheet or dialog: Chord sheet |
| FingerTechnique | menu: New; menu: {{rowT}}; sheet or dialog: Rename; sheet or dialog: Sort and filter; sheet or dialog: New folder |
| FingerTechniqueLaptop | menu: Ana Popescu; menu: {{rowT}}; sheet or dialog: Rename; sheet or dialog: Sort and filter; menu: New; sheet or dialog: New folder |
| JazzVocabulary | menu: New; menu: {{rowT}}; sheet or dialog: Rename; sheet or dialog: Sort and filter; sheet or dialog: New folder |
| JazzVocabularyLaptop | menu: Ana Popescu; menu: {{rowT}}; sheet or dialog: Rename; sheet or dialog: Sort and filter; menu: New; sheet or dialog: New folder |
| Exercise | sheet or dialog: Key; sheet or dialog: Piano |
| ExerciseLaptop | menu: Ana Popescu; sheet or dialog: Key; sheet or dialog: Piano |
| Check | sheet or dialog: Level; sheet or dialog: Chord qualities |
| CheckLaptop | menu: Ana Popescu; sheet or dialog: Level; sheet or dialog: Chord qualities |
| Metronome | sheet or dialog: Subdivision |
| MetronomeLaptop | menu: Ana Popescu; sheet or dialog: Subdivision |
| Tuner | — |
| TunerLaptop | menu: Ana Popescu |
| ChordFinder | sheet or dialog: Chord finder settings; sheet or dialog: Piano |
| ChordFinderLaptop | menu: Ana Popescu; sheet or dialog: Chord finder settings; sheet or dialog: Piano |
| CircleOfFifths | — |
| CircleOfFifthsLaptop | menu: Ana Popescu |

### Learn, Profile and Settings

| Board | Layers it opens |
| --- | --- |
| Learn | menu: New; sheet or dialog: New; sheet or dialog: {{newT}}; sheet or dialog: New course |
| LearnLaptop | menu: Ana Popescu; menu: New; sheet or dialog: New; sheet or dialog: {{newT}}; sheet or dialog: New course |
| LearnLevel | sheet or dialog: Chapter |
| LearnLevelLaptop | menu: Ana Popescu; sheet or dialog: Chapter |
| LearnCourses | sheet or dialog: Courses; sheet or dialog: About the courses; sheet or dialog: New course |
| LearnCoursesLaptop | menu: Ana Popescu; sheet or dialog: Courses; sheet or dialog: About the courses; sheet or dialog: New course |
| LearnYours | menu: New; sheet or dialog: {{newT}}; sheet or dialog: Sort; menu: {{rowT}} |
| LearnYoursLaptop | menu: Ana Popescu; menu: New; sheet or dialog: New; sheet or dialog: {{newT}}; sheet or dialog: Sort; menu: {{rowT}} |
| Profile | question: Clear all notifications?; sheet or dialog: Notifications |
| ProfileLaptop | menu: Ana Popescu; question: Clear all notifications?; sheet or dialog: Notifications |
| PracticeResult | — |
| PracticeResultLaptop | menu: Ana Popescu |
| Settings | sheet or dialog: About this; question: Sign out?; question: Reset progress?; question: Remove downloaded piano samples?; question: Restore this backup?; question: Delete your account?; sheet or dialog: Change photo; sheet or dialog: Connect a Bluetooth MIDI keyboard; sheet or dialog: Shortcuts; sheet or dialog: {{swTitle}} |
| SettingsLaptop | menu: Ana Popescu; sheet or dialog: About this; question: Sign out?; question: Reset progress?; question: Remove downloaded piano samples?; question: Restore this backup?; question: Delete your account?; sheet or dialog: Change photo; sheet or dialog: Connect a Bluetooth MIDI keyboard; sheet or dialog: Shortcuts; sheet or dialog: {{swTitle}} |
| Admin | question: {{dlg.t}}; sheet or dialog: New group; sheet or dialog: Add member; sheet or dialog: {{mMenuT}}; sheet or dialog: New flag |
| AdminLaptop | menu: Ana Popescu; question: {{dlg.t}}; sheet or dialog: New group; sheet or dialog: Add member; sheet or dialog: {{mMenuT}}; sheet or dialog: New flag |
| Lesson | sheet or dialog: The colours; question: Delete How major scales work?; sheet or dialog: Insert; sheet or dialog: Scale; sheet or dialog: About Notes; sheet or dialog: {{blkT}}; sheet or dialog: How major scales work; sheet or dialog: In this lesson; sheet or dialog: Tools; sheet or dialog: Versions of How major scales work; sheet or dialog: Style: Scale |
| LessonLaptop | menu: Ana Popescu; sheet or dialog: The colours; question: Delete How major scales work?; sheet or dialog: Insert; sheet or dialog: Scale; sheet or dialog: About Notes; sheet or dialog: {{blkT}}; sheet or dialog: How major scales work; sheet or dialog: In this lesson; sheet or dialog: Tools; sheet or dialog: Versions of How major scales work; sheet or dialog: Style: Scale |
| Course | question: Delete Intro to Music Reading?; sheet or dialog: New lesson; menu: Publishing |
| CourseLaptop | menu: Ana Popescu; question: Delete Intro to Music Reading?; sheet or dialog: New lesson; menu: Publishing |
| YourLessonSettings | sheet or dialog: Rename; sheet or dialog: In courses |
| YourLessonSettingsLaptop | menu: Ana Popescu; sheet or dialog: Rename; sheet or dialog: In courses |
| YourCourseSettings | sheet or dialog: Rename |
| YourCourseSettingsLaptop | menu: Ana Popescu; sheet or dialog: Rename |
| SignIn | — |
| SignInLaptop | menu: Ana Popescu |
| Legal | — |
| LegalLaptop | menu: Ana Popescu |
| AppLayers | sheet or dialog: Search |
| AppLayersLaptop | menu: Ana Popescu; sheet or dialog: Search |
| Laptop | menu: Ana Popescu |
| Songs | menu: New; sheet or dialog: New playlist; sheet or dialog: New song; sheet or dialog: Import; sheet or dialog: Record |

### On no canvas page

PlayerApp, PlayerDesk: boards only the published canvas holds, kept by index.py as they are (the owner's own)

129 boards, 463 layers.

## Components

| Component | Kit | Used by |
| --- | --- | --- |
| `ADDCARD` | r41_lib.py | r41_practice.py, r45_places.py, r58_chordplayer.py |
| `ADDROW` | r41_lib.py | r45_places.py, r46_admin.py, r48_course.py, r53_songs_more.py |
| `BAR` | calm_kit.py | r49_settings.py |
| `BARE` | r41_lib.py | the kit alone |
| `BSHEET` | r41_kit.py | r41_practice.py, r41_songs.py, r42_chords.py, r44_editor.py, r45_places.py, r46_admin.py, r47_edit.py, r48_course.py, r49_settings.py, r50_profile.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r55_editor_draft.py, r56_results.py, r57_yours.py, r59_takes.py, r60_scales.py, r61_intervals.py, r62_progression.py, r63_pattern.py, r64_metronome.py, r66_chord_finder.py, r68_exercise.py, r72_flat_songs.py |
| `BTN` | r41_kit.py | r41_practice.py, r41_songs.py, r44_editor.py, r45_places.py, r46_admin.py, r47_edit.py, r48_course.py, r49_settings.py, r50_profile.py, r51_account.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r55_editor_draft.py, r56_results.py, r57_yours.py, r58_chordplayer.py, r59_takes.py, r65_tuner.py, r72_flat_songs.py |
| `CAPS` | r41_kit.py | r41_practice.py, r41_songs.py, r45_places.py, r46_admin.py, r47_edit.py, r48_course.py, r49_settings.py, r50_profile.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r57_yours.py, r58_chordplayer.py |
| `CARD` | r41_kit.py | r41_practice.py, r45_places.py, r49_settings.py, r50_profile.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r56_results.py, r59_takes.py, r60_scales.py, r61_intervals.py, r62_progression.py, r63_pattern.py, r68_exercise.py |
| `CHIPS` | r41_kit.py | r47_edit.py, r57_yours.py |
| `CLOSEB` | r41_kit.py | r51_account.py, r54_practice_more.py, r56_results.py |
| `DOCK` | r41_kit.py | r41_practice.py, r47_edit.py, r53_songs_more.py, r57_yours.py, r58_chordplayer.py, r59_takes.py, r72_flat_songs.py |
| `DOCK_L` | r41_kit.py | r41_practice.py, r58_chordplayer.py |
| `DOTS` | r41_kit.py | r41_practice.py, r41_songs.py |
| `EDITR` | r41_kit.py | r45_places.py, r47_edit.py, r48_course.py |
| `EMPTY_T` | r41_kit.py | r53_songs_more.py |
| `FACES` | r41_lib.py | r53_songs_more.py |
| `GEAR` | r41_kit.py | r41_practice.py, r58_chordplayer.py |
| `GROUP` | r41_kit.py | r41_practice.py, r41_songs.py, r42_chords.py, r44_editor.py, r45_places.py, r46_admin.py, r47_edit.py, r48_course.py, r49_settings.py, r50_profile.py, r51_account.py, r53_songs_more.py, r54_practice_more.py, r55_editor_draft.py, r57_yours.py, r58_chordplayer.py, r59_takes.py, r62_progression.py, r63_pattern.py, r64_metronome.py, r65_tuner.py, r66_chord_finder.py, r68_exercise.py, r72_flat_songs.py |
| `H2` | r41_kit.py | r41_practice.py, r41_songs.py, r45_places.py, r48_course.py, r50_profile.py, r52_global.py, r53_songs_more.py |
| `IB` | r41_kit.py | r41_practice.py, r41_songs.py, r45_places.py, r46_admin.py, r47_edit.py, r48_course.py, r49_settings.py, r50_profile.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r58_chordplayer.py, r60_scales.py, r63_pattern.py, r72_flat_songs.py |
| `INFOB` | r41_kit.py | r44_editor.py, r47_edit.py, r49_settings.py, r54_practice_more.py, r61_intervals.py, r63_pattern.py |
| `INFOTIP` | r41_kit.py | r44_editor.py, r47_edit.py, r49_settings.py, r54_practice_more.py, r61_intervals.py, r63_pattern.py |
| `KEYS` | calm_kit.py | r41_practice.py, r41_songs.py, r44_editor.py, r56_results.py, r60_scales.py |
| `LABELLED` | r41_kit.py | r45_places.py |
| `LAPSHEET` | r41_lib.py | r45_places.py, r48_course.py, r53_songs_more.py, r54_practice_more.py, r55_editor_draft.py, r57_yours.py |
| `LCOL` | r41_kit.py | r50_profile.py, r53_songs_more.py, r54_practice_more.py, r57_yours.py, r63_pattern.py |
| `LEMPTY` | r41_lib.py | r46_admin.py, r57_yours.py |
| `LIB_ROW` | r41_lib.py | the kit alone |
| `LPAD` | r41_kit.py | r42_chords.py, r51_account.py, r53_songs_more.py, r54_practice_more.py, r56_results.py, r60_scales.py, r61_intervals.py, r62_progression.py, r63_pattern.py, r64_metronome.py, r65_tuner.py, r66_chord_finder.py, r67_circle.py, r68_exercise.py |
| `LPLACEBAR` | r41_kit.py | r53_songs_more.py, r72_flat_songs.py |
| `LTITLEBAR` | r41_kit.py | r45_places.py, r46_admin.py, r50_profile.py, r51_account.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r57_yours.py, r59_takes.py, r63_pattern.py |
| `LTOP` | r41_kit.py | r41_practice.py, r45_places.py, r47_edit.py, r48_course.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r56_results.py, r58_chordplayer.py |
| `MENUSHELL` | r41_kit.py | the kit alone |
| `MODESW` | r41_kit.py | r44_editor.py |
| `NAMEFIELD` | r41_lib.py | r45_places.py, r48_course.py |
| `NEWDIAL` | r41_kit.py | r45_places.py, r53_songs_more.py, r57_yours.py, r72_flat_songs.py |
| `NEWFAB` | r41_kit.py | r46_admin.py, r53_songs_more.py |
| `NEWMENU` | r41_kit.py | r45_places.py, r57_yours.py |
| `NEWNAME` | r41_lib.py | r46_admin.py, r53_songs_more.py |
| `NEWNAME_L` | r41_lib.py | r46_admin.py |
| `NONE` | r41_lib.py | the kit alone |
| `PILL` | calm_kit.py | r47_edit.py |
| `PLAYBTN` | r41_kit.py | r41_practice.py, r41_songs.py, r54_practice_more.py, r56_results.py |
| `POPOVER` | r41_kit.py | r41_practice.py, r41_songs.py, r42_chords.py, r44_editor.py, r45_places.py, r47_edit.py, r49_settings.py, r50_profile.py, r54_practice_more.py, r55_editor_draft.py, r56_results.py, r57_yours.py, r58_chordplayer.py, r59_takes.py, r60_scales.py, r61_intervals.py, r62_progression.py, r63_pattern.py, r64_metronome.py, r66_chord_finder.py, r68_exercise.py |
| `PREVPILL` | r41_kit.py | r47_edit.py, r49_settings.py |
| `PSEARCH` | r41_kit.py | r53_songs_more.py, r72_flat_songs.py |
| `ROOTGRID` | r41_kit.py | r41_practice.py, r47_edit.py, r54_practice_more.py, r58_chordplayer.py, r61_intervals.py, r62_progression.py, r68_exercise.py |
| `ROWMENU` | r41_kit.py | r41_songs.py, r48_course.py, r53_songs_more.py, r57_yours.py, r59_takes.py, r72_flat_songs.py |
| `ROWS` | calm_kit.py | r46_admin.py |
| `SEARCHROW` | r41_lib.py | the kit alone |
| `SECTIONS` | r41_lib.py | the kit alone |
| `SEGC` | r41_kit.py | r41_practice.py, r41_songs.py, r49_settings.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r57_yours.py, r58_chordplayer.py, r59_takes.py |
| `SHOWSTATES` | r41_kit.py | r41_practice.py, r44_editor.py, r45_places.py, r46_admin.py, r47_edit.py, r48_course.py, r49_settings.py, r51_account.py, r53_songs_more.py, r54_practice_more.py, r57_yours.py, r58_chordplayer.py, r59_takes.py, r60_scales.py, r61_intervals.py, r63_pattern.py, r64_metronome.py, r65_tuner.py, r66_chord_finder.py, r72_flat_songs.py |
| `SIDEBAR` | calm_kit.py | r42_chords.py |
| `SKELROW` | r41_lib.py | the kit alone |
| `SONGS_SUB` | calm_kit.py | the kit alone |
| `STEPPER` | r41_kit.py | the kit alone |
| `SUBJECT` | r41_kit.py | r41_practice.py |
| `TABBAR` | r41_kit.py | r41_practice.py, r45_places.py, r50_profile.py, r52_global.py, r72_flat_songs.py |
| `TB` | r41_kit.py | r45_places.py, r47_edit.py, r48_course.py, r53_songs_more.py, r57_yours.py, r59_takes.py, r72_flat_songs.py |
| `TITLEBAR` | r41_kit.py | r41_practice.py, r45_places.py, r50_profile.py, r52_global.py, r57_yours.py, r72_flat_songs.py |
| `TOGGLE` | r41_kit.py | r54_practice_more.py |
| `TOP` | r41_kit.py | r41_practice.py, r41_songs.py, r42_chords.py, r45_places.py, r46_admin.py, r47_edit.py, r48_course.py, r49_settings.py, r50_profile.py, r51_account.py, r52_global.py, r53_songs_more.py, r54_practice_more.py, r56_results.py, r57_yours.py, r58_chordplayer.py, r59_takes.py, r60_scales.py, r62_progression.py, r63_pattern.py, r72_flat_songs.py |
| `WCHIPS` | r41_kit.py | r45_places.py |
| `WHEEL` | calm_kit.py | r41_practice.py, r58_chordplayer.py |
