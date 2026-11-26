# UI flows, windows, menus, onboarding, paywall

Chordio 3.3.0 on the Mac is an **iPad app** (UIDeviceFamily 2, iOSSupport frameworks), not AppKit. It uses multiple scenes, and most UI is built in code. Storyboards are thin shells: LaunchScreen, plus one VC per scene storyboard. **exact**.

## 1. Windows (scene configurations, from Info.plist; exact)
| Scene | Delegate | Storyboard | Content |
|---|---|---|---|
| Default Configuration | `SceneDelegate` | — | main split view: sidebar `DetailViewController` + `HomeViewController` workspace |
| HelpScene | `HelpSceneDelegate` | HelpScreen | `HelpViewControllerMac` (13 chapters) |
| FeedbackScene | `FeedbackSceneDelegate` | FeedbackScreen | feedback form / email / website / rate |
| KeyboardScene | `KeyboardSceneDelegate` | KeyboardScreen | detached piano keyboard (remembers its frame: `TBKeyboardWindowScene{OriginX,OriginY,Width,Height}Key`) |
| SeparateStaveScene | `GrandStaffSceneDelegate` | SeparateStaveScreen | detached grand staff |
| ChordDisplayScene | `ChordDisplaySceneDelegate` | ChordDisplayScreen | detached chord name display |
| LeadsheetScene | `LeadsheetSceneDelegate` | LeadsheetScreen | lead sheet canvas (4/4 only) |
| WhatsNewScene | `WhatsNewSceneDelegate` | WhatsNewScreen | What's New carousel + promo cards for other apps (`WNPromoApp`) |
| ChordEditScene | `ChordEditSceneDelegate` | — | chord-cell editor window (`ChordEditWindowViewController`) |
| MusicalTypingScene | `MusicalTypingSceneDelegate` | — | computer-keyboard piano (`MusicalTypingView`, `MTMiniKeyboard`) |
| HarmonyExploreScene | `HarmonyExploreSceneDelegate` | — | Harmony Explorer, resizable |
| MusicNotesScene | `MusicNotesSceneDelegate` | — | music-notes panel (`TBMusicNotesPanelView`) |

Activity types used to open the scenes: `com.oneinabillion.open{Help,Feedback,Keyboard,SeparateStave,ChordDisplay,Leadsheet,Main,WhatsNew,MusicNotes,ChordEdit,MusicalTyping,HarmonyExplore}`. The detached Keyboard, Grand Staff and Chord Display windows each have an **Always on Top** toggle (`TB…AlwaysOnTopSwitchKey`; `setNSWindowFloating:`). **exact**.

## 2. Mac menu bar (`MenuController`, decompiled; exact titles, shortcuts and selectors)
Modifier flags: 0x100000 = ⌘, 0x80000 = ⌥, 0x20000 = ⇧, 0x120000 = ⇧⌘. 0x10000 is UIKit's alpha-shift (Caps Lock) flag, as coded.

