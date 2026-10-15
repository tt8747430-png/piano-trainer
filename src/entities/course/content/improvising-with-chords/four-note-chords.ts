import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

/** Improvising with Chords, lesson 2: three 7th chords as three colours in a song. */
const fourNoteChords: Lesson = {
  id: 'four-note-chords',
  title: { en: 'Four-note chords', ru: 'Четырёхзвучные аккорды' },
  summary: {
    en: 'Add a 7th to a triad and it gains a colour: dreamy maj7, restless 7, mellow m7. Learn where each fits in a song.',
    ru: 'Добавьте к трезвучию септиму, и у него появится окраска: мечтательный maj7, беспокойный 7, мягкий m7. Узнайте, где каждый уместен в песне.',
  },
  sections: [
    {
      heading: { en: 'A triad and one more note', ru: 'Трезвучие и ещё один звук' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Seventh chord:', ru: 'Септаккорд:' },
          text: {
            en: 'a triad with one more 3rd on top, four notes in all. The new note, the 7th, gives the chord its colour.',
            ru: 'трезвучие с ещё одной терцией сверху, всего четыре звука. Новый звук, септима, придаёт аккорду окраску.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cmaj7', 'C7', 'Cm7'], apart: true },
      ],
    },
    {
      heading: { en: 'Major 7th: dreamy', ru: 'Большой мажорный: мечтательный' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Cmaj7 adds B, a semitone below the top C. It sounds soft and dreamy. It suits the I and IV chords.',
            ru: 'Cmaj7 добавляет си, на полутон ниже верхнего до. Он звучит мягко и мечтательно. Подходит для аккордов I и IV ступеней.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cmaj7', degrees: '1 | 3 5 7', hands: 'C3 | E4 G4 B4' },
            { symbol: 'Fmaj7', degrees: '1 | 3 5 7', hands: 'F2 | A4 C5 E5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Dominant 7th: restless', ru: 'Доминантсептаккорд: беспокойный' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7 adds F, a whole tone below the top G. It sounds restless and wants to move to C. It belongs on V.',
            ru: 'G7 добавляет фа, на тон ниже верхнего соль. Он звучит неустойчиво и стремится к C. Его место — на V ступени.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'G7', degrees: '1 | ♭7 3 5', hands: 'G2 | F4 B4 D5' },
            { symbol: 'C', degrees: '1 | 3 5 1', hands: 'C3 | E4 G4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Minor 7th: mellow', ru: 'Малый минорный: мягкий' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Am7 adds G to A minor. It sounds warm and relaxed. It suits the ii, iii and vi chords.',
            ru: 'Am7 добавляет соль к ля минору. Он звучит тепло и спокойно. Подходит для аккордов II, III и VI ступеней.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Am7', degrees: '1 | ♭3 5 ♭7', hands: 'A2 | C4 E4 G4' },
            { symbol: 'Dm7', degrees: '1 | ♭3 5 ♭7', hands: 'D3 | F4 A4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'A key in four colours', ru: 'Тональность в четырёх красках' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Every chord of a key can take its 7th. In C, I–vi–ii–V becomes Cmaj7, Am7, Dm7, G7.',
            ru: 'Любой аккорд тональности может получить септиму. В до мажоре I–vi–ii–V превращается в Cmaj7, Am7, Dm7, G7.',
          },
        },
        { kind: 'progression', numerals: 'I vi ii V', key: C_MAJOR, size: 'sevenths' },
        {
          kind: 'link',
          title: { en: 'I–vi–ii–V in 7ths in the Player', ru: 'I–vi–ii–V септаккордами в плеере' },
          target: { opens: 'player', numerals: 'I vi ii V', key: C_MAJOR, size: 'sevenths' },
        },
      ],
    },
    {
      heading: { en: 'Colour a song', ru: 'Раскрасьте песню' },
      blocks: [
        {
          kind: 'chords',
          symbols: ['C', 'F', 'G7', 'C', 'Cmaj7', 'Fmaj7', 'G7', 'Cmaj7'],
        },
        {
          kind: 'text',
          text: {
            en: 'Play a song’s chords plain, then add 7ths: maj7 on I and IV, a 7th on V. Keep the melody and listen to it glow.',
            ru: 'Сыграйте аккорды песни просто, затем добавьте септимы: maj7 на I и IV, доминантсептаккорд на V. Мелодия та же, а звучит теплее.',
          },
        },
        {
          kind: 'link',
          title: {
            en: 'Swing Low, Sweet Chariot in the Player',
            ru: '«Swing Low, Sweet Chariot» в плеере',
          },
          target: { opens: 'piece', piece: 'swing-low' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play Cmaj7.', ru: 'Сыграйте Cmaj7.' },
          answer: { chord: 'Cmaj7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play G7.', ru: 'Сыграйте G7.' },
          answer: { chord: 'G7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Am7.', ru: 'Сыграйте Am7.' },
          answer: { chord: 'Am7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the IV chord of C as a major 7th.',
            ru: 'Сыграйте аккорд IV ступени до мажора как большой мажорный септаккорд.',
          },
          answer: { chord: 'Fmaj7' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
        {
          kind: 'link',
          title: { en: 'Cmaj7 arpeggio in the Player', ru: 'Арпеджио Cmaj7 в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('C'), quality: 'maj7' },
        },
        {
          kind: 'link',
          title: { en: 'Kumbaya in the Player', ru: '«Кумбая» в плеере' },
          target: { opens: 'piece', piece: 'kumbaya' },
        },
      ],
    },
  ],
}

export default fourNoteChords
