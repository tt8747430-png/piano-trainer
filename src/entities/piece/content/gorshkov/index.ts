import type { Collection } from '../../model/types'
import metel from './metel'
import olen from './olen'
import romashki from './romashki'

/** The songs of Vasily Gorshkov's accompaniment course, in the order its lessons teach on them. */
const gorshkov: Collection = {
  id: 'gorshkov',
  name: { en: 'Gorshkov’s songs', ru: 'Песни курса Горшкова' },
  entries: [romashki, olen, metel],
}

export default gorshkov
