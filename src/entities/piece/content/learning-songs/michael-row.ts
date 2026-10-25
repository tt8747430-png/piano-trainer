import { definePiece } from '../../model/types'

export default definePiece({
  id: 'michael-row',
  kind: 'song',
  title: 'Michael, Row the Boat Ashore',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 100,
  pattern: 'gospel',
  sections: [{ kind: 'verse', lines: ['C@2 C C F C', 'C G7 C@2-G7@2 C'] }],
  staves: [
    {
      notes:
        'C4/1 E4/1 | G4/1.5 E4/.5 G4/1 A4/1 | G4/2 E4/1 G4/1 | A4/4 | G4/1 r/1 E4/1 G4/1 | G4/1.5 E4/.5 F4/1 E4/1 | D4/2 C4/1 D4/1 | E4/2 D4/2 | C4/2',
    },
  ],
})
