# UI flows, screens, buttons and menus

Legend: **exact** = read from a file or binary (cited). **inferred** = interpretation. Strings are the `en.lproj/Localizable.strings` values (full table in LOCALISATION_EN.md). View names come from Swift metadata (`data/swift_types_app.json`).

## 1. Platform and shell

- iPad app built for Mac Catalyst (`UIDeviceFamily = [2]`, `LC_BUILD_VERSION platform 6`, `LSMinimumSystemVersion 13.0`), single scene (`UIApplicationSupportsMultipleScenes = false`), all four orientations (**exact**, Info.plist / Mach-O).
- SwiftUI shell `RootAppView` with UIKit islands: `PerformanceViewController` (score page, wrapped by `PerformanceViewControllerRepresentable`), `SubscriptionViewController`, `WebViewController`, `ModalViewController` (**exact**).
- URL schemes: `metronaut`, a Facebook scheme, a Google sign-in scheme. Universal-link domains: `link.metronaut.app`, `64nx.app.link`, `64nx-alternate.app.link`, `clicks.metronautapp.com` (**exact**, Info.plist; IDs omitted).

## 2. Mac menu bar and keyboard shortcuts

`buildMenu(with:)` in the main binary calls super, then, if the builder is the main menu system, removes `UIMenu.Identifier.edit` and `.format` (**exact**, disassembly at `0x1000f6890`). No custom menus or commands were found. So the menu bar is the Catalyst default (Metronaut, File, View, Window, Help) without Edit and Format (**inferred** for the remaining menus).

Score page key commands, `ScoreReaderV.keyCommands` (**exact**, PreviewUIKit `0xcab38`; all set `wantsPriorityOverSystemBehavior = true`):

| Title (as compiled) | Key | Modifiers |
|---|---|---|
| Play/Pause | Space | none |
| Print | P | ⌘ |
| Scroll to Next Page | Page Down | none |
| Scroll To Next Page | ↓ | none |
| Scroll to Previous Page | Page Up | none |
| Previous Page | ↑ | none |
| Next Page | → | none |
| Next Page | ← | none (title is "Next Page" in the binary; behaviour probably previous page — **inferred**) |
| Zoom In | + | ⌘ |
| Zoom Out | − | ⌘ |

## 3. Root flow

`Metronaut.RootFlow { onboarding, login, splash, premium, loading, home }` and `RootNavigationDestination { onboarding, login, home(HomeTabNavigation), community(postUUID, forPieceId), performance, onboardingAccount, splash, premium }` (**exact**).

```
launch → splash (SplashScreenUIView, LoadingAppUIView)
       → onboarding (first run) → [optional login] → [paywall "premium"] → home
       → home (returning user)
deep link → community post | performance | premium | onboardingAccount
```
(**inferred** order; cases **exact**)

## 4. Onboarding

`MetronautUI.OnboardingStep` (**exact**, declaration order): `instrumentsComment(Int)`, `levelComment(Int)`, `statusComment`, `preferencesComment(Int)`, `welcome`, `instruments`, `level`, `status`, `feedbackLonely`, `feedbackMotivation`, `feedbackStagnation`, `goal`, `commitment`, `preferences`.

