# Chordio content formats: .cla, .sheetmusicpack, .chordpack, .csm, .cpl

Every content file is an **NSKeyedArchiver binary plist** (`bplist00`, `$archiver = NSKeyedArchiver`, `$version = 100000`). There is no zip, no JSON and no custom binary container. Each file has one root key in `$top`, which names the format. **exact**: decoded with my Node decoder (`scratchpad/chordio/bplist.js`), and every key below was read from the files themselves.

| Extension | Root `$top` key | Root class | UTI (Info.plist) | Bundled files |
|---|---|---|---|---|
| `.cla` (lesson) | `ChordioLessonArchiveKey` | `ExportDataModel` | none declared | 6 |
| `.sheetmusicpack` | `kSheetMusicPackArchiveKey` | `SheetMusicPackTransferModel` | none declared | 9 |
| `.chordpack` | `ChordioChordPackArchiveKey` | `ChordPackTransferModel` | `com.oneinabillion.app.document.chordPack` (package, "Custom Chord Pack File", LSHandlerRank Owner) | 7 |
| `.csm` (single score) | `kChordioExportSheetMusicItemArchiveKey` | `ExportSheetMusicDataModel` | none declared | 1 (`Where Time Lingers.csm`) |
| `.cpl` (one playlist / progression) | `kChordioExportPlaylistArchiveKey` (string in the binary) | `ExportPlaylistDataModel` | `com.oneinabillion.app.document.cpl` (Editor, Alternate) | 0 |

Other archive keys found in the binary: `kChordioAirDropFileURLKey`, `TBLeadsheetDataModelKey`. **exact** (cstring).

Most string fields in `.cla` files start with a **leading space** (`" Intermediate"`, `" Claude Debussy"`). It is an artefact of the authoring tool. **exact**.

---

## 1. Lesson `.cla` (`ExportDataModel`), shown as "Lessons" / "Listening Session"

Lessons are authored in a separate tool. Every embedded file URL points at `…/T/com.oneinabillion.ChordioLessonCreator/.com.apple.Foundation.NSItemProvider.*`, so the tool is called **"ChordioLessonCreator"** and files are added by drag and drop. **exact**.

### Schema
| Field | Type | Meaning / values seen |
|---|---|---|
| `titleString` | NSString | title |
| `subtitleString` | NSString | subtitle |
| `author` | NSString | composer or "Chordio" |
| `genre` | NSString | "Classical", "Jazz Ballad", "RnB" |
| `levelName` | NSString | "Beginners", "Intermediate" (the app has the level list `Beginners / Intermediate / Advanced / Professional`, **exact** cstring) |
| `sku` | NSString | `LP-<NAME>-P01-GB-CHORDIO` |
| `keySignatureIndexNumber` | NSNumber | 0, 2, 9 seen (index into the key-signature list) |
| `pianoRollOffsetString` | NSString | vertical piano-roll scroll offset: " 80", " 30", " 0", " -10" |
| `lessonDescription` | NSAttributedString | 533–714 characters of prose |
| `isPurchased` | NSNumber(bool) | 0 in all files |
| `isBlankLesson` | NSNumber(bool) | 1 only in BlankLesson.cla (the template) |
| `instrumentIndexNumber` | NSNumber | 0 or 1 (present in newer files only) |
| `versionNumber` | NSNumber? | null |
| `fileName`, `fileSize` | — | null |
| `lessonAssets` | NSArray<`LessonAsset`> | always 4 |

### `LessonAsset`
| Field | Meaning |
|---|---|
| `dropViewTypeNumber` | **1** = full audio recording (mp3, `audioDurationNumber` s), **2** = audio preview clip (mp3, `audioPreviewDurationNumber` s, about 24–53 s), **3** = MIDI performance (`midiDurationNumber`, `endMIDITimeStampInSecNumber`, markers), **4** = artwork (PNG) |
| `draggableEventData` | NSData, the embedded file bytes |
| `fileName`, `pathExtention` (sic), `fileURL` | original drop name, extension, and the authoring machine's temp URL |
| `markerNames` | NSArray<NSString>: section titles. A first line is the title and the following lines are a description (`"Major II-V-I (inv)\nUsing Tensions (9th, 11th, 13ths)"`) |
| `markerEventTimeStamps` | NSArray<number>, in **beats (quarter notes)**. Verified: 52 beats × 480 ticks = tick 24960, which is the matching MIDI marker meta-event (type 6) in the embedded MIDI. **exact** |

