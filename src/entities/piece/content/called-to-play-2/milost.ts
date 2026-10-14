import { definePiece } from '../../model/types'

export default definePiece({
  id: 'milost',
  kind: 'song',
  title: 'Боже, лишь на милость уповаю я Твою',
  titleEn: 'God, I trust in Your mercy alone',
  source: { book: 'called-to-play-2', page: 41 },
  key: 'Gm',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Gm:3 F:t1', 'Cm:3 Gm:t2', 'Cm:4 Gm:t3', 'A7:inv D:t4'] },
    {
      kind: 'chorus',
      lines: [
        'Gm:5-D Gm:4',
        'Gm:3ch D:ch',
        'Cm:4 Gm:5.3',
        'D:5.1 Gm:oct',
        'Cm:t5 Gm:6d',
        'F:6u Bb:3ch',
        'Cm:3 Gm:3-Eb',
        'D7:t1 Gm:t4',
      ],
    },
  ],
})
