import { definePiece } from '../../model/types'

// The chords as Revive's recording plays them (Chordify's time-aligned chords, 91 BPM), the form as melodia.ro lists
// it. The words are Revive's, all rights reserved, so the chart carries the chords alone.
export default definePiece({
  id: 'voi-canta',
  kind: 'song',
  title: 'Voi cânta bunătatea Ta',
  titleEn: 'I Will Sing of Your Goodness',
  titleRu: 'Буду петь о Твоей благости',
  credits: [{ role: 'music', names: 'Revive' }],
  key: 'F',
  meter: '4/4',
  tempo: 91,
  pattern: 'ballad',
  sections: [
    { kind: 'verse', n: 1, lines: ['F F F F Dm Dm7 Bb Bb', 'F F F F Dm7 Dm7 Bb Bb'] },
    { kind: 'chorus', lines: ['F F Bb C', 'F-C Dm7 Bb C'] },
    { kind: 'verse', n: 2, lines: ['F F F F Dm7 Dm7 Bb Bb', 'F F F F Dm7 Dm7 Bb Bb'] },
    { kind: 'chorus', lines: ['|: F F Bb C', 'F-C Dm7 Bb C :|'] },
    { kind: 'bridge', lines: ['F F F Bb F Dm7 Gm7 Bb', 'F F F Bb F Dm Gm@3-Am@1 Bb-C'] },
    { kind: 'chorus', last: true, lines: ['F F Bb C', 'F F Bb C', 'F F Bb C', 'F-C Dm7 Bb C'] },
    { kind: 'ending', lines: ['F |.'] },
  ],
})
