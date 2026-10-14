import { definePiece } from '../../model/types'

export default definePiece({
  id: 'nuzhdayus',
  kind: 'song',
  title: 'Я нуждаюсь в Тебе, мой Спаситель',
  titleEn: 'I need You, my Saviour',
  source: { book: 'called-to-play-2', page: 42 },
  key: 'Em',
  meter: '6/8',
  tempo: 56,
  pattern: 'M1',
  sections: [
    { kind: 'verse', n: 1, lines: ['Em:3 Am:inv', 'B:5.1 Em:3', 'Em:inv Am:t3', 'B:t1 Em:6u'] },
    { kind: 'chorus', lines: ['Em:4 Am:ch D:t5 G:t2', 'Am:4 Em:t1 B:5.1 Em:3'] },
    { kind: 'verse', n: 2, lines: ['Em:6u Am:6u', 'B:5.1 Em:6d', 'Em:3 Am:t3', 'B:inv Em:oct'] },
  ],
})
