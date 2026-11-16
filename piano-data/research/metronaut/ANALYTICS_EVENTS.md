# Metronaut — analytics, trackers and logged events

Scope: what the app measures and which third parties receive data. Event **names** and **property names** only. No keys, tokens or payload values are reproduced. Machine-readable: `data/analytics_events.json`.

## How this was recovered

- **exact (type)**: Swift enum/struct names and cases from `__swift5_types`/`__swift5_fieldmd` of each binary.
- **exact (literal)**: strings of 16+ bytes in `__cstring` (`strings -arch arm64`).
- **exact (immediate)**: Swift "small strings" (15 bytes or fewer) are not in `__cstring`; they are encoded as `mov/movk` immediates. A disassembly scan (`otool -tV` + a Node decoder) recovered many. The decoder pairs registers heuristically, so a few recovered names are garbled; only clean ones are listed.
- **case**: a Swift case name. The string actually sent (raw value) may differ, for example `performanceSettingChanged` is sent as `performance_setting_changed`.
- Triggers are **inferred** from names, enum context and UI strings.

## Trackers and SDKs

| tracker | evidence (exact) | role | status |
|---|---|---|---|
| AppsFlyer | Frameworks/AppsFlyerLib.framework (stub; code linked into main binary: 228 "appsflyer" string hits); Info.plist NSAdvertisingAttributionReportEndpoint https://appsflyer-skadnetwork.com/; NSPrivacyTrackingDomains att.*.appsflyersdk.com etc.; params appsflyer_id / af_web_id sent to Metronaut auth API | Install attribution, SKAdNetwork, deep links (OneLink: ".onelink.me" in Networking) | exact |
| Branch | Resources/BranchSDK_BranchSDK.bundle; Info.plist branch_key {live,test} (values not reproduced) and branch_universal_link_domains; hosts api3.branch.io, api3-eu.branch.io, api-safetrack(-eu).branch.io, cdn.branch.io, bnc.lt | Deep links, referral links (link.metronaut.app), attribution | exact |
| Braze | Frameworks/BrazeKit.framework, Resources/braze-swift-sdk_BrazeUI.bundle; 778 "braze" string hits; Metronaut.BrazeDataSource {lastReportedOpenedPieceId, lastReportedIsPremium} | CRM: push, in-app messages, content cards, banners, feature flags, geofences. 388 "crm.*" strings in en table are its copy | exact |
| Facebook SDK (Core, Login, AEM) | Frameworks/FBSDKCoreKit, FBSDKCoreKit_Basics, FBSDKLoginKit, FBAEMKit; Info.plist FacebookAutoLogAppEventsEnabled = true, FacebookAdvertiserIDCollectionEnabled = true, FacebookAppID present (value not reproduced) | Login + automatic app-event logging + Aggregated Event Measurement (ad attribution) | exact |
| Firebase / Google Analytics for Firebase | Frameworks/FirebaseAnalytics, GoogleAppMeasurement, GoogleAppMeasurementIdentitySupport; bundles Firebase_FirebaseABTesting, FirebaseCore, FirebaseCrashlytics, FirebaseInstallations; strings firebaseremoteconfig.googleapis.com, app-analytics-services.com; GoogleService-Info.plist present (keys not reproduced); Info.plist FirebaseAppDelegateProxyEnabled = false | Analytics, Remote Config, A/B testing, Installations, App Check endpoint referenced | exact |
| Firebase Crashlytics | Firebase_FirebaseCrashlytics.bundle; hosts reports.crashlytics.com, update.crashlytics.com, firebase-settings.crashlytics.com | Crash reporting | exact |
| Amplitude | Resources/Amplitude_Amplitude.bundle; hosts api2.amplitude.com, api.eu.amplitude.com, regionconfig(.eu).amplitude.com; Swift types AnalyticsConnector.*; header names ampDeviceId / ampSessionId in Networking (sent to Metronaut backend) | Product analytics (likely primary event sink for the in-house Analytics package) | exact (hosts); inferred (primary sink) |
| Apple AdServices / SKAdNetwork | https://api-adservices.apple.com/api/v1/ in main binary; 82 "skadnetwork" string hits; NSUserTrackingUsageDescription (ATT prompt) | Apple Search Ads attribution, SKAN postbacks | exact |
| Google Sign-In | GoogleSignIn bundles; GIDClientID in Info.plist (value not reproduced) | Login (not a tracker, but a Google data flow) | exact |
| Zendesk | https://antescofo.zendesk.com + /api/v2/requests (Networking); help center community.metronautapp.com/hc | Support tickets with custom_fields and tags | exact |
| Segment / Adjust / Sentry mentions | Strings like ios_segment, adjust, sentry occur inside AppsFlyer/Branch plugin-detection tables | Not integrated (no frameworks or bundles) | inferred |

Architecture (**inferred** from types): the app logs through an in-house Swift package `Analytics` (`AnalyticsRepository`, `EventBuilder`, `TimedEventBuilder`, `CancellableEventBuilder(V3)`, `TimedEventLogger`) and `MetronautAnalyticsKit` (`ActionAnalyticsEvent`, `TimedAnalyticsEvent`, `CancellableAnalyticsEvent`, `AnalyticsLoggableEvent {type, properties}`). Each event is `{type: String, properties: [String: Any]}`. Timed events emit a begin and an end with `START_DATE`, `DATE`, `DURATION`. Cancellable events add `cancelled` and `failed` end states. The repository fans out to the SDKs above; Braze also receives user state through `Metronaut.BrazeDataSource` (`lastReportedOpenedPieceId`, `lastReportedIsPremium`).

