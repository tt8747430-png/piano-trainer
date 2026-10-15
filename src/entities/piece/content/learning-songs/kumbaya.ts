import { definePiece } from '../../model/types'

export default definePiece({
  id: 'kumbaya',
  kind: 'song',
  title: 'Kumbaya',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '3/4',
  tempo: 66,
  pattern: 'ballad',
  sections: [
    {
      kind: 'verse',
      lines: ['C@1 C@2-F@1 C C@2-F@1 G@2-C@1', 'C@2-F@1 C@2-F@1 C@1-G7@1-C@1 C'],
    },
  ],
  melody:
    'C4/.5 E4/.5 | G4/.75 G4/.25 G4/1 A4/.5 A4/.5 | G4/2 C4/.5 E4/.5 | G4/.75 G4/.25 G4/1 F4/.5 E4/.5 | D4/2 C4/.5 E4/.5 | G4/.75 G4/.25 G4/1 A4/.5 A4/.5 | G4/2 F4/1 | E4/.5 C4/.5 D4/.5 D4/.5 C4/3',
})
