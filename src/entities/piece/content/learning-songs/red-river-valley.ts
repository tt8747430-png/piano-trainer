import { definePiece } from '../../model/types'

export default definePiece({
  id: 'red-river-valley',
  kind: 'song',
  title: 'Red River Valley',
  titleRu: 'Долина Красной реки',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 100,
  pattern: 'country',
  sections: [
    { kind: 'verse', lines: ['C@2 C C-G7 C C', 'C C G7 G7'] },
    { kind: 'chorus', lines: ['C C7 F F', 'G7 G7 C C'] },
  ],
  melody:
    'G3/1 C4/1 | E4/2 E4/1 E4/1 | E4/2 D4/1 E4/1 | D4/1 C4/5 G3/1 C4/1 | E4/2 C4/1 E4/1 | G4/2 F4/1 E4/1 | D4/6 G4/1 F4/1 | E4/2 E4/1 D4/1 | C4/2 D4/1 E4/1 | G4/1 F4/5 A3/1 A3/1 | G3/2 B3/1 C4/1 | D4/2 E4/1 D4/1 | C4/6',
})
