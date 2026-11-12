import { definePiece } from '../../model/types'

// The chords and the bars as Revive's recording plays them (Chordify's time-aligned chords, measured at 90 BPM), the
// colours of the chords and the tune from a Songscription transcription of the same recording laid on those bars by its
// chord changes, the form as melodia.ro lists it. The transcription misreads the tempo of the first ten bars: there the
// first lines take the second verse's rhythm, an octave up as the first verse is sung, and the third line its own notes
// set to that rhythm. The words are Revive's: the score carries none, and a learner adds them in the score editor.
// The piano part is our own arrangement. The piano carries the tune on top of its right hand, harmonised under each
// long or strong note as the Chord player voices a chord (close, block and locked shapes; the tune in octaves with the
// chord inside at the climax), and its left hand moves from less to more (Gorshkov, lesson 4): 1-5-10 in verse 1,
// 1-5-8-5 in chorus 1, 1-5-10 eighths in verse 2, the bass with rootless voicings (Bill Evans's, as the Chord player
// has them) in chorus 2, a stride of bass and rootless chords in chorus 3, rootless chords alone then a stride in the
// bridge, octaves in the last choruses. Where the voice holds or rests the right hand answers with a scale run or an
// arpeggio into the next phrase (Gorshkov, lesson 5). No piano note sits a semitone from the sung note: every chord
// was chosen for the tune (C/Bb where it sings E over Bb, Gm6 under a held E, the next chord pushed onto the "and"
// where the tune arrives early), and every note of both hands was checked against it.
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
        'Fadd9 Bb/C F F@3-C/E@1 Dm Dm7 C/Bb@1.5-Bbmaj7@2.5 Bbmaj7@2-Bb/C@2',
        'Fmaj7 F F F@3-C/E@1 Dm7 Dm7@2-Dm7/C@2 Bbmaj7 Bbmaj7@1-C/Bb@.5-C7sus4@2.5',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Fadd9 F/A Bbsus2@3.5-C/Bb@.5 Cadd9',
        'F-C/E Dm7@2-Dm7/C@1.5-Bbsus2@.5 Bbsus2@3.5-C/Bb@.5 Gm7@2-C7@1.5-F@.5',
      ],
    },
    {
      kind: 'verse',
      n: 2,
      lines: [
        'Fadd9 F F F@3-A7/C#@1 Dm9 Dm7@2-Dm7/C@2 C/Bb@.75-Bbmaj9@3.25 Bbmaj9@2-C7sus4@2',
        'F F F F@3-C#dim7@1 Dm9 Dm7@2-Dm7/C@2 Bbmaj9 Gm7@1-Gm6@.5-C7sus4@2.5',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Fadd9 F/A@3.5-Bbsus2@.5 Bbsus2@3-C/Bb@1 C@3.5-F@.5',
        'F-C/E Dm7@2-Dm7/C@1.5-Bbsus2@.5 Bbsus2@3-C/Bb@1 Gm6@2-C6@1.5-F@.5',
        'Fadd9@3.5-Bbsus2@.5 F@2-F/A@1.5-Bbsus2@.5 Bbsus2@3-C/Bb@1 C@3.5-F@.5',
        'F-C/E Dm7@2-Dm7/C@1.5-Bbsus2@.5 Bbsus2@3-C/Bb@1 Gm6@2-C7@1.5-F@.5',
      ],
    },
    {
      kind: 'bridge',
      lines: [
        'F F F@2-F7/A@2 Bb@3-Bdim7@1 F/C Dm9 Gm7 Bbmaj7@2-C7sus4@2',
        'F F Dm7@2-F7/A@2 Bbmaj7 F@2-A7/E@2 Dm@2-Dm/C@2 Gm7@3-Am7@1 Bb/D@2-C/E@2',
      ],
    },
    {
      kind: 'chorus',
      last: true,
      lines: [
        'Fadd9 F@2-F/A@1.5-Bbsus2@.5 Bbadd9@2.75-Bbmaj7@1.25 C7sus4@2-C6@1.5-F@.5',
        'Fmaj7 Dm7@2-F/A@1.5-Bbsus2@.5 Bbadd9@2.75-Bbmaj7@1.25 Gm7@2-C7@1.5-F@.5',
        'Fadd9 C/E@.75-F@1.25-F/A@1.5-Bbsus2@.5 Bbadd9 C7sus4@2-C@1.5-F@.5',
        'F-C/E Dm7@2-Dm7/C@1.5-Bbsus2@.5 Ebmaj7@2-Bbadd9@2 Gm7@2-C7@1.5-F@.5',
      ],
    },
    { kind: 'ending', lines: ['F6/9 |.'] },
  ],
  staves: [
    {
      notes:
        'r/4 | r/4 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 E5/1 | F5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/1.5 G5/1 | E5/.75 E5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.75 F5/2.5 | E5/.75 C5/.75 C5/6.5 | F5/1.5 F5/2 D5/.25 E5/.25 | F5/.75 F5/.25 G5/.5 F5/1.5 E5/1 | E5/.75 F5/.75 F5/2 D5/.25 E5/.25 | F5/.75 F5/.25 G5/.5 F5/1.5 A5/1 | D5/1 C5/3 | D5/1 E5/.5 F5/1.5 Bb4/.75 A4/4.25 | r/2 F5/.25 F5/.5 A5/.75 A5/.5 | Bb5/1 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/1 D5/1.5 E5/.75 G5/.75 G5/.5 | A5/1.5 A5/.5 C6/.5 E5/.5 E5/.5 E5/.75 D5/.5 C5/.25 A4/1 F5/.75 A5/.75 Bb5/1 Bb5/.5 Bb5/.5 Bb5/.5 Bb5/.75 F5/.75 E5/1 D5/1 C5/.5 A5/.75 E5/.75 F5/2 G5/.25 A5/2.25 | r/4 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 E4/1 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 G4/1 | E4/.75 F4/.75 F4/2 F4/.25 G4/.25 | A4/.75 A4/.75 A4/1.5 G4/.5 Bb4/.5 | A4/1.5 G4/.25 F4/1.75 D4/.25 G4/.25 | F4/4 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 E4/1 | F4/.75 F4/.75 F4/2 D4/.25 E4/.25 | F4/.75 F4/.75 F4/1.5 G4/.5 A4/.5 | D4/4 | D4/1 E4/.5 F4/1 F4/.5 Bb4/.5 G4/.5 | A4/1.5 G4/.25 A4/.25 G4/1.5 F4/.25 G4/.25 | F4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2.5 E4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 F4/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2 C4/.5 A4/.75 A4/.25 G4/.5 A4/2 C5/2 Bb4/.5 | A4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2.5 E4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 F4/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 F4/.25 E4/.5 E4/2 C4/.5 A4/1 E4/.5 F4/2 F4/2.5 | F4/1 C4/1 C4/1 F4/1 | A4/3 G4/1 | F4/1.5 E4/.5 F4/1 D4/1 | C4/4 | F4/1 F4/1 E4/1 F4/1 | Bb3/3 Bb3/1 | D4/2 C4/2 | A3/5 C4/1 C4/1 F4/1 | A4/3 G4/1 | F4/1.5 E4/.5 F4/1 D4/1 | C4/2 G3/2 | F3/1 F4/1 E4/1 F4/1 | G4/3 A4/1 | Bb4/2 C5/2 | C5/3.25 Bb4/.25 A4/.25 Bb4/.25 | A4/2 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 A4/.75 G4/2 F4/.5 A4/.75 G4/.75 A4/2 A4/.5 C5/.5 E4/.5 E4/.5 E4/1 D4/1.5 F4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 A4/.75 G4/2 C4/.5 A4/.75 A4/.5 G4/.25 A4/2 G4/1.5 A4/1 | E4/.75 F4/.75 F4/.25 G4/.25 A4/.75 A4/.75 Bb4/1.5 Bb4/.5 Bb4/.5 Bb4/.75 D5/.75 C5/2 F4/.5 C5/.75 G4/.75 A4/2 A4/.5 C5/.5 C5/.5 E5/.5 E5/1 F5/1.5 F4/.75 A4/.75 Bb4/1 Bb4/.5 Bb4/.5 Bb4/.5 Bb4/.75 D5/.75 C5/2 C4/.5 A4/.75 E4/.75 F4/.25 G4/.25 | F4/4',
    },
  ],
  hands: {
    rh: 'r/1.5 G4/.5[mp] A4/.5 C5/.5 F5/.5 r/.5 | r/1 Bb4/.5 C5/.5 D5/.5 r/.5 Bb4/.25 C5/.25 D5/.25 E5/.25 | C5+F5/.75[p] C5+F5/.75 C5+F5/1 C5/.5 A4/.5 D5/.25 E5/.25 | C5+F5/.75 C5+F5/.75 C5+F5/1.5 C5+E5/1 | D5+F5/.75 D5+F5/.75 D5+F5/1 r/1 D5/.25 E5/.25 | C5+F5/.75 C5+F5/.75 C5+F5/1.5 D5+G5/1 | C5+E5/.75 C5+E5/.75 C5+F5/1 D5/.5 C5/.5 D5/.25 E5/.25 | C5+F5/.75 C5+F5/.75 C5+F5/1 D5/.5 C5/.5 Bb4/.5 | C5+E5/.75 G4+C5/.75 G4+C5/1 A4/.5 G4/.5 E4/.5 | F5/.5 C5/.5 A4/.5 A4/.5 C5/.5 F5/.5 Bb4/.25 C5/.25 D5/.25 E5/.25 | C5+F5/1.5 C5+F5/1 C5/.5 A4/.5 D5/.25 E5/.25 | C5+F5/.75 F5/.25 F5+G5/.5 C5+F5/1.5 C5+E5/1 | C5+E5/.75 C5+F5/.75 C5+F5/1 D5/.5 C5/.5 D5/.25 E5/.25 | C5+F5/.75 F5/.25 D5+G5/.5 C5+F5/1.5 F5+A5/1 | Bb4+D5/1 A4+C5/1 A4/.5 F4/.5 D4/.5 D4/.5 | Bb4+D5/1 C5+E5/.5 C5+F5/1.5 F4+Bb4/.75 F4+A4/.25 | F5/.5[mp] C5/.5 A4/.5 A4/.5 C5/.5 F5/.5 A4/.25 C5/.25 D5/.25 E5/.25 | r/1 Bb4/.25 C5/.25 D5/.25 E5/.25 A4+C5+F5/.25 F5/.5 F5+G5+A5/.75 A5/.5 | C5+F5+Bb5/1 C5+F5+Bb5/.5 Bb5/.5 C5+F5+Bb5/.75 Bb4+C5+F5/.75 C5+D5+E5/.5 | r/.5 E4+G4+D5/1.5 C5+D5+E5/.75 D5+E5+G5/.75 G5/.5 | F5+G5+A5/1.5 A5/.5 E5+G5+C6/.5 E5/.5 C5+D5+E5/.5 C5+D5+E5/.5 | r/.25 D5/.5 C5/.25 C4+F4+A4/1 C5+D5+F5/.75 C5+F5+A5/.75 C5+F5+Bb5/.5 | r/.5 Bb5/.5 C5+F5+Bb5/.5 Bb5/.5 C5+F5+Bb5/.75 Bb4+C5+F5/.75 C5+D5+E5/.5 | r/.5 F4+Bb4+D5/1 C5/.5 Bb4+E5+A5/.75 Bb4+C5+E5/.75 A4+C5+F5/.5 | G4/.25[mp] A4/.25 Bb4/.25 C5/.25 D5/.25 F5/.25 G5/.25 F5+A5/1 C5/.25 D5/.25 E5/.25 F5/.25 G5/.25 | F4/.5 C4/.5 A3/.5 A3/.5 C4/.5 F4/.5 Bb3/.25 C4/.25 D4/.25 E4/.25 | C4+F4/.75 C4+F4/.75 C4+F4/1 Bb4/.25 A4/.25 G4/.25 F4/.25 D4/.25 E4/.25 | C4+F4/.75 C4+F4/.75 C4+F4/1.5 B3+E4/1 | C4+F4/.75 C4+F4/.75 C4+F4/1 Bb4/.25 A4/.25 G4/.25 F4/.25 D4/.25 E4/.25 | C4+F4/.75 C4+F4/.75 C4+F4/1.5 D4+G4/1 | C4+E4/.75 C4+F4/.75 C4+F4/1 A3/.25 Bb3/.25 C4/.25 D4/.25 F4/.25 G4/.25 | F4+A4/.75 F4+A4/.75 F4+A4/1.5 D4+G4/.5 Bb4/.5 | F4+A4/1.5 G4/.25 C4+F4/1.75 D4/.25 G4/.25 | C4+F4/1 r/1 C3/.25 D3/.25 F3/.25 G3/.25 A3/.25 Bb3/.25 C4/.25 D4/.25 | C4+F4/.75 C4+F4/.75 C4+F4/1 Bb4/.25 A4/.25 G4/.25 F4/.25 D4/.25 E4/.25 | C4+F4/.75 C4+F4/.75 C4+F4/1.5 C#4+E4/1 | C4+F4/.75 C4+F4/.75 C4+F4/1 Bb4/.25 A4/.25 G4/.25 F4/.25 D4/.25 E4/.25 | C4+F4/.75 C4+F4/.75 C4+F4/1.5 D4+G4/.5 A4/.5 | Bb3+D4/1 r/1 C3/.25 D3/.25 E3/.25 F3/.25 G3/.25 A3/.25 Bb3/.25 C4/.25 | Bb3+D4/1 Bb3+E4/.5 C4+F4/1 F4/.5 F4+Bb4/.5 G4/.5 | C5+F5+G5+A5/1.5[mf] A4+G5/.25 G5+A5/.25 A4+C5+F5+G5/1.5 A4+F5/.25 A4+G5/.25 | G4+A4+C5+F5/1 Bb4/.25 C5/.25 D5/.25 E5/.25 G4+A4+C5+F5/.75 C5+F5+G5+A5/.75 Bb5/.5 | F6/.25 E6/.25 D6/.25 C6/.25 Bb5/.5 F5+Bb5/.5 Bb5/.75 C5+F5/.25 G4+C5+D5+E5/.5 G4+C5+D5+E5/.5 | A6/.25 G6/.25 E6/.25 D6/.25 C6/.25 Bb5/.25 A5/.25 G5/.25 G4+C5+D5+E5/.75 C5+D5+E5+G5/.75 C5+F5+G5+A5/.5 | A6/.25 G6/.25 F6/.25 E6/.25 D6/.25 C6/.25 G5+A5/.5 D5+E5+G5+C6/.5 D5+E5/.5 G4+C5+D5+E5/.5 G4+C5+D5+E5/.5 | r/.5 A4+C5+D5+F5/1.5 A4+C5+D5+F5/.75 C5+D5+F5+A5/.75 Bb5/.5 | r/.5 F5+Bb5/.5 Bb5/.5 F5+Bb5/.5 Bb5/.75 C5+F5/.25 G4+C5+D5+E5/.5 G4+C5+D5+E5/.5 | C6/.25 Bb5/.25 A5/.25 G5/.25 E5/.25 D5/.25 Bb4+C5/.5 D5+E5+G5+A5/.75 E5+A5/.25 A4+C5+E5+G5/.5 C5+F5+G5+A5/.5 | C5/.25[mf] D5/.25 E5/.25 F5/.25 G5/.25 A5/.25 C5+G5+A5+C6/1 E5/.25 F5/.25 G5/.25 A5/.25 Bb4+Bb5/.5 | A4+F5+G5+A5/1 D6/.25 C6/.25 A5/.25 G5/.25 F4+A4+C5+F5/.75 A4+F5+G5+A5/.75 Bb4+C5+F5+Bb5/.5 | F6/.25 E6/.25 D6/.25 C6/.25 Bb4+C5+F5+Bb5/.5 Bb4+Bb5/.5 Bb4+C5+F5+Bb5/.75 F4+F5/.25 E4+C5+D5+E5/.5 E4+C5+D5+E5/.5 | A6/.25 G6/.25 E6/.25 D6/.25 C6/.25 Bb5/.25 A5/.25 G5/.25 E4+C5+D5+E5/.75 G4+D5+E5+G5/.75 A4+F5+G5+A5/.5 | A6/.25 G6/.25 F6/.25 E6/.25 D6/.25 C6/.25 A4+A5/.5 C5+E5+G5+C6/.5 E4+E5/.5 E4+C5+D5+E5/.5 E4+C5+D5+E5/.5 | r/.5 F4+C5+D5+F5/1.5 F4+C5+D5+F5/.75 A4+C5+F5+A5/.75 Bb4+C5+F5+Bb5/.5 | r/.5 Bb4+Bb5/.5 Bb4+C5+F5+Bb5/.5 Bb4+Bb5/.5 Bb4+C5+F5+Bb5/.75 F4+F5/.25 E4+C5+D5+E5/.5 E4+C5+D5+E5/.5 | C6/.25 Bb5/.25 A5/.25 G5/.25 E5/.25 D5/.25 C4+C5/.5 A4+E5+G5+A5/1 E4+Bb4+C5+E5/.5 F4+A4+C5+F5/.5 | r/.5 C6/.25[p] Bb5/.25 A5/.25 G5/.25 G4+F5/1 C5/.5 A4/.5 G4/.5 | G4+F5/1 F4+C5/1 F4+C5/1 G4+F5/1 | C5+A5/1 G5/.5 F5/.5 C5/.5 C5/.5 A4+G5/1 | Bb4+F5/1.5 E5/.5 Bb4+F5/1 F4+D5/1 | F4+C5/1 r/1 A4/.5 G4/.5 F4/.5 F4/.5 | A4+F5/1 A4+F5/1 A4+E5/1 A4+F5/1 | D4+Bb4/1 G4/.5 F4/.5 D4/.5 D4/.5 D4+Bb4/1 | F4+D5/1 C5/.5 A4/.5 D4+C5/1 Bb4/.5 G4/.5 | F4+G4+A4/1[mp,cresc] r/1 F3/.25 G3/.25 A3/.25 C4/.25 D4/.25 E4/.25 F4/.25 G4/.25 | E4/.25 F4/.25 G4/.25 A4/.25 G4+A4+C5/1 G4+A4+C5/1 A4+C5+F5/1 | C5+F5+A5/1 E4/.25 F4/.25 G4/.25 A4/.25 C5/.25 D5/.25 E5/.25 F5/.25 A4+Eb5+G5/1 | A4+D5+F5/1.5 E5/.5 A4+D5+F5/1 A4+C5+D5/1 | G4+A4+C5/1 D5/.25 C5/.25 Bb4/.25 A4/.25 C#4+E4+G4/1 Bb3/.25 C#4/.25 E4/.25 F4/.25 | A3+D4+F4/1 A4+D5+F5/1 A4+D5+E5/1 A4+D5+F5/1 | Bb4+F5+G5/1 G4/.25 A4/.25 Bb4/.25 C5/.25 D5/.25 E5/.25 F5/.25 G5/.25 C5+G5+A5/1 | D5+F5+Bb5/1 F5/.25 G5/.25 A5/.25 Bb5/.25 E5+G5+C6/1 F5/.25 G5/.25 A5/.25 Bb5/.25 | C5+G5+A5+C6/1[f] r/.25 A4/.25 Bb4/.25 C5/.25 D5/.25 E5/.25 F5/.25 G5/.25 A5/.25 Bb4+Bb5/.25 A4+A5/.25 Bb4+Bb5/.25 | A4+F5+G5+A5/1 D6/.25 C6/.25 A5/.25 G5/.25 F4+A4+C5+F5/.75 A4+F5+G5+A5/.75 Bb4+C5+F5+Bb5/.5 | F6/.25 E6/.25 D6/.25 C6/.25 Bb4+D5+F5+Bb5/.5 Bb4+Bb5/.5 Bb4+D5+F5+Bb5/.75 A4+D5+F5+A5/.75 G4+A4+D5+G5/.5 | E6/.25 D6/.25 C6/.25 Bb5/.25 A5/.25 G5/.25 F4+F5/.5 A4+E5+G5+A5/.75 G4+A4+E5+G5/.75 A4+F5+G5+A5/.5 | A6/.25 G6/.25 F6/.25 E6/.25 D6/.25 C6/.25 A4+A5/.5 C5+E5+A5+C6/.5 E4+E5/.5 E4+A4+C5+E5/.5 E4+A4+C5+E5/.5 | r/.5 D4+F4+C5+D5/1.5 F4+A4+C5+F5/.75 A4+F5+G5+A5/.75 Bb4+C5+F5+Bb5/.5 | F6/.25 E6/.25 D6/.25 C6/.25 Bb4+D5+F5+Bb5/.5 Bb4+Bb5/.5 Bb4+D5+F5+Bb5/.75 A4+D5+F5+A5/.75 G4+A4+D5+G5/.5 | Bb5/.25 A5/.25 G5/.25 F5/.25 E5/.25 D5/.25 C4+C5/.5 A4+E5+G5+A5/.75 A4+A5/.5 G4+G5/.25 A4+F5+G5+A5/.5 | G6/.25 F6/.25 E6/.25 D6/.25 C6/.25 A5/.25 G4+A4+C5+G5/1.5 A4+F5+G5+A5/1 | E4+C5+D5+E5/.75 F4+A4+C5+F5/.75 F4+F5/.25 G4+G5/.25 A4+F5+G5+A5/.75 A4+F5+G5+A5/.75 Bb4+C5+F5+Bb5/.5 | F6/.25 E6/.25 D6/.25 C6/.25 Bb4+D5+F5+Bb5/.5 Bb4+Bb5/.5 Bb4+D5+F5+Bb5/.75 D5+F5+Bb5+D6/.75 C5+D5+F5+C6/.5 | E6/.25 D6/.25 C6/.25 Bb5/.25 A5/.25 G5/.25 F4+F5/.5 C5+E5+G5+C6/.75 G4+D5+E5+G5/.75 A4+F5+G5+A5/.5 | r/.5 F5/.25[mp,dim] E5/.25 D5/.25 C5/.25 A4/.5 G4+C5/.5 C5/.5 C5+E5/.5 C5+E5/.5 | r/.5 C5+F5/1.5 C4+F4/.75 F4+A4/.75 F4+Bb4/.5 | r/.5 Bb4/.5 F4+Bb4/.5 Bb4/.5 F4+Bb4/.75 Bb4+D5/.75 Bb4+C5/.5 | r/.5 G4/.25[rit] F4/.25 E4/.25 D4/.25 C4/.5 E4+A4/.75 C4+E4/.75 F4/.25 G4/.25 | r/2 G4+A4+C5+D5+F5/2[arp,ferm,p]',
    lh: 'F2/.5 C3/.5 A3/3 | C3/.5 F3/.5 D4/3 | F2/1 C3/1 A3/2 | F2/1 C3/2 E2/1 | D3/1 A3/1 F4/2 | D3/1 A3/1 F4/2 | Bb2/1.5 Bb2/1 F3/1.5 | Bb2/1 F3/1 C3/1 F3/1 | F2/1 C3/1 A3/2 | F2/1 C3/1 A3/2 | F2/1 C3/1 A3/2 | F2/1 C3/2 E2/1 | D3/1 A3/1 F4/2 | D3/1 A3/1 C3/1 F3/1 | Bb2/1 F3/1 D4/2 | Bb2/1 Bb2/.5 C3/1 G3/1.5 | F2/1 C3/1 F3/1 C3/1 | A2/1 F3/1 A3/1 F3/1 | Bb2/1 F3/1 Bb3/1 F3/.5 Bb2/.5 | C3/1 G3/1 C4/1 G3/1 | F2/1 C3/1 E2/1 C3/1 | D3/1 A3/1 C3/1 F3/.5 Bb2/.5 | Bb2/1 F3/1 Bb3/1 F3/.5 Bb2/.5 | G2/1 D3/1 C3/1 G3/.5 F2/.5 | F2/.5 C3/.5 A3/1 F2/.5 C3/.5 A3/1 | F2/.5 C3/.5 A3/1 F2/.5 C3/.5 A3/1 | F2/.5 C3/.5 A3/1 F2/.5 C3/.5 A3/1 | F2/.5 C3/.5 A3/1 F2/.5 C3/.5 C#3/.5 G3/.5 | D3/.5 A3/.5 F4/1 D3/.5 A3/.5 r/1 | D3/.5 A3/.5 F4/1 C3/.5 F3/.5 C4/1 | Bb2/.75 Bb2/.5 F3/.5 D4/1 Bb2/.5 F3/.75 | Bb2/.5 F3/.5 D4/1 C3/.5 G3/.5 F4/1 | F2/.5 C3/.5 A3/1 F2/.5 C3/.5 A3/1 | F2/.5 C3/.5 A3/1 F2/.5 C3/.5 A3/1 | F2/.5 C3/.5 A3/1 F2/.5 C3/.5 A3/1 | F2/.5 C3/.5 A3/1 F2/.5 C3/.5 C#3/.5 G3/.5 | D3/.5 A3/.5 F4/1 D3/.5 A3/.5 r/1 | D3/.5 A3/.5 F4/1 C3/.5 F3/.5 C4/1 | Bb2/.5 F3/.5 D4/1 Bb2/.5 F3/.5 D4/1 | G2/.5 D3/.5 G2/.5 C3/.5 G3/.5 F4/1 C3/.5 | F1+F2/1.5 G3+A3+C4/1.5 C3/1 | A1+A2/1.5 G3+A3+C4/2 Bb1+Bb2/.5 | Bb1+Bb2/1.5 F3+C4/1.5 Bb1+Bb2/1 | C2+C3/1.5 G3+D4+E4/2 F1+F2/.5 | F1+F2/1.5 G3+A3+C4/.5 E2/1.5 E3+G3+D4/.5 | D2+D3/1.5 D4/.5 C2+C3/1.5 Bb1+Bb2/.5 | Bb1+Bb2/1.5 C3+F3/1.5 Bb1+Bb2/1 | G1+G2/1.5 G4/.5 C2+C3/1.5 F1+F2/.5 | F1+F2/1 C3+G3+A3/1 F1+F2/1 F2/.5 Bb2/.5 | F1+F2/1 C3+G3+A3/1 A1+A2/1 A2/.5 Bb2/.5 | Bb1+Bb2/1 C3+F3/1 Bb1+Bb2/1 Bb1+Bb2/1 | C2+C3/1 D3+E3+G3/1 C2+C3/1 C3/.5 F2/.5 | F1+F2/1 C3+G3+A3/1 E2/1 D3+E3+G3/1 | D2+D3/1 D4/1 C2+C3/1 C3/.5 Bb2/.5 | Bb1+Bb2/1 C3+F3/1 Bb1+Bb2/1 Bb1+Bb2/1 | G1+G2/1 G4/1 C2+C3/1 C3/.5 F2/.5 | C3+G3+A3/4 | C3+G3+A3/4 | C3+G3+A3/2 Eb3+G3+A3+C4/2 | D3+F3+C4/3 D3+F3+Ab3/1 | C3+G3+A3/4 | D4/4 | G4/4 | D3+F3+A3+C4/2 D3+F3+G3+Bb3/2 | F1/1 C3+G3+A3/1 F1/1 C3+G3+A3/1 | F1/1 C3+G3+A3/1 F1/1 C3+G3+A3/1 | D2/1 F3+A3+C4+E4/1 A1/1 G3+A3+C4+Eb4/1 | Bb1/1 F3+A3+C4+D4/1 Bb1/1 F3+A3+C4+D4/1 | F1/1 G3+A3+C4/1 E2/1 G3+B3+C#4+E4/1 | D2/1 D4/1 C2/1 D4/1 | G1/1 G4/1 G1/1 A1/1 | D2/1 F3+C4+D4/1 E2/1 E3+G3+D4/1 | F1+F2/1.5 F1+F2/1.5 C3+F3/1 | F1+F2/1.5 C3/.5 A1+A2/1.5 Bb1+Bb2/.5 | Bb1+Bb2/1.5 F3/1.25 Bb1+Bb2/1.25 | C2+C3/1.5 G3/.5 C2+C3/1.5 F1+F2/.5 | F1+F2/1.5 F1+F2/1.5 C3+F3/1 | D2+D3/1.5 A3/.5 A1+A2/1.5 Bb1+Bb2/.5 | Bb1+Bb2/1.5 F3/1.25 Bb1+Bb2/1.25 | G1+G2/1.5 D3/.5 C2+C3/1.5 F1+F2/.5 | F1+F2/1.5 F1+F2/1.5 C3+F3/1 | E2/.75 F1+F2/1.25 A1+A2/1.5 Bb1+Bb2/.5 | Bb1+Bb2/1.5 Bb1+Bb2/1.5 F3+Bb3/1 | C2+C3/1.5 G3/.5 C2+C3/1.5 F1+F2/.5 | F2/1 C3/1 E2/1 C3/1 | D3/1 A3/1 C3/1.5 Bb2/.5 | Eb3/1 Bb3/1 Bb2/1 F3/1 | G2/1 D3/1 C3/1.5 F2/.5 | F1/.5 C2/.5 F2/.5 A2/.5 C3/.5 F3/.5 A3/.5 C4/.5[ferm]',
  },
  pedal:
    'down@0 change@4 up@7 down@8 change@12 change@15 change@16 change@20 change@24 change@25.5 change@28 change@30 change@32 change@36 up@39 down@40 change@44 change@47 change@48 change@52 change@54 change@56 change@60 change@61 change@61.5 change@64 up@67 down@68 up@69 down@72 change@75.5 change@76 change@80 change@82 change@84 change@86 change@87.5 change@88 change@91.5 change@92 change@94 change@95.5 change@96 up@96 down@100 up@103 down@104 up@106.5 down@108 change@111 change@112 up@114.5 down@116 change@118 change@120 change@120.75 up@122.5 down@124 change@126 change@128 change@132 up@134 down@136 up@138.5 down@140 change@143 change@144 up@146.5 down@148 change@150 change@152 up@154 down@156 change@157 change@157.5 change@160 change@164 up@165 down@167.5 change@168 up@168 down@171 change@172 up@172 down@175.5 change@176 up@176 down@178 change@180 change@182 change@183.5 change@184 change@187 change@188 up@188 down@190 change@191.5 change@192 up@192 down@195.5 change@196 up@197 down@198 change@199.5 change@200 up@200 down@203 change@204 up@204 down@207.5 change@208 up@208 down@210 change@212 change@214 change@215.5 change@216 change@219 change@220 up@220 down@222 change@223.5 change@224 up@224.5 down@228 change@232 change@234 change@236 change@239 change@240 change@244 change@248 change@252 change@254 change@256 up@258 down@260 up@260 down@264 up@265 down@266 change@268 change@272 up@273 down@274 up@275 down@276 change@278 change@280 up@281 down@283 change@284 up@285 down@286 up@287 down@288 up@289.25 down@292 up@293 down@294 change@295.5 change@296 up@296 down@298.75 change@300 up@300 down@302 change@303.5 change@304 up@304 down@308 change@310 change@311.5 change@312 up@312 down@314.75 change@316 up@316 down@318 change@319.5 change@320 up@320 down@324 change@324.75 change@326 change@327.5 change@328 up@328 down@332 up@332 down@334 change@335.5 change@336 up@336.5 down@338 change@340 change@342 change@343.5 change@344 change@346 change@348 up@348.5 down@350 change@351.5 change@352 up@356',
})
