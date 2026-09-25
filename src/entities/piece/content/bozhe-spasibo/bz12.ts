import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz12',
  kind: 'song',
  title: 'Ты поспеши к Нему',
  titleEn: 'Hurry to Him',
  credits: [{ role: 'words-and-music', names: 'Екатерина Лихачёва' }],
  source: { book: 'bozhe-spasibo', number: 12, page: 34 },
  key: 'Em',
  meter: '4/4',
  tempo: 76,
  pattern: 'r4',
  note: {
    en: 'The score writes B as H (German style): H7 = B7, Hsus4 = Bsus4.',
    ru: 'В нотах B записано как H (по-немецки): H7 = B7, Hsus4 = Bsus4.',
  },
  sections: [
    {
      kind: 'verse',
      lines: [
        'Em Am@1-Am/F#@1-Bsus4@1-B7@1 Em Am@1-Am/F#@1-Bsus4@1-B7@1',
        'Em-Em/D C-B C-Am Am/F#@2-Bsus4@1-B7@1',
      ],
    },
    {
      kind: 'chorus',
      lines: ['Em-Em/D Am-B7 Em-Em/G Am/F#-B7', 'C Am Am/F#@2-Bsus4@1-B7@1 Em', 'Em'],
    },
  ],
})
