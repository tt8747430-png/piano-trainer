import { definePiece } from '../../model/types'

export default definePiece({
  id: 'vboge',
  kind: 'song',
  title: 'В Боге одном лишь душа найдет',
  titleEn: 'In God alone the soul will find',
  source: { book: 'called-to-play-2', page: 28 },
  key: 'Gm',
  meter: '6/8',
  tempo: 54,
  pattern: 'M1',
  note: {
    en: 'Lesson 4 gives this song with no ways, for a plan of your own; this is lesson 7’s. Its 2nd verse marks the sixths over F “melody”: they follow the tune.',
    ru: 'В уроке 4 эта песня дана без видов, для собственного плана; здесь план урока 7. Во 2-м куплете сексты над F помечены «melody»: они идут за мелодией.',
  },
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: [
        'Gm:3 Cm:4',
        'D:t1 Gm:4',
        'Gm:5.1 Cm:5.1 D:4 Gm:6u',
        'F:t5 Bb:inv',
        'G:5.1 Cm:4',
        'D:3 Eb:t1 D:3 Gm:3',
      ],
    },
    {
      kind: 'verse',
      n: 2,
      lines: [
        'Gm:inv Cm:t3',
        'D:4 Gm:t2',
        'Gm:2 Cm:2 D:3 Gm:oct',
        'F:6u Bb:6u',
        'G:6u Cm:6u',
        'D:3 Eb:t1 D:3 Gm:t4',
      ],
    },
  ],
})