| Step | Question / content (**exact**) | Answers (**exact**) |
|---|---|---|
| welcome | "Welcome to Metronaut" — "Don’t play music alone, Metronaut plays along with you!"; video `onboarding.mp4` "Introducing the magic of Metronaut" | Continue / Skip |
| instruments | "Which instrument do you play?" / "Select your Main Instrument" — "We will Suggest and Transpose pieces for you!" | instrument grid (`InstrumentsUIView`, `InstrumentCellView`); commentary per instrument (piano: "Great, we've got everything a pianist needs!") |
| level | levels | "Beginner" (I can read the notes on a score.), "Basic" (I am able to play easy pieces.), "Advanced" (I know how to sight-read and perform pieces.), "Expert" (I easily sight-read any kind of scores.), "Teacher" (I would like to use Metronaut for my classes.) |
| status | "What describes you best?" | "I take music lessons", "I am a teacher", "I am in charge of an educational institution", "I practice alone at home" |
| feedbackLonely | "Do you sometimes find practicing alone less stimulating?" | Yes / No / I’m not sure → tailored reply |
| feedbackMotivation | "Do you sometimes find it hard to motivate yourself to practice?" | Yes / No / I’m not sure |
| feedbackStagnation | "Do you sometimes feel like you’re stagnating despite your efforts?" | Yes / No / I’m not sure |
| goal | "What do you want to achieve with Metronaut?" (`OnboardingGoal { progress, discover, enjoy, concert, motivation }`) | "I want to make progress", "… discover more pieces", "… enjoy playing more", "… prepare my next concert", "… be more motivated to practice" |
| commitment | "My commitment as a pianist" (per instrument) — "Tap to sign your commitment" — "Committing increases motivation" → "You are committed" | sign gesture |
| preferences | "What do you like to play?" — "You can change this later" | Classical & Baroque, Romantic & 20th century, Jazz, Pop, Rock, Film music, Country & Folk, Soul & R&B, Mainstream music, "A bit of everything" |
| (other) | "Are you comfortable with the idea of reading sheet music on a screen?", "Which approach suits you best?" ("I take my time to master a piece" / "I quickly explore several pieces"), "Would you like to play this piece?" | Yes/No |
| push ask | "Stay motivated" — "Allow notifications for updates about new pieces and features…" | "Enable notifications" / "Skip" |
| first piece | "Want to try?" — "Choose a first piece among our selection for you or skip to browse the whole catalog." | piece list / Skip |
| tech check | "Let's go!" — "Metronaut uses the microphone to synchronize Accompaniments and records your perfomance." / "Use speakers or headphones…" | "Play" |
| mic | "Mic Test... 1, 2, 1, 2" — "Allow access to the microphone to enjoy all of Metronaut's performance features." | "Allow Access" |

## 5. Login

Providers (**exact**): Apple, Google, Facebook, Email, SMS (phone), WeChat. `LoginFlowAction { selectProvider, openSmsSecond, openForgotPassword, openWeb, loginSuccess, appleAuthorization, appear, refreshProviders, toggleLoginKind, skip, cancel, startAppleSignIn, openSms, closeTopRoute }`; routes `LoginRoute { smsFirst, smsSecond(previous), forgotPassword(initialEmail), webLink }`; views `LoginHomeView`, `LoginFlowView`, `EmailLoginView`, `ForgotPasswordView`, `SmsFirstStepView`, `SmsVerificationView` (**exact**).

Login is contextual: `LoginModel.From { regular, subscription, error, playlist, postFeed, performanceStats, isTeacher, practiceReminders }` with titles "Create your account to save your settings", "Create an account to gain access to playlists", "Create an account to set practice reminders", "Your Premium access is activated! Creating an account is required to enjoy it.", "Create your account to access teacher benefits", "Login to interact with other users" (**exact**). Password rule: "at least 8 characters, and cannot contain only numbers" (**exact**). Anonymous auth exists (`AuthenticationType { none, anonymous }`, `UserDefaultsFallbackUserIdProvider.swift`) — the app is usable before login (**exact** types; behaviour **inferred**).

## 6. Home tabs

`Core.TabBarItem { myMusic, discovery, practice, search, account }` (**exact**). Labels (**exact**): "My music", "Discover", "Practice", "Catalog" (old: "Search"), "Account". Selected tab persisted in `selectedHomeTabTag`. Views: `HomeTabsView`, `TabBarUIView`, `MyMusicView`, `DiscoverView`, `PracticeView`, `SearchView`, `AccountUIView` (**exact**).

### 6.1 My music
- Sections `PieceSectionType { other(tag), favorite, played, request, collection, search, recommended }` (**exact**).
- Strings: "My Scores", "Already Played"; empty states "This is where you can find the pieces you recently played and your favorites." + "Find my first piece"; footer upsell "Unlock the full catalog" / "Play with No Time Limit" / "Try for free!" / "See all offers"; "Rate the App" (**exact**).
- Push destinations: `recentlyPlayed`, `offline`, `record`, `recordPiece`, `playlist`, `shares` (**exact**, `TabBarPushDestination`). Playlists: covers `PlaylistImageEnum { Kandinsky, Klimt, Miro, Miro2, Mondiran, Munch, VanGogh, VanGogh2 }` (**exact**).
- Stats widget: practice time this week (App Intent "How much did I practice this week in ${applicationName}?").

### 6.2 Discover
- Server-driven widgets (see CATALOG_MODEL.md §3/5). Sections seen: "Rhythm games", "Happy Holidays!", welcome "Enjoy 3 free pieces selected for you…" (**exact**).
- Push: `collection`, `composerDetail(composerName, id)`, `recommendation(Int)`, `workout` (**exact**).

