import type { Collection } from '../../model/types'
import ex3 from './ex3'
import exm1 from './exm1'
import exm2 from './exm2'
import exm3 from './exm3'
import ex5 from './ex5'
import ex6 from './ex6'
import ex7 from './ex7'
import ex8 from './ex8'
import ex9 from './ex9'

const exercises: Collection = {
  id: 'exercises',
  name: { en: 'Exercises', ru: 'Упражнения' },
  entries: [ex3, exm1, exm2, exm3, ex5, ex6, ex7, ex8, ex9],
}

export default exercises
