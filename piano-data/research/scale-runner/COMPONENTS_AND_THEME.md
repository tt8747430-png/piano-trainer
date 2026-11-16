# Scale Runner: components, theme, fonts

## Fonts (exact, FontManifest.json + name tables)

- **Inter** 400/500/600/700: body and UI text (inferred).
- **Space Grotesk** 500/700: display, headings and numbers such as the score and BPM (inferred from the usual pairing; the code mapping is not recoverable).
- Material Icons (tree-shaken) and Cupertino Icons.

## Theme (`theme/app_theme.dart`, class `AppTheme`)

- **exact getters:** `accentNow`, `blue`, `green`, `red`, `warning`, `bg`, `card`, `border`.
- **exact:** Material 3 colour-scheme roles are used (`surfaceContainerHigh`, `surfaceContainerHighest`, …), along with `material_color_utilities` (`TonalPalette`, `DynamicColor.fromPalette`).
- **inferred:** a dark-first custom palette, with a feedback triad of green (correct / on beat), amber (close) and red (wrong / off), and blue for target dots.
- **Colour values: not recovered.** Flutter colours are code constants, and recent Flutter stores `Color` as float components. `Assets.car` has no colour sets.
- **exact:** Avatar colour names: Amber, Blue, Green, Orange, Pink, Rose, Teal, Violet. Avatar emoji: 🦉 🎹 🎷 🎤 🦊 🐙 🎶 🐼 🥁 🎵 🎧 🪕 🎻 🎺 🐸 🎸 (exact UTF-16 strings; `AvatarPickerSheet` members `_emoji`, `_emojiChip`, `_color`, `_colorDot`, `_parse`; remote column `avatar_seed`).

## Widget inventory (exact class names)

- **Instrument surfaces:**
  - `PianoKeyboard` (`_WhiteKey`, `_BlackKey`, `_whiteIndexOf`, `_isWhite`)
  - `FretboardView`
  - `FretBoxStepper`
  - `InstrumentSurface`
  - `VoicingThumbnail` (`_VoicingThumbPainter` with `_held`, `_notes`, `_fill`): a mini keyboard drawing of a saved voicing
- **Timing:** `MetronomeBar` (expandable; beat dots, meter chip, BPM buttons), `TimingDifficultySelector`.
- **Sheets:**
  - `WelcomeSheet`, `ModeGuideSheet`, `GuideDemo`, `ReminderPromptSheet`
  - `StreakMilestoneSheet`, `StreakFrozenSheet`, `StreakLostSheet`
  - `PaywallSheet`, `GroovePromoSheet`, `AvatarPickerSheet`
  - 4 settings sheets and 4 session-summary sheets
  - `_SheetScaffold` (common sheet frame, with a `_grabber` handle)
- **Banners:** `RotateHintBanner`, the home MIDI banner.
- **Layout:** `ui/responsive.dart`, `ui/fold.dart` (split rows on wide or folded screens, with animated height).

## Motion

- **exact:**
  - `AnimatedScale`, `ScaleTransition`, `TweenSequence`
  - Flutter's `ink_sparkle` and `stretch_effect` shaders
  - flash methods (`_flash`, `_flashWrong`, `_flashVerdict`, `_clearFlashes`) in every controller
- **Durations and curves: not recoverable** (code constants).
- No Lottie or Rive files are bundled.
