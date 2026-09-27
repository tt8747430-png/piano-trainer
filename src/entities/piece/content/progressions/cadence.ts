import { definePiece } from '../../model/types'

export default definePiece({
  id: 'cadence',
  kind: 'progression',
  title: 'I–IV–V–I',
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'block',
  chordSize: { default: 'triads', choosable: true },
  progression: 'I:maj:4 IV:maj:4 V:dom:4 I:maj:4',
  note: {
    en: 'The authentic cadence: home, away to the subdominant and the dominant, and home.',
    ru: 'Полная каденция: тоника, субдоминанта, доминанта и снова тоника.',
  },
})
