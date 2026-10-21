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
    en: 'The song of lesson 1. Its chorus is played in 7th chords. Way 5 is printed once over the chorus and holds until way 2 appears.',
    ru: 'Песня урока 1. Припев играется септаккордами. Вид 5 напечатан над припевом один раз и действует до появления вида 2.',
  },
  sections: [
    { kind: 'verse', lines: ['Em:3 Am:t3', 'Em:2-B Em:t2', 'Em:5.2 Am:5.3', 'Em:3-B Em:2-E'] },
    {
      kind: 'chorus',
      lines: ['Am7:5-D7 Gmaj7-Em7', 'Am7-B7 Em7-E7', 'Am7-D7 Gmaj7-Cmaj7', 'Am:2-B Em:3ch'],
    },
  ],
})
