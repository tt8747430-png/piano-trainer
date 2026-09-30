# 07. The service worker registers during the first load

Status: done
Severity: P2
Tier: 1
Rule: vercel-react-best-practices `advanced-init-once`, `bundle-defer-third-party`
Where: `src/app/update-prompt/UpdatePrompt.tsx:9`

## What is wrong

`useRegisterSW()` defaults to `immediate: true`, so the worker registered at once and its precache (60 files, 3.1 MB with the recording and Bravura) downloaded while the first screen's chunk was still loading.

## The test that shows it

`src/app/update-prompt/UpdatePrompt.test.tsx`: "registers once the page has loaded, and looks for a new version on each return".

## The fix

`useRegisterSW({ immediate: false, … })`: Workbox registers after the page's `load`.

## Comments
