# Songs: the song page, its Settings and a folder's — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** The owner's 1.x feedback on the mockup page (song page 1.1–1.10, both passes) and ST17 (Decided 22): ✎ on a
song's page opens its score in the editor; the song's words (title, who wrote it, about) are edited on its Settings ›
Details; Settings' acts open drawers (Move to folder…, Export…, Archive asks first); a section opens in the Player, no
section page; a folder's ⋯ becomes its Settings page.

**Spec:** `.scratch/r29/owner/feedback-song-player-editor.md` (1.1–1.10, second pass 1.3), `.scratch/r29/plan/settings.md`
ST17 with its Decided 22, `.scratch/r29/mockups/song-player-editor.html` 1.x.

## Global Constraints

- One way to each act; one gear per screen; Back goes up; a step in the URL replaces.
- An act that loses or hides work asks through `ConfirmDialog`.
- Every string en + ru; phone and laptop alike.

## Review Focus

1. A learner's built-in song: ✎ opens their version in the editor; no Details row (nothing there is theirs).
2. An own song: Details edits title, credits and about; Back to Settings, then the song.
3. Archive from Settings asks; Keep it leaves the song where it was.
4. A section row opens the Player at the section's first bar.

### Task 1: ✎ opens the score; Settings › Details edits the words
**Files:** `PieceView.tsx` (✎ → `/edit/$pieceId`; the overview's Edit score button goes), `SongSettingsPage.tsx`
(Details row for an own song or an editor's original, `?page=details` drawing `OwnSongEdit`/`OriginalSongEdit`).
- [ ] Tests: "✎ opens the editor"; "Details edits an own song's title"; "a learner's built-in song has no Details".

### Task 2: Archive asks; Move to folder…
**Files:** `SongSettingsPage.tsx`. - [ ] Tests: "Archive asks, Keep it keeps".

### Task 3: A section opens in the Player
**Files:** `SectionRows.tsx`, router (`/songs/$pieceId/sections/...` removed), parents, `SectionPage*` deleted.
- [ ] Test: "a section row opens the Player at its bar".

### Task 4: A folder's Settings page
**Files:** `FolderSettingsPage.tsx` (Name, Colour, Move to, Archive folder, Delete folder), `LibraryHeader.tsx` (⋯ → gear).
- [ ] Tests from ST17's Done when.

### Task 5: gate, docs, main
