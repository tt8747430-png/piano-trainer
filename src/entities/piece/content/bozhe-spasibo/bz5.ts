import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz5',
  kind: 'song',
  title: 'Мир, душа, храни',
  titleEn: 'Still, my soul, be still',
  credits: [{ role: 'authors', names: 'Keith Getty, Kristyn Getty, Stuart Townend' }],
  source: { book: 'bozhe-spasibo', number: 5, page: 16 },
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 'r4',
  sections: [
    {
      kind: 'verse',
      lines: ['G C Em-G/B C@1-C/E@1-Dsus4@1-D/F#@1', 'G C Em-G/B C@1-C/E@1-Dsus4@1-D/F#@1'],
    },
    {
      kind: 'chorus',
      lines: ['Em-D/F# G Am-Em C@2-Dsus4@1-D7@1', 'Em-D/F# G Am-Em C-D', 'Em C-D'],
    },
    { kind: 'ending', lines: ['G'] },
  ],
})
