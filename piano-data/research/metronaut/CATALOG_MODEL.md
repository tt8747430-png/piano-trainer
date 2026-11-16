# Metronaut — catalog and content model

Scope: the "public library" model. It covers the bundled seed file `all.json`, the bundled `CatalogAPI/icons`, the live catalog API model recovered from Swift metadata, and the taxonomy (genres, levels, instruments, families, part kinds, accompaniment kinds). No score content is reproduced. Piece titles, author names and URLs of individual items are not copied here.

Data files:
- `data/catalog_schema.json`: inferred JSON schema of `all.json` with type counts, presence, ranges, array lengths.
- `data/catalog_stats.json`: counts and distributions, instrument list, referential-integrity checks, pk ranges.
- `data/swift_models_catalog.json`: 245 catalog/API Swift types (fields, optionality, CodingKeys) from Networking, Core, Domain, RealmDataSource.
- `data/api_endpoints.json`: hosts, paths and request types.

Legend: **exact** = read directly from the named file or binary. **inferred** = my interpretation.

## 1. The bundled seed: `Resources/all.json`

File: `Metronaut.app/Contents/Resources/all.json`, 75,879 bytes, one JSON object (**exact**).

### 1.1 Top level (**exact**)

| key | type | value / count |
|---|---|---|
| `cursor` | integer | 7065 |
| `piece` | array | 149 objects |
| `collection` | array | 73 objects |
| `author` | array | 129 objects |
| `instrument` | array | 29 objects |

Relation to the API (**exact** + **inferred**): the Swift type `Networking.All` (Networking framework) decodes `{author, instrument, instrumentfamily, genre, accompanimentkind, partkind, simplification, audiocopyright, piece, collection, opus, publisher, cursor, language, countryCode, full}`. It is returned by route `Networking.CatalogAPIv2.all`. `all.json` is a reduced, older-shape snapshot of the same "all" payload (it has `cursor`, `piece`, `collection`, `author`, `instrument`). **Inferred:** the app ships it as a first-launch seed and then requests deltas with `cursor` (incremental sync; `Backend.Parameters` has a `cursor` case and `CatalogParameters` is `{cursor, countryCode, language, token}`). The file's field names (`first_name`, `work_number`, `piece_icon`, `kind.description`) differ from the current DTOs (`Composer.firstName`, `Opus.workNumber`, `Accompaniment.kind: Int`), so it predates the v2/v4/v5 API.

### 1.2 `piece[]` schema (**exact**, 149 records)

| field | type | null / presence | notes |
|---|---|---|---|
| `pk` | integer | never null | range 498 to 992 |
| `title` | string | never null | mean length 17.2 characters; 8 titles carry a parenthesised arrangement suffix |
| `status` | string | never null | `Ready` 144, `Complete` 5 |
| `genre` | string | never null, may be empty | genre **name**, not id |
| `difficulty` | integer or null | null in 8 | range 1 to 3 |
| `collections` | integer[] | always present | collection pks; 0 items: 62, 1 item: 85, 2 items: 2 |
| `accompaniments` | object[] | always present | 1: 127 pieces, 2: 18, 3: 3, 4: 1 |
| `authors` | integer[] | always present | exactly 1 author for all 149 |
| `movement` | integer or null | null in 75 | range 1 to 24 (movement number within a work) |
| `work_number` | string or null | null in 103 | catalogue number string (opus / BWV-style) |
| `piece_icon` | null | always null | unused field |

### 1.3 `piece[].accompaniments[]` schema (**exact**, 176 records)

| field | type | notes |
|---|---|---|
| `pk` | integer | range 498 to 1030 |
| `kind` | object or null | `{description: string}`; null in 7 |
| `instrument` | integer | instrument pk of the **solo part** the user plays |
| `transposition` | integer | semitones; 0 in 175, 2 in 1 |

### 1.4 `collection[]` schema (**exact**, 73 records)

| field | type | notes |
|---|---|---|
| `pk` | integer | range 130 to 253 |
| `title` | string | |
| `image` | null | always null in seed |
| `pieces` | integer[] | piece pks; empty in 31 collections; max 15 |
| `piececollection` | boolean | true in 54. **Inferred:** true = "this collection is one multi-movement work" (e.g. an opera or suite), false = editorial grouping |
| `tags` | string[] | only one tag value exists: `opera` (1 collection) |

### 1.5 `author[]` schema (**exact**, 129 records)

