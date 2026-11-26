# Core Data model (Chordio.momd / Chordio.mom)

Decoded from the compiled model `Resources/Chordio.momd/Chordio.mom` (an NSKeyedArchiver of NSManagedObjectModel) with my Node decoder. **exact**. Store container class: `NSPersistentCloudKitContainer`, so iCloud sync of the store is possible (**exact**: class reference; whether CloudKit is switched on at runtime is not verified). Compiler: 25436 / Xcode 270200.

The 7 entities are listed below. All attributes are optional. A default of null means none. Delete rules come from the model.

## ChordPack (class `ChordPack`)

| Attribute | Type | Default | Notes |
|---|---|---|---|
| dateCreated | Date |  |  |
| highlights | String |  |  |
| imageData | Binary |  |  |
| infoText | String |  |  |
| initialContentCount | Integer32 | 0 |  |
| isPurchased | Boolean |  |  |
| isStorePack | Boolean |  |  |
| isUserCreated | Boolean |  |  |
| pData | Binary |  |  |
| price | String |  |  |
| productID | String |  |  |
| selectedImageIndex | Integer32 | 0 |  |
| sku | String |  |  |
| subtitle | String |  |  |
| title | String |  |  |
| versionNumber | Integer32 | 0 |  |
| videoData | Binary |  | flags 4 (external storage) |

| Relationship | To | Inverse | To-many | Delete rule |
|---|---|---|---|---|
| playlists | Playlist | theChordPack | true | Cascade |

## LessonPack (class `LessonPack`)

| Attribute | Type | Default | Notes |
|---|---|---|---|
| author | String |  |  |
| fileName | String |  |  |
| fileSize | Float | 0 |  |
| genre | String |  |  |
| instrumentIndex | Integer32 | 0 |  |
| isAvailable | Boolean |  |  |
| isBlankLesson | Boolean |  |  |
| isPurchased | Boolean |  |  |
| keySignatureIndex | Integer32 | 0 |  |
| lessonAssetData | Binary |  |  |
| lessonDescription | String |  |  |
| levelName | String |  |  |
| pianoRollOffset | String |  |  |
| price | String |  |  |
| productID | String |  |  |
| sku | String |  |  |
| subtitle | String |  |  |
| title | String |  |  |

| Relationship | To | Inverse | To-many | Delete rule |
|---|---|---|---|---|
| markers | LessonPackMarker | theLessonPack | true | Nullify |

## LessonPackMarker (class `LessonPackMarker`)

| Attribute | Type | Default | Notes |
|---|---|---|---|
| markerDescription | String |  |  |
| name | String |  |  |
| timeInSeconds | Double | 0 |  |

| Relationship | To | Inverse | To-many | Delete rule |
|---|---|---|---|---|
| theLessonPack | LessonPack | markers | false | Nullify |

## Playlist (class `Playlist`)

| Attribute | Type | Default | Notes |
|---|---|---|---|
| author | String |  |  |
| backingRhythmGenreIndex | Integer32 | 0 |  |
| backingRhythmSubGenre | String |  |  |
| bassIsActive | Boolean |  |  |
| basslineSettingsData | Binary |  |  |
| chordBackingMuteIsActive | Boolean |  |  |
| chordModels | Transformable |  | transformer TBArrayTransformer |
| chordModelsData | Binary |  |  |
| chordPatternIndex | Integer32 | 0 |  |
| chordPatternPlayOnKeyboard | Boolean | false |  |
| chordPatternPlaybackRateIndex | Integer32 | 0 |  |
| chordProgression | String |  |  |
| dateCreated | Date |  |  |
| detailDescription | String |  |  |
| drumsIsActive | Boolean |  |  |
| exsfileName | String |  |  |
| genre | String |  |  |
| instrument | String |  |  |
| instrumentIndex | Integer16 | 0 |  |
| isFavorite | Boolean |  |  |
| isMinorKeySignature | Boolean |  |  |
| isPurchased | Boolean |  |  |
| isStorePack | Boolean |  |  |
| isTempSave | Boolean |  |  |
| isUserCreated | Boolean |  |  |
| key | String |  |  |
| keySignatureIndex | Integer16 | 0 |  |
| midiData | Binary |  |  |
| tempo | Integer32 | 0 |  |
| title | String |  |  |
| versionNumber | Integer32 | 0 |  |

