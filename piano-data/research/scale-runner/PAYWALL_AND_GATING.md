# Scale Runner: paywall, Pro gating, cross-promo

## Purchase model (exact)

- RevenueCat through `purchases_flutter`. The macOS bundle has `RevenueCat_RevenueCat.bundle`. A RevenueCat Apple public API key (`appl_…`) is in the snapshot; **it is not reproduced here**.
- **Product id:** `com.scalerunner.app.pro`. **One-time, non-consumable lifetime unlock** (exact copy: "A one-time unlock, yours forever, on all your devices.", "One-time purchase: Scale Running, Inversion Running, Jam Mode and unlimited saved voicings").
- **inferred:** the entitlement id is `pro`. The strings `pro` and `isPro` exist; the entitlement name is not proven.
- Purchase service members (exact): `_configure`, `_onCustomerInfo`, `isPro`, `restore`, `trialsUsed`, `trialsRemaining`, `_trialCountKeyFor`, `_legacyTrialUsedKeyFor`.

## Paywall sheet (`paywall_sheet.dart`, `_PaywallSheetState`, exact)

- **Members:** `_load`, `_buy`, `_restore`, `_snack`, getter `_priceLabel`, `_Perk` row widget.
- **Header:** "Scale Runner Pro" / "Unlock Pro". Sub-header "A one-time unlock, yours forever, on all your devices."
- **Perks** (exact strings; the title/subtitle pairing is inferred):
  1. "Three timed drills, unlimited": "Scale Running, Inversion Running and Jam Mode, in time, key by key, as often as you like."
  2. "Unlimited voicings": "Build and drill as many shapes as you want, past the free 3."
  3. "Streak protection": "One missed day a week is repaired automatically."
  4. "Every progression & key": "Full progression presets, sevenths, and key cycles."
  5. "Your Pro bonus": "2 months of Groove Runner Pro, free." (shown when the promo is live)
- **Buttons:** "Unlock Pro for <price>", "Restore purchases" ("Recover a previous Pro unlock on this device"), "Not now" / "Maybe later".
- **Results:** "Unlocked. Thanks for the support!", "Pro restored!", "No previous purchase found to restore.", "Couldn't restore purchases.", "Something went wrong with the purchase.", "Purchases aren't available right now. Try again later."
- **Included badge:** "Included with Scale Runner Pro".

## What is gated

| Feature | Free | Pro | Basis |
|---|---|---|---|
| Free Play, Scales quiz, Chords quiz, MIDI monitor, calibration, Stats, Social, Reminders | yes | yes | exact: these have no `Gated` opener |
| Scale Running, Inversion Running, Jam Mode | limited **trial sessions per mode** | unlimited | exact: `_openScaleRunGated`/`_openInversionRunGated`/`_openJamModeGated`, `trial_count_<mode>`, "Last free ", " left in this mode.", " session, enjoy!". **The number of free sessions is a code constant, not recovered.** |
| Saved voicings | **3** | unlimited | exact: "past the free 3", `_atFreeLimit`, `_clearedFreeLimit` |
| Weekly streak freeze | no | 1 per ISO week | exact copy |
| Progression presets, 7th chords, key cycles in Scale Running | **inferred:** a subset only | all | exact perk copy "Every progression & key"; which presets are free is not recoverable |

## Groove Runner cross-promo (`promo/`, exact)

- The developer's drum app for MIDI e-kits: "Groove Runner: drum practice for MIDI e-kits", "Our drum practice app for MIDI e-kits. New subscribers, monthly plan."
- Offer id `groove60`: "Get 2 months of Groove Runner Pro free with Scale Runner Pro.", "Groove Runner Pro, on us", "Bonus unlocked", "Your Pro bonus. Tap for the code".
- The sheet shows a code box (`_codeBox`, `_copy`) and "Get Groove Runner" (`_getGrooveRunner`): "The App Store opens with the code ready to redeem." Fallback: "Couldn't open the store. Search for Groove Runner and use code <code>". Small print: "Then $5.99/month unless canceled. New subscribers only. Ends <date>" (`_endsLabel`).
- **inferred:** the offer and its code come from a Supabase table `app_promos` and are cached in `promo_cache_groove60`. "Seen" flags are kept separately for Pro and non-Pro users. A Settings tile `_grooveOfferTile` and a dismissible home tab also exist.
