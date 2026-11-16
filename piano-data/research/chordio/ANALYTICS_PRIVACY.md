# Analytics and privacy

- **No third-party analytics, crash or ads SDK.** There are no Firebase, Crashlytics, Mixpanel, Amplitude, Sentry, AppsFlyer or similar classes or strings, and the linked libraries are only Apple frameworks plus `MIKMIDI.framework` (com.mixedinkey.MIKMIDI). **exact**: `otool -L`, class list, cstrings.
- `PrivacyInfo.xcprivacy`: Required-Reason APIs only. UserDefaults with reason `CA92.1`, and SystemBootTime with `35F9.1` (Ableton Link clock). There are no collected-data types and no tracking domains. **exact**.
- Network endpoints in the binary:
  - StoreKit receipt check: `https://buy.itunes.apple.com/verifyReceipt` and the sandbox equivalent.
  - Links: `https://chordio.co.uk`, `/video-tutorials.html`, `https://www.oneinabillion.net`, `https://writerssession.com`, `https://mixhaven.app` (promo), a Typeform feedback form, and `http://www.ableton.com/link`.
  - Ableton Link peer discovery (UDP multicast) and Network MIDI (`_apple-midi._udp`).
  - **exact**.
- Permissions (Info.plist): Bluetooth ("connect to MIDI keyboards"), Local Network ("Ableton Link … Network MIDI sessions"). Background modes: `bluetooth-central`, `audio`.
- iCloud: the Core Data stack uses `NSPersistentCloudKitContainer` (class reference). Whether CloudKit sync is switched on could not be confirmed statically.
- Event names: none. There is no analytics event layer. The only "events" are local NSNotifications (`TB…Notification`, 135 names ending in "Notification" in the binary).
- Receipt/purchase state is stored in defaults (`TBAppStorereceiptActiveStatusKey`, `TBPurchaseAppReceiptKey`). These are noted by name only; nothing was read.