| Menu | Item | Shortcut | Action |
|---|---|---|---|
| App | Preferences | ⌘ + key literal `cf__` (likely ",", **inferred**) | `openPreferencesPanel:` |
| App (new window) | Chordio | ⌘O | `openNewWindowAction` |
| File | Save | ⌘S | `saveAction` |
| File | Export MIDI... | ⌘E | `exportClick:` |
| File | Import File... | ⌘I | `importClick:` |
| Edit | Undo / Redo | ⌘Z / ⇧⌘Z | `undoAction:`/`redoAction:` |
| Edit | Chord Edit | E | `chordEditAction` |
| Edit | Duplicate | ⌘D | `duplicateAction` |
| Edit | Delete… | ⌫ | `chordDeleteAction` |
| Edit | Delete All… | ⌘⌫ | `chordDeleteAllAction` |
| Actions | Play/Stop | Space | `spacebarAction` |
| Actions | Previous Chord / Next Chord | ⌥← / ⌥→ | `arrowActionLeft/Right` |
| Actions | Transpose All Up / Down | ↑ / ↓ | |
| Actions | Transpose Cell Up / Down | ⌥↑ / ⌥↓ | |
| Actions | Transpose Note Up / Down | ⌘↑ / ⌘↓ | |
| Tools | Progression Generator | ⌘1 | `menuItemClick1:` |
| Tools | Chord Suggestion AI | ⌘2 | |
| Tools | Chord Types | ⌘3 | |
| Tools | Chord Voicings | ⌘4 | |
| Tools | Chord Transformer | ⌘5 | |
| Tools | Chord Pattern | ⌘6 | |
| Tools | Backing Rhythm | ⌘7 | |
| Tools | Chord Cells | ⌘8 | |
| Tools | Chord Repeats | ⌘9 | |
| Tools | Harmony Explorer | ⌘0 | |
| Tools | Key Cycle | ⇧⌘K | |
| Tools | Bassline | ⇧⌘B | |
| MIDI | Input Devices | ⇪D | `openInputMIDIDevicesAction` |
| MIDI | Output Devices | ⇪O | |
| MIDI | MIDI Sync (title "M") | — | `openMIDISyncAction` |
| MIDI | Loop Sequence | L | `loopAction` |
| Window ▸ Detach | Keyboard | K | `openDetachedKeyboardWindowAction:` |
| Window ▸ Detach | Grand Staff | G | |
| Window ▸ Detach | Chord Display | D | |
| Window | Always on Top | — | `toggleAlwaysOnTopAction:` |
| Capture | Capture Chords | C | `captureChordsAction:` |
| Musical Typing | Musical Typing | ⌘K | `openMusicalTypingAction:` |
| Sound | Enabled (state `TBChordSoundEnabled`) | — | `keysSoundOnAction:` |
| Help | User Guide | ⌘H | `openActionH` |

Some single-letter items (E, K, G, D, C, L) have modifier 0 in the call, so they are plain-key commands (**inferred**: active only when the canvas has focus).

## 3. Main window
- **Sidebar** (`DetailViewController`). Sections: Store Packs ( n ) / User Packs ( n ), Chord Packs, Sheet Music Packs, Lesson Packs, User Chords, and Trash ("Bin" in en-GB). Items: Save As..., Export MIDI..., Import File..., Import Chord Pack..., Discover More, Feedback, User Guide, Video Tutorials, and **Upgrade to Premium** (crown icon). Packs can be organised into folders ("Create a folder in the User Packs section…", "Move to selected folder..."). **exact**.
- **Title button** opens the workspace picker (`WorkspaceCollectionViewSelectionController`, "Select a Workspace", with descriptions). See PRACTICE_LESSON_PLAYER.md §1.
- **Composition workspace**, top to bottom:
  - Chord display, with the stave and interval labels.
  - Upper note-letter strip (`UpperNoteKeyboardDisplayView`): tap to toggle note letters ↔ intervals.
  - Piano keyboard (`GLNPianoView`, the Swift "GLN" piano with note-name layers) and the foot-pedal button (`FootPedalView`, right-click → Hold Last Chord).
  - Chord-cell canvas (`ChordSequenceViewController`, `BMLongPressDragCellCollectionView` with drag-reorder, context menu Edit / Duplicate / +12 / −12 / Rest / Start Repeat / End Repeat / Insert).
  - Bottom HUD (`PlaybackEditDisplayHudView`): Edit, Play/Stop, Cycle, Clear, More, Capture, Chord Pads.
  - The **More** popover (`TBMoreOptionPopView`) holds the Tools.
  - Tempo label → tempo popover with tap tempo. Key button → key-signature settings. Instrument label → playback instrument picker.
- **Chord cell editor** (`EditSequencerChordCellViewController`, `EditChordNotesViewController`): notes, inversion, length (Whole … Sixteenth, dotted), alternative names, borrow from the parallel key (`BorrowedChordsViewController`), transpose, and colours of bass and melody notes (`CustomNoteColourView`).