## App Tracking Transparency and privacy manifest

| item | value (exact) |
|---|---|
| ATT prompt (en, InfoPlist.strings `NSUserTrackingUsageDescription`) | This will help us to bring more musicians like you to Metronaut community. You won't see any ads in our App. |
| A/B variants `_NEW_1` / `_NEW_2` | This will help us to bring more musicians like you to Metronaut community. / You won't see any ads in our App. |
| Info.plist base value | To Help Build our Community |
| Info.plist `NSPrivacyTrackingDomains` (19) | api-safetrack-eu.branch.io, api-safetrack.branch.io, att.attr.appsflyer-cn.com, att.attr.appsflyersdk.com, att.attr.hevents.appsflyer-cn.com, att.attr.whappsflyer.com, att.conversions.appsflyer-cn.com, att.conversions.appsflyersdk.com, att.conversions.hevents.appsflyer-cn.com, att.conversions.whappsflyer.com, att.dlsdk.appsflyer-cn.com, att.dlsdk.appsflyersdk.com, att.dlsdk.hevents.appsflyer-cn.com, att.dlsdk.whappsflyer.com, att.launches.appsflyer-cn.com, att.launches.appsflyersdk.com, att.launches.hevents.appsflyer-cn.com, att.launches.whappsflyer.com, ep1.facebook.com |
| `Resources/PrivacyInfo.xcprivacy` | Only accessed-API reasons: DiskSpace (85F4.1, E174.1), FileTimestamp (DDA9.1), UserDefaults (CA92.1). No tracking declaration and no collected-data list in this file. |
| Info.plist Facebook flags | `FacebookAutoLogAppEventsEnabled` = true, `FacebookAdvertiserIDCollectionEnabled` = true |
| Analytics consent hooks seen in strings (SDK-level) | ad_storage, analytics_storage, ad_user_data, ad_personalization (Google consent mode), IABTCF_TCString / IABTCF_CmpSdkID (TCF), dma_eea (Branch DMA) |

## Events

Columns: event | properties | source | trigger (**inferred**). Properties are **exact** for typed events whose own fields/CodingKeys list them (Domain.PerformanceSessionEvent, Domain.SubPerformanceEvent, PiecePurchaseEvent, UserActivityEvent, PerformanceSettingEvent.Properties, Analytics package property enums, SearchEvent.Filters.DeselectAll). For other rows the properties are an **inferred** mapping from the shared property enums below to that event. "status" tells whether the name is a sent string (wire), a Swift case name (case) or an identifier that may be a popup id (id).

### Action events (ActionAnalyticsEventKey)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `errorAction(identifier)` | error{code,domain,localizedDescription}, scene, reason | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | User acts on an error UI |
| `annotation_action` | type, reason | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Score annotation tool used |
| `annotation_zoom` | value | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Zoom while annotating |
| `performanceSettingChanged` | performanceSetting, category, setting, value, handsSettings, transposition, scene | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Any practice setting change (tempo, loop, metronome, volumes, transposition, clef, hands) |
| `deviceOrientationChanged` | deviceOrientation{current,previous,isForced,isPreviouslyForced} | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Rotation |
| `contactSupportFormBegin` | scene, tag | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Support form opened |
| `contactSupportFormFailed` | error | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Support form submit failed |
| `contactSupportFormSubmitted` | submitted | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Support form sent |
| `contactSupportFormEnd` | reason, duration | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Support form closed |
| `pieceRequestFormBegin` | scene | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Piece-request form opened |
| `pieceRequestFormFailed` | error | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Piece-request form failed |
| `pieceRequestFormEnd` | reason, duration, submitted | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Piece-request form closed |
| `askedForPushNotification` | pushNotifModal{isDeniedAuthorizationStatus}, tag | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Push permission modal shown |
| `videoMode` | value | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Video recording mode toggled |

### Action events: confirmed wire names

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `performance_setting_changed` |  | MetronautAnalyticsKit __cstring literal | wire | Raw value of performanceSettingChanged |
| `device_orientation_changed` |  | MetronautAnalyticsKit __cstring literal | wire | Raw value of deviceOrientationChanged |
| `annotation_action` |  | MetronautAnalyticsKit __cstring literal | wire |  |
| `annotation_zoom` |  | MetronautAnalyticsKit __cstring literal | wire |  |

### Timed events (TimedAnalyticsEventKey, states begin/end)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `foopup` | type, reason, duration, scene | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Generic popup ("foopup") shown/closed; types in AnalyticsEventPropertyTypeValue |
| `performanceSettings` | type, reason, duration | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Practice settings sheet open to close |
| `notification` | type, reason | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | In-app notification/tip shown |
| `annotation` | duration | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Annotation mode session |
| `pushOnboarding` | reason | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Push opt-in onboarding screen |
| `tunerFoopup` | tuningDiapason, duration | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Tuner popup session |
| `micPermission` | status | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Microphone permission prompt |
| `micPermissionWarning` | reason | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Mic-denied warning |
| `error` | error, scenario | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Error screen visible |
| `recordings` | duration | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Recordings list open |
| `videoRecordingPreview` | duration | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Video preview open |

### Timed events: confirmed wire names

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `performance_settings` |  | MetronautAnalyticsKit __cstring literal | wire | Raw value of performanceSettings |