| Relationship | To | Inverse | To-many | Delete rule |
|---|---|---|---|---|
| theChordPack | ChordPack | playlists | false | Nullify |
| theTrash | Trash | playlists | false | Nullify |

## SheetMusicItem (class `SheetMusicItem`)

| Attribute | Type | Default | Notes |
|---|---|---|---|
| author | String |  |  |
| chordProgression | String |  |  |
| cursorHeightMultiplier | Float | 0 |  |
| dateCreated | Date |  |  |
| detailDescription | String |  |  |
| exsInstrumentBassFileName | String |  |  |
| exsInstrumentDrumsFileName | String |  |  |
| genre | String |  |  |
| instrument | String |  |  |
| instrumentIndex | Integer16 | 0 |  |
| isFavorite | Boolean |  |  |
| isPurchased | Boolean |  |  |
| isStorePack | Boolean |  |  |
| isUserCreated | Boolean |  |  |
| key | String |  |  |
| lowerStaveClefIndex | Integer32 | 0 |  |
| middleCSplitPointNumber | Integer16 | 0 |  |
| midiData | Binary |  |  |
| noteSizeIndex | Integer16 | 0 |  |
| proficiencyItemLevel | Integer32 | 0 |  |
| repeatBarsData | Binary |  |  |
| repeatBarsEnabled | Boolean | false |  |
| reverbPresetIndex | Integer32 | 0 |  |
| reverbWetDryMixAmount | Float | 0 |  |
| showNoteLetterIndex | Integer16 | 0 |  |
| subtitle | String |  |  |
| swingClefTarget | Integer32 | 0 |  |
| swingPresetIndex | Integer32 | 0 |  |
| tempo | Integer32 | 0 |  |
| timeConstantMultiplier | Float | 0 |  |
| title | String |  |  |
| upperStaveClefIndex | Integer32 | 0 |  |
| versionNumber | Integer32 | 0 |  |

| Relationship | To | Inverse | To-many | Delete rule |
|---|---|---|---|---|
| theSheetMusicPack | SheetMusicPack | sheetMusicItems | false | Nullify |

## SheetMusicPack (class `SheetMusicPack`)

| Attribute | Type | Default | Notes |
|---|---|---|---|
| dateCreated | Date |  |  |
| imageData | Binary |  |  |
| infoText | String |  |  |
| initialContentCount | Integer32 | 0 |  |
| isPurchased | Boolean |  |  |
| isStorePack | Boolean |  |  |
| isUserCreated | Boolean |  |  |
| pData | Binary |  |  |
| price | String |  |  |
| productID | String |  |  |
| proficiencyPackLevel | Integer32 | 0 |  |
| selectedImageIndex | Integer32 | 0 |  |
| sku | String |  |  |
| sortOrder | Integer32 | 0 |  |
| title | String |  |  |
| versionNumber | Integer32 | 0 |  |
| videoData | Binary |  | flags 4 (external storage) |
| videoHasAudio | Boolean | false |  |

| Relationship | To | Inverse | To-many | Delete rule |
|---|---|---|---|---|
| sheetMusicItems | SheetMusicItem | theSheetMusicPack | true | Cascade |

## Trash (class `Trash`)

| Attribute | Type | Default | Notes |
|---|---|---|---|
| title | String |  |  |

| Relationship | To | Inverse | To-many | Delete rule |
|---|---|---|---|---|
| playlists | Playlist | theTrash | true | Nullify |

## Notes
- `Playlist` is one chord progression (a "session"). It belongs to a `ChordPack` or, after deletion, to `Trash`. Trash is a soft-delete bin (Nullify), and the UI says "Are you sure you want to permanently erase all the items in the Bin?". **exact**.
- `Playlist.chordModels` is Transformable with `TBArrayTransformer`, holding an NSArray of `ChordModel` (see CONTENT_FORMATS.md §3). `isTempSave` marks an autosaved working copy (**inferred** from the name).
- `SheetMusicItem` carries per-score playback settings: tempo, reverb, swing, clefs, split point, note size, note-letter display, repeat bars, and bass/drum EXS instruments.
- `LessonPack` keeps the whole `.cla` payload in `lessonAssetData` (Binary). `LessonPackMarker` holds user and section markers (`timeInSeconds`).
- There is no entity for user progress, scores, streaks or XP. **exact**: the model has none. Quiz scores live only in view state (`QuizLessonPickerView.correctAnswers/totalQuestions`).
