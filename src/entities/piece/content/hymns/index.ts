import type { Collection } from '../../model/types'
import otche from './otche'
import ode from './ode'
import silent from './silent'
import amazing from './amazing'
import wonderful from './wonderful'

const hymns: Collection = {
  id: 'hymns',
  name: { en: 'Hymns', ru: 'Гимны' },
  entries: [otche, ode, silent, amazing, wonderful],
}

export default hymns
