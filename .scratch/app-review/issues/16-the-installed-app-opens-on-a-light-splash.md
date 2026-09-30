# 16. The installed app opens on a light splash for a dark-theme learner

Status: wontfix
Severity: P3
Tier: 1
Rule: spec §6 (no white flash)
Where: `vite.config.ts:45-46`

## What is wrong

The manifest's `theme_color` and `background_color` are the light theme's.

## The test that shows it

None.

## The fix

None. The manifest is one static file the OS reads before the app runs: it cannot know the learner's theme. The page itself never flashes (the boot script), and the toolbar now follows the theme before first paint (issue 13).

## Comments
