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
    en: 'An exam song: no ways are printed, the plan is yours, for two verses, with an intro and an ending. The chorus repeats, written out; its last E7 comes home to Am.',
    ru: 'Экзаменационная песня: виды не напечатаны, план нужно составить самому, на два куплета, со вступлением и окончанием. Припев повторяется и выписан дважды; последний E7 приходит в Am.',
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