### Cancellable events (CancellableAnalyticsEventKey, states begin/end/cancelled/failed)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `foopup` |  | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case |  |
| `accompanimentLoading` | scenario{previewLoadingVersionsList\|previewLoadingVersion\|previewStreamingVersion\|scoreRendering}, duration, error | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Download/render of a piece version |
| `print` | pdfProvider{back\|guido\|testing}, printStatus{locked\|unlocked}, printCredits, pdfDownload{loading\|loaded} | MetronautAnalyticsKit __swift5_fieldmd (enum case) | case | Print/PDF export |

### Cancellable events: confirmed wire names

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `accompaniment_loading` |  | MetronautAnalyticsKit __cstring literal | wire |  |
| `purchase_piece` | purchaseStatus{free\|purchased\|purchasable}, productIdentifier | MetronautAnalyticsKit __cstring literal | wire | Single-piece purchase flow |

### Analytics package events

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `selected_piece` | SelectionContext{sectionTag,indexSection,indexItem}, scenario, scene, feature | Analytics package __cstring literal | wire | Piece tapped in any list |
| `selected_collection` | id, piecesCount, localizedTitle, sectionTag, indexSection, indexItem | Analytics package __cstring literal | wire | Collection tapped |
| `selected_post` | id, EventAction{performance\|postsFeed} | Analytics package __cstring literal | wire | Community post tapped |
| `memory_warning_received` |  | Analytics package __cstring literal | wire | iOS memory warning |
| `userClass_businessOrFirst` | userClass | Analytics package __cstring literal | wire | User class assignment |
| `post_like` | id | Analytics package __cstring literal | wire | Community like |
| `post_unlike` | id | Analytics package __cstring literal | wire | Community unlike |
| `post_toggle_like` | id | Analytics package __cstring literal | wire |  |
| `post_piece` | id | Analytics package __cstring literal | wire | Open piece from post |
| `post_play` | id | Analytics package __cstring literal | wire | Play a post video |
| `post_share` | id | Analytics package __cstring literal | wire | Share a post |

### Analytics package typed events (type string not recovered)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `AccountActionEvent` | actionName, isActive, url, value | Analytics package (Analytics_-10EF06E9999E684F_PackageProduct) __swift5_fieldmd | case | Account screen actions (see Metronaut.AccountAction cases) |
| `ConversionDataSuccessEvent` | adgroup, campaign, media_source | Analytics package (Analytics_-10EF06E9999E684F_PackageProduct) __swift5_fieldmd | case | AppsFlyer onConversionDataSuccess callback |
| `StartedSubscriptionEvent` | hasFreeTrial, conversionScore | Analytics package (Analytics_-10EF06E9999E684F_PackageProduct) __swift5_fieldmd | case | Subscription started |
| `SubscriptionPurchaseBeginEvent` |  | Analytics package (Analytics_-10EF06E9999E684F_PackageProduct) __swift5_fieldmd | case | Purchase sheet started |
| `SubscriptionPromptBeginEvent` |  | Analytics package (Analytics_-10EF06E9999E684F_PackageProduct) __swift5_fieldmd | case | Paywall prompt shown |
| `TimedEvent (TYPE_START / TYPE_STOP)` | START_DATE, DATE, DURATION | Analytics package (Analytics_-10EF06E9999E684F_PackageProduct) __swift5_fieldmd | case | Generic begin/end pair; suffix strings inferred to be _begin/_end |

### Performance (practice) session events

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `PerformanceSessionEvent (TYPE_START / TYPE_STOP)` | identifier, userId, deviceId, opusId, pieceId, accompanimentId, workoutStepId, workoutId, instrumentId, appVersion, scoreDuration, date, startDate, duration | Domain __swift5_fieldmd | case | Piece opened for practice until closed |
| `SubPerformanceEvent (TYPE_START / TYPE_STOP)` | date, duration, identifier, performanceSessionId, userId, deviceId, startPosition, endPosition, tempoAverage, notesNumber, practiceScore, isFreeSubscription, performanceId, scoreDuration | Domain __swift5_fieldmd | case | Each play run (press Play to stop) inside a session |
| `PiecePurchaseEvent` | pieceId, composerName, pieceTitle | Domain __swift5_fieldmd | case | Piece bought/unlocked |
| `OpenedDeeplinkEvent` | type, deeplink | Domain __swift5_fieldmd | case | Deep link opened |

### Domain literals (user properties / events)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `piece_opened_first` |  | Domain __cstring literal | wire | First piece opened (milestone) |
| `piece_request_upvoted` | type, properties, scenario | Domain __cstring literal | wire | User up-voted a piece request |
| `session_start_date` |  | Domain __cstring literal | wire | User property |
| `initial_utm_campaign` |  | Domain __cstring literal | wire | User property (attribution) |
| `initial_utm_content` |  | Domain __cstring literal | wire | User property (attribution) |
| `initial_utm_source` |  | Domain __cstring literal | wire | User property (attribution) |
| `referring_link_id` |  | Domain __cstring literal | wire | User property (Branch referral) |

### Recording events (Core.RecordingEventType)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `deleteRecord` | id, pieceId, accompanimentId, mode, duration | Core __swift5_fieldmd | case |  |
| `renamedRecord` |  | Core __swift5_fieldmd | case |  |
| `saveRecord` |  | Core __swift5_fieldmd | case |  |
| `sharedRecord` |  | Core __swift5_fieldmd | case |  |

