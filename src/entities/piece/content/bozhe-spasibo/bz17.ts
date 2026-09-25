import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz17',
  kind: 'song',
  title: 'Сколько раз Мне тебя прощать',
  titleEn: 'How many times must I forgive you',
  credits: [
    { role: 'words', names: 'Владимир Шариков' },
    { role: 'music', names: 'Виктор Лобода' },
  ],
  source: { book: 'bozhe-spasibo', number: 17, page: 50 },
  key: 'Cm',
  meter: '4/4',
  tempo: 72,
  pattern: 'r4',
  note: {
    en: 'Fm/D is an F minor chord over D in the bass: the same notes as Dm7♭5.',
    ru: 'Fm/D — фа-минорный аккорд над басом ре: те же звуки, что в Dm7♭5.',
  },
  sections: [
    {
      kind: 'verse',
      lines: [
        'Cm Fm/D-G Fm/D@2-Gsus4@1-G7@1 Cm',
        'Cm Bbm@1-C7@1-Fm@2 Fm/D-Cm/Eb Fm@1-G7@1-Cm@2',
        'Fm-G Cm Fm-Bb Eb-C/E',
        'Fm-G Cm-Ab Fm@1-Fm/D@1-G@2 Bbm-C7',
        'Fm-G Cm-Ab Fm/D-G Cm',
      ],
    },
    {
      kind: 'verse',
      n: 4,
      detail: { en: 'and ending', ru: 'и окончание' },
      lines: [
        'Cm Fm/D-G Fm/D@2-Gsus4@1-G7@1 Cm',
        'Cm Bbm@1-C7@1-Fm@2 Fm/D-Cm/Eb Fm@1-G7@1-Ab@2',
        'Fm/D-Cm/Eb Fm-G7 Cm Cm',
        'Cm Fm/D-G Cm',
      ],
    },
  ],
})
