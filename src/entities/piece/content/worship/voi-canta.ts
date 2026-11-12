import { definePiece } from '../../model/types'

// The chords and the bars as Revive's recording plays them (Chordify's time-aligned chords, measured at 90 BPM), the
// colours of the chords and the tune from a Songscription transcription of the same recording laid on those bars by its
// chord changes, the form as melodia.ro lists it. The transcription misreads the tempo of the first ten bars: there the
// first lines take the second verse's rhythm, an octave up as the first verse is sung, and the third line its own notes
// set to that rhythm. The words are Revive's: the score carries none, and a learner adds them in the score editor.
// The piano part is our own arrangement, built from less to more as Gorshkov's arranging lesson teaches: half-note add9
// pads in verse 1, a quarter pulse in chorus 1, broken eighths (1-5-8-10) in verse 2, the 3+3+2 push in the middle
// choruses, a quiet harmonic figuration then driving eighths in the bridge, octaves in the last chorus, then calm.
// Colour chords (add9, maj7, m9, 7sus4), a walking bass (F, C/E, Dm7, Dm7/C), II–V–I into each section (Gm7–C7) and
// a passing A7/E into Dm, each checked against the tune; short answers in the tune's rests.
export default definePiece({
  id: 'voi-canta',
  kind: 'song',
  title: 'Voi cânta bunătatea Ta',
  titleEn: 'I Will Sing of Your Goodness',
  titleRu: 'Буду петь о Твоей благости',
  credits: [{ role: 'words-and-music', names: 'Revive' }],
  note: {
    en: '© Revive 2023. Used with permission.',
    ru: '© Revive 2023. С разрешения авторов.',
  },
  key: 'F',
  meter: '4/4',
  tempo: 90,
  pattern: 'ballad',
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: [
        'Fadd9 Fadd9 F F@3-C/E@1 Dm Dm7 Bbmaj7 Bbmaj7@2-C7sus4@2',
        'Fmaj7 F F F@3-C/E@1 Dm7 Dm7@2-Dm7/C@2 Bbmaj7 Bbmaj7@2-C7sus4@2',
      ],
    },
    {
      kind: 'chorus',
      lines: ['Fadd9 F/A Bbsus2 C7sus4@2-C@2', 'F-C/E Dm7@2-Dm7/C@2 Bbsus2 Gm7@2-C7@2'],
    },
    {
      kind: 'verse',
      n: 2,
      lines: [
        'Fadd9 F F F@3-C/E@1 Dm7 Dm7@2-Dm7/C@2 Bbmaj9 Bbmaj9@2-C7sus4@2',
        'F F F F@3-C/E@1 Dm7 Dm7@2-Dm7/C@2 Bbmaj9 Gm7@2-C7sus4@2',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Fadd9 F/A Bbsus2 C7sus4@2-C@2',
        'F-C/E Dm7@2-Dm7/C@2 Bbsus2 Gm7@2-C7@2',
        'Fadd9 F@2-F/A@2 Bbsus2 C7sus4@2-C@2',
        'F-C/E Dm7@2-Dm7/C@2 Bbsus2 Gm7@2-C7@2',
      ],
    },
    {
      kind: 'bridge',
      lines: [
        'F F F@3-F7@1 Bb F Dm9 Gm7 Bbmaj7@2-C7sus4@2',
        'F F F@3-F7@1 Bbmaj7 F@2-A7/E@2 Dm@2-Dm/C@2 Gm7@3-Am7@1 Bb@2-C7sus4@1-C7@1',
      ],
    },
    {
      kind: 'chorus',
      last: true,
      lines: [
        'Fadd9 F@2-F/A@2 Bbsus2 C7sus4@2-C@2',
        'Fmaj7 Dm7@2-F/A@2 Bbsus2 Gm7@2-C7@2',
        'Fadd9 F@2-F/A@2 Bbsus2 C7sus4@2-C@2',
        'F-C/E Dm7@2-Dm7/C@2 Bbsus2 Gm7@2-C7@2',
      ],
    },
    { kind: 'ending', lines: ['Fadd9 |.'] },
  ],
  staves: [
    {
      notes:
        'r/4 | r/4 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 E5/1 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 G5/1 | E5/.75 E5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/2.5 | E5/.75 C5/.75 C5/6.5 | F5/1.5 F5/2 D5/.25 E5/.25 | F5/.75 F5/.25 G5/.5 F5/1.5 E5/1 | E5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.25 G5/.5 F5/1.5 A5/1 | D5/1 C5/3 | D5/1 E5/.5 F5/1.5 Bb4/.75 A4/4.25 | r/2 F5/.25 F5/.5 A5/.75 A5/.5 | Bb5/1 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/1 D5/1.5 E5/.75 G5/.75 G5/.5 | A5/1.5 A5/.5 C6/.5 E5/.5 E5/.5 E5/.75 D5/.5 C5/.25 A4/1 F5/.75 A5/.75 Bb5/1 Bb5/.5 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/1 D5/1 C5/.5 A5/.75 E5/.75 F5/2 G5/.25 A5/2.25 | r/4 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 E4/1 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 G4/1 | E4/.75 F4/.75 F4/2 F4/.25 G4/.25 | A4/.75 A4/.75 A4/1.5 G4/.5 Bb4/.5 | A4/1.5 G4/.25 F4/1.75 D4/.25 G4/.25 | F4/4 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 E4/1 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 G4/.5 A4/.5 | D4/4 | D4/1 E4/.5 F4/1 F4/.5 Bb4/.5 G4/.5 | A4/1.5 G4/.25 A4/.25 G4/1.5 F4/.25 G4/.25 | F4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2.5 E4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 F4/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2 C4/.5 A4/.75 A4/.25 G4/.5 A4/2 C5/2 Bb4/.5 | A4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2.5 E4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 F4/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2 C4/.5 A4/1 E4/.5 F4/2 F4/2.5 | F4/1 C4/1 C4/1 F4/1 | A4/3 G4/1 | F4/1.5 E4/.5 F4/1 D4/1 | C4/4 | F4/1 F4/1 E4/1 F4/1 | Bb3/3 Bb3/1 | D4/2 C4/2 | A3/5 C4/1 C4/1 F4/1 | A4/3 G4/1 | F4/1.5 E4/.5 F4/1 D4/1 | C4/2 G3/2 | F3/1 F4/1 E4/1 F4/1 | G4/3 A4/1 | Bb4/2 C5/2 | C5/3.25 Bb4/.25 A4/.25 Bb4/.25 | A4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 A4/.75 G4/2 F4/.5 A4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 D4/1.5 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 A4/.75 G4/2 C4/.5 A4/.75 A4/.5 G4/.25 A4/2 G4/1.5 A4/1 | E4/.75 F4/.75 F4/.25 G4/.25 A4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 D5/.75 C5/2 F4/.5 C5/.75 G4/.75 A4/2 A4/.5 C5/.5 C5/.5 E5/.5 E5/1 F5/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 D5/.75 C5/2 C4/.5 A4/.75 E4/.75 F4/.25 G4/.25 | F4/4',
    },
  ],
  hands: {
    rh: 'A3/.5[p] C4/.5 F4/.5 G4/.5 F4/.5 C4/.5 A3/.5 C4/.5 | A3/.5 C4/.5 F4/.5 G4/.5 F4/.5 C4/.5 A3/.5 C4/.5 | C4+F4+A4/2 C4+F4+A4/2 | C4+F4+A4/1.5 C4+F4+A4/1.5 C4+E4+G4/1 | D4+F4+A4/2 D4+F4+A4/2 | D4+F4+A4+C5/2 D4+F4+A4+C5/2 | D4+F4+A4+Bb4/2 D4+F4+A4+Bb4/2 | D4+F4+A4+Bb4/1 D4+F4+A4+Bb4/1 C4+F4+G4+Bb4/1 C4+F4+G4+Bb4/1 | C4+E4+F4+A4/2 C4+E4+F4+A4/2 | C4+F4+A4/2 C4+F4+A4/2 | C4+F4+A4/2 C4+F4+A4/2 | C4+F4+A4/1.5 C4+F4+A4/1.5 C4+E4+G4/1 | C4+D4+F4+A4/2 C4+D4+F4+A4/2 | C4+D4+F4+A4/1 C4+D4+F4+A4/1 C4+D4+F4+A4/1 C4+D4+F4+A4/1 | Bb3+D4+F4+A4/2 Bb3+D4+F4+A4/2 | Bb3+D4+F4+A4/1 Bb3+D4+F4+A4/1 Bb3+C4+F4+G4/1 Bb3+C4+F4+G4/1 | A3+C4+F4+G4/1[mp] A3+C4+F4+G4/1 A3+C4+F4+G4/1 A3+C4+F4+G4/1 | C4+F4+A4/1 C4+F4+A4/1 C4+F4+A4/1 C4+F4+A4/1 | C4+F4+Bb4/1 C4+F4+Bb4/1 C4+F4+Bb4/1 C4+F4+Bb4/1 | C4+F4+G4+Bb4/1 C4+F4+G4+Bb4/1 C4+E4+G4/1 C4+E4+G4/1 | C4+F4+A4/1 C4+F4+A4/1 C4+E4+G4/1 C4+E4+G4/1 | C4+D4+F4+A4/1 C4+D4+F4+A4/1 C4+D4+F4+A4/1 C4+D4+F4+A4/1 | C4+F4+Bb4/1 C4+F4+Bb4/1 C4+F4+Bb4/1 C4+F4+Bb4/1 | D4+F4+G4+Bb4/1 D4+F4+G4+Bb4/1 C4+E4+G4+Bb4/1 C4+E4+G4+Bb4/1 | C4+F4+G4+A4/4[mp] | C4/.5 F4/.5 A4/.5 F4/.5 C4/.5 F4/.5 A4/.5 | C4+F4+A4/4 | C4+F4+A4/3 C4+E4+G4/1 | C4+D4+F4+A4/4 | C4+D4+F4+A4/2 C4+D4+F4+A4/2 | C4+D4+F4+A4/4 | C4+D4+F4+A4/2 Bb3+C4+F4+G4/2 | C4+F4+A4/4 | C4+F4+A4/4 | C4+F4+A4/4 | C4+F4+A4/3 C4+E4+G4/1 | C4+D4+F4+A4/4 | C4+D4+F4+A4/2 C4+D4+F4+A4/2 | C4+D4+F4+A4/4 | Bb3+D4+F4+G4/2 Bb3+C4+F4+G4/2 | A3+C4+F4+G4/1.5[mf] A3+C4+F4+G4/1.5 A3+C4+F4+G4/1 | C4+F4+A4/1.5 C4+F4+A4/1.5 C4+F4+A4/1 | C4+F4+Bb4/1.5 C4+F4+Bb4/1.5 C4+F4+Bb4/1 | C4+F4+G4+Bb4/1.5 C4+F4+G4+Bb4/.5 C4+E4+G4/1.5 C4+E4+G4/.5 | C4+F4+A4/1.5 C4+F4+A4/.5 C4+E4+G4/1.5 C4+E4+G4/.5 | C4+D4+F4+A4/1.5 C4+D4+F4+A4/.5 C4+D4+F4+A4/1.5 C4+D4+F4+A4/.5 | C4+F4+Bb4/1.5 C4+F4+Bb4/1.5 C4+F4+Bb4/1 | D4+F4+G4+Bb4/1.5 D4+F4+G4+Bb4/.5 C4+E4+G4+Bb4/1.5 C4+E4+G4+Bb4/.5 | C4+F4+G4+A4/1.5 C4+F4+G4+A4/1.5 C4+F4+G4+A4/1 | C4+F4+A4/1.5 C4+F4+A4/.5 C4+F4+A4/1.5 C4+F4+A4/.5 | C4+F4+Bb4/1.5 C4+F4+Bb4/1.5 C4+F4+Bb4/1 | C4+F4+G4+Bb4/1.5 C4+F4+G4+Bb4/.5 C4+E4+G4/1.5 C4+E4+G4/.5 | C4+F4+A4/1.5 C4+F4+A4/.5 C4+E4+G4/1.5 C4+E4+G4/.5 | C4+D4+F4+A4/1.5 C4+D4+F4+A4/.5 C4+D4+F4+A4/1.5 C4+D4+F4+A4/.5 | C4+F4+Bb4/1.5 C4+F4+Bb4/1.5 C4+F4+Bb4/1 | D4+F4+G4+Bb4/1.5 D4+F4+G4+Bb4/.5 C4+E4+G4+Bb4/1.5 C4+E4+G4+Bb4/.5 | C4/.5[p] F4/.5 A4/.5 A4/.5 A4/.5 F4/.5 C4/.5 F4/.5 | C4/.5 F4/.5 A4/.5 A4/.5 A4/.5 F4/.5 C4/.5 F4/.5 | C4/.5 F4/.5 A4/.5 A4/.5 A4/.5 F4/.5 Eb4/.5 F4/.5 | D4/.5 F4/.5 Bb4/.5 Bb4/.5 Bb4/.5 F4/.5 D4/.5 F4/.5 | C4/.5 F4/.5 A4/.5 A4/.5 A4/.5 F4/.5 C4/.5 F4/.5 | C4/.5 E4/.5 F4/.5 A4/.5 F4/.5 E4/.5 C4/.5 E4/.5 | Bb3/.5 D4/.5 F4/.5 G4/.5 F4/.5 D4/.5 Bb3/.5 D4/.5 | Bb3/.5 D4/.5 F4/.5 A4/.5 Bb3/.5 C4/.5 F4/.5 G4/.5 | C4+F4+A4/.5[mp,cresc] C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 | C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 | C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 Eb4+F4+A4+C5/.5 Eb4+F4+A4+C5/.5 | D4+F4+A4+Bb4/.5 D4+F4+A4+Bb4/.5 D4+F4+A4+Bb4/.5 D4+F4+A4+Bb4/.5 D4+F4+A4+Bb4/.5 D4+F4+A4+Bb4/.5 D4+F4+A4+Bb4/.5 D4+F4+A4+Bb4/.5 | C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C4+F4+A4/.5 C#4+E4+G4+A4/.5 C#4+E4+G4+A4/.5 C#4+E4+G4+A4/.5 C#4+E4+G4+A4/.5 | D4+F4+A4/.5 D4+F4+A4/.5 D4+F4+A4/.5 D4+F4+A4/.5 D4+F4+A4/.5 D4+F4+A4/.5 D4+F4+A4/.5 D4+F4+A4/.5 | D4+F4+G4+Bb4/.5 D4+F4+G4+Bb4/.5 D4+F4+G4+Bb4/.5 D4+F4+G4+Bb4/.5 D4+F4+G4+Bb4/.5 D4+F4+G4+Bb4/.5 C4+E4+G4+A4/.5 C4+E4+G4+A4/.5 | D4+F4+Bb4/.5 D4+F4+Bb4/.5 D4+F4+Bb4/.5 D4+F4+Bb4/.5 C4+F4+G4+Bb4/.5 C4+F4+G4+Bb4/.5 C4+E4+G4+Bb4/.5 C4+E4+G4+Bb4/.5 | C4+F4+G4+A4/1.5[f] C4+F4+G4+A4/1.5 C4+F4+G4+A4/1 | C4+F4+A4/1.5 C4+F4+A4/.5 C4+F4+A4/1.5 C4+F4+A4/.5 | C4+F4+Bb4/1.5 C4+F4+Bb4/1.5 C4+F4+Bb4/1 | C4+F4+G4+Bb4/1.5 C4+F4+G4+Bb4/.5 C4+E4+G4/1.5 C4+E4+G4/.5 | C4+E4+F4+A4/1.5 C4+E4+F4+A4/1.5 C4+E4+F4+A4/1 | C4+D4+F4+A4/1.5 C4+D4+F4+A4/.5 C4+F4+A4/1.5 C4+F4+A4/.5 | C4+F4+Bb4/1.5 C4+F4+Bb4/1.5 C4+F4+Bb4/1 | D4+F4+G4+Bb4/1.5 D4+F4+G4+Bb4/.5 C4+E4+G4+Bb4/1.5 C4+E4+G4+Bb4/.5 | C4+F4+G4+A4/1.5 C4+F4+G4+A4/1.5 C4+F4+G4+A4/1 | C4+F4+A4/1.5 C4+F4+A4/.5 C4+F4+A4/1.5 C4+F4+A4/.5 | C4+F4+Bb4/1.5 C4+F4+Bb4/1.5 C4+F4+Bb4/1 | C4+F4+G4+Bb4/1.5 C4+F4+G4+Bb4/.5 C4+E4+G4/1.5 C4+E4+G4/.5 | C4+F4+A4/2[mf,rit] C4+E4+G4/2 | C4+D4+F4+A4/2 C4+D4+F4+A4/2 | C4+F4+Bb4/4 | D4+F4+G4+Bb4/2 C4+E4+G4+Bb4/2 | C4+F4+G4+A4/4[p,arp,ferm]',
    lh: 'F2+C3/4 | F2+C3/4 | F2+C3/4 | F2+C3/3 E2+C3/1 | D3+A3/4 | D3+A3/4 | Bb2+F3/4 | Bb2+F3/2 C3+G3/2 | F2+C3/4 | F2+C3/4 | F2+C3/4 | F2+C3/3 E2+C3/1 | D3+A3/4 | D3+A3/2 C3+F3/2 | Bb2+F3/4 | Bb2+F3/2 C3+G3/2 | F2/2 C3/2 | A2/2 F3/2 | Bb2/2 F3/2 | C3/1 G3/1 C3/1 G3/1 | F2/1 C3/1 E2/1 C3/1 | D3/1 A3/1 C3/1 F3/1 | Bb2/2 F3/2 | G2/1 D3/1 C3/1 G3/1 | F2/.5 C3/.5 F3/.5 A3/.5 C4/.5 A3/.5 F3/.5 C3/.5 | F2/.5 C3/.5 F3/.5 A3/.5 C4/.5 A3/.5 F3/.5 C3/.5 | F2/.5 C3/.5 F3/.5 A3/.5 C4/.5 A3/.5 F3/.5 C3/.5 | F2/.5 C3/.5 F3/.5 A3/.5 C4/.5 A3/.5 E2/.5 C3/.5 | D3/.5 A3/.5 D4/.5 F4/.5 A4/.5 F4/.5 D4/.5 A3/.5 | D3/.5 A3/.5 D4/.5 F4/.5 C3/.5 F3/.5 A3/.5 D4/.5 | Bb2/.5 F3/.5 Bb3/.5 D4/.5 F4/.5 D4/.5 Bb3/.5 F3/.5 | Bb2/.5 F3/.5 Bb3/.5 D4/.5 C3/.5 G3/.5 C4/.5 F4/.5 | F2/.5 C3/.5 F3/.5 A3/.5 C4/.5 A3/.5 F3/.5 C3/.5 | F2/.5 C3/.5 F3/.5 A3/.5 C4/.5 A3/.5 F3/.5 C3/.5 | F2/.5 C3/.5 F3/.5 A3/.5 C4/.5 A3/.5 F3/.5 C3/.5 | F2/.5 C3/.5 F3/.5 A3/.5 C4/.5 A3/.5 E2/.5 C3/.5 | D3/.5 A3/.5 D4/.5 F4/.5 A4/.5 F4/.5 D4/.5 A3/.5 | D3/.5 A3/.5 D4/.5 F4/.5 C3/.5 F3/.5 A3/.5 D4/.5 | Bb2/.5 F3/.5 Bb3/.5 D4/.5 F4/.5 D4/.5 Bb3/.5 F3/.5 | G2/.5 D3/.5 G3/.5 Bb3/.5 C3/.5 G3/.5 C4/.5 F4/.5 | F1+F2/1.5 C3/1.5 F3/1 | A1+A2/1.5 F3/1.5 A3/1 | Bb1+Bb2/1.5 F3/1.5 Bb3/1 | C2+C3/1.5 G3/.5 C2+C3/1.5 G3/.5 | F1+F2/1.5 C3/.5 E2+E2/1.5 C3/.5 | D2+D3/1.5 A3/.5 C2+C3/1.5 F3/.5 | Bb1+Bb2/1.5 F3/1.5 Bb3/1 | G1+G2/1.5 D3/.5 C2+C3/1.5 G3/.5 | F1+F2/1.5 C3/1.5 F3/1 | F1+F2/1.5 C3/.5 A1+A2/1.5 F3/.5 | Bb1+Bb2/1.5 F3/1.5 Bb3/1 | C2+C3/1.5 G3/.5 C2+C3/1.5 G3/.5 | F1+F2/1.5 C3/.5 E2+E2/1.5 C3/.5 | D2+D3/1.5 A3/.5 C2+C3/1.5 F3/.5 | Bb1+Bb2/1.5 F3/1.5 Bb3/1 | G1+G2/1.5 D3/.5 C2+C3/1.5 G3/.5 | F2+C3/4 | F2+C3/4 | F2+C3/3 F2+C3/1 | Bb2+F3/4 | F2+C3/4 | D3+A3/4 | G2+D3/4 | Bb2+F3/2 C3+G3/2 | F1+F2/1 F1+F2/1 F1+F2/1 F1+F2/1 | F1+F2/1 F1+F2/1 F1+F2/1 F1+F2/1 | F1+F2/1 F1+F2/1 F1+F2/1 F1+F2/1 | Bb1+Bb2/1 Bb1+Bb2/1 Bb1+Bb2/1 Bb1+Bb2/1 | F1+F2/1 F1+F2/1 E2+E2/1 E2+E2/1 | D2+D3/1 D2+D3/1 C2+C3/1 C2+C3/1 | G1+G2/1 G1+G2/1 G1+G2/1 A1+A2/1 | Bb1+Bb2/1 Bb1+Bb2/1 C2+C3/1 C2+C3/1 | F1+F2/1.5 C3/1.5 F3/1 | F1+F2/1.5 C3/.5 A1+A2/1.5 F3/.5 | Bb1+Bb2/1.5 F3/1.5 Bb3/1 | C2+C3/1.5 G3/.5 C2+C3/1.5 G3/.5 | F1+F2/1.5 C3/1.5 F3/1 | D2+D3/1.5 A3/.5 A1+A2/1.5 F3/.5 | Bb1+Bb2/1.5 F3/1.5 Bb3/1 | G1+G2/1.5 D3/.5 C2+C3/1.5 G3/.5 | F1+F2/1.5 C3/1.5 F3/1 | F1+F2/1.5 C3/.5 A1+A2/1.5 F3/.5 | Bb1+Bb2/1.5 F3/1.5 Bb3/1 | C2+C3/1.5 G3/.5 C2+C3/1.5 G3/.5 | F2+C3/2 E2+C3/2 | D3+A3/2 C3+F3/2 | Bb2+F3/4 | G2+D3/2 C3+G3/2 | F1+F2/4[ferm]',
  },
  pedal:
    'down@0 change@4 change@8 change@12 change@15 change@16 change@20 change@24 change@28 change@30 change@32 change@36 change@40 change@44 change@47 change@48 change@52 change@54 change@56 change@60 change@62 change@64 change@68 change@72 change@76 change@78 change@80 change@82 change@84 change@86 change@88 change@92 change@94 change@96 change@100 change@104 change@108 change@111 change@112 change@116 change@118 change@120 change@124 change@126 change@128 change@132 change@136 change@140 change@143 change@144 change@148 change@150 change@152 change@156 change@158 change@160 change@164 change@168 change@172 change@174 change@176 change@178 change@180 change@182 change@184 change@188 change@190 change@192 change@196 change@198 change@200 change@204 change@206 change@208 change@210 change@212 change@214 change@216 change@220 change@222 change@224 change@228 change@232 change@235 change@236 change@240 change@244 change@248 change@252 change@254 change@256 change@260 change@264 change@267 change@268 change@272 change@274 change@276 change@278 change@280 change@283 change@284 change@286 change@287 change@288 change@292 change@294 change@296 change@300 change@302 change@304 change@308 change@310 change@312 change@316 change@318 change@320 change@324 change@326 change@328 change@332 change@334 change@336 change@338 change@340 change@342 change@344 change@348 change@350 change@352 up@356',
})
