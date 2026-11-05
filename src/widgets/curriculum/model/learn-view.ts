/** What Learn shows (ADR 0053): the Lessons' journeys or the Courses, as its header's toggle says. */
export const LEARN_VIEWS = ['lessons', 'courses'] as const
export type LearnShows = (typeof LEARN_VIEWS)[number]

/**
 * Learn's view in its URL: what it shows, on the Lessons the journey ('' for the current one), and
 * whether an editor has it in Edit mode (R29 B4: the level's or the shelves', in place).
 */
export interface LearnView {
  readonly view: LearnShows
  readonly journey: string
  readonly edit: boolean
}

export const LEARN_DEFAULTS: LearnView = { view: 'lessons', journey: '', edit: false }

/** The Lessons' fifth chip, after the levels (R30-5): Your lessons, the learner's own. */
export const OWN_LESSONS = 'own'