### 6.3 Practice (guided workouts)
- Sections (**exact**): "Daily Routine" — "Accompanied exercises to learn the basics and warm up."; "Skill Focus" — "Develop new music skills while playing famous piece extracts."; "Learning a Piece" — "Apply your technique by learning these famous pieces."
- Workout → steps: `WorkoutView`, `CellWorkoutUIView`, `CellWorkoutStepUIView`, `PerformanceWorkoutStepsUIView`; step bar "Step {{stepNumber}}/{{totalSteps}}"; buttons "Start Step", "Next step", "Play again", "Try again", "Skip", "Switch to Training Mode", "Instructions", "Listen", "End workout", "Exit to Open the Full Piece"; results "Step Complete!", "Almost there! — Score above %u%% to validate this step."; end "Congratulations, you finished this workout!" → "We recommend next:" / "Next Workout" / "See all workouts" (**exact**).
- Locked workouts: "Start my free trial" / "Subscribe" — "To unlock all workouts and pieces" (**exact**). `Workout.Properties { id, free }`, `WorkoutStep.Properties { id, difficulty, free }` (**exact**).

### 6.4 Catalog (search)
- Search field "Search in the catalog"; indexes `SearchIndex { pieces, collections, authors }`; suggestions/history `MNSearchEnum { suggested, history }`; pills `SearchPillView`, `ClearSearchPillView` (**exact**).
- Filters (`FiltersSectionModel.Kind { genre, difficulty, accompaniment, instrument, myMusic, composer, originalComposition }`, `FilterKind { difficulty, genre, instrument, instrumentFamily, accompanimentKind, favorite, recentlyPlayed, original, composer }`) with labels "Period / Genre", "Difficulty", "Accompaniment type", "Sheet music instrument", "My music", "Original compositions" ("Only search for pieces composed for the selected instrument(s)"), "Include adaptations", "Price"; buttons "Filter", "Reset", "Clear filters", "View results" (**exact**).
- Placeholders `noInternet` ("You are currently offline. Please connect to the internet to search for a new piece." / "However, you can still search for a piece you have already opened."), `noResults` ("No result"), `error` (**exact**).
- Piece request when nothing is found (`CellSearchRequestPieceUIView`, `PieceRequest*` strings) (**exact**).

### 6.5 Account
`AccountDestination { web(url), profile, mySubscription, settings, speechRecognition, switchOffReason, switchOffComment, switchOffHow, goal }` (**exact**). Rows and actions in SETTINGS.md §6. Views: `AccountProfileView`, `AccountSettingsView`, `AccountDisplayPrefsUIView`, `AccountRecordingUIView`, `AccountSubscriptionUIView`, `AccountUserAvatarGalleryUIView`, `AccountUserGoalUIView`, `AccountLegalView`, `PracticeGoalView`, `SwitchOffReasonUIView`, `SwitchOffCommentUIView`, `SwitchOffHowUIView` (cancellation survey), `StorageUIView`, `MIDISettingsView`, `VoiceCommandView`, `EducationAdvantagesUIView`, `StudentsButtonView` (**exact**).

Gamification shown from account/home (**exact**): "Rank" (grade, "Total XP earned"), "Streak" ("Weeks in a row!", "Best streak", "Play every week to keep your streak going."), weekly "Leaderboard (expires in {duration})" with leagues (promoted / relegated / remain), "Nauts" currency, XP per session ("You've earned:", "Total this week"). Modals `ranking`, `streakDetails`, `gradeDetails` (**exact**).

## 7. Piece preview (before playing)

- `PreviewData { piece, configuration, context, additionalProperties, sequenceContext }`; `PreviewAppearance { new, old }`; `PreviewButtonAction { performance, subscription, purchase, consumeOfferedPieceCredit }`; `PreviewNextScene { performance, subscription, purchase }` (**exact**).
- Shows score excerpt (GuidoKit preview), audio preview "Play Preview"/"Pause", version list, buttons "Start Practicing", "Start my free trial", "Try Premium for Free", "Subscribe", "Buy - {{price}}", "Unlock this Piece", "Discover our special offer" (**exact**).
- Versions (accompaniments) picker `PerfVersionsUIView`, grouped by difficulty (`PerfDifficultyGroupUIView`), "Choose your version", "Change version" (**exact**).
- Auto-adapt message: "Clef and transposition have been automatically adapted to your instrument. You will be able to change them in the piece settings." (**exact**).

## 8. Score page (performance screen)

