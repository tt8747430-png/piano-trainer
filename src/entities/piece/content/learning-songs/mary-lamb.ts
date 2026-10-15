import { definePiece } from '../../model/types'

export default definePiece({
  id: 'mary-lamb',
  kind: 'song',
  title: 'Mary Had a Little Lamb',
  titleRu: 'У Мэри был барашек',
  credits: [
    { role: 'words', names: 'Sarah Josepha Hale' },
    { role: 'music', names: 'Traditional' },
  ],
  key: 'C',
  meter: '4/4',
  tempo: 100,
  pattern: 'block',
  sections: [{ kind: 'verse', lines: ['C C G C', 'C C G C'] }],
  melody:
    'E4/1 D4/1 C4/1 D4/1 | E4/1 E4/1 E4/2 | D4/1 D4/1 D4/2 | E4/1 G4/1 G4/2 | E4/1 D4/1 C4/1 D4/1 | E4/1 E4/1 E4/1 E4/1 | D4/1 D4/1 E4/1 D4/1 | C4/4',
})
