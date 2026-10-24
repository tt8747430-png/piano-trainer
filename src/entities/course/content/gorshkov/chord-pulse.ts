import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/**
 * Gorshkov's lesson 4, «Аранжировка аккомпанемента: аккордовая пульсация»: harmony turned into
 * texture, from less to more.
 */
const chordPulse: Lesson = {
  id: 'chord-pulse',
  title: { en: 'Chord pulse', ru: 'Аккордовая пульсация' },
  summary: {
    en: 'Turn plain chords into an accompaniment: pulse, an added note, broken chords and figuration.',
    ru: 'Превратить простые аккорды в аккомпанемент: пульсация, добавочный звук, ломаные аккорды и фигурация.',
  },
  sections: [
    {
      heading: { en: 'From harmony to accompaniment', ru: 'От гармонии к аккомпанементу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Chords alone are not yet an accompaniment. Four elements turn harmony into texture, the way the chords are laid out in time:',
            ru: 'Аккорды сами по себе ещё не аккомпанемент. Гармонию превращают в фактуру, то есть в способ изложения аккордов во времени, четыре элемента:',
          },
        },
        { kind: 'chords', symbols: ['C', 'G', 'Am', 'F'] },
        {
          kind: 'steps',
          steps: [
            { en: 'Chord pulse', ru: 'Аккордовая пульсация' },
            { en: 'Harmonic figuration', ru: 'Гармоническая фигурация' },
            { en: 'Melodic figuration', ru: 'Мелодическая фигурация' },
            { en: 'Rhythmic figuration', ru: 'Ритмическая фигурация' },
          ],
        },
      ],
    },
    {
      heading: { en: 'From less to more', ru: 'От меньшего к большему' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Start plain and add movement as the song grows. First find its sections, where it builds and where it peaks.',
            ru: 'Начинайте просто и добавляйте движение по мере развития песни. Сначала найдите её разделы, нарастание и кульминацию.',
          },
        },
        { kind: 'pattern', pattern: 'block', piece: 'romashki' },
        {
          kind: 'note',
          text: {
            en: 'Use every device at once and the song has nothing left to grow into.',
            ru: 'Если использовать всё сразу, песне некуда развиваться.',
          },
        },
      ],
    },
    {
      heading: { en: 'Chord pulse', ru: 'Аккордовая пульсация' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Chord pulse:', ru: 'Аккордовая пульсация:' },
          text: {
            en: 'a chord on every beat. Play beats 1 and 4 brighter, beats 2 and 3 softer.',
            ru: 'аккорд на каждую долю. Первую и четвёртую доли играйте ярче, вторую и третью мягче.',
          },
        },
        { kind: 'pattern', pattern: 'g1', piece: 'romashki' },
      ],
    },
    {
      heading: { en: 'A fourth note', ru: 'Четвёртый звук' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Give each chord a fourth note. A major triad takes its 2nd, written add2. A minor triad grows into a 7th or a 9th chord.',
            ru: 'Добавьте в аккорд четвёртый звук. Мажорное трезвучие получает вторую ступень, это add2. Минорное расширяется до септ- или нонаккорда.',
          },
        },
        { kind: 'pattern', pattern: 'g2', piece: 'romashki' },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cadd2', degrees: '1 | 2 3 5', hands: 'C3 | D4 E4 G4' },
            { symbol: 'Gadd2', degrees: '1 | 2 3 5', hands: 'G2 | A3 B3 D4' },
            { symbol: 'Am9', degrees: '1 | ♭7 9 ♭3 5', hands: 'A2 | G3 B3 C4 E4' },
            { symbol: 'Fadd2', degrees: '1 | 2 3 5', hands: 'F2 | G3 A3 C4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'A major triad can also grow into Maj7 or Maj9.',
            ru: 'Мажорное трезвучие можно расширить и до Maj7 или Maj9, если позволяет гармония.',
          },
        },
      ],
    },
    {
      heading: { en: 'Broken chords for a new section', ru: 'Ломаные аккорды для нового раздела' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Songs fall into phrases of 4, 8 or 16 bars. Mark a new section with a new texture: break the chords into eighths.',
            ru: 'Песни строятся из фраз по 4, 8 или 16 тактов. Отметьте новый раздел новой фактурой: разложите аккорды восьмыми.',
          },
        },
        { kind: 'pattern', pattern: 'g3', piece: 'romashki' },
        {
          kind: 'note',
          text: {
            en: 'Find the phrase first, then choose what fills it.',
            ru: 'Сначала определите фразу, затем решайте, чем её заполнить.',
          },
        },
      ],
    },
    {
      heading: { en: 'Harmonic figuration', ru: 'Гармоническая фигурация' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Harmonic figuration:', ru: 'Гармоническая фигурация:' },
          text: {
            en: 'the chord’s notes played one after another.',
            ru: 'звуки аккорда, сыгранные один за другим.',
          },
        },
        { kind: 'pattern', pattern: 'g4', piece: 'romashki' },
        {
          kind: 'note',
          text: {
            en: 'A good mix: pulse on beats 1 to 3, then figuration on beat 4.',
            ru: 'Хорошо сочетать пульсацию на первые три доли и фигурацию на четвёртую.',
          },
        },
        { kind: 'pattern', pattern: 'g5', piece: 'romashki' },
      ],
    },
    {
      heading: { en: 'ii and V over a held note', ru: '2-5 на долгой ноте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'When the melody holds a long note on V before I, that bar can carry both ii and V. In “What a Friend”, Gorshkov writes II and V over the G, then I on C.',
            ru: 'Когда мелодия тянет долгую ноту на V перед I, в этот такт помещается весь оборот 2-5. В «What a Friend» Горшков пишет II и V над соль, затем I на до.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'In a song', ru: 'В песне' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The verse pulses in quarter notes, with add2 chords. The chorus breaks the chords into eighths.',
            ru: 'Куплет пульсирует четвертями, с аккордами add2. В припеве аккорды раскладываются восьмыми.',
          },
        },
        { kind: 'chords', symbols: ['A', 'F♯m7', 'D', 'Bm7', 'Esus4'] },
        {
          kind: 'chords',
          symbols: ['A', 'E/G♯', 'F♯m7', 'Asus4/E', 'D', 'Bm9', 'Esus4', 'E'],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play Cadd2: C major with its 2nd.',
            ru: 'Сыграйте Cadd2: до мажор со второй ступенью.',
          },
          answer: { chord: 'Cadd2' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Am9.', ru: 'Сыграйте Am9.' },
          answer: { chord: 'Am9' },
        },
        {
          kind: 'link',
          title: { en: '“What a Friend” in the Player', ru: '«What a Friend» в плеере' },
          target: { opens: 'piece', piece: 'wafriend' },
        },
      ],
    },
  ],
}

export default chordPulse
