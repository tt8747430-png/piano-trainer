import { isOneOf } from '@/shared/lib'

/** Learn's two views (ADR 0049): the Path's levels as a journey, or every module as a course. */
export const LEARN_VIEWS = ['journey', 'courses'] as const
export type LearnViewName = (typeof LEARN_VIEWS)[number]
export const isLearnView = isOneOf(LEARN_VIEWS)

/** Learn's URL: the view shown. */
export interface LearnView {
  readonly view: LearnViewName
}
