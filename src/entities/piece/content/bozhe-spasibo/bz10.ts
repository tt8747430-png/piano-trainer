import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz10',
  kind: 'song',
  title: 'Белоснежные одежды',
  titleEn: 'Snow-white robes',
  credits: [
    { role: 'words', names: 'Л. Татаренко' },
    { role: 'music', names: 'М. Мельничук' },
  ],
  source: { book: 'bozhe-spasibo', number: 10, page: 30 },
  key: 'Dm',
  meter: '4/4',
  tempo: 76,
  pattern: 'r4',
  sections: [
    {
      kind: 'verse',
      lines: [
        'Dm C Gm Gm/E@2-Asus4@1-A7@1',
        'Dm@1-Edim@1-Dm/F@2 F#dim-Gm Gm/E-Dm/F Gm/E-Asus4',
        'A7@2',
      ],
    },
    {
      kind: 'chorus',
      detail: { en: 'in 2/4', ru: 'на 2/4' },
      lines: [
        'Dm@1-Edim@1 Dm/F@1-F#dim@1 Gm@2 Gm@2',
        'C@2 C@2 F@2 Asus4@1-A7@1',
        'Dm@1-Edim@1 Dm/F@1-F#dim@1 Gm@2 Edim@2',
        'Asus4@2 A@2',
      ],
    },
    { kind: 'ending', lines: ['Dm Dm'] },
  ],
})
