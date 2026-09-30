# 60. Settings' Back pushes a history entry, so the system Back returns to Settings

Status: done
Severity: P1
Tier: 4
Rule: spec §5 (a screen below a place's top has a back button); `useGoBack` ("going back from there never returns to it")
Where: `src/pages/settings/ui/SettingsPage.tsx:78`

## What is wrong

Back was a `RoundLink` to `/`: Path → Settings → Back left `[/, /settings, /]`, so Android's or the installed app's Back from Path opened Settings again. Every other Back leaves through `useGoBack`.

## The test that shows it

`SettingsPage.test.tsx`: "goes back to the Path it was opened from, leaving no Settings to come back to", "goes back to the Path when it was opened directly".

## The fix

`BackButton` with `fallback={{ to: '/' }}` (see 70).

## Comments