`PerformanceView` → `PerformanceViewController` with `ScoreReaderV` (**exact**). Layout pieces (**exact** view names): `PerformanceHeaderView`, `HeaderMiddleView`, `PerformanceToolbarView`/`PerformanceToolbarViewGroup`, `PerformanceBarUIView` (iPhone/iPad variants `PerformanceIPhoneBarUIView`, `PerformanceIPadBarUIView`, `PerformanceIPadPlayerControlsUIView`), `PlayerControlsUIView`, `PerformanceProgressView`, `CountDownV`, `CoachProgressBar`, `PianoUIView`/`PianoKeyboardUIView`, `DrawerBtUIView` (`DrawerBtEnum { piano, chevron }`), `AlertUIView`, `UserMessageUIView`, `NextPieceFooterView`, `PreviewFooterView`, `CameraPiPView`, `RecordTimerView`.

### 8.1 Bottom bar buttons — `PerformanceBarEnum` (**exact**, declaration order)

| Button | Opens / does | Strings (**exact**) |
|---|---|---|
| `rec` | recording menu (`PerformanceRecordUIView`): audio or video; list of recordings | "Audio recording", "Video Recording", "When you are ready to record, tap the Play button.", "Listen", "See", "Delete" |
| `loop` | toggle loop, shows loop handles | "Loop" |
| `tempo` | tempo drawer (`PerformanceTempoUIView`: slider + metronome toggle + mode reaction) | "Tempo", "Metronaut's reaction", "Fixed", "AI Tempo", "Wait", "AI Feedback" |
| `feedbackAI` | toggle AI feedback (`PerformanceFeedbackAIBarItem`) | "AI Feedback" |
| `mode` | mode sheet (`PerformanceModeUIView`) | "What would you like to do?" — Listen / Practice / Interpret (AI Tempo) / Sight-read |
| `listen` | listen panel (`PerformanceListenUIView`, slider model) | "Listen" |
| `steps` | workout steps (`PerformanceWorkoutStepsUIView`) | "Steps" |
| `playPause` | start/stop | "Perform", "Play" |
| `rewind` | back to start position, twice → beginning | "Back" |
| `metronome` | toggle metronome | "Metronome" |
| `tap_rhythm` | rhythm-game tap pad (`PerformanceRhythmUIView`) | "Tap here 👇 to play notes when cursor reaches them" |

Also `PerformanceHandsUIView` (hands selector) and the settings ("Tools") drawer `MainSettingView` with the 18 buttons listed in SETTINGS.md §4.1.

Actions available on the page, `PerformanceAction` (**exact**): `play`, `rewind`, `tapOnScore`, `annotation`, `previousWorkoutStep`, `nextWorkoutStep`, `nextPiece`, `dismiss`, `training`, `practice`, `instructions`, `listen`, `print`, `settings`, `advanced`, `hands`, `videoMode`, `recordingMode`, `rhythmTap`.

Player actions `MetronautPerformancePlayerAction` (**exact**): `updateConfigValue`, `updateScoreDisplayValue`, `updateScoreTranspositionValue`, `annotation(Bool)`, `retryVersionLoading(versionIdentifier)`, `startPlaying`, `stopPlaying`, `rewind`, `rhythmTap`, `retryVersionsListLoading`, `dismiss`.

Annotation toolbar (`AnnotationMenuView`): tools, hide (`eye.fill`/`eye.slash.fill`), undo, redo, delete (`trash.fill`), dismiss (`xmark`) (**exact** enum `ScoreAnnotationToolType` + SF Symbol small strings).

### 8.2 End of session

`PerformanceSummaryUIView`, `PerformanceSummaryEndWorkoutUIView`, `PerformanceSummaryListItemUIView` (**exact**). Stats labels (**exact**): "Well done!", "Score played", "Played notes", "Average tempo", "Playing time", "Nauts gained", plus playful ones "Calories burned", "Neural connections", "Disturbed neighbors", "Saved Trees". Session block: "Your session", "Session time", "This session XP", "New recordings", leaderboard nickname entry, "Similar pieces", "Have a student practice this piece" → "Send to a student", "Done". Rating ask: "So, what do you think?" → "Rate" / "Later". Next piece: "Next piece" "in the collection" / "in your playlist".

### 8.3 Help tour (`performance.help.*`, **exact**)
intro → score ("This is the piece you will play…") → play button → rewind → tempo ("Tap here to choose the tempo… slide to the left or to the right") → mode control → settings → previous recordings ("only your 20 previous performances are stored") → speakers → conclusion.

## 9. Paywall and gating

