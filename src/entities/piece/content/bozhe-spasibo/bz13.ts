import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz13',
  kind: 'song',
  title: 'Он избит, обезображен, умирает на кресте',
  titleEn: 'Stricken, smitten and afflicted',
  credits: [
    { role: 'words', names: 'Thomas Kelly' },
    { role: 'music', names: 'Geistliche Volkslieder' },
  ],
  source: { book: 'bozhe-spasibo', number: 13, page: 36 },
  key: 'Fm',
  meter: '3/4',
  tempo: 88,
  pattern: 'r2',
  note: {
    en: 'Each line ends on Csus4 → C7, and that move is the cadence. Hold the 4th of Csus4, then let it fall to the 3rd of C7.',
    ru: 'Каждая строка заканчивается на Csus4 → C7: так звучит каденция. Задержите кварту Csus4, затем дайте ей опуститься в терцию C7.',
  },
  sections: [
    {
      kind: 'verse',
      lines: [
        'Fm Cm/Eb Db@1-Bbm@1-Csus4@.5-C7@.5 Fm',
        'Fm Cm/Eb Db@1-Bbm@1-Csus4@.5-C7@.5 Fm',
        'Ab@2-Adim@1 Bbm@2-Edim@1 Fm@2-Bdim@1 Csus4@2-C7@1',
        'Fm Gdim Fm/Ab@1-Bbm@1-Csus4@.5-C7@.5 Fm',
      ],
    },
  ],
})
