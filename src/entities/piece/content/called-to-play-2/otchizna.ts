import { definePiece } from '../../model/types'

export default definePiece({
  id: 'otchizna',
  kind: 'song',
  title: 'В небесах моя отчизна',
  titleEn: 'My homeland is in heaven',
  source: { book: 'called-to-play-2', page: 9 },
  key: 'Em',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  sections: [
    { kind: 'verse', n: 1, lines: ['Em:3 Am:t3 B:t1 Em:4', 'Em:6u Am:6d B:5.1 Em:t4'] },
    { kind: 'chorus', lines: ['Em:5-E7 Am:ch', 'D:octs G:5-B7', 'Em:4 Am:5.2', 'B:t1 Em:3ch'] },
    { kind: 'verse', n: 2, lines: ['Em:5.2 Am:5.3 B:t2 Em:6d', 'Em:t5 Am:inv B:ch Em:oct'] },
  ],
})
