import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz6',
  kind: 'song',
  title: 'Синее небо меня так манит',
  titleEn: 'The blue sky calls to me',
  credits: [{ role: 'words-and-music', names: 'Л. Н. Курс' }],
  source: { book: 'bozhe-spasibo', number: 6, page: 18 },
  key: 'Gm',
  meter: '12/8',
  tempo: 56,
  pattern: 'r1',
  sections: [
    { kind: 'verse', lines: ['Gm-Gm/Bb Cm-Cm/A Gm/D-D7 D7', 'Gm-Gm/Bb Cm-Cm/A Gm/D-D7 D7'] },
    { kind: 'chorus', lines: ['Gm Cm-Cm/A D7 D7', 'Gm Cm-Cm/A Gm/D-D7 Gm'] },
  ],
})
