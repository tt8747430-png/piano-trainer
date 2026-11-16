# Analytics, privacy, localisation

## Analytics (Aptabase)
SDK aptabase-swift; endpoints `https://us.aptabase.com`, `https://eu.aptabase.com` (region chosen by app key prefix). An Aptabase App Key is compiled into the binary (exists; not copied). Privacy manifest: NSPrivacyCollectedDataType "Usage Data", not linked, purpose Analytics, tracking false.

`Analytics.Event` cases (exact, 35) with parameters:
appLaunched(launchCount), whatsNewShown(whatsNewVersion, source), appBackgrounded(sessionSeconds, mode), screenView(mode, section?, detail?), lessonStarted(id, title), lessonCompleted(id, title, accuracyPct, exercisesCorrect, exercisesTotal), earTrainingStarted(levelId, mode), earTrainingCompleted(levelId, mode, accuracyPct, score, durationSeconds), practiceSessionStarted(type, root, scale, progression?), playExploreCompleted(exerciseId, title), packStoreShown(source), paywallShown(packId, source, price?, priceValue?, currency?), paywallDismissed(packId, source), purchaseStarted(…), purchaseCompleted(packId, source), purchaseFailed, purchasePending, purchaseRestored, ariaOpened(context), chapterUnlockCelebrationShown/Started/Dismissed(chapterId), ratingPromptShown(source), ratingSentimentPicked(rating), ratingPromptScored(rating), ratingPromptSubmitted(rating, route), ratingPromptDismissed(rating, stage), xpEarned(amount, source), levelUp(newLevel, xpTotal), badgeUnlocked(id, tier), challengeAssigned(id, kind), challengeCompleted(id, reward), gameCenterAuthResult(success), leaderboardOpened(id), achievementsGalleryOpened.

Wire names are snake_case; those ≥16 bytes are visible as literals (app_backgrounded, lesson_completed, ear_training_completed, practice_session_started, pack_store_shown, paywall_dismissed, purchase_started/pending/completed/restored, achievements_gallery_opened, chapter_unlock_celebration_shown/started/dismissed, play_explore_completed, challenge_assigned, challenge_completed, game_center_auth); shorter ones are inlined (inferred names such as `xp_earned`, `level_up`). Also `legacy_purchaser_granted`, `early_adopter_2_2_0_granted`, `early_adopter_2_2_0_sheet_shown`, `transaction_update`, `entitlement_owned_packs`.

## Permissions (Info.plist)
Microphone ("detect the notes you sing or play … without a MIDI keyboard"), Calendars write-only (practice schedule), Documents folder (import soundfonts). Live Activities. Game Center. No tracking.

## Localisation
No `.lproj` folders and no `.strings`/`.xcstrings` in the bundle: **English only** (CFBundleDevelopmentRegion en). **No Russian.** Game Center localisations: en-US only. A filtered list of 4,094 UI-like English strings from `__cstring` is in `data/strings_ui_en.txt` (strings ≤15 bytes are inlined in code and missing; lesson prose with `[token]` markup excluded on purpose as copyrighted content).
