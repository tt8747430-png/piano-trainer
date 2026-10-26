import { definePiece } from '../../model/types'

export default definePiece({
  id: 'london-bridge',
  kind: 'song',
  title: 'London Bridge',
  titleRu: 'Лондонский мост',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 108,
  pattern: 'block',
  sections: [{ kind: 'verse', lines: ['C C G7 C', 'C C G7 C'] }],
  staves: [
    {
      notes:
        'G4/1.5 A4/.5 G4/1 F4/1 | E4/1 F4/1 G4/2 | D4/1 E4/1 F4/2 | E4/1 F4/1 G4/2 | G4/1.5 A4/.5 G4/1 F4/1 | E4/1 F4/1 G4/2 | D4/2 G4/2 | E4/1 C4/3',
    },
  ],
})
