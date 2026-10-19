import { definePiece } from '../../model/types'

export default definePiece({
  id: 'wonderful',
  kind: 'song',
  title: 'Wonderful Grace of Jesus',
  credits: [
    { role: 'words-and-music', names: 'Haldor Lillenas' },
    { role: 'harmony', names: 'Natalie R. Blanton' },
  ],
  key: 'C',
  meter: '4/4',
  tempo: 84,
  pattern: 'r2',
  note: {
    en: 'The chords of Natalie R. Blanton’s arrangement, its first verse and refrain; its later verses vary them.',
    ru: 'Аккорды обработки Натали Р. Блантон, её первый куплет и припев; дальше куплеты их варьируют.',
  },
  sections: [
    {
      kind: 'verse',
      lines: [
        'C C°7-C C@3-G7/B@1 C-E7/B',
        'Am7 Am-Dm7 G@2-A7@1-D7@1 G-G7',
        'C C°7-C C-C7 F-Dm7',
        'F#°7 C/G-G#°7 Am-G7 C@3-G7@1',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'C G7 C G7',
        'G-G7 C-Am D7/F#-D7 G7',
        'C G7 C-C7 F',
        'F#°7-D7 C/G-C7/Bb-F/A-Fm6/Ab G7 C',
      ],
    },
  ],
})
