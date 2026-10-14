import { definePiece } from '../../model/types'

export default definePiece({
  id: 'letom',
  kind: 'song',
  title: 'Так уж бывает летней порой',
  titleEn: 'So it happens in summertime',
  source: { book: 'called-to-play-2', page: 44 },
  key: 'Em',
  meter: '6/8',
  tempo: 56,
  pattern: 'M1',
  sections: [
    { kind: 'verse', n: 1, lines: ['Em:inv Am:4', 'B:inv Em:4', 'Em:5.1 Am:inv', 'D:t5 G:oct-E'] },
    { kind: 'chorus', lines: ['Am:6u D:6d', 'G:4 C:t2', 'Am:t3 Em:t1', 'B:3 Em:inv'] },
    { kind: 'verse', n: 2, lines: ['Em:4 Am:t3', 'B:4 Em:oct', 'Em:ch Am:inv', 'D:6u G:t4'] },
  ],
})
