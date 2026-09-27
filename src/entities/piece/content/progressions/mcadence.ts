import { definePiece } from '../../model/types'

export default definePiece({
  id: 'mcadence',
  kind: 'progression',
  title: 'i–iv–V–i',
  key: 'Am',
  meter: '4/4',
  tempo: 72,
  pattern: 'block',
  chordSize: { default: 'triads', choosable: true },
  progression: 'i:min:4 iv:min:4 V:domb9:4 i:min:4',
  note: {
    en: 'The minor cadence: the dominant is major, from harmonic minor, and leads home.',
    ru: 'Минорная каденция: доминанта мажорная, из гармонического минора, и ведёт к тонике.',
  },
})
