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
    en: 'Lesson 8 asks you to play way 5 all through, joining each chord to the next by its nearest notes. After that, make a plan of your own. The chorus is written out twice, because its E7 leads back into it.',
    ru: 'Урок 8 просит сыграть всю песню 5-м видом, соединяя каждый аккорд со следующим через ближайшие звуки. После этого составьте свой план. Припев выписан дважды: его E7 ведёт к повтору.',
  },
  sections: [
    { kind: 'verse', lines: ['Em:5 C:5', 'D:5 B:5.1', 'Em:5 Am:5', 'B:5.1 Em:5'] },
    { kind: 'chorus', lines: ['E7 Am7-D7 G-C', 'Am7-B7 Em-E7', 'Am7-D7 G-C', 'Am7-B7 Em'] },
  ],
})
