import { definePiece } from '../../model/types'

export default definePiece({
  id: 'prostil',
  kind: 'song',
  title: 'Когда Христос меня простил',
  titleEn: 'Where Jesus Is, ’Tis Heaven',
  source: { book: 'called-to-play-2', page: 46 },
  key: 'Am',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  note: {
    en: 'An exam song. No ways are printed, so the plan is yours: two verses, with an intro and an ending. The chorus repeats and is written out twice; its last E7 resolves to Am.',
    ru: 'Экзаменационная песня. Виды не напечатаны, план составляете вы сами: два куплета, вступление и окончание. Припев повторяется и выписан дважды; последний E7 разрешается в Am.',
  },
  sections: [
    { kind: 'verse', n: 1, lines: ['C C', 'Am Am', 'Dm Dm', 'F E'] },
    {
      kind: 'chorus',
      lines: ['Am Dm', 'G C-E7', 'Am Dm', 'F E7', 'Am Dm', 'G C-E7', 'Am Dm', 'F E7 Am'],
    },
    { kind: 'verse', n: 2, lines: ['C C', 'Am Am', 'Dm Dm', 'F E'] },
  ],
})
