import { definePiece } from '../../model/types'

export default definePiece({
  id: 'kryl',
  kind: 'song',
  title: 'Буду жить под защитой Твоих крыл',
  titleEn: 'I will live under the shelter of Your wings',
  source: { book: 'called-to-play-2', page: 32 },
  key: 'Em',
  meter: '4/4',
  tempo: 80,
  pattern: 'M5',
  note: {
    en: 'Lesson 8 asks for way 5 throughout, each chord joined to the next by its nearest notes, then a plan of your own. The chorus is written out twice: its E7 leads back into it.',
    ru: 'Урок 8 просит играть всё 5-м видом, соединяя аккорды через ближайшие звуки, а затем составить свой план. Припев выписан дважды: E7 ведёт к его повтору.',
  },
  sections: [
    { kind: 'verse', lines: ['Em:5 C:5', 'D:5 B:5.1', 'Em:5 Am:5', 'B:5.1 Em:5'] },
    { kind: 'chorus', lines: ['E7 Am7-D7 G-C', 'Am7-B7 Em-E7', 'Am7-D7 G-C', 'Am7-B7 Em'] },
  ],
})
