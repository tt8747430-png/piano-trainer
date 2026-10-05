import type { Collection } from '../../model/types'
import romashki from './romashki'

/** Songs from outside the songbooks: a course's, a learner's request. */
const other: Collection = {
  id: 'other',
  name: { en: 'Other songs', ru: 'Другие песни' },
  entries: [romashki],
}

export default other
