# 105. The precache lists seven icons twice

Status: done
Severity: P3
Tier: 6
Rule: CODE_STYLE §11
Where: `vite.config.ts:40`

## What is wrong

`includeAssets` and the manifest's icons were added beside the glob that already matches them: 59 entries for 52 URLs.

## The test that shows it

The built `sw.js`: no URL listed twice after, each icon once.

## The fix

No `includeAssets`, and `includeManifestIcons: false`; the glob lists every icon.

## Comments
