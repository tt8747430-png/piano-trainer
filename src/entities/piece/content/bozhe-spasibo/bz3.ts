import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz3',
  kind: 'song',
  title: 'Помолись за меня, моя мама',
  titleEn: 'Pray for me, my mother',
  credits: [{ role: 'words-and-music', names: 'А. Гусев' }],
  source: { book: 'bozhe-spasibo', number: 3, page: 11 },
  key: 'Cm',
  meter: '12/8',
  tempo: 56,
  pattern: 'r1',
  sections: [
    { kind: 'verse', lines: ['Cm Fm G Cm-G', 'Cm Fm G Cm'] },
    { kind: 'chorus', lines: ['C7 Fm Bb Eb-G', 'Cm Fm G Cm'] },
  ],
})