### Core literals (onboarding / profile / experiments / ranking)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `instrumentSelection_action` |  | Core __cstring literal | wire | Onboarding: instrument chosen |
| `userLevelSelection_action` |  | Core __cstring literal | wire | Onboarding: level chosen |
| `userStatusSelection_action` |  | Core __cstring literal | wire | Onboarding: status chosen |
| `userIsTeacherSelection_action` |  | Core __cstring literal | wire | Onboarding: teacher yes/no |
| `onboardingPreferenceSelection_action` |  | Core __cstring literal | wire | Onboarding: preference chosen |
| `landing_newUser_action` |  | Core __cstring literal | wire | Landing screen, new user path |
| `landing_returningUser_action` |  | Core __cstring literal | wire | Landing screen, returning user path |
| `updateUser_action` |  | Core __cstring literal | wire | Profile update |
| `firstname_changed` |  | Core __cstring literal | wire |  |
| `lastname_changed` |  | Core __cstring literal | wire |  |
| `nickname_changed` |  | Core __cstring literal | wire |  |
| `experiment_started` | group_name | Core __cstring literal | wire | A/B experiment assignment |
| `experiment_first_screen_practice` |  | Core __cstring literal | wire | A/B: first screen = practice |
| `league_up` |  | Core __cstring literal | wire | Ranking result |
| `league_down` |  | Core __cstring literal | wire |  |
| `league_same` |  | Core __cstring literal | wire |  |
| `league_never` |  | Core __cstring literal | wire |  |
| `league_wood` |  | Core __cstring literal | wire | League tier |
| `league_bronze` |  | Core __cstring literal | wire |  |
| `league_silver` |  | Core __cstring literal | wire |  |
| `league_gold` |  | Core __cstring literal | wire |  |
| `league_diamond` |  | Core __cstring literal | wire |  |
| `congrats_type` |  | Core __cstring literal | wire | Property of congratulation screens |

### Piece menu (MetronautUI.PieceMenuEventType)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `pieceMenu_open` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `pieceMenu_action_share` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `pieceMenu_action_playlist_add` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `pieceMenu_action_playlist_remove` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `pieceMenu_action_students_add` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `pieceMenu_action_offline` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `pieceMenu_action_collection_open` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |

### Playlist drawer (MetronautUI.PlaylistDrawerEventType)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `playlist_create` | id, name, count, favorite, piecesId, piecesCount | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `playlist_piece_add` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `playlist_piece_remove` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `playlist_piece_move` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |

### Share menu (MetronautUI.ShareMenuEventType)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `shareMenu_delete` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `shareMenu_share` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |

### Search (MetronautUI.SearchEvent)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `search_start` |  | MetronautUI __cstring literal | wire | Search field focused |
| `search_stop` | kind{scroll\|select\|enter\|exit\|cancel\|suggestion\|recent} | MetronautUI __cstring literal | wire | Search editing ended |
| `search_category_select` |  | MetronautUI __cstring literal | wire | Category tile tapped |
| `filters_select` | kind, pk | MetronautUI __cstring literal | wire | Filter chip on |
| `filters_deselect` | kind, pk | MetronautUI __cstring literal | wire | Filter chip off |
| `filters_deselect_all` | filtersCount | MetronautUI __cstring literal | wire | Clear filters |
| `search_perf` |  | MetronautUI __cstring literal | wire | Search performance/latency (inferred) |

### Discovery / exploration / external links

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `exploration_cell_click` |  | MetronautUI __cstring literal | wire |  |
| `exploration_video_click` |  | MetronautUI __cstring literal | wire |  |
| `exploration_list` |  | MetronautUI __cstring literal | wire |  |
| `external_link_load` |  | MetronautUI __cstring literal | wire | In-app web view |
| `external_link_loaded` |  | MetronautUI __cstring literal | wire |  |
| `external_link_refresh` |  | MetronautUI __cstring literal | wire |  |
| `external_link_scroll` |  | MetronautUI __cstring literal | wire |  |
| `header_action` |  | MetronautUI __cstring literal | wire |  |
| `gamification_details` |  | MetronautUI __cstring literal | wire | Streak/grade details opened |
| `download_piece` |  | MetronautUI __cstring literal | wire | Offline download |
| `accompaniment_update` |  | MetronautUI __cstring literal | wire |  |
| `player_status_failed` |  | MetronautUI __cstring literal | wire | AVPlayer failure |
| `students_action_send` |  | MetronautUI __cstring literal | wire | Teacher sends piece to students |
| `playlist_action_students_add` |  | MetronautUI __cstring literal | wire |  |

### Workout / training

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `workout_start_step` |  | MetronautUI __cstring literal | wire |  |
| `workout_step_success` |  | MetronautUI __cstring literal | wire |  |
| `workout_step_fail` |  | MetronautUI __cstring literal | wire |  |
| `workout_notachieved` |  | MetronautUI __cstring literal | wire |  |
| `workout_training_start` |  | MetronautUI __cstring literal | wire |  |
| `workout_training_success` |  | MetronautUI __cstring literal | wire |  |
| `training_success` |  | MetronautUI __cstring literal | wire |  |
| `popup_workout_success` |  | MetronautUI __cstring literal | wire |  |
| `teacher_success` |  | MetronautUI __cstring literal | wire |  |

