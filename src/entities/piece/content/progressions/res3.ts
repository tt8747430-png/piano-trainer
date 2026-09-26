import { definePiece } from '../../model/types'

export default definePiece({
  id: 'res3',
  kind: 'progression',
  title: 'V7♭9 → im9',
  key: 'Gm',
  meter: '4/4',
  tempo: 72,
  pattern: 'block',
  chordSize: { default: 'ninths', choosable: false },
  progression: 'V:=b9:4 i:min:4',
  note: {
    en: 'Into minor, use the ♭9 right away. The top four notes of V7♭9 form a diminished 7th chord.',
    ru: 'В минор используйте ♭9 сразу. Четыре верхних звука V7♭9 образуют уменьшённый септаккорд.',
  },
})
