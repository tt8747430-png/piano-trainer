# Canvas change ledger

Every change to the canvas (https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), newest first, one line each:
date · commit · what changed · boards · published version, or **pending**. Written before each publish and
before the turn moves on, so the record outlives a compaction: `.claude/hooks/canvas-ledger.sh` prints this file
into the compaction and back into the context after it. A publish that is refused marks its line **pending**;
the next publish sends every pending board and the lines get the new version.

## Pending

- 2026-11-19 · 5acca61d · a lesson: the real lesson's count (7 of 11), summary and Russian title · Lesson,LessonLaptop · v623

- 2026-11-19 · 7671f3d9 · a course: lesson rows 68 as a level's (were 80), laptop lessons in four columns (a dead replace kept one), laptop column on the 56 (was 40), the real course's words, lessons and songs · Course,CourseLaptop · v622

- 2026-11-19 · 1956b88c · the shelves hold the app's real courses, five shelves in its paints (were an invented four) · Learn,LearnLaptop,LearnCourses,LearnCoursesLaptop,LearnLevel,LearnLevelLaptop · v621

- 2026-11-19 · fdd88a9f · a level's scale lesson wears stairs, never a bar chart (its ruling) · LearnLevel,LearnLevelLaptop · v620


## Changes

- 2026-11-19 · dad864f5 · Chord finder laptop: the keys 8 under the bar, the name 16 under them (were 24 inside the bar) · ChordFinderLaptop · v619

- 2026-11-19 · 5e3c908e · Exercise: the keys 8 under the bar, as its siblings (its generator kept 4) · Exercise · v618

- 2026-11-19 · 5d55594e · the Practice libraries' laptop head as LTITLEBAR (88, Back 44 in) and their column on the 56 every other laptop board keeps (was 40, its own head) · AccompanimentLaptop,FingerTechniqueLaptop,JazzVocabularyLaptop,ProgressionsLaptop · v617

- 2026-11-19 · be5cf3e7 · no dim under what floats: the kit's FLOAT on bars, the tab bar, the + and the floating bars (was SHADOW's 28px blur); (app) --elevation-float · every board (all docks and floating actions) · v615

