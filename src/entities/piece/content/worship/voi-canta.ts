import { definePiece } from '../../model/types'

// The chords and the bars as Revive's recording plays them (Chordify's time-aligned chords, measured at 90 BPM), the
// colours of the chords and the tune from a Songscription transcription of the same recording laid on those bars by its
// chord changes, the form as melodia.ro lists it. The transcription misreads the tempo of the first ten bars: there the
// first lines take the second verse's rhythm, an octave up as the first verse is sung, and the third line its own notes
// set to that rhythm. The words are Revive's, all rights reserved, so the score carries no words.
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
        'r/4 | r/4 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 E5/1 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 G5/1 | E5/.75 E5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/2.5 | E5/.75 C5/.75 C5/6.5 | F5/1.5 F5/2 D5/.25 E5/.25 | F5/.75 F5/.25 G5/.5 F5/1.5 E5/1 | E5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.25 G5/.5 F5/1.5 A5/1 | D5/1 C5/3 | D5/1 E5/.5 F5/1.5 Bb4/.75 A4/4.25 | r/2 F5/.25 F5/.5 A5/.75 A5/.5 | Bb5/1 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/1 D5/1.5 E5/.75 G5/.75 G5/.5 | A5/1.5 A5/.5 C6/.5 E5/.5 E5/.5 E5/.75 D5/.5 C5/.25 A4/1 F5/.75 A5/.75 Bb5/1 Bb5/.5 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/1 D5/1 C5/.5 A5/.75 E5/.75 F5/2 G5/.25 A5/2.25 | r/4 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 E4/1 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 G4/1 | E4/.75 F4/.75 F4/2 F4/.25 G4/.25 | A4/.75 A4/.75 A4/1.5 G4/.5 Bb4/.5 | A4/1.5 G4/.25 F4/1.75 D4/.25 G4/.25 | F4/4 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 E4/1 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 G4/.5 A4/.5 | D4/4 | D4/1 E4/.5 F4/1 F4/.5 Bb4/.5 G4/.5 | A4/1.5 G4/.25 A4/.25 G4/1.5 F4/.25 G4/.25 | F4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2.5 E4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 F4/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2 C4/.5 A4/.75 A4/.25 G4/.5 A4/2 C5/2 Bb4/.5 | A4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2.5 E4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 F4/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2 C4/.5 A4/1 E4/.5 F4/2 F4/2.5 | F4/1 C4/1 C4/1 F4/1 | A4/3 G4/1 | F4/1.5 E4/.5 F4/1 D4/1 | C4/4 | F4/1 F4/1 E4/1 F4/1 | Bb3/3 Bb3/1 | D4/2 C4/2 | A3/5 C4/1 C4/1 F4/1 | A4/3 G4/1 | F4/1.5 E4/.5 F4/1 D4/1 | C4/2 G3/2 | F3/1 F4/1 E4/1 F4/1 | G4/3 A4/1 | Bb4/2 C5/2 | C5/3.25 Bb4/.25 A4/.25 Bb4/.25 | A4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 A4/.75 G4/2 F4/.5 A4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 D4/1.5 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 A4/.75 G4/2 C4/.5 A4/.75 A4/.5 G4/.25 A4/2 G4/1.5 A4/1 | E4/.75 F4/.75 F4/.25 G4/.25 A4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 D5/.75 C5/2 F4/.5 C5/.75 G4/.75 A4/2 A4/.5 C5/.5 C5/.5 E5/.5 E5/1 F5/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 D5/.75 C5/2 C4/.5 A4/.75 E4/.75 F4/.25 G4/.25 | F4/4',
    },
  ],
})
