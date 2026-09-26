import { definePiece } from '../../model/types'

export default definePiece({
  id: 'res1',
  kind: 'progression',
  title: 'V9 → IMaj9',
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 'block',
  chordSize: { default: 'ninths', choosable: true },
  progression: 'V:dom:4 I:maj:4',
  note: {
    en: 'Resolving into major, option 1: a plain 9 on the dominant. Smooth and bright.',
    ru: 'Разрешение в мажор, вариант 1: простая нона на доминанте. Мягко и светло.',
  },
})