### Recording / community

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `recording_publish_community` |  | MetronautUI __cstring literal | wire |  |
| `popupShown_recording_publish_community` |  | MetronautUI __cstring literal | wire |  |
| `recording_upload_done` |  | MetronautUI __cstring literal | wire |  |
| `recording_uploaded` |  | MetronautUI __cstring literal | wire |  |
| `recording_already_published` |  | MetronautUI __cstring literal | wire |  |
| `recording_camera` |  | MetronautUI __cstring literal | wire |  |
| `recording_camera_settings` |  | MetronautUI __cstring literal | wire |  |
| `recording_internalSpeaker_warning` |  | MetronautUI __cstring literal | wire | Recording through built-in speaker warning |
| `recording_publish_share_from_student` |  | MetronautUI __cstring literal | wire |  |
| `recording_publish_share_from_teacher` |  | MetronautUI __cstring literal | wire |  |
| `listen_recording_audio` |  | MetronautUI __cstring literal | wire |  |
| `listen_recording_video` |  | MetronautUI __cstring literal | wire |  |

### Popups / permissions / device (identifiers; may be popup ids rather than events)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `speechrecognition_permission_prompt` |  | MetronautUI __cstring literal | id |  |
| `speechrecognition_permission_denied` |  | MetronautUI __cstring literal | id |  |
| `speechrecognition_popup` |  | MetronautUI __cstring literal | id |  |
| `headphone_speaker_prompt` |  | MetronautUI __cstring literal | id |  |
| `wireless_speaker_prompt` |  | MetronautUI __cstring literal | id | Bluetooth speaker latency warning |
| `prefer_headphones` |  | MetronautUI __cstring literal | id |  |
| `micro_permission` |  | MetronautUI __cstring literal | id |  |
| `microphone_access` |  | MetronautUI __cstring literal | id |  |
| `midi_connection` |  | MetronautUI __cstring literal | id |  |
| `storage_low` |  | MetronautUI __cstring literal | id |  |
| `reduced_motion` |  | MetronautUI __cstring literal | id |  |
| `no_internet` |  | MetronautUI __cstring literal | id |  |
| `error_no_internet` |  | MetronautUI __cstring literal | id |  |
| `error_generic_with_retry` |  | MetronautUI __cstring literal | id |  |

### Onboarding (UI)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `onboarding_goal_concert` |  | MetronautUI __cstring literal | wire |  |
| `onboarding_goal_discover` |  | MetronautUI __cstring literal | wire |  |
| `onboarding_goal_enjoy` |  | MetronautUI __cstring literal | wire |  |
| `onboarding_goal_motivation` |  | MetronautUI __cstring literal | wire |  |
| `onboarding_goal_progress` |  | MetronautUI __cstring literal | wire |  |
| `onboarding_genres` |  | MetronautUI __cstring literal | wire |  |
| `onboarding_genres_count` |  | MetronautUI __cstring literal | wire |  |
| `onboarding_commitment_fingerprint` |  | MetronautUI __cstring literal | wire | Lottie/asset id |
| `onboarding_commitment_illustration` |  | MetronautUI __cstring literal | wire | Asset id |
| `onboardingCommitment_sign` |  | MetronautUI __cstring literal | wire | User "signs" practice commitment |
| `onboardingGoalSelection_action` |  | MetronautUI __cstring literal | wire |  |

### Subscription result pages (MetronautUI.DescriptionPageEnum)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `subscription_congrats_with_free_trial` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_congrats_without_free_trial` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_congrats_renew` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_error_internet` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_error_internet_retry` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_error_global` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_error_appstore` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_error_already_user` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_error_purchase` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_error_restore` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_loading` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `subscription_waiting` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `contact_form` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `contact_form_community` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `contact_form_performance` | pieceId, accompanimentId | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `contact_form_piece_request` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `contact_form_recording` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `contact_subscription_error_form_purchase` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |
| `contact_subscription_error_form_restore` |  | MetronautUI __swift5_fieldmd (enum case) | wire |  |

### Practice screen (MetronautPreviewCoreKit)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `performance_action` | PerformanceAction{play\|rewind\|tapOnScore\|annotation\|previousWorkoutStep\|nextWorkoutStep\|nextPiece\|dismiss\|training\|practice\|instructions\|listen\|print\|settings\|advanced\|hands\|videoMode\|recordingMode\|rhythmTap} | MetronautPreviewCoreKit __cstring literal | wire | Any transport/toolbar action |
| `feedback_ai` | type, properties | MetronautPreviewCoreKit __cstring literal | wire | AI feedback toggled/shown (PerformanceFeedbackAIEvent) |
| `selected_accompaniment` |  | MetronautPreviewCoreKit __cstring literal | wire | Version/accompaniment chosen |
| `purchase_piece` |  | MetronautPreviewCoreKit __cstring literal | wire |  |
| `mode_track_gain` | mode, role, gain | MetronautPreviewCoreKit __cstring literal | wire | Mixer gain per playing mode (property name) |
| `track_role` |  | MetronautPreviewCoreKit __cstring literal | wire | Property: solo\|accompaniment |
| `workout_substep` |  | MetronautPreviewCoreKit __cstring literal | wire | Property |
| `score_algorithm_version` |  | MetronautPreviewCoreKit __cstring literal | wire | Property: practice-score algorithm version |
| `videoMode_PiP` |  | MetronautPreviewCoreKit __cstring literal | wire | Property |

### PerformanceSettingEvent.Properties (property names)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `performance setting event properties` | category, setting, value, mode, trackRole, type, loopLength, audioOutputType, audioOutputName, audioInputType, audioInputName, scoreDuration, scoreAlgorithmVersion, scoreScale, playingState, orientation, position, transposition, performanceMode, performanceTotalDuration, pageScrolling, workoutSubStep, videoMode, recordingMode, videoMode_PiP, showFingering | MetronautPreviewCoreKit __swift5_fieldmd | case | Attached to performance_setting_changed / performance_action |

