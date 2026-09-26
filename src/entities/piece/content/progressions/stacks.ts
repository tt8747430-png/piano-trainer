import { definePiece } from '../../model/types'

export default definePiece({
  id: 'stacks',
  kind: 'progression',
  title: 'Stack Your Chords',
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 'block',
  chordSize: { default: 'triads', choosable: false },
  progression:
    'I:=maj:4 iv:=m7:1 i:=m7:1 v:=m7:1 ii:=m7:1 vi:=m7:4 ♭VI:=maj:1 ♭III:=maj:1 ♭VII:=maj:1 IV:=maj:1',
  note: {
    en: 'Four m7 chords move clockwise around the circle of fifths, then four major chords lead back home. Take it through all 12 keys.',
    ru: 'Четыре аккорда m7 идут по кварто-квинтовому кругу по часовой стрелке, затем четыре мажорных аккорда возвращают домой. Пройдите её во всех 12 тональностях.',
  },
})