| field | type | notes |
|---|---|---|
| `pk` | integer | range 136 to 268 |
| `first_name` | string | |
| `last_name` | string | |
| `image` | string (URL) | 116 non-null; all on `s3-eu-west-1.amazonaws.com/production.antescofo.com/authors/<sha1>.png` |
| `pieces` | integer[] | 87 authors list 0 pieces; max 21 |

Only 42 of the 129 authors are referenced by `piece[].authors`. All referenced ids resolve (0 dangling references for authors, collections, collection pieces and accompaniment instruments; **exact**, computed).

### 1.6 `instrument[]` (**exact**, 29 records)

Field set: `{pk: int, name: string, transposition: int, image: null}`. `transposition` is the written-to-sounding offset in semitones.

| pk | name | transposition |
|---|---|---|
| 33 | Voice | 0 |
| 34 | Flute | 0 |
| 35 | Violin | 0 |
| 36 | Soprano Saxophone | -2 |
| 37 | Piano | 0 |
| 38 | Cello | 0 |
| 39 | Clarinet in Bb | -2 |
| 40 | French Horn | -7 |
| 41 | Oboe | 0 |
| 42 | Viola | 0 |
| 43 | Mallet | 0 |
| 44 | Trumpet in C | 0 |
| 45 | Double Bass | -12 |
| 46 | Tuba | 0 |
| 48 | Trombone | 0 |
| 49 | Bassoon | 0 |
| 50 | English horn | -7 |
| 51 | Soprano | 0 |
| 52 | Bass | 0 |
| 53 | Baritone | 0 |
| 54 | Tenor | 0 |
| 55 | Alto saxophone | -9 |
| 56 | Clarinet in A | -3 |
| 57 | Mezzo-soprano | 0 |
| 58 | Trumpet in Eb | 3 |
| 60 | Trumpet in Bb | -2 |
| 65 | Euphonium | 0 |
| 66 | Alto | 0 |
| 67 | Tenor Saxophone | -14 |

### 1.7 Statistics (**exact**, computed by `scratchpad/catalog.js`)

Pieces by genre string: Classical 90, Baroque 20, empty 16, Jazz 10, Romantic 8, Traditional 4, Pop rock 1.

Pieces by difficulty: 1 = 62, 2 = 58, 3 = 21, null = 8.

Genre x difficulty:

| genre | 1 | 2 | 3 | null |
|---|---|---|---|---|
| Classical | 37 | 34 | 15 | 4 |
| Baroque | 11 | 8 | 0 | 1 |
| (empty) | 4 | 7 | 4 | 1 |
| Jazz | 4 | 5 | 0 | 1 |
| Romantic | 3 | 2 | 2 | 1 |
| Traditional | 3 | 1 | 0 | 0 |
| Pop rock | 0 | 1 | 0 | 0 |

Accompaniments by `kind.description`: Piano 156, Orchestral 13, null 7.

Accompaniments by solo instrument: Voice 43, Violin 27, Cello 24, Soprano 24, Flute 21, Baritone 6, Tenor 5, Trumpet in C 5, French Horn 3, Mezzo-soprano 3, Double Bass 2, Viola 2, Bassoon 2, Trombone 2, Oboe 2, Clarinet in A 1, Clarinet in Bb 1, Bass 1, English horn 1, Piano 1.

Observation (**exact**): the seed is a melody-instrument-plus-piano-accompaniment catalogue. Piano appears as the solo instrument in only 1 of 176 accompaniments. The piano-centric content (hands separate, "Right Hand" / "Left Hand" / "Both Hands" parts) comes from the live API, not from this seed.

## 2. `Resources/CatalogAPI/icons/` (**exact**)

60 PNG files with alpha, named by a 40-hex-digit hash (SHA-1 length). Three sizes, 20 files each:

| size (px, w x h) | files | **inferred** role |
|---|---|---|
| 120 x 100 | 20 | `@1x` |
| 240 x 200 | 20 | `@2x` |
| 360 x 300 | 20 | `@3x` |

So there are 20 distinct images in 3 scales. Two sampled files show a flat instrument illustration (violin, cream body with navy neck). None of the 60 hashes occurs in `all.json`. The string `CatalogAPI/icons` sits in the main binary next to `realmCloseInstruments` and `UserService.swift` (**exact**, `strings` order). **Inferred:** these are offline fallbacks for instrument and instrument-family `deviceImage` assets (`Core.DeviceImage {backgroundColor, placeholder, _url, x1, x2, x3, isAsset}`), the file name being a hash of the remote URL. They are proprietary art; do not reuse.

