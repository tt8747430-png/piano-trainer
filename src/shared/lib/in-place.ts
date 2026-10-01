/**
 * A navigation that changes the screen in place: a choice on it, or a link to the view beside it. It
 * replaces the history entry, so Back leaves the screen, and keeps the scroll where the learner is.
 */
export const IN_PLACE = { replace: true, resetScroll: false } as const
