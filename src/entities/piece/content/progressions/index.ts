import type { Collection } from '../../model/types'
import flow from './flow'
import pop from './pop'
import twofive from './twofive'
import minor251 from './minor251'
import res1 from './res1'
import res2 from './res2'
import res3 from './res3'
import blues from './blues'
import stacks from './stacks'
import romashki from './romashki'

const progressions: Collection = {
  id: 'progressions',
  name: { en: 'Progressions', ru: 'Последовательности аккордов' },
  entries: [flow, pop, twofive, minor251, res1, res2, res3, blues, stacks, romashki],
}

export default progressions
