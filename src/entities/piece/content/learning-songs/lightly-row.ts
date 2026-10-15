import { definePiece } from '../../model/types'

export default definePiece({
  id: 'lightly-row',
  kind: 'song',
  title: 'Lightly Row',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 100,
  pattern: 'block',
  note: {
    en: 'The German children’s song «Hänschen klein».',
    ru: 'Немецкая детская песенка «Hänschen klein».',
  },
  sections: [
    { kind: 'part', label: 'A', lines: ['C G7 C C', 'C G7 C C'] },
    { kind: 'part', label: 'B', lines: ['G G7 C C', 'C G7 C C'] },
  ],
  melody:
    'G4/1 E4/1 E4/2 | F4/1 D4/1 D4/2 | C4/1 D4/1 E4/1 F4/1 | G4/1 G4/1 G4/2 | G4/1 E4/1 E4/2 | F4/1 D4/1 D4/2 | C4/1 E4/1 G4/1 G4/1 | C4/4 | D4/1 D4/1 D4/1 D4/1 | D4/1 E4/1 F4/2 | E4/1 E4/1 E4/1 E4/1 | E4/1 F4/1 G4/2 | G4/1 E4/1 E4/2 | F4/1 D4/1 D4/2 | C4/1 E4/1 G4/1 G4/1 | C4/4',
})
