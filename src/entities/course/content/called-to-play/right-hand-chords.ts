import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 7: dotted chords, three chords up the keys, and inversions. */
const rightHandChords: Lesson = {
  id: 'right-hand-chords',
  title: {
    en: 'Right-hand techniques: chords up the keyboard',
    ru: 'Техники правой руки: аккорды вверх по клавиатуре',
  },
  summary: {
    en: 'Move the whole chord up the keyboard: dotted chords, three chords, and inversions.',
    ru: 'Ведите весь аккорд вверх по клавиатуре: пунктиром, тремя аккордами и обращениями.',
  },
  sections: [
    {
      heading: { en: '♩.♪♩: dotted chords', ru: '♩.♪♩: пунктирные аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the chord long, then an octave higher, short and then long. Under it, the left hand plays a wide arpeggio.',
            ru: 'Сыграйте аккорд долго, затем октавой выше, коротко и долго. Под ним левая рука играет широкое арпеджио.',
          },
        },
        { kind: 'pattern', pattern: 't5', piece: 'ex7' },
      ],
    },
    {
      heading: { en: '3 chords', ru: '3 аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the chord three times, each an octave higher than the last. Hold the top one.',
            ru: 'Сыграйте аккорд три раза, каждый раз октавой выше. Верхний выдержите.',
          },
        },
        { kind: 'pattern', pattern: 'c3', piece: 'ex7' },
      ],
    },
    {
      heading: { en: 'Inversions', ru: 'Обращения' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'puts a note other than the root at the bottom. Play root position, then the 1st and 2nd inversions.',
            ru: '— это аккорд, в котором внизу не основной тон. Сыграйте основной вид, затем 1-е обращение, затем 2-е.',
          },
        },
        { kind: 'pattern', pattern: 'inv', piece: 'ex7' },
        {
          kind: 'note',
          text: {
            en: 'In C major: C E G, then E G C, then G C E.',
            ru: 'В до мажоре: до-ми-соль, затем ми-соль-до, затем соль-до-ми.',
          },
        },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords with each of the three techniques.',
              ru: 'Сыграйте эту цепочку аккордов каждой из трёх техник.',
            },
            { en: 'Play the lesson’s study.', ru: 'Сыграйте этюд урока.' },
            {
              en: 'Learn “For Love, For Mercy, For Salvation” by its plan.',
              ru: 'Выучите «For Love, For Mercy, For Salvation» по плану.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Am', 'Dm', 'E', 'Am', 'G', 'F', 'E', 'Am'] },
        {
          kind: 'link',
          title: { en: 'The lesson’s study', ru: 'Этюд урока' },
          target: { opens: 'piece', piece: 'ex7' },
        },
        {
          kind: 'link',
          title: {
            en: 'For Love, For Mercy, For Salvation',
            ru: 'For Love, For Mercy, For Salvation',
          },
          target: { opens: 'piece', piece: 'mercy' },
        },
      ],
    },
  ],
}

export default rightHandChords
