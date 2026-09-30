# 06. The update prompt says it never reloads, and it reloads every tab

Status: done
Severity: P3
Tier: 1
Rule: CODE_STYLE §11; a comment says what the code does
Where: `src/app/update-prompt/UpdatePrompt.tsx:4`

## What is wrong

vite-plugin-pwa's prompt mode reloads every tab that was offered the waiting version once it takes control, so Update in one tab reloads the others. That is right: the old version's lazy chunks leave the precache with the old worker (`cleanupOutdatedCaches`) and the server, so a tab left on it could not open its next screen. The comment said the opposite.

## The test that shows it

None: the behaviour is the plugin's and stays; the comment is corrected.

## The fix

The comment now says why taking the update reloads every open tab.

## Comments
