import type { Collection } from '../../model/types'
import voiCanta from './voi-canta'

const worship: Collection = {
  id: 'worship',
  name: { en: 'Worship songs', ru: 'Песни прославления' },
  entries: [voiCanta],
}

export default worship
