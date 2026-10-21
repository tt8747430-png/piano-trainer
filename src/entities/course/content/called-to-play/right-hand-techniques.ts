import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 5: the right hand's first two techniques, on its study and its song. */
const rightHandTechniques: Lesson = {
  id: 'right-hand-techniques',
  title: { en: 'Right-hand techniques: ♪♩ and ♪♪♪♪', ru: 'Техники правой руки: ♪♩ и ♪♪♪♪' },
  summary: {
    en: 'Fill a held chord with the right hand: first with octave jumps, then with an arpeggio.',
    ru: 'Заполняйте выдержанный аккорд правой рукой: сначала скачками на октаву, затем арпеджио.',
  },
  sections: [
    {
      heading: { en: '♪♩: the chord, then octave jumps', ru: '♪♩: аккорд, затем скачки на октаву' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A technique', ru: 'Техника' },
          text: {
            en: 'keeps the same chord and gives the right hand a figure to play until the chord changes. In ♪♩ the chord’s root jumps up one octave, then two.',
            ru: 'сохраняет аккорд и даёт правой руке фигуру до следующей смены. В ♪♩ основной тон аккорда прыгает на октаву вверх, затем на две.',
          },
        },
        { kind: 'pattern', pattern: 't1', piece: 'ex5' },
      ],
    },
    {
      heading: { en: '♪♪♪♪: an arpeggio up two octaves', ru: '♪♪♪♪: арпеджио на две октавы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The right hand climbs the chord’s notes, 1–3–5–8, twice, with fingers 1–2–3–5. The left hand holds the bass.',
            ru: 'Правая рука дважды поднимается по звукам аккорда, 1–3–5–8, пальцами 1–2–3–5. Левая держит бас.',
          },
        },
        { kind: 'pattern', pattern: 't2', piece: 'ex5' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords with ♪♩, then with ♪♪♪♪.',
              ru: 'Сыграйте эту цепочку аккордов техникой ♪♩, затем ♪♪♪♪.',
            },
            {
              en: 'Play the lesson’s study.',
              ru: 'Сыграйте этюд урока.',
            },
            {
              en: 'Learn “All Glory to God in This World” with both techniques.',
              ru: 'Выучите «All Glory to God in This World» с обеими техниками.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Am', 'Dm', 'E', 'Am', 'F', 'C', 'Dm', 'E', 'Am'] },
        {
          kind: 'link',
          title: { en: 'The lesson’s study', ru: 'Этюд урока' },
          target: { opens: 'piece', piece: 'ex5' },
        },
        {
          kind: 'link',
          title: { en: 'All Glory to God in This World', ru: 'All Glory to God in This World' },
          target: { opens: 'piece', piece: 'glory' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play E major, the chord that leads back to Am.',
            ru: 'Сыграйте ми мажор — аккорд, который ведёт обратно к Am.',
          },
          answer: { chord: 'E' },
        },
      ],
    },
  ],
}

export default rightHandTechniques