### Practice screen (MetronautPreviewUIKit)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `recordMenu_open` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `community_recording_playback` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `performance_auto_adaptation` |  | MetronautPreviewUIKit __cstring literal | wire | Engine auto-adapted settings (PerformanceAutoAdaptationEvent) |
| `tap_rhythm` |  | MetronautPreviewUIKit __cstring literal | wire | Rhythm-tap mode |
| `step_finished_end` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `workout_finished_end` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `nickname_textfield_focus` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `midi_settings_scan` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `midi_settings_select` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `midi_settings_deselect` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_add_collection` |  | MetronautPreviewUIKit __cstring literal | wire | Settings menu items (likely event values) |
| `settings_anotate` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_fullperf` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_partition` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_practiceInstructions` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_problem` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_rec_audio` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_rec_camera` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_transpose` |  | MetronautPreviewUIKit __cstring literal | wire |  |
| `settings_version` |  | MetronautPreviewUIKit __cstring literal | wire |  |

### Score annotation (MetronautPreviewUIKit.ScoreAnnotationEvent)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `action(annotationTool\|hide(state)\|delete\|undo\|redo\|dismiss)` |  | MetronautPreviewUIKit __swift5_fieldmd | case |  |
| `didZoom(scale)` |  | MetronautPreviewUIKit __swift5_fieldmd | case |  |
| `begin` |  | MetronautPreviewUIKit __swift5_fieldmd | case |  |
| `end` |  | MetronautPreviewUIKit __swift5_fieldmd | case |  |
| `notification begin/end (alert\|tip; reason swipe\|tap\|timeOut\|delete\|cancel)` |  | MetronautPreviewUIKit __swift5_fieldmd | case |  |

### Subscription paywall (MetronautSubscriptionUIKit / CoreKit)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `subscription_product_loaded` | presentedProductIdentifiers, promotionOfferIdentifiers | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `subscription_selected` | productId, segmentIndex | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `subscription_purchase` | productId, transactionId, conversionScore, probability, elapsedDuration | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `subscription_restore` |  | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `subscription_action` |  | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `subscription_switchOff` |  | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `subscription_termsOfUse` |  | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `subscription_warning_displayed` | message | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `subscriptionPrompt_action` | scenario{subscription\|subscriptionChange\|subscriptionOffer\|subscriptionYearOnly\|subscriptionNoFreeTrial} | MetronautSubscriptionUIKit __cstring literal | wire |  |
| `probabilistic_multiplier` |  | MetronautSubscriptionUIKit __cstring literal | wire | Property: conversion-probability weighting |

### Subscription controller states (SubscriptionViewControllerEvent)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `state(begin\|end{presentedProductIdentifiers,promotionOfferIdentifiers,selectedProductIdentifier,reason closed\|actionSucceed})` |  | MetronautSubscriptionCoreKit __swift5_fieldmd | case |  |
| `load / select / action(purchase\|restore; begin\|end\|cancelled\|failed) / selectSegment / warning / seeAll / hideAll / termsOfUse` |  | MetronautSubscriptionCoreKit __swift5_fieldmd | case |  |
| `CongratsState begin(productIdentifier)/end` |  | MetronautSubscriptionCoreKit __swift5_fieldmd | case |  |
| `PremiumDescription begin / end(subscription\|skip)` |  | MetronautSubscriptionCoreKit __swift5_fieldmd | case |  |

### Main app literals

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `preview_play` |  | MacOS/Metronaut __cstring literal | wire | Audio preview played from a list |
| `preview_pause` |  | MacOS/Metronaut __cstring literal | wire |  |
| `appStoreReview_action` |  | MacOS/Metronaut __cstring literal | wire | Rating prompt |
| `deeplink_input_action` |  | MacOS/Metronaut __cstring literal | wire |  |
| `switchoff_reason_select` | SwitchOffReason{hesitant_to_confirm\|hesitant_to_renew\|catalog\|level\|no_time\|expensive\|other} | MacOS/Metronaut __cstring literal | wire | Cancellation survey |
| `collection_action_students_add` |  | MacOS/Metronaut __cstring literal | wire |  |
| `piece_isAlreadyOpened` |  | MacOS/Metronaut __cstring literal | wire |  |
| `performance_loading` |  | MacOS/Metronaut __cstring literal | wire |  |
| `firstName_textfield_focus` |  | MacOS/Metronaut __cstring literal | wire |  |
| `lastName_textfield_focus` |  | MacOS/Metronaut __cstring literal | wire |  |
| `selected_card_title` |  | MacOS/Metronaut __cstring literal | wire | Property |
| `selected_card_url` |  | MacOS/Metronaut __cstring literal | wire | Property |
| `selected_card_video` |  | MacOS/Metronaut __cstring literal | wire | Property |
| `selected_playlist` |  | MacOS/Metronaut __cstring literal | wire |  |
| `selected_ranking` |  | MacOS/Metronaut __cstring literal | wire |  |
| `selected_workout` |  | MacOS/Metronaut __cstring literal | wire |  |

