# 09. The update banner covers the Player's controls

Status: done
Severity: P2
Tier: 1
Rule: CODE_STYLE §1 (nothing laid over a control)
Where: `src/app/update-prompt/UpdateBanner.tsx:9`, `src/app/RootLayout.tsx`

## What is wrong

The banner is placed for the shell's tab bar (`bottom-28`, `lg:bottom-4`). In the Player and the Check it sat over the bottom row (‹ ▶ ›), and it interrupted a practice to offer a reload.

## The test that shows it

`src/app/router.test.tsx`: "offers a waiting version in the shell, never over a practice"; `UpdatePrompt.test.tsx`: "keeps a waiting version to itself while it may not offer it".

## The fix

The full-screen route carries `staticData: { fullScreen: true }` (typed in the router's module declaration); `RootLayout` keeps registering the worker but offers the version only when no full-screen screen is open (`UpdatePrompt offer`).

## Comments
