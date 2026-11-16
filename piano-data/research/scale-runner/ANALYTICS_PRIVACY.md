# Scale Runner: analytics, backend, privacy

## SDKs (exact: Dart packages in the snapshot, native bundles in `Contents/Resources`)

- **Firebase:** only `firebase_core`, plus the native FirebaseCore, FirebaseCoreInternal and FirebaseInstallations bundles. **No Analytics, Crashlytics or Messaging packages were found** in the Dart package list or the bundles.
- **RevenueCat:** `purchases_flutter`. It reports purchase events to RevenueCat itself.
- **Supabase:** `supabase_flutter`, gotrue, postgrest, realtime_client, storage_client, functions_client. Used for the optional account, sync and social features. A publishable key is present (not reproduced).
- **Sign-in:** Apple (`sign_in_with_apple`), Google (`google_sign_in`, with GoogleSignIn/AppAuth/GTMAppAuth bundles), email.
- **Others:** `share_plus`, `url_launcher`, `app_links`, `package_info_plus`, `shared_preferences`, `path_provider`, `flutter_local_notifications`, `flutter_timezone`, `wakelock_plus`, `audioplayers`, `flutter_midi_command`, `universal_ble`.
- **App analytics event names:** **none found.** The app defines no event logging. Its debug-only log is `BeatDebugLog` (`beat_debug.dart`).

## Backend data (exact table names; see `data/backend.json`)

`profiles`, `friendships`, `invites`, `applause`, `streaks`, `mode_stats`, `weekly_stats`, `device_stats`, `user_settings`, `library_items`, `voicings`, `voicing_folders`, `voicing_tags`, `voicing_customs`, `voicing_deleted`, `app_promos`; RPC/functions `accept_invite_tx`, `invite_preview`, `delete_account`.

## Privacy policy (in-app, exact)

- **Title:** "Privacy Policy", "Last updated: July 14, 2026".
- **Sections:** "Data Stored on Your Device", "Optional Account & Social Features", "Children's Privacy", "Changes to This Policy", "Questions about this privacy policy? Contact us at:".
- **Key statements:**
  - "Scale Runner works fully offline and collects no personal data unless you choose to sign in for the optional social features. The app uses no analytics, advertising, or tracking services of any kind."
  - Server-side list for signed-in users: display name and generated avatar; streak (current, best, total days); saved voicings, folders and tags; practice settings; per-device practice statistics; friend connections, invites and applause.
  - "Your streak, this week's practice and per-mode scores are visible only to friends you connect with … There is no public profile or global leaderboard."
  - MIDI: "No information about your device, your playing, or your MIDI hardware is transmitted anywhere."
- **Older on-device notice (exact, UTF-16 string):** "The app stores the following information locally on your device only… Practice statistics (score, best streak) · App settings (sound preference, onboarding status)".
- **Account deletion:** "This permanently removes your profile, friendships, and every synced voicing, setting and stat from our servers. Your local copy stays on this device. This can't be undone."