## 3. Live catalog model (Swift DTOs, **exact** field names)

Mangled type legend: `Si` Int, `SS` String, `Sb` Bool, `Sd` Double, suffix `Sg` = optional, `Say…G` = array. Full machine-readable list: `data/swift_models_catalog.json`.

### 3.1 Wire DTOs (Networking framework)

| type | fields (`?` = optional) |
|---|---|
| `Networking.All` | author[], instrument[Instrument], instrumentfamily[InstrumentFamily], genre[], accompanimentkind[], partkind[], simplification[], audiocopyright[], piece[Piece], collection[Collection], opus[Opus], publisher[], cursor: Int, language: String, countryCode?, full: Bool? |
| `Networking.Opus` (a work) | pk, originalTitle?, title?, displayTitle?, fullTitle?, key?, accidental?, mood?, workNumber?, genre: Int?, authors[Int], pieces[Int], collections[Int], displayContentSeparately?, freeformMatch? |
| `Networking.Piece` (a movement / playable item of an opus) | pk, status: String, originalTitle?, title?, displayTitle?, fullTitle?, movement: Int?, collections[Int], opus: Int, accompaniments[Accompaniment], freeformMatch?, computedTitle?, publishers[Int]? |
| `Networking.Accompaniment` (a "version") | pk, status?, fullTitle, kind: Int?, lyricsLanguage?, instruments[Int], isoriginal: Bool, transposition: Int, difficulty: Int?, partKind: Int?, partExtra?, simplification: Int?, musicxmlFile?, soloMusicxmlFile?, editedPdfFile?, ascoFile?, previewAudioFile?, previewAudioFile48?, recordings[]?, soloPart: Int?, previewBeginMeasure: Int?, previewBeginPulsation: Double?, previewEndMeasure: Int?, previewEndPulsation: Double?, mixers[]? |
| `Networking.Collection` | pk, title, opuses[Int], pieces[Int], freeformMatch?, deviceImage, shouldDisplay? |
| `Networking.Instrument` | pk, title, register?, rangeMin: Int?, rangeMax: Int?, clef: String, alternateClef1?, alternateClef2?, octavia: Int, transposition: Int, deviceImage, defaultOrder?, freeformMatch?, closeInstruments[Int], compatibleInstruments[Int]? |
| `Networking.InstrumentFamily` | pk, title, description?, instruments[Int], deviceImage, defaultOrder?, freeformMatch? |
| `Networking.FreePieces` | bundles[FreePieceBundle{id, pieces[FreePiece{id}]}], nextRotation? |
| `Networking.SearchResults` | widgets[], parameters, hasMore |
| `Networking.SearchParameters` | offset, limit, query, instrument, level, filters[], pks[Int]?, token?, countryCode?, genrePreference?, hasInternet, widescreen?, showCategories?; `Properties` cases: filtersCount, favorited, purchased, original |

Key ideas visible in the model (**inferred** from names):
- One **Opus** (work) has many **Pieces** (movements). One Piece has many **Accompaniments**. An Accompaniment is a playable "version": a solo part (`soloMusicxmlFile`, `soloPart`, `instruments`, `partKind`, `partExtra`, `simplification`, `difficulty`, `transposition`) bound to a backing track and an Antescofo score-following file (`ascoFile`). `musicxmlFile` is the full score; `editedPdfFile` is the print PDF.
- `previewBegin/EndMeasure` + `previewBegin/EndPulsation` define the audio preview excerpt by measure and beat.
- `mixers[]` lists audio stems (`Core.Mixer {recordingType, mixerTitle, mixerSubtitle}`; `Core.VersionMixer {tracks[VersionTrack{role, title, subtitle, number}]}`).
- `isoriginal` marks pieces originally written for that instrument (search filter "Only original compositions").
- `freeformMatch` fields exist on every entity: **inferred** search-synonym text.
- `closeInstruments` / `compatibleInstruments` let a user on one instrument see versions for a related one.
- `octavia` and `clef` / `alternateClef1/2` drive display transposition and clef switching per instrument.

### 3.2 App-side models (Core framework)

