# Back: where it goes (research, 2026-11-04)

The owner asked to fix Back and to research which page Back should go to from which.

## What the platforms do
- **Android** (developer.android.com, Principles of navigation): inside the app's own task, Up and Back do
  the same thing, the reverse of how the learner came. Up never leaves the app and is absent on the
  start destination. A screen opened by a deep link gets a *synthetic back stack* (the start destination and
  the parents in the graph), so Up and Back from it walk up through the app instead of out of it.
  https://developer.android.com/guide/navigation/principles ,
  https://developer.android.com/guide/navigation/navigation-3/recipes/deeplinks-syntheticbackstack
- **iOS** (HIG, Navigation bars): the back button returns to the previous screen in the navigation stack,
  labelled with its title; an edge swipe does the same.
- **The web** (practitioners' consensus, no standard): `history.back()` when the previous entry is the app's
  own, else a fixed fallback to the parent or list; never a dead button on a page opened from a bookmark,
  and never a jump out to another site from an in-app control.

## What ours did (rule 26, until today)
Always up to the screen's parent from `app/routes/parents.ts`. A song opened from Practice, Search, the
Profile, a lesson or Explore came back to Songs, not to where the learner was: what the owner reported.

## The rule now
1. **Came from a screen in the app** (this session's history) → Back returns there, stepping back
   (iOS's stack, Android's in-task Back).
2. **Opened directly** (a link, a shared song, a reload, a notification, a new tab) → Back goes up to the
   screen's parent in `parents.ts`, pushed (Android's synthetic back stack): Back never leaves the app.
3. **A view, tab, filter, mode or a step of a flow** replaces its entry (`useSetSearch`), so Back never
   walks back through them (unchanged).
4. **A deleted thing's screens** (a song, a folder, a progression, a pattern) are forgotten as it is deleted
   (`useForgetScreens`): Back steps past them to the nearest screen still there, else to the parent.
5. **Places** (Learn, Songs, Practice, Profile) have no Back; the tab bar moves between them.
6. **Close (✕) and Done** in the Player and the editors use the same Back: the Player opened from a
   lesson returns to the lesson; the editor opened from the Player returns to the Player.
