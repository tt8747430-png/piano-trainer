import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz1',
  kind: 'song',
  title: 'Боже, спасибо',
  titleEn: 'Thank you, God',
  credits: [
    { role: 'words-and-music', names: 'Вадим Калацей' },
    { role: 'russian-text', names: 'Н. Боброва' },
  ],
  source: { book: 'bozhe-spasibo', number: 1, page: 5 },
  key: 'Bm',
  meter: '12/8',
  tempo: 56,
  pattern: 'r1',
  note: {
    en: 'The score prints no chord symbols for this song. These chords were read from the bass line, so check them against the score.',
    ru: 'В нотах этой песни нет буквенных обозначений аккордов. Эти аккорды прочитаны по басу — сверьте их с нотами.',
  },
  sections: [
    { kind: 'intro', lines: ['Bm Bm'] },
    { kind: 'verse', lines: ['Bm A G-Em F#7', 'Bm A G-Em F#7'] },
    { kind: 'chorus', lines: ['Em-A F#7 Bm-A G', 'Em-A F#7 Bm-A G', 'Em-A F#7'] },
    { kind: 'ending', lines: ['Bm A G-Em F#7', 'Bm'] },
  ],
})