### Main app code immediates (heuristic recovery, short names)

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `login_success` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `Login_Apple` |  | MacOS/Metronaut code immediate (Swift small string) | wire | Login form tag |
| `Login_Email` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `Login_Facebook` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `Login_Google` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `Login_Phone` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `Login_Wechat` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `Login_Home` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `opened_deeplink` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `selected_card` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `selected_CTA` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `workout_action` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `upload_record` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `UserGoal_form` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `SwitchOffForm_1` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `posts_fetch` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `session_load` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `congrats_user` |  | MacOS/Metronaut code immediate (Swift small string) | wire |  |
| `start_tempo` |  | MacOS/Metronaut code immediate (Swift small string) | wire | Property |
| `start_position` |  | MacOS/Metronaut code immediate (Swift small string) | wire | Property |

### Main app typed events

| event | properties | source | status | trigger |
|---|---|---|---|---|
| `DeeplinkEvent (processed\|failedToProcess)` |  | MacOS/Metronaut __swift5_fieldmd | case |  |
| `UserActivityEvent` | activityType, url, handledByBranch, handledByAppsFlyer | MacOS/Metronaut __swift5_fieldmd | case | NSUserActivity / universal link |
| `BranchDebugEvent` |  | MacOS/Metronaut __swift5_fieldmd | case |  |
| `UserGoalSwitchedEvent` |  | MacOS/Metronaut __swift5_fieldmd | case | Practice goal toggled |
| `PausedPreviewEvent / PlayedPreviewEvent` |  | MacOS/Metronaut __swift5_fieldmd | case |  |
| `AnalyticsCardEvent` |  | MacOS/Metronaut __swift5_fieldmd | case | Discovery card |
| `AnalyticsPracticeEvent` |  | MacOS/Metronaut __swift5_fieldmd | case | Practice tab |
| `AnalyticsWorkoutActionEvent` |  | MacOS/Metronaut __swift5_fieldmd | case |  |
| `PerformanceStateChangeEvent` | type, date, scorePosition | MacOS/Metronaut __swift5_fieldmd | case | Play/pause/stop transitions |
| `TapTempoEvent` | averageTempo, updateCount | MacOS/Metronaut __swift5_fieldmd | case | Tap-tempo |
| `PlayedAccompanimentEvent` | accompanimentId, pieceId, date | MacOS/Metronaut __swift5_fieldmd | case |  |
| `PushNotificationActionType (remind(triggerDuration)\|tap\|dismiss\|none)` |  | MacOS/Metronaut __swift5_fieldmd | case |  |

## Property and value enums (exact, from Swift metadata)

| enum | cases |
|---|---|
| AnalyticsEventProperty (MetronautAnalyticsKit) | scenario, scene, duration, date, type, reason, deviceOrientation, pushNotifModal, submitted, page, fromPage, performanceSetting, error, tag, status, appVersion, handsSettings, category, productIdentifier, offerId, setting, pdfProvider, printStatus, purchaseStatus, pdfDownload, transpositionWarning, printCredits, value, other(key,value), campaign |
| AnalyticsEventPropertySceneValue | other(String), myMusic, preview, performance, workoutStep, pushPresentation, onboarding, tuner, testing |
| AnalyticsEventPropertyCategoryValue | tempo, volume, mode, hands, display, transposition, switch |
| AnalyticsEventPropertySettingValue | tempo, loopStatus, loopPosition, stateMetronome, countDownKind, stateSoloMidi, volumeMidiSolo, volumeMetronome, volumeAccompaniment, transpositionOctave, transpositionInterval, scoreClef, displayAccompaniment, hands |
| AnalyticsEventPerformanceSettingPropertyValue | category, setting, type, loopLength, audioOutputType, audioOutputName, scoreDuration, scoreScale, playingState, position, transposition, performanceMode, tuningDiapason, performanceTotalDuration |
| AnalyticsEventPropertyTypeValue | advertiserTracking, referral, preview, mode, volume, advanced, tip, alert, badConnection, settings, versions, storage, transposition, display, annotationLocked, printLocked, noPrintCredit, printConfirmation, tempo, noPDF, printFail, unknown, hands, listen, recordingMode, rhythmMode, videoFeedback, latency, speechRecognition, tuner |
| AnalyticsEventPropertyReasonValue | sharing, dismiss, tap, swipe, settingChanged, action, close, enableNotif, settings, annotation, recordings, tuner, transposition, versions, print, purchasePiece, subscription, display, error, advertiserTracking, instructions, fullPerformance, contact, volume, videoMode, sharePiece, sharePlay, addToPlaylist, backButton, helpCenter, rhythm, latency, speechRecognitionPermission, sharePieceToStudent |
| AnalyticsEventPropertyTagValue | onboarding, home, account, upvote, pieceRequest, support, userGoal, universalLink |
| AnalyticsEventPropertyScenarioValue | scene(...), previewLoadingVersionsList, previewLoadingVersion, previewStreamingVersion, scoreRendering |
| AnalyticsEventPropertyHandsSettingsValue | left, right, both |
| AnalyticsEventPropertyOrientationValue | portrait, landscape |
| AnalyticsEventPropertyPurchaseStatusValue | free, purchased, purchasable |
| AnalyticsEventPropertyPDFProviderValue | back, guido, testing |
| AnalyticsEventPropertyPrintStatusValue | locked, unlocked |
| AnalyticsEventPropertyPDFDownloadValue | loading, loaded |
| AnalyticsEventPropertyCampaignValue | referralOneFreePiece (wire "referral_1freePiece") |
| Analytics.Scenario (package) | myMusic, discovery, practice, search, account, performance, preview, workoutStep, subscription, onboarding, community, ranking, performanceStats |
| Analytics.Scene (package) | collectionDetail, composerDetail, playlistDetail, workout, pieceList, offline, post, recommendation, recordings, voiceCommands, shares, onboarding, community |
| Analytics.Feature (package) | pieceMenu, playlists |
| Analytics.ModalEndReason (package) | dismiss, tap, swipe, back, timeOut, action, dontshow, primaryAction, secondaryAction |
| Analytics.NavigationContext properties | date, duration, feature, fromPage, kind, reason, scenario, scene, type |
| Analytics.UserProperty (user profile sent to analytics) | recordsSaved, recordsShared, userClass, userLevel, preferredInstrumentId, onboardingPref, totalPerformances, totalPerformancesDuration, totalPiecesPaid, totalReferralSent, totalRecommandApp, totalSearchDone, totalSongsDisplayed, totalSongsPurchased, email, isPremium, lastOpenedPieceId, lastPreviewedPieceId, initialUtmCampaign, initialUtmContent, initialUtmSource, isTeacher, userStatus, campaign, channel, referringLink, referringLinkId |
| Analytics.RevenueType | purchase, subscription |
| Metronaut.NavigationScenario | other(String), pushNotification, inAppMessage, spotlight, universalLink, shortcut, widget, siri, commands, banner |
| Metronaut.AccountAction (AccountActionEvent.actionName) | togglePracticeGoal(active), text(field,text), avatarChanged(asset), externalLink(url), automaticRecording(value), onboarding, account, user, mySubscription, settings, avatar, midiSettings, share, shareTeacher, shareStudent, studentsList, speechRecognition, subscribe, switchOffReason, switchOffComment, switchOffHow, zendeskSupport, deeplinkInput, contact, userGoal, deconnexion, resetMyAccount, login, restorePurchases |
| Metronaut.SwitchOffReason | hesitant_to_confirm, hesitant_to_renew, catalog, level, no_time, expensive, other |
| Core.MetronautModalAuthorisePushNotifOrigin | onboarding, appOpening, account, pieceRequest, upVote, support, userGoal |