- 2026-11-19 · bd0d9245 · one title picker: Scales' name as Chords' PART (44, 56 on a laptop, 54 tall, one faint chevron; was 40, 64 tall, two chevrons); the kit's PART end pad 8 at its source (a pass rewrote 9) · Scales,ScalesLaptop · v614
- 2026-11-19 · ae0596ad · Chord finder: the empty picker says Spelled in; keys 8 under the bar on Scales, Intervals, Progression, Pattern, Chord finder (were 4); the Practice pages' floating bars on the 34 safe area (were 30); (app) the finder's line under the name at normal line height · ChordFinder,ChordFinderLaptop,CircleOfFifths,Exercise,Intervals,Metronome,Pattern,Progression,Scales · v613
- 2026-11-19 · 06731f79 · the phone's status bar 62 tall, as the owner's iPhone 17 Pro and the app's inset (was 54): every phone bar 8 lower, where the app draws it · every phone board (54) · v612
- 2026-11-19 · e0ddd0f4 · Chords: the leftover 56 spacer under the bar gone, the 3D keys 8 under the bar as every page's (was 62, a bare band) · Chords,ChordsLaptop · v611
- 2026-11-19 · 0e092e8e · the overview pages' sections fold again: the fold pass matched the heading row only before its spacing changed · Main,Laptop,Learn,LearnLaptop,Profile,ProfileLaptop · v611
- 2026-11-19 · 8d285648 · Chords laptop: Practise in the Player in one column with chevrons, as its siblings; (app) the chord name's pickers on the left edge, 8 apart · ChordsLaptop · v610
- 2026-11-19 · 23d09364 · laptop sidebar 16 in (was 14), account email line 8 × 12 · every laptop board (52) · v609
- 2026-11-19 · e08c7c81 · the kit's CARD pads 16 all round (was 14 × 16); Settings' Paused card and folds on the scale · AppLayers,AppLayersLaptop,Check,CheckLaptop,Exercise,ExerciseLaptop,Explore,ExploreLaptop,Learn,LearnLaptop,Pattern,PatternLaptop,PatternNew,PatternNewLaptop,Profile,ProfileLaptop,ProgressionEdit,ProgressionEditLaptop,Section,SectionLaptop,Settings,SettingsLaptop,SongSettings,SongSettingsLaptop · v608
- 2026-11-19 · 5eced71f · the public song's chart: card 14, bar cells 8/12 · Explore, ExploreLaptop · v607
- 2026-11-19 · b6b52a84 · one switch knob: paper face, ink shadow in the kit's TOGGLE, Piano sheet and Player; Chords' patch gone · Admin,AdminLaptop,AllSongs,AllSongsLaptop,Archive,ArchiveLaptop,ChordFinder,ChordFinderLaptop,ChordPlayer,ChordPlayerLaptop,Chords,ChordsLaptop,Folder,FolderLaptop,Groups,GroupsLaptop,Metronome,MetronomeLaptop,PlayChromatic,PlayChromaticLaptop,PlayExercise,PlayExerciseLaptop,PlayProgression,PlayProgressionLaptop,PlayWalk,PlayWalkLaptop,PlayerApp,PlayerDesk,Settings,SettingsLaptop,Songs,SongsLaptop,Takes,TakesLaptop,Trash,TrashLaptop · v606
- 2026-11-19 · fe799f01 · one list card on a sheet: hand-copied 12 lists to the kit's 14 ringed card; Chords' post-build patch gone · ChordFinder,ChordFinderLaptop,ChordPlayer,ChordPlayerLaptop,Chords,ChordsLaptop,Exercise,ExerciseLaptop,Intervals,IntervalsLaptop,Metronome,MetronomeLaptop,Pattern,PatternLaptop,Progression,ProgressionLaptop,Scales,ScalesLaptop,Takes,TakesLaptop · v605
- 2026-11-19 · b7d3efef · Chords: the post-build type rewrite (17→16, 15→14) removed; sheet titles and Done 17 as every board · Chords, ChordsLaptop · v604
- 2026-11-19 · 658ebae0 · Chord player: chord sheet's Root, Quality, Bass, Duration and Delete at the 12 control corner (also the app's ChordDialog) · ChordPlayer, ChordPlayerLaptop · v602
- 2026-11-19 · efdaa434 · one segmented control, 44 tall at 14px, as the app's Segmented · boards in the commit · published by v601
- 2026-11-19 · cf66fcc8 · one search box, the kit's SEARCHBOX, as the app's SearchField · boards in the commit · published by v601
- 2026-11-19 · 94a4b868 · the boards as the committed generators build them · boards in the commit · published by v601
- 2026-11-19 · 2ff1de00 · Intervals grouped as Simple and Compound · boards in the commit · published by v601
- 2026-11-19 · 56042f52 · Explore's cover miniature is a picture, hidden from readers · boards in the commit · published by v601
- 2026-11-19 · 0dbb53ef · the tooltip pass runs last, reaching the Songs boards · boards in the commit · published by v601
- 2026-11-19 · 914f914d · every scrim at 32% at its source; the scrim pass runs last · boards in the commit · published by v601
- 2026-11-19 · 000ce61b · one centred dialog box in the kit (DIALOGBOX) · boards in the commit · published by v601
- 2026-11-19 · fb603fdf · one confirm dialog in the kit (ASK) for every board · boards in the commit · published by v601
- 2026-11-19 · 2ce87c22 · one empty state in the kit for every board · boards in the commit · published by v601
- 2026-11-19 · 6bda5b23 · the library's laptop sheets use the kit's LAPSHEET · boards in the commit · published by v601
- 2026-11-19 · 3560faa5 · one toast helper in the kit for every board · boards in the commit · published by v601
- 2026-11-19 · 35112e16 · Settings' toast takes the shape every other toast has · boards in the commit · published by v601
- 2026-11-19 · 588a6139 · (and app) a lesson's steps stand 8 apart, on the scale · boards in the commit · published by v601
- 2026-11-19 · 4429e1fc · four weights and three trackings, set where each is made · boards in the commit · published by v601
- 2026-11-19 · aae237c8 · a shared cover's owner initial at the 12 type floor · boards in the commit · published by v601
- 2026-11-19 · c0bd72e5 · the laptop Player's tempo steps, Tap and pattern row buttons reach 44, as the phone's · boards in the commit · published by v601
- 2026-11-19 · faeaefc0 · the Player's tempo steps, Tap and pattern row buttons reach 44 · boards in the commit · published by v601
- 2026-11-18 · 0a35966d · (and app) a key walk named as musicians name it · boards in the commit · published by v601
- 2026-11-18 · 938fd8b7 · the laptop Profile's rows take their own height, 32 apart · boards in the commit · published by v601
