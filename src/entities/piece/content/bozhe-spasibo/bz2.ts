import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz2',
  kind: 'song',
  title: 'Ты ждал света утра',
  titleEn: 'You waited for the morning light',
  credits: [{ role: 'unknown' }],
  source: { book: 'bozhe-spasibo', number: 2, page: 8 },
  key: 'C#m',
  meter: '6/8',
  tempo: 58,
  pattern: 'r1',
  sections: [
    {
      kind: 'verse',
      lines: ['C#m C#m F#m F#m/D#', 'G# G# C#m C#m', 'C#m C#m F#m F#m/D#', 'G# G# C#m C#m'],
    },
    { kind: 'chorus', lines: ['C#m C# F#m F#m', 'B B E E', 'A A F#m F#m/D#', 'G# G# C#m G#'] },
    {
      kind: 'chorus',
      last: true,
      lines: ['C#m C# F#m F#m', 'B B E E', 'A A F#m F#m/D#', 'G# G# C#m C#m'],
    },
  ],
})