| type | fields |
|---|---|
| `Core.MNOpus` | pk, originalTitle?, title?, displayTitle?, fullTitle?, key?, accidental?, mood?, workNumber?, genre?, freeformMatch?, authors[]?, pieces[]?, collections[]? |
| `Core.MNPiece` | pk, status?, originalTitle?, title?, displayTitle?, fullTitle?, movement?, freeformMatch?, computedTitle?, purchased?, freePiece?, opus?, selectedAccompaniment?, accompaniments[]?, collections[]?, publishers[MNPublisher{pk, name?}]? |
| `Core.MNAccompaniment` | as the DTO plus kind/simplification/partKind as objects, and `difficultyLevel` (CodingKeys) |
| `Core.MNCollection` | id, title?, freeformMatch?, image?, opus[]?, pieces[]? |
| `Core.MNInstrument` | pk?, title?, register?, rangeMin, rangeMax, clef?, alternateClef1?, alternateClef2?, octavia, transposition, defaultOrder, freeformMatch?, image?, closeInstruments[]? |
| `Core.MNInstrumentFamily` | title?, summary?, defaultOrder, freeformMatch?, image?, instruments[]? |
| `Core.Composer` | pk, firstName?, lastName?, fullName?, deviceImage?, defaultOrder?, freeformMatch? |
| `Core.Genre` | pk, title?, defaultOrder?, shouldDisplay? |
| `Core.AccompanimentKind` | pk, title?, defaultOrder? |
| `Core.PartKind` / `Core.Simplification` / `Core.MusicPublisher` | pk, name? |
| `Core.StaticData` | genres, simplifications, publishers, audioCopyrights, partKinds, accompanimentKinds, instruments, instrumentFamilies |
| `Core.DeviceImage` | backgroundColor?, placeholder?, _url?, x1?, x2?, x3?, isAsset? |
| `Core.DifficultyGroup` | label, difficultyLevel: Int, versions[VersionDescriptor{label, sublabel, accompaniments[], selectedAccompanimentIndex?}] |
| `Core.Playlist` | id, name?, icon?, isFavorite, owner?, playlistPieces[PlaylistPiece{playlistId, pieceId, order?}]?, opuses[]? ; `PlaylistImageEnum`: Kandinsky, Klimt, Miro, Miro2, Mondiran, Munch, VanGogh, VanGogh2 |
| `Core.Workout` | pk, title?, subtitle?, summary?, isFree?, deviceImage?, workoutSteps[]? |
| `Core.WorkoutStep` | pk, opus?, difficulty?, difficultyText?, minScore?, maxScoreSimplified?, subStepPerformance?, subStepSimplified?, isFree?, workoutStepState{practice, training}?, title?, workout?, suggestedWorkouts[]?, bestScore?, bestScoreVersion?, currentScore?, currentScoreVersion?, currentTotalXp?, totalXp? |
| `Core.WorkoutSubStep` | explanation?, extractBeginMeasure?, extractBeginPulsation?, extractEndMeasure?, extractEndPulsation?, preference: PerformancePreferences |
| `Core.MNCard` | id, title?, summaryInside?, summaryOutside?, theme?, image?, action?, tag? |
| `Core.MNWidget` | widgetType?, type: EntityType?, title?, subtitle?, entities[]?, titleButton?, tag?, hasBottomDivider? |
| `Core.SearchCategory` | id, title, query?, index: SearchIndex{pieces, collections, authors}?, filters[] |
| `Core.PieceRequest` | id, title, artist, date, voteNumber, allowedToVote, additionalProperties? |
| `Core.CellPieceUIViewModel` | pieceId?, composerId?, title, titleColor, url?, placeholderImage, authorText, authorColor, color?, level1?, level2?, level3?, isLoading, previewPlayerItem?, previewIsPlaying?, offlineStatus, showDifficulty, showPlay, preferredAccompanimentId?, showComposerMenuItem?, isTeacher |

### 3.3 Home / discovery layout is server-driven (**exact** enum cases)

`Core.WidgetType`: card_header_collection, card_header_offline, card_header_playlist, card_header_recently_played, opus_composer, opus_collection, opus_offline, opusMyMusicRecentlyPlayed, opus_playlist, opus_recently_played, record_piece, record, search_categories, search_opuses, search_authors, search_collections, search_opuses_all, search_authors_all, search_collections_all, suggestion_search_history, title, cards, statsMyMusic, students.

`Core.MNWidget.EntityType` (41 cases): card, opus, collection, composer, author, rating, pieceRequest, workout, workoutDetail, workoutStep, title, onboarding, myMusicOnboarding, placeholder, recordPiece, record, recordPlaceholder, playlist, post, postUser, postUserPlaceholder, postPiece, postPiecePlaceholder, stats, recently, suggestion, history, search, searchCategory, searchPiece, searchComposer, searchCollection, searchPieceRequest, piecesListHeader, recommendations, offline, offlinePlaceholder, video, student, share, sharePlaceholder.

