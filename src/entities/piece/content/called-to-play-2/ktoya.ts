import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ktoya',
  kind: 'song',
  title: 'Кто я в этом мире, что Ты помнишь меня?',
  titleEn: 'Who am I in this world, that You remember me?',
  source: { book: 'called-to-play-2', page: 26 },
  key: 'Am',
  meter: '12/8',
  tempo: 54,
  pattern: 'M1',
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: ['Am:5.1 Em:4', 'Dm:t4 E:3-E:t1', 'Am:5.3 Em:3ch', 'Dm:t3-Dm/B:5 E:4-E:oct'],
    },
    { kind: 'chorus', lines: ['Am:6d Dm:6d', 'E:t2 Am:6u', 'F:4 Dm:5.2', 'Am/E:5-E Am:3'] },
    {
      kind: 'verse',
      n: 2,
      lines: ['Am:4 Em:3-Em:6d', 'Dm:inv E:t2', 'Am:6u Em:4', 'Dm:5-Dm/B E:oct'],
    },
    {
      kind: 'chorus',
      last: true,
      lines: ['Am:4 Dm:t5', 'E:inv Am:3-Am:t3', 'F:3ch Dm:6d', 'Am/E:t1-E:3 Am:t4'],
    },
  ],
})
