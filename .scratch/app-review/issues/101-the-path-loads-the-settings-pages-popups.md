# 101. The Path screen loads the Settings page's popup code

Status: done
Severity: P2
Tier: 6
Rule: CODE_STYLE §7 (a screens module is one chunk of the screens that load together); `react-route-splitting`
Where: `src/app/routes/home-screens.ts:2`

## What is wrong

`SettingsPage` shared the Path's chunk, so `/` loaded the keyboard settings' Base UI popups (about 62 kB of Base UI and its utils) and the piece parsers before any popover opened.

## The test that shows it

Measured on a production build: what `/` loads (its screens chunk and every chunk it imports, the entry's included) was 625,571 B raw / 212,767 B gzip; after, 541,633 B / 184,480 B (−83.9 kB, −28.3 kB gzip). Settings loads 578,279 B / 196,599 B when opened.

## The fix

`routes/settings-screens.ts`, its own chunk; CLAUDE.md lists it.

## Comments
