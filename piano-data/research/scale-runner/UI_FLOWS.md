# Scale Runner: screens, sheets and flows

**exact** means the screen, class, method or string is in the snapshot. Navigation order and layout are **inferred** from method names like `_openX` and `_buildX`.

## App shell

- **exact:** `ScaleRunnerApp`. The splash screen (`splash_screen.dart`) uses `assets/icon/icon_splash.png`, then opens `HomeScreen`.
- **exact:** The macOS window is `MainFlutterWindow` (Swift). It also hosts the native Bluetooth MIDI pairing window (see MIDI_AND_SOUND.md).
- **exact:** Responsive and foldable layout helpers: `ui/responsive.dart`, `ui/fold.dart` (`_FoldSplitRowState`, `_FoldAnimatedHeightState`).
- **exact:** A rotate hint for phones: `RotateHintBanner`, key `rotate_hint_dismissed`.

## Home (`_HomeScreenState`, lib @26014561, exact members)

- **Builders:** `_buildHeader`, `_buildContent`, `_buildMidiBanner`, `_SectionHeader`, `_ModeCard`, `_ProBadge`, `_StreakBadge`.
- **Navigation:**
  - `_openFreePlay`
  - `_openQuiz` (Scales and Chords)
  - `_openScaleRun` / `_openScaleRunGated`
  - `_openInversionRun` / `_openInversionRunGated`
  - `_openJamMode` / `_openJamModeGated`
  - `_openVoicings`
  - `_openStats`
  - `_openSocial`
  - `_openSettings`
  - `_openMonitor` (MIDI monitor)
- **Events:** `_maybeShowIntro` (welcome sheet once, `intro_seen`), `_maybeShowStreakEvent` (frozen, lost or milestone sheet), `_showPaywall`, `_showTrialToast`, `_onPurchasesChanged`.
- **MIDI banner (exact copy):** "Got a MIDI keyboard?" / "Tap to connect or just use the on-screen keys" / "No MIDI device" / "MIDI connected". Guide copy: "Tap the banner on the home screen to connect over USB or Bluetooth and play on the real thing."
- **Section headings (exact strings):** "Pick a practice mode", "Scale practice", "Chord practice", "Timed exercises against the metronome". Pro cards show `_ProBadge` (inferred: a "PRO" pill).
- **Promo tab (exact):** `GroovePromoTab`, which can be dismissed ("Hide Groove Runner offer", `promo_groove60_tab_dismissed`).

## Onboarding

- **Welcome sheet** (`welcome_sheet.dart`, exact copy):
  - "Welcome to Scale Runner"
  - "Got a MIDI keyboard?"
  - "No piano needed"
  - "Pick a practice mode"
  - "Let's play"
- **Mode guides** (`onboarding/mode_guides.dart`, `ModeGuideSheet`, `GuideDemo`, enum `GuideMode`):
  - Shown once per mode (`guide_seen_<mode>`, `maybeShowGuide`).
  - Titles "Free Play guide", "Scale Running guide", "Inversion Running guide", "Jam Mode guide", "Voicings guide".
  - Sections "How it works", "How it works:", "A few seconds of how it works:" (an animated keyboard demo: `_GuideDemoState`, `_lit`, `_hinted`, `_arm`, getter `_frame`).
  - Close with "Got it".
- **Reminder prompt sheet:** shown once (`reminder_prompt_seen`). See GAME_AND_SCORING.md section 11.

## Practice screens (exact builders)