- Subscription screen `SubscriptionViewController` / `SubscriptionPageUIView`; content `SubscriptionContent { trial, notrial }`; scenarios `SubscriptionScenario { subscription, subscriptionChange, subscriptionOffer, subscriptionYearOnly, subscriptionNoFreeTrial }`; appearance `{ subscribe, subscribeMixed, changeSubscription, promotion }`; periods `week, month, year`; intro periods `day, week, month, year` (**exact**).
- Copy (**exact**): "Metronaut Premium", "Become the Musician you Dream to Be!", feature cells "Explore 12,000+ music sheets", "Play with accompaniments", "Practice at your tempo", "Progress thanks to metronaut AI", "Share your recordings"; button "Start my free trial"; segment "Free trial"; offer screens "LIMITED OFFER", "7-DAYS FREE TRIAL", "I waive the 7-days free trial", "24h hours left".
- User status `UserSubscriptionStatus { freeUser, trial, premium, premiumNonPaying, switchedOff, expiredTrial, expired }`; stores `apple, premium, stripe` (**exact**).
- What is gated (**exact** strings; mapping **inferred**):
  - Full score beyond the preview excerpt ("Unlock all full music sheets", "You still have 70% of the score to discover" in old copy).
  - Daily free play time: "Every day enjoy %u minutes of free play time"; at zero: "Start your free trial to play this piece!" / "Become Premium to play this piece!".
  - Annotation ("Unlock the piece to annotate"), print ("Unlock the piece to print", monthly print credits), workouts ("Unlock all workouts").
  - Pay-per-piece alternative: "Buy your favorite pieces"; offered-piece credits (`credit_piece_qty`, `OfferedPieceDetails { numberOfCredits }`).
  - Bullet list of Premium: loop, tempo of your choice, automatic page turn, annotation & print, 8,000+ sheets.
- Feature catalogue used for upsell and "what's new" cards `Core.FeaturesEnum` (**exact**): `airplay, annotation, audio_preview, change_version, clef, cursor, display_accompaniment, feedback, landscape_orientation, latency, loop, metronome, midi, piece_request, playlist, practice, print, publication, rating, recording, related_collections, reminders, rhythm_game, same_composer, search_filters, smart_tempo, solo, speakers_headphones, speech_recognition, stats, support, tempo, transposition, tuner, wait_mode, watch_video_recording, zoom, scroll_page, piano_not_tuned, search, my_music` (+ `unknown`).

## 10. Modals reachable from tabs

`TabBarModalDestination` (**exact**): `web(url)`, `playlist(pieceId, playlistDrawerActions)`, `helpCenter(articleId, sectionId)`, `featuresList`, `pageDescription`, `pageDescriptionForm`, `subscription`, `educationAdvantagesView(mode, handler)`, `students(isSelectMode, shareEntity)`, `zendeskMessage(messageId)`, `video`, `ranking`, `searchFilters`, `midiSettings`, `streakDetails`, `gradeDetails`.

Popup kinds `PopupMessageEnum { message, popup, feature, tuner, playlistCreation }` (**exact**).

## 11. Deep links

`Metronaut.Navigation` (**exact**): `collection`, `piece`, `article`, `section`, `deepLinkCongrats`, `search`, `share`, `webPiece`, `workoutStep(Int)`, `workout`, `community(post)`, `webAppPath(String)`, `videoModal`, `feature([...])`, `subscribe`, `account`, `practice`, `myMusic`, `discover`, `request`, `rating`, `login`, `push`, `contact`, `shareTeacher`, `shareStudent`, `voiceCommands`. Web sheet-music paths localised `en, es, fr, zh` (**exact**).

## 12. System integrations

- App Intents (**exact**, `Metadata.appintents`): `PracticeIntent` ("Practice in ${applicationName}"), `OpenPieceIntent` (target; "Open ${target} in ${applicationName}", "Play ${target} on ${applicationName}"), `OpenPieceAIIntent`, `MetronautSearchIntent` (criteria; "Search ${applicationName}"), `WeeklyPracticeSummaryIntent` ("How much did I practice this week in ${applicationName}?").
- Widgets (**exact**, `Metronaut-WidgetExtension.appex`): `MetronautWidget` (piece cards: small card, medium/large list) and `PracticeStatisticsWidget` (practice duration; home and accessory families).
- SharePlay (`isSharePlay`, `SharePlaySettings`, `joinedGroupActivity`) (**exact**).
- Support: Zendesk help center and messaging (`HelpCenterView`, `ZendeskMessageView`), feedback by email, iMessage or Messenger ("Give Us Feedback") (**exact**).
