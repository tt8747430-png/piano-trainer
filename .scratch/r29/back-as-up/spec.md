# Spec: Back as up, and Search as a palette (R26, R27, A7, A18)

## Problem
`useGoBack` (`shared/lib/use-go-back.ts`, 16 callers) calls `history.back()`. Back therefore retraces every
mode switch (Edit ⇄ Done, Player ⇄ editor), every view or tab written into the URL, and Search. A learner who
went Songs → song → Edit → Done → Settings needs four Backs to get home. `/search` is a sidebar destination,
not a tool.

## Decision
1. **One parents table**, `app/routes/parents.ts`: `parentOf(match) → NavigateOptions | null`, keyed by
   route id. A place (`/`, `/songs`, `/practice`, `/profile`, and on a laptop `/settings`) returns null.
   Every other route names its parent, with the params it needs:
   - `/songs/$pieceId` → the folder it sits in (`/songs/folders/$folderId` when the library puts it in one),
     else `/songs`; `/songs/$pieceId/settings`, `/publish`, `/sections/$section` → `/songs/$pieceId`;
   - `/play/$pieceId` and `/edit/$pieceId` → the song (a study's under `/practice/accompaniment/studies/…`);
     `/edit/$pieceId/settings` → `/edit/$pieceId`; a take → `/edit/$pieceId`;
   - `/lessons/$lessonId` → `/` (`view=lessons`), its settings and edit → the lesson; a course's lesson →
     the course → `/` (`view=courses`); `/lessons/$lessonId/example` → the lesson's edit;
   - `/practice/<page>` → `/practice`; `/practice/quiz/$trainerId` → `/practice/quiz`; a pattern's
     edit and publish → the pattern → `/practice/accompaniment`;
   - `/settings/<page>` → `/settings`; `/settings/midi/log` → `/settings/midi`; `/settings` on a phone →
     `/profile`; `/profile/activity` → `/profile`; `/account/*` → `/settings/account` when signed in, else
     `/profile`; `/legal/*` → `/settings/how-to-use`; `/admin` → `/settings`.
   The table is data plus one resolver; a test walks `router.flatRoutes` and fails for a route with no
   entry, so a new route can't be added without its parent.
2. **`useUp()`** in `shared/lib` replaces `useGoBack`: it navigates to the parent with `replace: true` when
   the previous history entry *is* that parent (so the browser's own Back still works and nothing piles up),
   else it pushes the parent. `BackButton`, the Player's and the editor's close, the account pages and
   `RouteError` all call it. `useGoBack` is deleted.
3. **What isn't a place doesn't push.** Every `navigate` that switches a mode, a view, a tab, a filter, a
   sort, a step of a flow, or opens/closes a sheet held in the URL takes `replace: true`. One helper,
   `useSetSearch()` (search-param writes, always `replace`), so a view change can't forget it. The 46
   `navigate(` call sites are listed in `audit.md` with their verdict.
4. **Done after Edit** replaces the edit route with the page edited; Back from there goes to that page's
   parent (one test per place).
5. **Search palette (R27):** `widgets/search-palette`, a `Dialog` over the current screen (⌘K / Ctrl+K,
   the sidebar's Search, a place's search button on Learn and Practice): recent searches (`pt-views`
   `searchRecent`, max 8), then results grouped Practice · Songs · Folders · Lessons, arrow keys move, Enter
   opens (one push from the screen underneath), Esc closes with nothing pushed. On a phone, Songs keeps
   its own field (searches the library first, "Search everywhere" opens the palette). `/search?q=` stays
   as a link that opens the palette over `/`. The sidebar's Search stops being a route.

## Tests
- `parents.test.ts`: every route has a parent or is a place; each parent resolves to a real route.
- One app test per place: Songs → folder → song → Settings → Back ×3 lands in Songs; Learn → lesson →
  Edit → Done → Back lands in Learn; Practice → Chords (change root, view) → Back lands in Practice;
  Profile → Settings → Account → Back ×2 lands in Profile (phone).
- Palette: ⌘K opens, typing filters, ↓ Enter opens a song, Back returns to the screen under it; Esc leaves
  history length unchanged.

## ADR
0052 (navigation) and 0038 (URLs): Back goes up the parents table; view and mode changes replace; Search is
a palette.
