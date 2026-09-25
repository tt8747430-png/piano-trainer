import { definePiece } from '../../model/types'

export default definePiece({
  id: 'face',
  kind: 'song',
  title: 'Face to Face with Christ',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 72,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Am:6u Dm:6u', 'Am:4 E:t2', 'Am:3 Dm:5.2', 'Am-E:5 Am:t3'] },
    { kind: 'chorus', lines: ['E:5.1 Am:6u', 'E:inv Am:6d', 'Dm:5.3 Am:t5', 'E:t1 Am:3ch'] },
  ],
})
