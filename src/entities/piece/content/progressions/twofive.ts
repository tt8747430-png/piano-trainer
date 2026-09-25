import { definePiece } from '../../model/types'

export default definePiece({
  id: 'twofive',
  kind: 'progression',
  title: 'ii–V–I',
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'jazz',
  voicing: { default: 'sevenths', choosable: true },
  progression: 'ii:min:4 V:dom:4 I:maj:8',
  note: {
    en: 'The basic jazz cadence. With 9ths: m9 → 9 → Maj9.',
    ru: 'Основная джазовая каденция. С нонаккордами: m9 → 9 → Maj9.',
  },
})