## Data sent to Metronaut's own backend that is analytics-like (exact field names)

| endpoint / model | fields |
|---|---|
| `/stats/performance/` (PerfStatCreate), Domain.SubPerformanceEvent | date, duration, identifier, performanceSessionId, userId, deviceId, startPosition, endPosition, tempoAverage, notesNumber, practiceScore, isFreeSubscription, performanceId, scoreDuration |
| `/v1/conversion_score/purchase_begin/` | currencyCode, instrumentId, levelId, genrePreference, status, platform, isIpad -> server returns a conversion score used on the paywall |
| Networking.Device (AuthAPI.device) | deviceId, model, apnsToken, pushauthorized, defaultLanguage, os, timezone |
| Login/registration params | appsflyer_id, af_web_id, firebase_id, instrument_id, level_id, genre_preference, status, platform |
| Networking.UserDeepLinkParameters (AuthAPI.branch) | first_attributed_touch_data, last_attributed_touch_data, user_id |
| Request headers (immediates) | x-auth-token, ampDeviceId, ampSessionId, Accept-Language |
| Recording upload body | id, instrumentId, pieceId, accompanimentId, creationDate, duration, startBeatPosition, endBeatPosition, startOffset, latency, mode, title, isDiscontinuous, preferences, nimFilename, mediaFilename, imageFilename, mediaSize, hasVideoTrack, hasAccompanimentTrack |

## What to measure / what not to do (for a privacy-respecting web piano trainer)

What is worth measuring (first-party, aggregate, no third parties):
1. Practice session start/stop with piece id, duration and score duration (Metronaut: PerformanceSessionEvent). This is the core retention metric.
2. Per-run metrics: start/end beat position, average tempo, notes count, practice score, score-algorithm version (SubPerformanceEvent + score_algorithm_version). Keep the algorithm version so scores stay comparable after changes.
3. Setting changes as one event with `category`/`setting`/`value` (tempo, loop, metronome, count-in, hands, volumes, transposition, clef). One generic event beats twenty specific ones.
4. Load and render failures with a scenario (`previewLoadingVersion`, `scoreRendering`) and duration (accompaniment_loading). This finds slow MusicXML parsing and audio decoding.
5. Audio route and latency context (audioOutputType/Name, audioInputType/Name, latency) to explain bad sync reports. Store the route type, not the device name.
6. Permission funnel (mic prompt shown, granted, denied) because mic-based following fails silently without it.
7. Search: start, stop reason, filters chosen, result clicked position (sectionTag, indexItem).

What not to do:
1. Do not ship ad-attribution SDKs (AppsFlyer, Branch, Facebook AEM, SKAN) in a practice tool. Metronaut ships seven third-party SDKs and 19 declared tracking domains.
2. Do not send email or names as analytics user properties (Analytics.UserProperty includes `email`).
3. Do not send device names (`audioOutputName`, `audioInputName` can contain a person's name, for example "Anna's AirPods").
4. Do not enable automatic SDK event logging (`FacebookAutoLogAppEventsEnabled = true`); log only events you designed.
5. Do not use a server-computed "conversion score"/"probabilistic_multiplier" to tune paywalls per user without disclosure.
6. Do not log before consent. In a web app, keep analytics off until the user opts in, and keep practice data local-first.
7. Do not mix CRM copy into the main string table (388 `crm.*` keys); keep marketing text out of the app bundle.
