import { definePiece } from '../../model/types'

export default definePiece({
  id: 'amazing',
  kind: 'song',
  title: 'Amazing Grace',
  titleRu: 'О, благодать',
  credits: [
    { role: 'words', names: 'John Newton' },
    { role: 'music', names: 'New Britain (American folk tune)' },
  ],
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  sections: [{ kind: 'verse', lines: ['_@1 G G7 C G', 'G G D D7', 'G G7 C G', 'Em D G G@2'] }],
  // New Britain as hymnals print it (Wikipedia's score of the hymn, the tune's ABC): a pickup, the held "me" and "see".
  staves: [
    {
      notes:
        'D4/1 | G4/2 B4/.5 G4/.5 | B4/2 A4/1 | G4/2 E4/1 | D4/2 D4/1 | G4/2 B4/.5 G4/.5 | B4/2 A4/1 | D5/4 | r/1 B4/1 | D5/1.5 B4/.5 D5/.5 B4/.5 | G4/2 D4/1 | E4/1.5 G4/.5 G4/.5 E4/.5 | D4/2 D4/1 | G4/2 B4/.5 G4/.5 | B4/2 A4/1 | G4/4 | r/1',
    },
  ],
  // John Newton's words (1779), the first verse, a syllable under each note of the tune; a slurred pair takes one.
  lyrics: [
    'A- ma- zing_ grace! How sweet the sound, That saved a_ wretch like me! I once_ was_ lost, but now_ am_ found. Was blind, but_ now I see.',
  ],
})
