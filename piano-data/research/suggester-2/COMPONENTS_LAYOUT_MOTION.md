# Components, layout, colours, typography, icons, motion

Sources: Swift metadata (`data/swift_ui_types.json`, 396 types in DocumentEditor, 21 in the app, 10 in the AU), asset catalogs (`data/assets.json`), SwiftUI imports (`dyld_info -imports`), arm64 disassembly of property initialisers and animation call sites.

## 1. Modules inside DocumentEditor.framework (exact)

| Module | Role | Notable types |
|---|---|---|
| `DocumentEditor` | Suggester screens | see UI_FLOWS_AND_MENUS.md |
| `MRMusicUI` | Reusable music views | `PianoView` (+`Style`, `PianoState`), `OutputCrossbarPianoView`, `FretboardView`, `GuitarChordDiagramView`, `EditableGuitarChordShapeDiagramView`, `UnknownGuitarChordDiagramView`, `GuitarChordShapeDiagramPainter`, `ArpeggiationSection`, `HumanizationSection`, `SynthEffectsSections`, `TempoPropertyRow`, `LocalizedDurationPickerView`, `DurationImageProvider`, `StandardArpeggioModePicker`, `ObservableStore`, `ObservableSequencerState`, `ObservableBeatService` |
| `MRUtilUI` | Localised-string views, store explanation | `LocalizedStringText/Label/Picker/Section/Toggle`, `LocalizedTextField`, `TextRichText`, `PurchaseInvitationView`, `StoreExplanationView`, `StoreKeyView`, `UndoButton`, `UndoStackBridgeViewModifier` |
| `MRSwiftUI` | Generic components | `FloatingToolbar`, `FloatingToolbarButtonStyle`, `FloatingToolbarProminentButtonStyle`, `FloatingToolbarToggleStyle`, `GravityHStack`, `GravityTranslucentToolbar`, `TranslucentToolbar`, `ToolbarView`, `CapsulePicker`/`CapsulePickerChoice`, `CollectionLayout` (`Metrics{itemHeight, minItemWidth, interItemSpacing, alignment}`), `EqualWidthHStack`/`EqualWidthVStack`, `AutoSplitView{idealWidthOfA, minimumWidthOfB}`, `ActionMenu`/`ActionGroup`/`Action{title, image, color, iconColor}`, `PopoverButtonWithBinding/State`, `PopoverSheetButton`, `SheetButton`, `DraggableButton`, `ButtonStepper`, `MRStepper`, `TintedBorderedButtonStyle{color, labelColor, capsule, wide, prominent, glass, interactive}`, `CircleTag`, `ToastView`/`ToastCapsule`/`Toaster`, `TipInlineView`/`TipMessageView`/`TipPopoverContent`/`TipSheetContent`, `OnboardingView`/`OnboardingCellView`, `DismissButton(image: done/close/back)`, `DialogViewModifier`, `ModalToolbarModifier`, `PoppingViewModifier{delay, initialScale}`, `WithLoadingScreen`, `LazyProgressView{delay}`, `NavigationStackWithBackButton`, `HoverHighlightBackgroundViewModifier`, `HoverHighlightGlassViewModifier`, `LegacyButtonBevelModifier` |
| `MenuBuilder` | AppKit `NSMenu` DSL | `MenuItem`, `CustomMenuItem`, `IndentGroup`, `SeparatorItem`, `MenuItemView` (`NSVisualEffectView` host), modifiers `shortcut(_:holding:)`, `onSelect`, `submenu`, `toolTip`, `disabled`, `state`, `image`, `indent(level:)` |

`MRSwiftUI.UserInterfaceIdiom` = phone, pad, mac, other; `ExecutableType` = application, appExtension (the AU hides some UI).

## 2. Layout constants

Exact numeric constants read from Swift property initialisers (`… variable initialization expression`, `fmov d0`):

| Property | Value (pt) |
|---|---|
| `DocumentEditorView._minimumSongWidth` | 250 |
| `DocumentEditorView._idealSongWidth` | 350 |
| `ChordCollectionView._itemMinimumWidth` | 175 |
| `ChordCollectionView._interItemSpacing` | 4 |
| `ChordCollectionView._horizontalPadding` | 10 |
| `OutputCrossbarPianoView.standardHeight` | 50 |
| `OutputCrossbarPianoView.compactHeight` | 30 |
| `GuitarChordDiagramView._scaledDiagramSize` | 75 |
| `FretboardView.guideDotSize` | 20 |
| `FretboardView.tagSize` | 35 |
| `FretboardView.insets` | 80 and 20 (two constants; which edges is inferred: horizontal 80, vertical 20) |
| `StoreKeyView._keyHeight` | 48 |
| `MRSwiftUI.ToolbarView._toolbarHeight` | 44 |

