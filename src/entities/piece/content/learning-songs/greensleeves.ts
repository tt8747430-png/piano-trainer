import { definePiece } from '../../model/types'

export default definePiece({
  id: 'greensleeves',
  kind: 'song',
  title: 'Greensleeves',
  titleRu: 'Зелёные рукава',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'Am',
  meter: '3/4',
  tempo: 96,
  pattern: 'block',
  sections: [
    { kind: 'verse', lines: ['Am@1 Am C G Em', 'Am Am E Am', 'Am C G Em', 'Am E Am Am'] },
    { kind: 'chorus', lines: ['C C G Em', 'Am Am E C', 'C C G Em', 'Am E Am Am'] },
  ],
  melody:
    'A4/1 | C5/2 D5/1 | E5/1.5 F5/.5 E5/1 | D5/2 B4/1 | G4/1.5 A4/.5 B4/1 | C5/2 A4/1 | A4/1.5 G#4/.5 A4/1 | B4/2 G#4/1 | E4/2 A4/1 | C5/2 D5/1 | E5/1.5 F5/.5 E5/1 | D5/2 B4/1 | G4/1.5 A4/.5 B4/1 | C5/1.5 B4/.5 A4/1 | G#4/1.5 F#4/.5 G#4/1 | A4/5 r/1 | G5/4.5 F#5/.5 E5/1 | D5/2 B4/1 | G4/1.5 A4/.5 B4/1 | C5/2 A4/1 | A4/1.5 G#4/.5 A4/1 | B4/2 G#4/1 | E4/3 | G5/4.5 F#5/.5 E5/1 | D5/2 B4/1 | G4/1.5 A4/.5 B4/1 | C5/2 A4/1 | G#4/1.5 F#4/.5 G#4/1 | A4/5',
})
