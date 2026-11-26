# Score rendering

Legend: **exact** = read from a file or binary (cited). **inferred** = interpretation.

## 1. Pipeline

| Stage | Component | Evidence |
|---|---|---|
| Input | MusicXML per version: `musicxmlFile` (full) and `soloMusicxmlFile` (solo part) in the catalogue; DTD id `-//Recordare//DTD MusicXML 3.1 Partwise//EN` | **exact** (`all.json` fields, GuidoKit strings) |
| Load | `-[GuidoKitScoreView setScoreFromMusicXMLatURL:error:withTitle:withSubtitle:withAuthors:withPartNum:percent:startMeasure:atStartBeat:endMeasure:atEndBeat:previewHeader:isPreview:]` | **exact** selector |
| Convert | libmusicxml `MusicXML2::xmlpart2guido` (RTTI string `N9MusicXML213xmlpart2guidoE`, `partHeader`, `partGroup`), messages like "xml2guido: Pop() called while EMPTY! Please REPORT!" | **exact**. libmusicxml is statically linked in `GuidoKit` (the separate `libmusicxml.framework` is an 84 KB stub) |
| Model | `GuidoKitScore { arHandler, guidoString, lastGuidoString, soloStaves, accompStaves, currentSoloTranspo, currentAccTranspo, currentSoloClef, measurePositionMap, timeSignatureMap, totalScoreDuration, askedSoloTranspo, askedAccTranspo, askedSoloClef, xmlInfos }` | **exact** ObjC properties |
| XML info | `XmlInfos { instrTransposer, soloStaves, totalStaves, totalMeasures, clefs, totalScoreDuration, numberOfParts, soloWrittenPitchRangeMin, soloWrittenPitchRangeMax }`; Swift `MusicXMLInfos { instrumentTransposition, initialClefs, scoreDuration, soloWrittenPitchRange }` | **exact** |
| Engrave | GUIDOEngine (AR → GR) and libguidoar, statically linked in `GuidoKit`. All GUIDO tags are present (`\staff`, `\clef`, `\meter`, `\key`, `\barFormat`, `\systemFormat`, `\pageFormat`, `\staffFormat`, `\noteFormat`, `\fingering`, `\lyrics`, `\tempo`, `\volta`, `\repeatBegin`, …) | **exact** strings |
| Layout settings | `GuidoLayoutSettings { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions, useExtendedBoundingBox }` and `pageFormat { width, height, marginleft, margintop, marginright, marginbottom }` | **exact** ObjC type encoding |
| Render call | `renderScoreWithSoloClef:transpoSolo:transpoAcc:scrollMode:withLyrics:withFingering:withBowing:withBreathing:withHarmony:grayedStaff:` | **exact** selector |
| Renderer | `GuidoKitScoreRenderer { system, grHandler, printGrHandler, pianoRoll, widthRendered, heightRendered, layout, score, topMargin, bottomMargin, leftMargin, rightMargin, showlyrics, showFingering, showBowing, showBreathing, showHarmony, grayedStaff, numberOfPrintedPages, printZoomScale }` | **exact** |
| Maps for cursor | `GuidoKitScoreLayout { scoreSize, maximumSystemHeight, scoreDuration, topMargin, systemMap, systemBoundingBoxMap, staffMap, measureMap, eventMap, annotationMap, pageCount, interlineHeight, maximumMeasureWidth }`, built by C++ collectors `EventMapCollector`, `GKMapCollector`, `StaffCollector`, `SystemCollector` mapping `TimeSegment → TRect<float>` per page/staff/system; `transposedOffsetSearchCache` (LRU) | **exact** type encodings |
| Tiling and cache | `ScoreContent { renderer, cache, scoreHeader, direction, contentSize, scale, scaleToFill, scrollFactor, layoutStyle, pageSize, cachable }`; caches `GuidoKitImageCache`, `GuidoKitAutoPurgeCache`, `MemoryCache`, `DiskCache`, `RotatingCache`, `ChainedCache`, `SubCache`; `renderImageAtIndex:forContent:withScoreSize:` on a `renderingThread` with `imagesToRenderPriorities` | **exact** |
| Display | `GuidoKitScoreView` (UIView + UIScrollView), wrapped by `MetronautPreviewUIKit.ScoreReaderV` / `ScoreReaderVM` / `ScoreReaderViewModel` | **exact** |