## 4. Onboarding and help
- `OnboardingManager` (Swift, `TBHasCompletedInteractiveOnboardingKey`) runs an interactive onboarding on first launch. It can be re-run with Settings ▸ General ▸ "Show Onboarding". `OnboardingViewController` is page-based (background video, skip button, fade). `OnboardingPianoView` and `ChordProgressionDemo` are SwiftUI coordinators. **exact**.
- **Help** (`HelpViewControllerMac`) has 13 chapters: 1 Introduction, 2 Composition, 3 Chord Pad Trigger, 4 Chord Charts, 5 Related Scales, 6 Tools Panel, 7 Sharing files, 8 Sheet Music, 9 Scales, 10 Modes, 11 Lessons, 12 MIDI Settings, 13 Musical Typing. There are about 70 pages with images named `<Chapter>_Onboarding_NN` and tip videos `ChordioTip1/2.mp4`. Full text is in `data/strings_en.json`. **exact**.
- **Guided tooltips**: `JDFTooltipManager`/`JDFSequentialTooltipManager`, `TBGuidedTooltipManager`, `InstructionPopView`. There is also a sequential highlight animation of cells ("Starting sequential highlight animation (scroll, border & text) after initial delay").

## 5. Store, pack pages and paywall (exact strings)
- **Premium unlock**: product `com.oneinabillion.InAppPurchase.UNLOCKAPP.P01`, a "One-time charge". The screen `PurchaseAppView` shows "Upgrade to Chordio Premium", "What's included", "Chord, Sheet Music & Lesson packs are purchased separately.", Purchase, Restore Purchase, Done, and an "existing paid user" panel.
- **Packs are add-ons that require Premium first**: "Chord Packs are add-ons for Chordio Premium. Please purchase the main app before buying a pack." The same message exists for Sheet Music Packs.
- Product IDs are built from SKUs: `com.oneinabillion.InAppPurchase.<CP|SP|LP>.<NAME>.P01` (`TBUtilityManager createProductIDFromContentPackSKU:`). There are 21 pack IDs in the binary (7 CP, 5 LP, 9 SP). Receipts are validated locally and against `buy.itunes.apple.com/verifyReceipt` (`DYFStoreReceiptVerifier`).
- **Pack pages** (`ChordPackFeaturesViewController` / `SheetMusicPackFeaturesViewController`) are long marketing pages:
  - a hero video (`PackHeroVideoView`) and feature cards (`PackFeatureCardView`);
  - sections "Start with a progression / Build the groove / Shape the harmony / Explore and arrange / Take it further" and "Learn at your own pace / Play along / Go deeper";
  - preview playback for a limited set ("Unlock this pack to hear more") and locked items ("%@, locked", "More scores, locked");
  - CTAs "Unlock all %ld progressions" / "Unlock all %ld scores".
- **What's gated** (**inferred** from strings): Premium is needed before buying packs, and locked packs allow previews only. The exact list of features locked in the free app is not determinable statically: there are only `isPurchased` checks spread across controllers, and the free Chord Pack is "Sample the Best of Every Pack".

## 6. Feedback
`FeedbackViewController(Mac)` has a typeform link (feedback form), email, the website https://chordio.co.uk, video tutorials at https://chordio.co.uk/video-tutorials.html, and a "rate the app" request. The feedback email subject is "Feedback or Suggestion: %@ %@, Version: %@ (%@), Device: %@".

## 7. Visual system
- Fonts: **Bravura** (bundled, SMuFL music font) and Helvetica Neue. **exact**.
- Appearance: Light/Dark (`TBIsLightModeKey`, `AppColourAppearanceModeKey`). The Sheet Music workspace has its own dark mode.
- Keyboard highlight colour, note selection colour and interval colour are each stored as RGBA in defaults (`KeyboardHightlight{Red,Green,Blue,Alpha}ComponentKey`, etc.). Settings ▸ Keyboard Colours.
- Chord-chart print styles: Quick Styles **Classic** ("Dark green headers and blue keys.") and **Ink Saver** ("White headers, grey keys and a compact layout for black-and-white printing"). Header colours: Forest, Charcoal, Navy, Plum, Sand, Light Grey, White. Key highlights: Blue, Teal, Orange, Red, Green, Grey. Header height Compact/Regular. Show Note Lengths. Show Note Names.
- Wait-mode colours: systemBlue (expected), systemGreen (correct), systemRed (wrong, 0.32 s).
- The asset catalog holds 343 images, 594 vector glyphs (SF-symbol-style), 16 packed images, 10 icon images and 2 multi-sized images. There are **no named colour sets** (`assetutil --info`). **exact**.
