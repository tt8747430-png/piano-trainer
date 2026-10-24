import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Improvising with Chords, lesson 2: three 7th chords as three colours in a song. */
const fourNoteChords: Lesson = {
  id: 'four-note-chords',
  title: { en: 'Four-note chords', ru: 'Четырёхзвучные аккорды' },
  summary: {
    en: 'Add a 7th to a triad and learn the three 7th chords a song uses most: maj7, 7 and m7.',
    ru: 'Добавьте к трезвучию септиму и выучите три самых частых в песнях септаккорда: maj7, 7 и m7.',
  },
  sections: [
    {
      heading: { en: 'A triad and one more note', ru: 'Трезвучие и ещё один звук' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A seventh chord', ru: 'Септаккорд' },
          text: {
            en: 'is a triad with one more 3rd stacked on top. The new note is the 7th, and it gives the chord its colour.',
            ru: '— трезвучие, над которым надстроена ещё одна терция. Новый звук называется септимой, он и даёт аккорду окраску.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cmaj7', 'C7', 'Cm7'], apart: true },
      ],
    },
    {
      heading: { en: 'Major 7th: soft, on I and IV', ru: 'Большой мажорный: мягкий, на I и IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Cmaj7 adds B to C major, a semitone below the C an octave up. It sounds soft and dreamy. In a major key it suits the I and IV chords.',
            ru: 'Cmaj7 добавляет к до мажору си, на полутон ниже до октавой выше. Звучит мягко и мечтательно. В мажоре он подходит к I и IV ступеням.',
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
      heading: { en: 'Dominant 7th: restless, on V', ru: 'Доминантсептаккорд: неустойчивый, на V' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7 adds F to G major, a whole tone below the G an octave up. It sounds restless and pulls towards C. Play it on V.',
            ru: 'G7 добавляет к соль мажору фа, на тон ниже соль октавой выше. Звучит неустойчиво и тянется к C. Играйте его на V ступени.',
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
      heading: {
        en: 'Minor 7th: warm, on ii, iii and vi',
        ru: 'Малый минорный: тёплый, на II, III и VI',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Am7 adds G to A minor. It sounds warm and relaxed. In a major key it suits the minor chords on ii, iii and vi.',
            ru: 'Am7 добавляет соль к ля минору. Звучит тепло и спокойно. В мажоре он подходит к минорным аккордам II, III и VI ступеней.',
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
      heading: { en: 'A key in 7ths', ru: 'Тональность септаккордами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Every chord of a key can take its own 7th. In C major, I vi ii V becomes Cmaj7, Am7, Dm7 and G7.',
            ru: 'Любой аккорд тональности может получить свою септиму. В до мажоре I vi ii V превращается в Cmaj7, Am7, Dm7 и G7.',
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
            en: 'First play a song’s chords as plain triads. Then play maj7 on I and IV, and 7 on V. The melody stays the same while the harmony grows richer.',
            ru: 'Сначала сыграйте аккорды песни простыми трезвучиями. Затем возьмите maj7 на I и IV и 7 на V. Мелодия остаётся прежней, а гармония становится богаче.',
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
          title: { en: 'Kumbaya in the Player', ru: '«Кумбая» в плеере' },
          target: { opens: 'piece', piece: 'kumbaya' },
        },
      ],
    },
  ],
}

export default fourNoteChords