So the score is engraved once into page images (tiles), cached in memory and on disk, and shown in a scroll view. The cursor and overlays are separate `CALayer`s placed from the time→rect maps (**inferred** from the class set).

## 2. Fonts

| Font | Use | Status |
|---|---|---|
| `Bravura` (Resources/Bravura.otf, registered in `UIAppFonts`) | Music glyphs for engraving and annotation stamps. GuidoKit logs `" font creation failed !"`. `ScoreAnnotationKit.bravuraFontUrl` | **exact** |
| `BravuraText` / "Bravura Text" | Inline music symbols in text | **exact** |
| `guido2.ttf` (GuidoKit resources; strings `Guido2`, `guido2`) | GUIDO's own music font, fallback | **exact** |
| `Times`, `Times New Roman`, `Times New Roman Bold Italic`, `Palatino`, `Helvetica`, `HelveticaNeue-Bold`, `Arial` | Score text (titles, lyrics, tempo text) | **exact** strings in GuidoKit |
| `HelveticaNeue` family | App UI (see COMPONENTS_LAYOUT_MOTION.md) | **exact** |

Licences: Bravura, BravuraText and Guido2 are SIL OFL 1.1 (verified from the fonts' name tables; see RESOURCES_AND_LICENCES.md and `open-licensed/fonts/`).

## 3. Placeholder score (`GuidoKit.framework/Resources/placeholder.gmn`, **exact**)

Shown while the real score loads. It uses `\title<"Piece Title">`, `\composer<"Piece Composer", dy=4hs>`, `\set<autoEndBar="off",autoSystemBreak="off",autoPageBreak="on">` and paints everything in light grey `0xD9D9D9` (`\systemFormat`, `\barFormat<style="system">`, `\staffFormat<size=4pt>`, `\clef<"none">`, `\noteFormat`). Loading strings: "Loading score…", "Preparing layout", "Cannot display score", "No score found" (**exact**).

## 4. Layout and scrolling

| Item | Detail | Status |
|---|---|---|
| Scroll mode | `MetronautPerformancePageScrollingMode { page, continue }`; labels "Page", "Continuous" | **exact** |
| Page-turn direction | `GuidoKit.PageTurnDirection { Horizontal, Vertical }`; older labels "vertical", "horizontal" | **exact** |
| Page-turn view | `GuidoKitPageTurnView { pageTurnMode, maskingY, maskingX, pageTurnLayer, previousPageLayer, nextPageIndex, scoreBackgroundColor, dimmedScoreBackgroundColor, appearanceAnimationDuration, disappearanceAnimationDuration, bgcolorAnimationDuration, waitFinalDuration, automaticPreviousPageTurn, edgeTriangle, edgeTriangle2, delimiterThickness1, delimiterThickness2 }` | **exact** fields |
| Page turn behaviour | Next page is revealed progressively under a mask while the current page is still played, with a triangle marker at the boundary; previous page can turn back automatically (**inferred** from fields; see also COMPONENTS_LAYOUT_MOTION.md) | **inferred** |
| Scroll anticipation | `scrollAnticipation` (beats). UI: "Scroll Anticipation" — "Choose how early you want the score to scroll ahead as you play." | **exact** |
| Scroll methods | `scrollToCursorDuringPlayForBeat:`, `scrollToCursorWithAnimation:`, `scrollToPageForBeatposition:animated:`, `scrollToNextPage`, `scrollToPreviousPage`, `scrollToBeginning`, `scrollHorizontallyToPutCursorAtRelativeOffset:animated:`, `scrollVerticallyToMiddleOfRect:animated:`, `scrollVerticallyToTopOfRect:animated:`, `scrollToOffset:direction:animated:` | **exact** |
| Current staff on top | `forceCurrentStaffOnTop` | **exact** |
| Limits | `scrollUpLimit`, `scrollDownLimit`, `scrollValidRect`, `VerticalTileLength` | **exact** |
| Loop forces continuous scroll | "Loop activated: In this mode the music sheet scroll is continuous." | **exact** |
| Zoom | pinch (`pinchGesture`), `scale`, `maximumScale`, `scaleToFill`, `setInitialScale:`, `updateGestureScale:`; ⌘+ / ⌘− key commands; persisted `scoreScale` | **exact** |
| Gestures | `tapGesture` (tap to move cursor), `panGesture`, `pinchGesture`, `swipeLeft`, `swipeRight` | **exact** |
| Size classes | `MetronautUI.ExtendedWindowSizeClass { telPortrait, telLandscape, tabletPortrait, tabletLandscape, desktop }` | **exact** |
| Header | `GuidoKitScoreHeader { title, subtitle, composer, showVersionSelector, version, previewHeader, previewFontName, previewFontColor, composerYpos, versionLayer, scoreLayer }` | **exact** |
| Trailing view | `trailingView`, `trailingViewAnchorPoint`, `trailingViewInsideAnchorPoint`, `trailingViewShouldAlwaysBeVisible` (end-of-score footer, e.g. "Next piece") | **exact**; purpose **inferred** |

## 5. Cursor

| Item | Detail | Status |
|---|---|---|
| Modes | `Core.CursorMode { none, beats, continuous, recognition }` | **exact** |
| Labels | "No Cursor", "Beats", "Continuous", "Continuous with beats" (`accompPuls`), "Continuous" (`accompNoPuls`), "Detected events" (`detectedEvents`), "Beats" (`pulseOnly`) | **exact** (`performance.cursorMode.*`) |
| Default | `beats` | **exact** |
| Forced | Sight-reading forces `continuous` | **exact** (`forcedCursorMode`) |
| API | `setCursorBeatPosition:`, `setCursorColor:`, `showCursor:`, `cursorScreenLocation`, `measureOffsetAtPosition` | **exact** |
| Data sources | `PerformanceControllerManager.setScoreViewModel(withAccompaniment:pulsePositionAndDuration:continuousPosition:detectedPosition:cursorLoopDuration:)` — beat cursor jumps on pulses; continuous cursor follows accompaniment position; recognition cursor follows detected position | **exact** signature; meaning **inferred** |
| Latency | separate `cursorLatency` | **exact** |
| Colour | not recovered from code. The brand blue `#35AFF7` is the likely cursor colour (**inferred**; small string `35AFF7` in PreviewUIKit) | **inferred** |

Help text (**exact**): "The cursor shows your current position on the score. You can drag it or tap anywhere to get there." / "Tap on the rewind button to move the cursor to the previous starting position. Tap again to set the cursor at the beginning."

## 6. Overlays drawn on the score

| Overlay | API | Status |
|---|---|---|
| Highlight range | `highlightBeginBeatPosition`, `highlightEndBeatPosition`, `highlightStyle`, `highlightView` | **exact** |
| Loop selector | `showSelector:withScheme:`, `GuidoKitScoreSellector { colorScheme, arrowFillColor, borderWidth, borderHeightSup, borderCircleRadius, arrayOfRect }`, `setInitialLoopWithBegin:end:`, `loopStartPos`, `loopEndPos` | **exact** |
| Practice zones | `showPracticeZone:`, `showPracticeComments:` (zone colours in PRACTICE_AND_SCORE_FOLLOWING.md §7.3) | **exact** |
| Real-time feedback | `showPracticeFeedback:`, `showRealtimePracticeFeedbackWith:bgColor:duration:` | **exact** |
| Pitch lines | `insertAudioPitchFeedbackOnPosition:refMidi:forPitch:expectedMidi:pitchTolerance:gradientInterpolation:` | **exact** |
| Page delimiters | `showPageDelimitersWithShow:` | **exact** |
| Grayed staff | `grayedStaff` render flag (accompaniment staves greyed when "Display accompaniment" is on) | **exact** flag; use **inferred** |
| Piano keyboard | `PianoKeyboardUIView` below the score: `PianoKeyboardGeometry { firstOctave, octaveCount, whiteKeyWidth, whiteKeys, blackKeys }`, `PianoKeysCanvas { activePitches, activeKeyColor }`, `PianoNoteNamesCanvas`, `PianoContext { pianoLowRange, pianoHighRange, pitches }`; "You can tap any note to see how to play it on the keyboard on the bottom of the score." | **exact** |

## 7. Annotation

- PencilKit tool picker (`PKToolPicker`), pen and highlighter (`penToolType`, `penAlpha`, `penWidth`, `highlighterToolType`, `highlighterAlpha`, `highlighterWidth`), eraser, glyph stamps (Bravura glyphs), text (**exact**, `ScoreAnnotationKit`).
- Actions: `AnnotationAction { freehand(type), glyph(symbol), eraser, none }`; undo/redo; hide; delete all ("Delete All Annotations?") (**exact**).
- Stored as JSON per piece/version (**exact** schema):
  - `AnnotationData { schemaVersion, dateCreated, lastModified, deviceId, pieceIdentifier, accompanimentIdentifier, authorUserId, authorName, elements }`
  - `AnnotationElement { dateCreated, engineVersion, object }`
  - `AnnotationObject = freehand(identifier, start, end, path, drawAttribute) | glyph(identifier, unicode, position, drawAttribute) | text(identifier, message, position, drawAttribute)`
  - `ScoreAttribute { beatPosition, point, leftMapIndex, rightMapIndex, leftEventFrame, rightEventFrame, measureFrame, staff, measure, anchor }`
  - `ScoreAnchor { beatPosition, staff, measure, leftEventBeat, rightEventBeat, xOffset, yOffset, xReference (events|eventCenter|measure), yReference (staffTop|eventCenter|measure), yUnit (staffSpaces|scoreUnits) }`
  - `DrawingAttribute { color, fillColor, fontName, fontSize, brushWidth, scale }`
- Anchoring to musical time (beat, staff, measure) rather than pixels means annotations survive re-layout, zoom, transposition and clef change (**inferred**). This is a strong pattern to copy.
- Tips (**exact**): "In Annotation Mode, scroll with two fingers to move through the music sheet"; "Zoom-In to annotate with more precision."; "Annotate your scores as you would do on paper, using your finger or Apple Pencil."

## 8. Transposition and clef

- `TranspositionParameters { interval, octave, instrument, clef }`; `EngineTranspositionParameters { soloScoreTranspo, accompScoreTranspo, scoreClef, playerScoreTranspo, playerAudioTranspo }` — score and audio are transposed separately (**exact**).
- Auto adaptation to the user's instrument range: `AutoAdaptationRangeOutcome { notEvaluated, legacyFits, adjustedToFit, missingScoreRange, missingInstrumentRange, impossibleFit }`; message "Clef and transposition have been automatically adapted to your instrument." (**exact**).
- Instrument model: `MNInstrument { pk, title, register, rangeMin, rangeMax, clef, alternateClef1, alternateClef2, octavia, transposition, defaultOrder, freeformMatch, image, closeInstruments }` (**exact**).
- Clef choices: Original, Treble, Treble −8, Treble +8, Alto, Tenor, Bass, Bass −8, Bass +8 (**exact**, `settings.clef*`; small strings `treble-8`, `treble+8`, `bass+8`, `tenor`).
- Print warns: "Transposition changes won't be taken into account when printing." (**exact**).

## 9. Preview (paywalled excerpt)

`GuidoKitPreview { startMeasure, endMeasure, startBeat, endBeat, percentage, endMeasureOffset, beatOffset, startPos, endPos, isPreview }` and `PreviewScoreData { isPreview, percent, startMeasure, startBeat, endMeasure, endBeat, startBeatPos, endBeatPos, beatOffset }` (**exact**). Labels: "Excerpt: %li%%", "Excerpt: {{previewBarsNumber}} of {{totalBarsNumber}} bars", "Excerpt from bar %u"; older copy "You still have 70% of the score to discover." (**exact**).

## 10. Printing

- `UIGraphicsPDFRenderer`, `printGrHandler`, `printZoomScale`, `numberOfPrintedPages`, `generatePDF()` (**exact**).
- Credits: subscribers "You can print %u scores this month. A score can be printed as many times as you want."; trial "%u printout available"; geo-block "Due to copyright issues, this music sheet cannot be printed in your country." (**exact**).
- Publisher PDFs may be used instead (`editedPdfFile` in catalogue; analytics `pdfProvider`, `pdfDownload`) (**exact** names).

## 11. Web equivalents (for the owner)

| Metronaut | Web option (**inferred**) |
|---|---|
| GUIDOEngine + libmusicxml | GUIDO has a WebAssembly build (guidolib); alternatives: OpenSheetMusicDisplay (BSD-3), Verovio (LGPL-3) |
| Bravura | Same font (OFL) via `@font-face`; SMuFL code points |
| Tile cache | Render SVG per system; virtualise off-screen systems |
| Time→rect maps | OSMD cursor iterator / Verovio `getElementsAtTime` + bounding boxes |
| Beat-anchored annotations | Store `{measure, beat, staff, dx, dy}` and re-project after layout |