Metric names whose values live in view initialisers and were not resolved (exact names, mostly `@ScaledMetric`): `DocumentEditorView._minimumSuggestionsWidth`, `ChordView._romanNumeralsWidth/_horizontalPadding/_keyboardCellHeight/_guitarCellHeight`, `ChordButton._keyboardCellHeight/_guitarCellHeight/_cornerRadius`, `ChordEventCellContent._romanNumeralWidth/_alterButtonCornerRadius`, `SongRowView._standardCellHeight/_guitarCellHeight`, `ScaleView._cellPadding/_cornerRadius/_cellHeight`, `ScaleCollectionView._itemMinimumWidth/_cellHeight/_sectionHeaderSpacing`, `MatchedScaleCell._trebleClefHeight/_cellHeight`, `TextMarkerCell._cellHeight`, `ScaleMarkerCell._trebleClefImageSize`, `BeatIndicator._smallIndicatorSize/_largeIndicatorSize`, `BeatButton._beatIndicatorBottomPadding`, `ChordEventParametersButton._durationButtonWidth/_buttonCornerRadius`, `WorkspaceSheet/WorkspaceSectionPicker._workspaceIconSize`, `InstrumentPickerView._itemHeight/_itemMinimumWidth`, `GuitarTuningPickerView._itemHeight/_itemMinimumWidth`, `*._pianoHeight`, `SongView/WorkspaceView._toolbarHorizontalPadding`, `SuggesterProductView._buyButtonPaddingHorizontal/_keyWidth/_buyButtonPaddingVertical`, `FloatingToolbar._pillHorizontalPadding/_height`, `TranslucentToolbar._minimumBarHeight/_compactBarHeight`, `TintedBorderedButtonStyle._horizontalPadding/_verticalPadding/_cornerRadius`, `PopoverSheetButton._imageWidth/_minActionHeight`.

Collection pattern (inferred from types): chords and scales are shown in adaptive grids (`CollectionLayout`: minimum item width, fixed item height, inter-item spacing) inside collapsible sections (`CollectionSectionHeader(title, collapsed, action)`). The editor is a split: song list (250–350 pt) + workspace panel (`AutoSplitView` hides the panel when too narrow).

Row size and panel size are user settings with Dynamic Type names (`xSmall, small, medium, large, xLarge, xxLarge, xxxLarge`, plus System).

## 3. Colours (exact, from Assets.car)