`Core.MNActionTypeEnum` (card/button action): unknown, deeplink, url, payload, simple, callback, video.

### 3.4 Search and filters (**exact**)

| model | values |
|---|---|
| `Core.FilterKind` | difficulty, genre, instrument, instrumentFamily, accompanimentKind, favorite, recentlyPlayed, original, composer |
| `Core.FiltersSectionModel.Kind` | genre, difficulty, accompaniment, instrument, myMusic, composer, originalComposition |
| `Core.SearchIndex` | pieces, collections, authors |
| `Core.MNSearch.MNSearchEnum` | suggested, history |
| `Core.MNSearchPlaceholderType` | noInternet, noResults, error |
| UI labels (en strings) | search.filter.difficulty "Difficulty", search.filter.genre "Period / Genre", search.filter.instrument "Sheet music instrument", search.filter.accompaniment "Accompaniment type", search.filter.myMusic "My music", search.filter.originalComposition "Original compositions", search.filter.onlyOriginal_new "Only search for pieces composed for the selected instrument(s)", search.filter.arrangementsIncluded "Include adaptations", search.filter.price "Price", search.filter.clear "Reset", search.filter.reset "Clear filters", search.filter.confirm "View results" |

## 4. Taxonomy (**exact**, from `en.lproj/Localizable.strings`)

The app localises taxonomy by server pk.

Genres (`genre.<pk>`): 1 Classical, 2 Baroque, 3 Jazz, 4 Traditional, 5 Romantic, 6 Pop Rock, 7 Anthem, 8 French Chanson, 9 Renaissance, 11 Gospel, 12 Christmas, 13 Country, 14 Celtic, 15 Children, 16 Music of the 20th Century, 17 Soul - R&B, 18 Film Music. (No key for pk 10.) Asset/onboarding genre ids in MetronautUI/Core strings: classical_baroque, romantic_20th, country_folk, soul_rnb, film_music, bubble_gum.

User levels (`user_level.<n>`): 1 Beginner, 2 Intermediate, 3 Advanced, 4 Expert.

Piece difficulty labels: `global.difficulty1` Easy, `global.difficulty2` Intermediate, `global.difficulty3` Advanced. `songDetails.difficulty` = "Level". Seed difficulty values are 1 to 3, matching these labels.

Simplification labels: `part_simplified.1` "simplified", `part_simplified.2` "very simplified".

Instrument families (`InstrumentFamily.<pk>`): 1 Voice, 2 Saxophones, 3 Clarinets, 4 Trumpets, 5 Oboes, 7 Harp. Account avatar assets exist for families 1, 2, 3, 4, 5, 7 (`MetronautResourceKit.AccountAsset.InstrumentFamily`).

Instruments (`Instrument.<pk>`; 117 keys including `.mixer` and `.crm.` variants): 33 Female Voice, 34 Flute, 35 Violin, 36 Soprano Saxophone, 37 Piano, 38 Cello, 39 Clarinet in B♭, 40 French Horn, 41 Oboe, 42 Viola, 43 Mallet, 44 Trumpet in C, 45 Double Bass, 46 Tuba, 48 Trombone, 49 Bassoon, 50 English horn, 51 Soprano, 52 Bass, 53 Baritone, 54 Tenor, 55 Alto saxophone, 56 Clarinet in A, 57 Mezzo-soprano, 58 Trumpet in E♭, 60 Trumpet in B♭, 63 Guitar, 64 Countertenor, 65 Euphonium, 66 Alto, 67 Tenor Saxophone, 68 Male voice, 69 Harp, 70 Bass Clarinet. Slug keys also exist (`Instrument.piano`, `.violin`, `.cello`, `.flute`, `.clarinet`, `.saxophone`, `.trumpet`, `.trombone`, `.horn`, `.oboe`, `.bassoon`, `.viola`, `.double_bass`, `.guitar`, `.harp`, `.voice`, `.percussion` = Mallet). Account avatar assets exist for instruments 34, 35, 37, 38, 40, 42, 43, 45, 46, 48, 49, 63, 65.

Part kinds (`part.<pk>`): 1 "{{instrument}} {{extra}}", 2 Prima (4 Hands), 3 Seconda (4 Hands), 4 Student, 5 Teacher, 6 Right Hand, 7 Left Hand, 8 "{{instrument}} {{extra}}", 12 Both Hands, 15 (solo), 16 (accompaniment). Mixer labels (`partKind.<pk>.mixer`): 2 Prima, 3 Seconda, 15 Solo, 16 Accomp.

