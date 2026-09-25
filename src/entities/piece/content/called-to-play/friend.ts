import { definePiece } from '../../model/types'

export default definePiece({
  id: 'friend',
  kind: 'song',
  title: 'What a Friend We Have in Jesus',
  source: { book: 'called-to-play' },
  key: 'F',
  meter: '4/4',
  tempo: 76,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['F:3 Bb:2', 'F:1 C:4', 'F:3 Bb:1', 'F-C:5 F:4'] },
    { kind: 'chorus', lines: ['C:5 F:5', 'Bb-F:5 C:4', 'F:3 Bb:4', 'F-C:2 F:3'] },
  ],
})
