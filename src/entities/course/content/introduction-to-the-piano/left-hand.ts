import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const leftHand: Lesson = {
  id: 'left-hand',
  title: { en: 'Playing with the left hand', ru: 'Игра левой рукой' },
  summary: {
    en: 'Play in the left hand’s C position and read the bass clef.',
    ru: 'Играть левой рукой в позиции до и читать басовый ключ.',
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
            ru: '— пятый палец на до малой октавы, большой на соль. Вверх пальцы идут от пятого: 5 4 3 2 1.',
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
            en: 'marks F on the line between its two dots. The left hand reads it.',
            ru: 'отмечает фа на линейке между двумя точками. По нему читает левая рука.',
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
            en: 'From the bottom, the lines read G B D F A and the spaces A C E G.',
            ru: 'Снизу линейки: соль, си, ре, фа, ля. Промежутки: ля, до, ми, соль.',
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
            en: 'Hot Cross Buns an octave lower: E, D, C with fingers 3, 4 and 5.',
            ru: '«Горячие булочки» октавой ниже: ми, ре, до пальцами 3, 4 и 5.',
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
      heading: { en: 'Bass notes', ru: 'Басовые ноты' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A bass note', ru: 'Бас' },
          text: {
            en: 'is a low note under the tune, often one a bar. In C the most used are C and G, fingers 5 and 1.',
            ru: '— низкая нота под мелодией, часто одна на такт. В до мажоре чаще всего до и соль, пальцы 5 и 1.',
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
            en: 'With the left hand in the C position, play from finger 5 up to the thumb.',
            ru: 'Левой рукой в позиции до сыграйте от пятого пальца вверх до большого.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the bass staff’s middle line.',
            ru: 'Сыграйте ноту на средней линейке басового стана.',
          },
          answer: { notes: ['D'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the two bass notes used most in C.',
            ru: 'Сыграйте два баса, самые частые в до мажоре.',
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