Accompaniment kinds (`accompanimentKind.<pk>.mixer`): 1 Piano, 2 Orchestra, 3 "...", 4 Violin, 5 Guitar, 6 Viola, 7 Flute.

Piano-relevant point (**inferred**): hands-separate practice is modelled as separate **part kinds** (Right Hand, Left Hand, Both Hands) of the same piece, each a separate accompaniment/version with its own MusicXML and follow file. Four-hands duets use Prima/Seconda; teacher/student duets use Student/Teacher.

## 5. API surface for the catalog (summary; full list in `data/api_endpoints.json`)

Hosts (**exact**, Networking): catalog `https://catalog.metronaut.app/` (prod), `https://catalog.staging.antescofo.dev/` (staging), China `https://catalog.production.metronautapp.cn/` and `.staging.`; auth `https://auth.metronaut.app/`, `https://auth.staging.antescofo.dev/`, China equivalents.

Catalog paths (**exact**; long ones from `__cstring`, short ones recovered from Swift small-string immediates in Networking code):

| path (**exact**) | request type / purpose (**inferred** pairing by name) |
|---|---|
| `/v4/static_data/` | StaticDataRequest (platform) -> genres, simplifications, publishers, audioCopyrights, partKinds, accompanimentKinds, instruments, instrumentFamilies |
| `/v4/pieces/`, `pieces/`, `previewpieces/`, `versions/` | piece detail, preview pieces, versions list (CatalogAPIv2.pieces.piece / pieceSlug / previewPieces; PerfVersionsRequest) |
| `/v4/authors/` | ComposerDetailsRequest |
| `/v4/collections/` | CollectionRequest / CollectionDetailsRequest |
| `/v4/discovery/`, `/v5/discovery/` | DiscoverRequest / DiscoverRequestV5 (server-driven home widgets) |
| `/v4/practice/` | PracticeRequest (practice tab) |
| `/v4/my_music/` | MyMusicGetRequest |
| `/v4/playlist/`, `playlist/`, `/playlist/`, `/pieces/` | playlists CRUD and playlist pieces |
| `/v4/recently_played/` | RecentlyPlayedRequest |
| `/v4/recommendation/` | RecommendationRequest(s) |
| `/v5/search/`, `/v5/search/pieces/`, `/v5/search/collections/`, `/v5/search/authors/` | search |
| `/v3/workouts/`, `workoutsteps/` | WorkoutRequest, CatalogAPIv3.workoutSteps |
| `v1/card_video/`, `v1/exploration/` | VideoCardsRequest, exploration feature cards |
| `/v4/shares/`, `/v1/shares/` | shared pieces/recordings |

Common query parameters (**exact** CodingKeys): `instrument`, `level`, `genre_preference` / `genrePreference`, `countryCode`, `is_intro_offer_eligible`, `offset`, `limit`, `clicked_card_ids`, `launch_date`, `platform`. Headers: `Accept-Language`, `x-auth-token`, plus `language` and `full` (`Backend.Headers`). Request policy per call: `network`, `cached`, `both` (`AbstractRequest.RequestPolicy`).

Personalisation (**inferred**): almost every catalog call carries the user's instrument, level, genre preference and country. Results and free-piece rotations (`FreePieces.nextRotation`) are computed server-side per user profile and region.

## 6. What a web piano trainer can take from this model

1. Separate **work** (opus), **movement** (piece) and **version** (accompaniment). A version owns the MusicXML for the player's part, the backing audio, a follow/alignment file, difficulty, simplification level, part kind and transposition.
2. Model hands as part kinds (RH, LH, Both) or as staff filters on one MusicXML. Metronaut uses separate versions; a web app can derive them from one MusicXML by staff.
3. Keep a `difficulty` 1-3 on versions and a `level` 1-4 on users; map level to default difficulty filters.
4. Store preview excerpts as measure + beat ranges, not seconds, so they survive tempo changes.
5. Ship a small seed catalogue in the bundle and sync deltas with a monotonically increasing `cursor`.
6. Give every entity a `freeformMatch` (search synonyms) and a `defaultOrder` (editorial sort).
7. Instruments need `transposition`, `clef`, alternate clefs, `rangeMin`/`rangeMax` and an octave shift (`octavia`); for piano only the clef pair and range matter.