The embedded MIDI is SMF format 0 at 480 PPQ. The marker meta-events (FF 06) repeat `markerNames`. Channel use inside lesson MIDI: ch 0 carries most notes, and ch 9/10 (and 1, 8) carry other notes. Because ChordModel uses channel 9 for "coloured bass notes" (§3), channel number is very likely used as a **colour or role tag, not a GM drum channel**. **inferred**.

The Core Data entity `LessonPack` keeps a `.cla` as `lessonAssetData`, with markers in the `LessonPackMarker` entity (`name`, `markerDescription`, `timeInSeconds`). Users add, rename and edit markers ("Rename", "Edit the marker title", "Marker title"). **exact** (strings + model).

### Statistics (bundled lessons)
| File | Title | Author | Genre | Level | Audio s | MIDI notes | Markers | Tempo |
|---|---|---|---|---|---|---|---|---|
| ArabesqueNo1.cla | Arabesque No. 1 | Claude Debussy | Classical | Intermediate | 213.9 | 1455 | 0 | 119 |
| GnossienneNo1.cla | Gnossienne No. 1 | Erik Satie | Classical | Intermediate | 194.7 | 830 | 0 | 100 |
| GymnopedieNo1.cla | Gymnopedie No. 1 | Erik Satie | Classical | Intermediate | 177.1 | 455 | 0 | 80 (3/4) |
| ChordProgressions251No1.cla | Chord Progressions 251 No.1 | Chordio | Jazz Ballad | Beginners | 346.7 | 508 | 7 | 54 |
| RnBChordsNo1.cla | RnB Chords No.1 | Chordio | RnB | Intermediate | 232.1 | 793 | 10 | 120 |
| BlankLesson.cla | (template) | — | — | — | 0.04 | 1 | 0 | 120 |

There is also an HTML "lesson pack" store page (`Content/Data/LessonPacks/en/chordioLessonPack01.html` + `assets/css/style.css` + one PNG). It talks to native code through `window.webkit.messageHandlers.purchaseItem` and `.preview`. The page has a **PURCHASE** and a **PREVIEW** button, the title "How To Play Neo Soul Chord Progressions", and 4 content items. **exact**.

---

## 2. Sheet-music pack `.sheetmusicpack` (`SheetMusicPackTransferModel`)

### Pack fields
`title, sku (SP-…-P01-GB-CHORDIO), sortOrder, versionNumber, proficiencyPackLevel (0/1/2), infoText, imageData (PNG), selectedImageIndex, videoData (MP4 hero video, about 1.3–1.5 MB), videoHasAudio, dateCreated, isStorePack, isPurchased, isUserCreated, initialContentCount, pData, price, productID, sheetMusicItems[]`. **exact**.

