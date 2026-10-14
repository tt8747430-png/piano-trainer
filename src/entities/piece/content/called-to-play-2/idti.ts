import { definePiece } from '../../model/types'

export default definePiece({
  id: 'idti',
  kind: 'song',
  title: 'Я хочу за Тобою идти',
  titleEn: 'I want to follow You',
  source: { book: 'called-to-play-2', page: 16 },
  key: 'Em',
  meter: '6/8',
  tempo: 56,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Em:3 B:t1', 'B:4 Em:t3', 'Am:2 Em:3', 'B7:5 Em:t4'] },
    { kind: 'chorus', lines: ['Em:4 B:t1', 'B:t2 Em:3', 'Am7:5 Em:t3', 'B:2 Em:3'] },
  ],
})
