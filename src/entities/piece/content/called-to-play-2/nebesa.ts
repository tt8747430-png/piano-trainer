import { definePiece } from '../../model/types'

export default definePiece({
  id: 'nebesa',
  kind: 'song',
  title: 'Твои небеса и Твоя земля',
  titleEn: 'Yours are the heavens, Yours the earth',
  source: { book: 'called-to-play-2', page: 47 },
  key: 'Am',
  meter: '6/8',
  tempo: 56,
  pattern: 'M1',
  note: {
    en: 'An exam song: no ways are printed, the plan is yours, for two verses, with an intro and an ending.',
    ru: 'Экзаменационная песня: виды не напечатаны, план нужно составить самому, на два куплета, со вступлением и окончанием.',
  },
  sections: [
    { kind: 'verse', n: 1, lines: ['Am Dm', 'G C', 'Am Dm', 'F7 E7'] },
    { kind: 'chorus', lines: ['Am Dm E Am', 'Dm Am E F', 'Dm Am E Am'] },
    { kind: 'verse', n: 2, lines: ['Am Dm', 'G C', 'Am Dm', 'F7 E7'] },
  ],
})
