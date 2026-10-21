import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const leftHand: Lesson = {
  id: 'left-hand',
  title: { en: 'Playing with the left hand', ru: 'Игра левой рукой' },
  summary: {
    en: 'Put the left hand in the C position, read the bass clef and play a tune and bass notes.',
    ru: 'Поставить левую руку в позицию до, читать басовый ключ, сыграть мелодию и басы.',
  },
  sections: [
    {
      heading: { en: 'The left hand’s C position', ru: 'Позиция до в левой руке' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The left-hand C position', ru: 'Позиция до в левой руке' },
          text: {
            en: 'puts finger 5 on the C below middle C and the thumb on G. Going up, the fingers count down: 5 4 3 2 1.',
            ru: '— пятый палец на до малой октавы, большой на соль. Когда вы идёте вверх, номера пальцев убывают: 5 4 3 2 1.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3 F3 E3 D3 C3/1' },
      ],
    },
    {
      heading: { en: 'The bass clef', ru: 'Басовый ключ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The bass clef', ru: 'Басовый ключ' },
          text: {
            en: 'is the sign for low notes, which the left hand usually plays. Its two dots sit either side of the F line.',
            ru: '— знак для низких нот, которые обычно играет левая рука. Его две точки стоят по сторонам линейки фа.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F3/1' },
      ],
    },
    {
      heading: { en: 'Lines and spaces', ru: 'Линейки и промежутки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Read the bass staff from the bottom up. The lines are G B D F A, and the spaces are A C E G.',
            ru: 'Читайте басовый стан снизу вверх. На линейках соль, си, ре, фа, ля, в промежутках ля, до, ми, соль.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'G2 B2 D3 F3 A3/1' },
        { kind: 'notes', clef: 'bass', notes: 'A2 C3 E3 G3' },
      ],
    },
    {
      heading: { en: 'A tune in the left hand', ru: 'Мелодия в левой руке' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Here is Hot Cross Buns an octave lower. The left hand plays E, D and C with fingers 3, 4 and 5.',
            ru: 'Это «Горячие булочки» октавой ниже. Левая рука играет ми, ре и до пальцами 3, 4 и 5.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'E3 D3 C3/2 E3 D3 C3/2 C3/8 C3/8 C3/8 C3/8 D3/8 D3/8 D3/8 D3/8 E3 D3 C3/2',
        },
        {
          kind: 'link',
          title: { en: 'Hot Cross Buns in the Player', ru: '«Горячие булочки» в плеере' },
          target: { opens: 'piece', piece: 'hot-cross-buns' },
        },
      ],
    },
    {
      heading: { en: 'Bass notes', ru: 'Басы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A bass note', ru: 'Бас' },
          text: {
            en: 'is a low note that supports the tune, often one per bar. In C major the most common are C and G, with fingers 5 and 1.',
            ru: '— низкая нота, которая поддерживает мелодию, часто одна на такт. В до мажоре чаще всего это до и соль, пальцы 5 и 1.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 G3/1 G3/1 C3/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'With the left hand in the C position, play up from finger 5 to the thumb.',
            ru: 'Левой рукой в позиции до сыграйте вверх от пятого пальца до большого.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the middle line of the bass staff.',
            ru: 'Сыграйте ноту на средней линейке басового стана.',
          },
          answer: { notes: ['D'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the two most common bass notes in C major.',
            ru: 'Сыграйте два самых частых баса в до мажоре.',
          },
          answer: { notes: ['C', 'G'] },
        },
        {
          kind: 'link',
          title: {
            en: 'The five-finger position in the Player',
            ru: 'Позиция пяти пальцев в плеере',
          },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default leftHand
