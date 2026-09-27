import { definePiece } from '../../model/types'

export default definePiece({
  id: 'minorpop',
  kind: 'progression',
  title: 'i–VI–III–VII',
  key: 'Am',
  meter: '4/4',
  tempo: 72,
  pattern: 'pop8',
  chordSize: { default: 'triads', choosable: true },
  progression: 'i:min:4 bVI:maj:4 bIII:maj:4 bVII:dom:4',
  note: {
    en: 'The minor-key loop of pop and rock ballads.',
    ru: 'Минорный круг поп- и рок-баллад.',
  },
})
