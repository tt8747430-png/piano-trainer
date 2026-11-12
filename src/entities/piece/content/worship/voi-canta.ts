import { definePiece } from '../../model/types'

// The chords and the bars as Revive's recording plays them (Chordify's time-aligned chords, measured at 90 BPM), the
// colours of the chords and the tune from a Songscription transcription of the same recording laid on those bars, the
// form as melodia.ro lists it. The transcription stops in the second chorus: the first verse's opening lines take the
// second verse's tune, a chorus sung again takes the first chorus's, and the bridge has no tune yet. The words are
// Revive's, all rights reserved, so the score carries no words.
export default definePiece({
  id: 'voi-canta',
  kind: 'song',
  title: 'Voi cânta bunătatea Ta',
  titleEn: 'I Will Sing of Your Goodness',
  titleRu: 'Буду петь о Твоей благости',
  credits: [{ role: 'music', names: 'Revive' }],
  key: 'F',
  meter: '4/4',
  tempo: 90,
  pattern: 'ballad',
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: ['F F F F Dm Dm7 Bbmaj7 Bbmaj7', 'F F F F Dm7 Dm7 Bbmaj7 Bbmaj7'],
    },
    { kind: 'chorus', lines: ['F F Bbsus2 C', 'F-C/E Dm7 Bbsus2 C'] },
    {
      kind: 'verse',
      n: 2,
      lines: ['F F F F Dm7 Dm7 Bbmaj9 Bbmaj9', 'F F F F Dm7 Dm7 Bbmaj9 Bbmaj9'],
    },
    {
      kind: 'chorus',
      lines: ['F F Bbsus2 C', 'F-C/E Dm7 Bbsus2 C', 'F F Bbsus2 C', 'F-C/E Dm7 Bbsus2 C'],
    },
    { kind: 'bridge', lines: ['F F F Bb F Dm7 Gm7 Bb', 'F F F Bb F Dm Gm@3-Am@1 Bb-C'] },
    {
      kind: 'chorus',
      last: true,
      lines: ['F F Bbsus2 C', 'F F Bbsus2 C', 'F F Bbsus2 C', 'F-C/E Dm7 Bbsus2 C'],
    },
    { kind: 'ending', lines: ['F |.'] },
  ],
  staves: [
    {
      notes:
        'r/4 | r/4 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 E5/1 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 G5/1 | E5/.75 F5/.75 F5/2 D5/.25 E5/.25 | A5/.75 A5/.75 A5/1.5 G5/.5 Bb5/.5 | A5/1.5 G5/.25 F5/1.75 r/.5 | r/4 | F5/.75 F5/.75 F5/.75 D5/1.25 D5/.25 E5/.25 | F5/.75 F5/.75 E5/.5 F5/1 E5/1 | E5/.75 F5/.75 F5/.75 D5/1.25 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 A5/1 | D5/.75 C5/3.25 | D5/1 E5/.5 F5/1.5 Bb4/.75 A4/4.25 | G4/2 F5/.75 A5/.75 A5/1.5 | Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2.5 | E5/.75 G5/.75 G5/.5 | A5/1.5 A5/.5 C6/.5 E5/.5 E5/.5 E5/.75 | D5/.25 C5/.25 A4/1.25 F5/.75 A5/.75 Bb5/1 | Bb5/.5 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2 | C5/.5 A5/.75 E5/.75 F5/2 | G5/.25 A5/1.25 r/1 | r/4 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 E5/1 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 G5/1 | E5/.75 F5/.75 F5/2 D5/.25 E5/.25 | A5/.75 A5/.75 A5/1.5 G5/.5 Bb5/.5 | A5/1.5 G5/.25 F5/1.75 r/.5 | r/4 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 E5/1 | E5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 G5/.5 A5/.5 | D5/4 | D5/1 E5/.5 F5/1 F5/.5 Bb5/.5 A5/2 | G5/.25 A5/.25 G5/1.5 F5/.25 G5/.25 | F5/2 F5/.75 A5/.75 Bb5/1.5 | Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2.5 | E5/.75 G5/.75 A5/.5 | A5/1.5 A5/.5 C6/.5 E5/.5 E5/.5 E5/.75 | D5/.25 C5/.25 A4/1.25 F5/.75 A5/.75 Bb5/1 | Bb5/.5 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2 | C5/.5 A5/.75 E5/.75 F5/2 | G5/.25 A5/1.25 r/1 | r/2 F5/.75 A5/.75 A5/1.5 | Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2.5 | E5/.75 G5/.75 G5/.5 | A5/1.5 A5/.5 C6/.5 E5/.5 E5/.5 E5/.75 | D5/.25 C5/.25 A4/1.25 F5/.75 A5/.75 Bb5/1 | Bb5/.5 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2 | C5/.5 A5/.75 E5/.75 F5/2 | G5/.25 A5/1.25 r/1 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/4 | r/2 F5/.75 A5/.75 A5/1.5 | Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2.5 | E5/.75 G5/.75 G5/.5 | A5/1.5 A5/.5 C6/.5 E5/.5 E5/.5 E5/.75 | D5/.25 C5/.25 A4/1.25 F5/.75 A5/.75 Bb5/1 | Bb5/.5 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2 | C5/.5 A5/.75 E5/.75 F5/2 | G5/.25 A5/1.25 r/1 | r/2 F5/.75 A5/.75 A5/1.5 | Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2.5 | E5/.75 G5/.75 G5/.5 | A5/1.5 A5/.5 C6/.5 E5/.5 E5/.5 E5/.75 | D5/.25 C5/.25 A4/1.25 F5/.75 A5/.75 Bb5/1 | Bb5/.5 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/2 | C5/.5 A5/.75 E5/.75 F5/3.5',
    },
  ],
})
