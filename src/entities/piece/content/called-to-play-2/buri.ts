import { definePiece } from '../../model/types'

export default definePiece({
  id: 'buri',
  kind: 'song',
  title: 'Если в бурях жизни дух твой удручён',
  titleEn: 'Count Your Blessings',
  source: { book: 'called-to-play-2', page: 29 },
  key: 'C',
  meter: '4/4',
  tempo: 84,
  pattern: 'M1',
  note: {
    en: 'The octaves at the end of each verse are marked “x 1”: play them once. The sixths in the chorus are marked “melody”: they follow the tune.',
    ru: 'Октавы в конце каждого куплета помечены «x 1»: их играют один раз. Сексты в припеве помечены «melody»: они идут за мелодией.',
  },
  sections: [
    { kind: 'verse', n: 1, lines: ['C:3 Dm:t3', 'G:5.1 C:6u', 'C:4 Dm:6d', 'G:t5 G:3-C:oct'] },
    { kind: 'chorus', lines: ['C:4 Dm:inv', 'G:ch C:t2', 'C:2-F G7:5-C', 'C:6u-F G7 C:3'] },
    { kind: 'verse', n: 2, lines: ['C:t1 Dm:5.2', 'G:4 C:t3', 'C:inv Dm:t4', 'G:3ch G:3-C:oct'] },
  ],
})
