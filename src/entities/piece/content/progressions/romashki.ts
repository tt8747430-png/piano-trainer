import { definePiece } from '../../model/types'

export default definePiece({
  id: 'romashki',
  kind: 'progression',
  title: 'Ромашковые поля',
  titleEn: 'Daisy fields',
  key: 'Dm',
  meter: '4/4',
  tempo: 72,
  pattern: 'pop8',
  chordSize: { default: 'sevenths', choosable: true },
  progression:
    'i:min:2 iv:min:2 ♭VII:=sus2:1 ♭VII:dom:1 ♭III:maj:1 I:domb9:1 iv:min:2 i:min:2/3 ii:hd:2 V:=sus4:1 V:domb9:1',
  note: {
    en: 'The chorus from the course. With 9ths, D7 becomes D7♭9 into Gm9, as in the course.',
    ru: 'Припев из курса. С нонаккордами D7 становится D7♭9 перед Gm9, как в курсе.',
  },
})
