import { isLearnView, type LearnView } from '@/pages/learn'
import { routeSearch, type Raw } from './read-search'

// Learn (ADR 0049): its view, the Journey unless the URL names Courses.
const LEARN_DEFAULTS: LearnView = { view: 'journey' }

export const readLearnSearch = (raw: Raw): LearnView => ({
  view: isLearnView(raw.view) ? raw.view : LEARN_DEFAULTS.view,
})
export const learnSearch = routeSearch(readLearnSearch, LEARN_DEFAULTS)
