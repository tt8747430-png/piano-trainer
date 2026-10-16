/** What Learn shows (ADR 0053): the Lessons' journeys or the Courses, as its header's toggle says. */
export const LEARN_VIEWS = ['lessons', 'courses'] as const
export type LearnShows = (typeof LEARN_VIEWS)[number]

/** Learn's view in its URL: what it shows and, on the Lessons, the journey ('' for the current one). */
export interface LearnView {
  readonly view: LearnShows
  readonly journey: string
}

export const LEARN_DEFAULTS: LearnView = { view: 'lessons', journey: '' }
