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
  progression: [
    {
      kind: 'verse',
      lines: [
        'i:min:4 iv:min:2 V:=sus4:2 i:min:4',
        'iv:=min:2 ♭VII:=sus4:2 v:=min:2 I:=maj:2 I:=maj:2/3 iv:=min:2',
        '♭VII:=sus4:1 ♭VII:=maj:1 ♭III:=maj:2 ♭VI:=maj:2 iv:=min:2',
        'ii:hd:4 V:=sus4:2 V:=maj:2',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'i:min:2 iv:min:2 ♭VII:=sus2:1 ♭VII:=maj:1 ♭III:maj:1 I:domb9:1',
        'iv:min:2 i:=min:2/3 ii:hd:2 V:=sus4:1 V:=maj:1',
      ],
    },
    {
      kind: 'chorus',
      last: true,
      lines: [
        'i:min:2 iv:min:2 ♭VII:=sus2:1 ♭VII:=maj:1 ♭III:maj:1 I:domb9:1',
        'iv:min:2 i:=min:2/3 ii:hd:1 V:=maj:1 i:=m6:2',
      ],
    },
  ],
  note: {
    en: 'From Vasily Gorshkov’s accompaniment course, the chorus written out twice: with its 1st ending, then its 2nd. With 9ths only the 7th chords grow, as the course teaches: Dm9, Gm9, FMaj9, and D7♭9 into Gm.',
    ru: 'Из курса по аккомпанементу Василия Горшкова; припев выписан дважды: с первой вольтой, затем со второй. С нонаккордами растут только септаккорды, как учит курс: Dm9, Gm9, FMaj9 и D7♭9 перед Gm.',
  },
})
