import { definePiece } from '../../model/types'

export default definePiece({
  id: 'molitva',
  kind: 'song',
  title: 'О молитва, о молитва!',
  titleEn: 'O prayer, O prayer!',
  source: { book: 'called-to-play-2', page: 6 },
  key: 'Em',
  meter: '4/4',
  tempo: 76,
  pattern: 'M5',
  note: {
    en: 'Lesson 1’s song: its chorus is in 7th chords. Way 5 is printed once over the chorus and holds until way 2.',
    ru: 'Песня урока 1: припев идёт септаккордами. Вид 5 напечатан один раз над припевом и держится до вида 2.',
  },
  sections: [
    { kind: 'verse', lines: ['Em:3 Am:t3', 'Em:2-B Em:t2', 'Em:5.2 Am:5.3', 'Em:3-B Em:2-E'] },
    {
      kind: 'chorus',
      lines: ['Am7:5-D7 Gmaj7-Em7', 'Am7-B7 Em7-E7', 'Am7-D7 Gmaj7-Cmaj7', 'Am:2-B Em:3ch'],
    },
  ],
})