| Screen | Builders / members |
|---|---|
| Free Play `_FreePlayScreenState` | `_buildTopBar`, `_buildReadout` (enum `ReadoutKind`: note, interval or chord), `_buildKeyboard`. Copy: "Play any chord", "Play at least two notes first.", "No notes yet." |
| Quiz `_QuizScreenState` | `_buildTopBar`, `_buildPrompt`, `_buildScoreBar`, `_buildKeyboard`, `_openSettings`, `_resetStats`, `_refreshLatency`, getters `_modeLabel`, `_instruction`, `_guideMode` |
| Scale Run `_ScaleRunScreenState` | `_buildTopBar`, `_buildPrompt`, `_buildChordIndicator`, `_buildBeatDots`, `_buildRunControl` (Start/Stop, `_toggleRun`), `_buildKeyboard`, `_tapCell` (fretboard), `_endSession` |
| Inversion Run | `_buildStepDots` (`_dotColor`, `_dotIcon`), `_buildPrompt`, `_buildRunControl`, `_endSession` |
| Jam Mode | `_buildCountInNumber`, `_buildBeatDots`, `_liveChordPill`, `_matchedIndicator`, `_pill`, `_buildRunControl`, `_endSession` |
| Voicings library `_VoicingsScreenState` | `_buildSearchBar`, `_buildFilterBar`, `_buildFolderSection`, `_buildFolderHeader`, `_buildCard` (thumbnail `VoicingThumbnail`), `_buildMenu` (Edit, Rename, Duplicate, Move to folder…, Tag…, Delete), `_buildEmpty` ("Create your first voicing", "Try a sample voicing first"), `_buildFooter`, `_newFolder`, `_reorderFolders` |
| Voicing capture | `_buildRootChips`, `_buildNameField`, `_buildNoteReadout`, `_buildFormula`, `_buildBoxStepper` (guitar fret box), `_save` |
| Voicing drill | `_buildPrompt`, `_buildProgress`, `_buildControl`, `_demoSpec`, `_markPractice`, `_unplayableOnGuitar` |
| Stats | see GAME_AND_SCORING.md section 12 |
| MIDI monitor | `_buildNoteTester`, `_connect`, `_pairBluetooth`, `_refresh` ("Rescan devices"), `_calibrate` → Latency calibration |
| Latency calibration | `_handleTap`, `_metronome`, `_reset`, `_saveAndClose` ("Calibrate Timing", "Keep tapping...", "Your 8 taps ranged …", "Timing Offset") |
| Social / Friends / Friend profile / Accept invite | see below |
| Settings | see SETTINGS.md |

**Shared widgets (exact):**

- `MetronomeBar`: `_beatDots`, `_meterChip`, `_btn`, `_controls`, `_toggleExpanded`, `_tickNow`, `_scheduleNext`.
- `PianoKeyboard`: `_WhiteKey`, `_BlackKey`.
- `FretboardView`.
- `InstrumentSurface`, which switches between piano and guitar.
- `TimingDifficultySelector`.

**exact:** Every timed mode has its own settings sheet and session summary sheet:

- `ScaleRunSettingsSheet` / `ScaleRunSessionSummarySheet`
- `InversionRunSettingsSheet` / `InversionSessionSummarySheet`
- `JamModeSettingsSheet` / `JamSessionSummarySheet`
- `VoicingRunSettingsSheet` / `VoicingSessionSummarySheet` (`VoicingSummaryAction`, "Pick another voicing")

Summary sheets use `_statBox` and `_weakRow` (exact).

**Feedback colours (exact copy):** correct = green, wrong = red flash; timing green/amber/red. Target keys are "Blue target dots" ("The blue dots marking which keys to play").

## Paywall flow (see PAYWALL_AND_GATING.md)

Tapping a Pro mode calls `_openXGated`. **inferred:**

- With free trial sessions left, the mode opens and a toast shows "Last free <mode> session, enjoy!" or "<n> left in this mode." (`_showTrialToast`).
- With no sessions left, `_showPaywall` opens `PaywallSheet`.

## Social (optional account)

- **SocialScreen** (exact builders):
  - signed in or out views
  - `_profileCard` (avatar `AvatarPickerSheet`: emoji 🦉🎹🎷🎤🦊🐙🎶🐼🥁🎵🎧🪕🎻🎺🐸🎸 + colour Amber/Blue/Green/Orange/Pink/Rose/Teal/Violet; exact strings, inferred to be the picker set)
  - `_editName` ("Enter a name (up to 24 characters).")
  - `_leaderboard` ("Streak leaderboard")
  - `_activityRow`
  - `_invite` ("Invite a friend")
  - `_showEmailSignIn`
  - `_confirmSignOut` ("Sign out?")
  - `_confirmDelete` ("Delete your account?" + permanent-delete copy)
- **Friends / Friend profile:**
  - `_streakRow`, `_thisWeek` (day dots), `_modeScores`, `_trend`, `_applaud` ("Applaud", "Applauded today")
  - `_confirmRemove` ("You'll stop seeing each other's streaks and activity. They aren't notified.")
- **Invite links:**
  - `https://scalerunner.c1gnus.com/invite…` or `scalerunner://` via app_links
  - `AcceptInviteScreen`: "<name> wants to be practice friends on Scale Runner…", "Sign in to accept:", error strings for expired, used, invalid or own link
- **Sign-in sheet copy:** "Sign in to keep your voicings, settings, stats and streak in sync across your devices, invite friends, applaud their practice, and climb the streak leaderboard. Everything else works without an account."
- **Sync status:** "Synced just now", "Last synced <t>", "Not synced yet", "Sync now", "Your library is backed up.".
