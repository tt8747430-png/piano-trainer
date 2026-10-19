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
        'C C°7-C C6@1-C/E@1-C/G@1-G7@1 C-E7/B',
        'Am Am G-D7 G@1-C/G@1-G7@2',
        'C C°7-C C@3-C7@1 F',
        'F#°7 C/G-Ab7 C/G-G7 C',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'C G7 C G7',
        'G7 C G-D7 G7',
        'C-F/C G7 C@2-Am/E@1-C7@1 F',
        'F#°7 C/G-C7/Bb-F/A-Fm6/Ab C/G-G7 C',
      ],
    },
  ],
})
