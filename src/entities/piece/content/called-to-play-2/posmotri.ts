import { definePiece } from '../../model/types'

export default definePiece({
  id: 'posmotri',
  kind: 'song',
  title: 'Посмотри ты на Христа',
  titleEn: 'Look to Christ',
  source: { book: 'called-to-play-2', page: 17 },
  key: 'Cm',
  meter: '6/8',
  tempo: 56,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Cm:3 Fm:5', 'G:t1 Cm:t2', 'Cm:t3 Fm:4', 'G:3 Cm:t4'] },
    {
      kind: 'chorus',
      lines: [
        'Cm:3 Fm:4 Bb:5 Eb:4',
        'Ab:t1 Fm:t2 G:3 Cm:t4',
        'Cm:3 Fm:5 Bb:4 Eb:2',
        'Ab:5 Fm:4 G:t1 Cm:t3',
        'Cm:5 Fm:4 Bb:2 Eb:4',
        'Ab:t1 Fm:t2 G:3 Cm:3',
      ],
    },
  ],
})
