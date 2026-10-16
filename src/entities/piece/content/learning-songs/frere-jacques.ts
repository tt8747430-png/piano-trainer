import { definePiece } from '../../model/types'

export default definePiece({
  id: 'frere-jacques',
  kind: 'song',
  title: 'Frère Jacques',
  titleEn: 'Brother John',
  titleRu: 'Братец Якоб',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 100,
  pattern: 'block',
  note: {
    en: 'A round: a second voice starts the tune when the first reaches bar 3.',
    ru: 'Канон: второй голос начинает мелодию, когда первый доходит до третьего такта.',
  },
  sections: [{ kind: 'verse', lines: ['C C C C', 'C C C@1-G@1-C@2 C@1-G@1-C@2'] }],
  melody:
    'C4/1 D4/1 E4/1 C4/1 | C4/1 D4/1 E4/1 C4/1 | E4/1 F4/1 G4/2 | E4/1 F4/1 G4/2 | G4/.5 A4/.5 G4/.5 F4/.5 E4/1 C4/1 | G4/.5 A4/.5 G4/.5 F4/.5 E4/1 C4/1 | C4/1 G3/1 C4/2 | C4/1 G3/1 C4/2',
})