### Item fields (`SheetMusicPackTransferSheetMusicItemModel`, which is also the Core Data `SheetMusicItem`)
| Field | Meaning / values (counts across all 108 items) |
|---|---|
| `title`, `subtitle`, `author`, `genre`, `key` (free text, e.g. "D major, B minor") | metadata |
| `detailDescription` | Markdown learning guide (history plus numbered "Piano playing directions"), up to about 4 KB; 16 items start with `#` headings |
| `midiData` | SMF format 1, 480 PPQ (all 108). **3 tracks** (43 items) = conductor + RH + LH; **5 tracks** (64) = conductor + RH + LH + bass + drums; 4 tracks (1). RH/LH by track order (track 1 ch 0, track 2 ch 1); bass on ch 5, drums on ch 10 (0-based). Role by track position is **inferred** from note ranges |
| `tempo` | BPM (0 means use the file's tempo; 6 items) |
| `proficiencyItemLevel` | 0 (15 items), 1 (92), 2 (1) → Beginner / Intermediate / Advanced (**inferred** from the pack-level labels) |
| `instrument` / `instrumentIndex` | all "Piano"; index 0 (103), 3, 7, 8 |
| `exsInstrumentBassFileName` | DoubleBassC 61, "No File Selected" 24, null 19, 808Bass01 3, BassBouquetCombo 1 |
| `exsInstrumentDrumsFileName` | JazzDrumsA 39, "No File Selected" 25, null 19, SalsaPercussionB 18, Jimindorothy Kit 6, JazzDrumsBrushesA 1 |
| `reverbPresetIndex` / `reverbWetDryMixAmount` | 0 (98), 3–7; wet/dry percentage |
| `timeConstantMultiplier` | 2 (68) or 0 (40): note-duration display scaling (**inferred**) |
| `cursorHeightMultiplier` | 0.7–1.5 (mostly 1): height of the playback cursor on the score |
| `noteSizeIndex`, `showNoteLetterIndex`, `middleCSplitPointNumber` | all 0 |
| `upperStaveClefIndex`, `lowerStaveClefIndex` | clef per staff |
| `swingPresetIndex`, `swingClefTarget` | swing feel and which staff it applies to |
| `repeatBarsEnabled` (14 true) / `repeatBarsData` | stored loop/repeat bar ranges |
| `chordProgression` | empty in every bundled item |
| `isFavorite, isPurchased, isStorePack, isUserCreated, versionNumber, dateCreated` | flags |

### Statistics
9 packs, **108 items**. Time signatures in item MIDI: 4/4 ×84, 3/4 ×16, 2/4 ×6, 12/8 ×1, 6/8 ×1.

| Pack | SKU | sortOrder | packLevel | Items | Store purchased flag |
|---|---|---|---|---|---|
| Jazz Progression, Vol. 1 | SP-JAZZPROGRESSIONVOL1 | 1 | 2 | 12 | true |
| Jazz Lick Exercises, Vol. 1 | SP-JAZZLICKEXERCISESVOL1 | 2 | 2 | 15 | true |
| II-V-I Jazz Progressions | SP-251JAZZPROGRESSIONS | 3 | 2 | 14 | false |
| Classical Collection, Vol. 1 | SP-CLASSICALCOLLECTION1 | 4 | 2 | 12 | true |
| Classical Collection, Vol. 2 | SP-CLASSICALCOLLECTION2 | 5 | 2 | 12 | true |
| Salsa Montuno Exercises, Vol. 1 | SP-SALSAMONTUNOEXERCISESVOL1 | 6 | 1 | 18 | true |
| RnB Progressions, Vol. 1 | SP-RNBPROGRESSIONSVOL1 | 7 | 1 | 6 | false |
| 19th Century Piano Songs | SP-NINETEENTHCENTURYPIANOSONGS | 8 | 0 | 6 | false |
| Beginner Essentials | SP-BEGINNERESSENTIALS | 9 | 0 | 13 | false |

The full per-item list (title, author, level, tempo, track layout) is in `data/content_stats.json` → `sheetmusicpacks[].itemList`.

The in-app guide text, verbatim string **exact**: "Each piece … comes with clear, step-by-step learning instructions … Adjust the Tempo · Play in Any Key · Loop Key Sections · Practice Hands Separately · Personalise Backing Tracks (piano, bass, drum volumes) · Jazz Solo: Jam over chord progressions (Jazz Packs)."

### `.csm` single score
`ExportSheetMusicDataModel` has the same fields as a sheet-music item. Example: "Where Time Lingers" by A.R. Briscoe, 83 BPM, bass DoubleBassC, 4-track MIDI.

---

## 3. Chord pack `.chordpack` (`ChordPackTransferModel`)

### Pack fields
`title, subtitle, sku (CP-…-P01-GB-CHORDIO), versionNumber, infoText, highlights ("{count} …" template, 3 lines), imageData (PNG), selectedImageIndex, videoData (MP4), dateCreated, isStorePack, isPurchased, isUserCreated, playlists[]`. **exact**. The binary has a "Chord Pack Creator" screen (`ChordPackSKUViewController`: "Enter a unique SKU", "Enter a version number", "Export: macOS: ( P01 ) and iPhone: ( Q01 )"), so packs are authored inside the app in a developer mode (`TBDeveloperModeAppKey`). **exact** strings.

### Playlist (= one progression; Core Data `Playlist`)
| Field | Values |
|---|---|
| `title`, `author` (often the song or composer), `genre` (free text), `key` (free text, mostly null) | metadata |
| `chordProgression` | display string `"C min \| F min7 \| G Aug \| …"` |
| `chordModelsData` | NSData holding a **nested NSKeyedArchiver** with root `SavedChordModels: [ChordModel]` |
| `midiData` | SMF format 1 rendering of the progression |
| `tempo` | BPM (120 for 339 of 556) |
| `instrument` / `instrumentIndex` / `exsfileName` | Grand Piano/GrandPianoC 187, Electric Piano/RhodesB 141, Rhodes/RhodesMixA 79, Strings/StringsA 64, Dream Key/DreamKey 52, RnB Pads/DevantePad 19, Guitar/GuitarC 7, Piano/GrandPianoA 5, Vibes/VibeA 2 |
| `chordPatternIndex` | 0 (421), 1 (132), 5, 4: the chord-rhythm pattern (§ accompaniment) |
| `chordPatternPlaybackRateIndex` | 0–3 |
| `chordPatternPlayOnKeyboard` | bool |
| `backingRhythmGenreIndex` / `backingRhythmSubGenre` | 0 (542), 4, 5, 1 / "-", "Hip Hop Soul", "Beat 01 (No Clap)", "8ths Hats & Click" |
| `drumsIsActive`, `bassIsActive`, `chordBackingMuteIsActive` | bool (drums and bass on in 368 of 556) |
| `basslineSettingsData` | NSData (null in all bundled files) |
| `keySignatureIndex`, `isMinorKeySignature` | key signature |
| `isFavorite, isPurchased, isStorePack, versionNumber, dateCreated, detailDescription` | |

### `ChordModel` (one chord cell), 43 keys
| Field | Meaning |
|---|---|
| `name` | display name, root + space + quality: "F min7", "G 7", "C  Major 6th" |
| `rootNoteName`, `chordExtention` (sic) | root and quality suffix ("min9", "7(♯9, ♯5)", "/ B" for slash) |
| `midiNumbers` | the voicing (MIDI notes), 1–16 notes; 5 notes most common (2120), then 6 (1515) and 4 (1122) |
| `noteChannelNumbers` | per-note tag: **9 = coloured bass note** (lowest notes in 3175 of 3203 cases), **1 = melody/top note** (top notes in 16 of 16), 0 = normal chord tone. Matches `bassNoteColorRGBAs` / `melodyNoteColorRGBAs` and the API `numberOfColouredBassNote`. **inferred** from data + API names |
| `track1MidiNumbers`, `track2MidiNumbers`, `splitPointNumber` | right/left-hand split (split point = bass note number) |
| `chordResults` | **ranked alternative names** from the chord detector: `["Fmin7","Ab6 / F","Cmin(11, #5) / F","Eb6/9sus4 / F"]` |
| `numberOfChordResults` | count (0 for 2422 cells = not analysed or a single note) |
| `chordIntervalResults` | interval label per note for each result, concatenated (`"1","b3","5","b7"…`). Vocabulary: 1, 2, b3, 3, 4, b5, 5, #5, 6, b6, bb7, b7, 7, 8, b9, 9, #9, 10, 11, #11, b13, 13 |
| `numberOfSemitones` | step pattern of the primary scale (`[0,2,4,5,7,9,10]`) |
| `primaryScaleNotes` | the scale spelled from the root |
| `compatibleScales` | list of `{scaleName: [notes]}`. 25 names seen: Dorian, Phrygian, Melodic Minor, Harmonic Minor, Minor, Major, Major Pentatonic, Mixolydian, Lydian, Diminished WT, Aeolian, Minor Blues, Pentatonic Major, Locrian, Diminished, Diminished Whole Tone, Blues, Locrian ♯2 / #2, Whole Tone (WT), Ionian, Augmented, Whole Tone, Enigmatic, Oriental |
| `compatibleModalChords` | 5 groups, **Triad, Tetrad, Ninth, Eleventh, Thirteenth**, each with 7 diatonic chords as `"<Root> <Quality>\|[notes with octave]"`, e.g. `"G Minor Diminished Dominant 7th ♭ 9th\|[G0, B♭0, D♭1, F1, A♭1]"` |
| `duration`, `durationFraction`, `durationFractionFloat`, `chordNoteDurationType`, `tickCount` | length. Type↔fraction (exact from the data): 0=1/1, 1=3/2, 2=1/2, 3=3/4, 4=1/4, 5=3/8, 6=1/8, 8=1/16 (7 = 3/16, from the UI list). UI labels: "Whole Note (1/1)", "Half Note Dotted (3/2)", "Half Note (1/2)", "Quarter Note Dotted (3/4)", "Quarter Note (1/4)", "Eight Note Dotted (3/8)", "Eight Note (1/8)", "Sixteenth Note Dotted (3/16)", "Sixteenth Note (1/16)" |
| `isChordRest` | rest cell (133) |
| `isStartRepeat`/`isEndRepeat`/`startRepeatCount`/`endRepeatCount`/`startRepeatIndex`/`shouldAdd*Repeat` | repeat signs (201 cells). Shown as `\|\|:` / `:\|\|` names |
| `isSlashChord` (573 true), `slashCount`, `isDisplayIndexSwapped`, `displayIndex` | which `chordResults` entry is displayed |
| `transpose`, `releaseVelocity`, `channel`, `index`, `timeStamp`, `isACopy`, `strumIndex`, `noteColourIndex`, `modeName` | misc |

### Statistics (7 chord packs)
| Pack | SKU | ver | Progressions | Chords |
|---|---|---|---|---|
| Free Chord Pack | CP-FREECHORDPACK | 31 | 16 | 322 |
| Jazz Progressions 1 | CP-JAZZPROGRESSION1 | 28 | 96 | 1134 |
| Neo-Soul Tunes 1 | CP-NEOSOULTUNES1 | 33 | 106 | 1159 |
| II-V-I Progressions | CP-251PROGRESSION | 29 | 79 | 1158 |
| RnB Progressions 1 | CP-RANDB1 | 23 | 78 | 628 |
| Neo-Soul Progressions 1 | CP-NEOSOULPROGRESSION1 | 40 | 114 | 862 |
| Classical Progressions 1 | CP-CLASSICALPROGRESSION1 | 18 | 67 | 886 |
| **Total** | | | **556** | **6149** |

Chords per progression: mode 8 (80 progressions), then 4 (77) and 5 (53); range 3–61. Most common displayed qualities (suffix of `name`): min9 604, min9(11) 435, Maj9 419, min7 404, Maj 322, Maj7 295, min 204, 7 188, 9sus4 180, 9(13) 174, 7(♯9, ♯5) 147, 13sus4 146, Maj7(13) 105, min7♭5 94. There are 350 distinct name suffixes in all.

The full aggregate tables are in `data/content_stats.json` → `aggregate`.

---

## 4. Core Data storage
See `DATA_MODEL.md`. Imported packs become `ChordPack`/`Playlist`, `SheetMusicPack`/`SheetMusicItem` and `LessonPack`/`LessonPackMarker` rows. Each ChordModel array is stored in `Playlist.chordModels` (Transformable, `TBArrayTransformer`, an `NSSecureUnarchiveFromDataTransformer` subclass) or in `chordModelsData` (Binary).
