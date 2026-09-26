import { definePiece } from '../../model/types'

export default definePiece({
  id: 'pop',
  kind: 'progression',
  title: 'I–V–vi–IV',
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'pop8',
  chordSize: { default: 'triads', choosable: true },
  progression: 'I:maj:4 V:dom:4 vi:min:4 IV:maj:4',
  note: {
    en: 'The most common pop progression.',
    ru: 'Самая распространённая последовательность в поп-музыке.',
  },
})
