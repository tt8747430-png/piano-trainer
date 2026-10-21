import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ode',
  kind: 'song',
  title: 'Ode to Joy',
  titleRu: 'Ода к радости',
  credits: [{ role: 'music', names: 'Beethoven' }],
  key: 'C',
  meter: '4/4',
  tempo: 100,
  pattern: 'r7',
  note: {
    en: 'A good first tune to play with both hands.',
    ru: 'Хорошая первая мелодия для игры двумя руками.',
  },
  sections: [
    { kind: 'part', label: 'A', lines: ['C G', 'C G'] },
    { kind: 'part', label: 'A', lines: ['C G', 'C G-C'] },
    { kind: 'part', label: 'B', lines: ['G G-C', 'G C-G'] },
    { kind: 'part', label: 'A', lines: ['C G', 'C G-C'] },
  ],
  melody:
    'E4/1 E4/1 F4/1 G4/1 | G4/1 F4/1 E4/1 D4/1 | C4/1 C4/1 D4/1 E4/1 | E4/1.5 D4/.5 D4/2 | E4/1 E4/1 F4/1 G4/1 | G4/1 F4/1 E4/1 D4/1 | C4/1 C4/1 D4/1 E4/1 | D4/1.5 C4/.5 C4/2 | D4/1 D4/1 E4/1 C4/1 | D4/1 E4/.5 F4/.5 E4/1 C4/1 | D4/1 E4/.5 F4/.5 E4/1 D4/1 | C4/1 D4/1 G3/2 | E4/1 E4/1 F4/1 G4/1 | G4/1 F4/1 E4/1 D4/1 | C4/1 C4/1 D4/1 E4/1 | D4/1.5 C4/.5 C4/2',
})