| Name | Light (any) | Dark | Space |
|---|---|---|---|
| AccentColor (app) | 0, 0.533, 1 (systemBlue) | — | sRGB |
| SuggesterOrange | 1, 0.514, 0 (#FF8300) | 1, 0.624, 0.043 (#FF9F0B) | sRGB |
| SuggesterMint | 0, 0.647, 0.51 | 0.231, 0.808, 0.631 | Display P3 |
| Chartreuse | 0.447, 0.576, 0 | 0.659, 0.808, 0.231 | Display P3 |
| LightOrange | 1, 0.792, 0.498 (#FFCA7F) | 1, 0.804, 0.502 | sRGB |
| LightYellow | 1, 0.898, 0.49 (#FFE57D) | 1, 0.914, 0.494 | sRGB |
| Icon Color-2 | 0.984, 0.839, 0.294 | — | Display P3 |
| Icon Color-3 | 1, 0.424, 0 | — | Display P3 |
| Icon Color-1 / Color-4 | white (1) / black (0) | — | extended grey |
| Icon Gradient-1 | Color-2 → Color-3, vertical (0.5,0 → 0.5,1) | | |

`LightYellow` and `LightOrange` are used by the MIDI storm alert and similar warnings (exact strings sit next to each other in code). Section colours come from `ColorCode` (White, Grey/Gray, Pink, Red, Orange, Yellow, Green, Teal, Blue, Indigo, Purple; fr Blanc, Gris, Rose, Rouge, Orange, Jaune, Vert, Turquoise, Bleu, Indigo, Violet) — mapped to system colours (inferred). Piano style fields (exact): whiteKeyColor, disabledWhiteKeyColor, blackKeyColor, disabledBlackKeyColor, separatorColor, primaryHighlightColor, secondaryHighlightColor, primarySustainHighlightColor, secondarySustainHighlightColor, displayShadow, disableKeysOutOfBound, scaledKeyWidth.

## 4. Typography

- System font with Dynamic Type (`DynamicTypeSize` environment read in several views; `TextRichText(richText, fontTextStyle)`).
- Music glyphs: **Bravura Text** (`BravuraText.otf`, loaded at run time by `DocumentEditor.FontLoader` via CoreText `CGFontCreateWithDataProvider`). Used for note/rest/accidental glyphs in durations and chord names (inferred).
- Rich text attributes in the engine (`util2.richtext`): types `Serif`, `Secondary`, `Superscript`, `Subscript`, `Small`, `BigSuperscript`, `Bold` (exact). Chord names put extensions in superscript (`coreSuperscriptName`), Roman numerals use a `bottom` (subscript/figured bass) part.
- Number formatting: superscript digits `⁰¹²³⁴⁵⁶⁷⁸⁹`, subscript `₀₁₂₃₄₅₆₇₈₉`, fraction slash `⁄` (exact literals) — used for fine durations like `³⁄₁₆`.

## 5. Icons

- SF Symbols (exact names; 82): see `data/sf_symbols_and_icons.json`. Main ones: `play.fill`, `pause.fill`, `metronome`, `music.note.list`, `music.quarternote.3`, `pianokeys`, `speaker.wave.2`, `slider.horizontal.3`, `wand.and.stars`, `stethoscope`, `shuffle`, `hammer.fill`, `heart.fill`, `number`, `lightbulb.fill`, `lightbulb.circle`, `books.vertical.fill`, `character.textbox`, `square.and.arrow.up`, `square.and.arrow.down`, `arrow.up.doc`, `doc.on.doc`, `doc.on.clipboard`, `scissors`, `trash`, `circle.grid.2x1`, `circle.slash`, `square.dashed`, `plus.circle`, `chevron.down`, `chevron.right`, `chevron.up.chevron.down`, `ellipsis`, `xmark`, `checkmark`, `info.circle`, `exclamationmark.triangle`, `clock`, `switch.2`, `cable.connector.horizontal`, `app.connected.to.app.below.fill`, `bolt.fill`, `key.fill`, `tag.fill`, `receipt`, `star.bubble`, `safari`, `hand.thumbsup.fill`, `questionmark.bubble`, `paintpalette.fill`, `wrench.and.screwdriver`, `puzzlepiece.extension`, `arrow.uturn.backward`, `arrow.uturn.forward`, `arrow.counterclockwise`, `arrowtriangle.up.fill`, `arrowtriangle.down.fill`, `1.circle`, `asterisk.circle`, `house`, `bubble.left.fill`.
- Custom symbol/vector assets (exact): `TrebleClef`, `Guitar`, `Instruments`, `capsule.pro`, `capsule.pro.fill` (PRO pill), `key.circle`, `lightbulb.max.fill`, `ArpeggioUp`, `ArpeggioDown`, `ArpeggioOff`, `ArpeggioSkipUp`, `ArpeggioSkipDown`, `note-006`…`note-800`, `rest-006`…`rest-800` (13 each), `Intent-TrebleClef`.
- Bitmaps: `AppIcon`, `AppIconLarge`, `AppLogo`, `ChordPadX2`, `ChordShapes` (cross-promo icons), `Clouds` (1024×512 welcome background), app icon `Suggester2-glass` (Liquid Glass layered icon with Bubble, Shadow layers).

## 6. Motion (animations)

SwiftUI animation APIs imported (exact): `Animation.default`, `.easeIn(duration:)`, `.easeInOut(duration:)`, `.spring(response:dampingFraction:blendDuration:)`, `.spring(_:blendDuration:)` with `Spring(duration:bounce:)`, `.speed(_:)`, `withAnimation`, `View.animation(_:value:)`, `Binding.animation`, transitions `.opacity`, `.move(edge:)`, `.push(from:)`, `.scale(scale:anchor:)`, `.asymmetric(insertion:removal:)`, `.identity`, `combined(with:)`, `MoveTransition`, `OpacityTransition`, `ContentTransition.symbolEffect`, `matchedGeometryEffect` (`MatchedGeometryProperties.frame`), AppKit `NSAnimationContext`.

Constants loaded into the first floating-point argument right before the call (exact numbers; argument mapping inferred):

| Call | Values seen |
|---|---|
| `Animation.easeIn(duration:)` | 0.25 |
| `Animation.easeInOut(duration:)` | 0.25 |
| `withAnimation` (with a preceding animation) | 0.25 |
| `Spring(duration:bounce:)` / `Animation.spring(_:)` | duration 0.5 (second register 1.2, likely stale — not trusted) |
| `Animation.spring(response:dampingFraction:blendDuration:)` | response 0.25; response 0.5 with dampingFraction 1.0 |
| `Animation.speed(_:)` | 2.0 |
| `OpacityTransition` site | 0.5 |
| Welcome window (`Suggester 2` app) | `spring(response: 0.5, …)` + `.move(edge:)`/`.opacity` asymmetric transitions |
| Onboarding | staged appearance `initial → titleAppears → contentAppears → continueButtonAppears → finished` |
| `PoppingViewModifier` | pop-in with `delay` and `initialScale` parameters |
| `LazyProgressView` | shows a spinner only after `delay` |

Inferred motion style: short (0.25 s) ease curves for state changes, 0.5 s critically damped springs for panels and picks (`ScaleView.animatesToTheLeft`, `ChordButton.beingPicked` "fly to song" effect), symbol-effect content transitions for play/pause.
