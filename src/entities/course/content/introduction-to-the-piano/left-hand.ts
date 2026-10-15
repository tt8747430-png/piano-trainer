import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const leftHand: Lesson = {
  id: 'left-hand',
  title: { en: 'Playing with the left hand', ru: 'Игра левой рукой' },
  summary: {
    en: 'The left hand’s C position below middle C, its mirrored fingers, the bass clef, and the tunes and bass notes it plays.',
    ru: 'Позиция до для левой руки ниже до первой октавы, зеркальные пальцы, басовый ключ, мелодии и басовые ноты.',
  },
  sections: [
    {
      heading: { en: 'The left hand’s C position', ru: 'Позиция до для левой руки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The left-hand C position', ru: 'Позиция до в левой руке' },
          text: {
            en: 'puts finger 5 on the C below middle C and the thumb on G.',
            ru: '— пятый палец на до малой октавы, большой палец на соль.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3 F3 E3 D3 C3/1' },
        {
          kind: 'note',
          text: {
            en: 'Going up, the left hand counts down: 5 4 3 2 1.',
            ru: 'Вверх левая рука идёт от пятого пальца к первому: 5 4 3 2 1.',
          },
        },
      ],
    },
    {
      heading: { en: 'The hands are mirrors', ru: 'Руки — зеркальные' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The thumb is always 1. So the same five keys take fingers 1 to 5 in the right hand and 5 to 1 in the left.',
            ru: 'Большой палец — всегда первый. Поэтому те же пять клавиш правая рука играет пальцами 1–5, а левая — 5–1.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
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
        {
          kind: 'question',
          ask: {
            en: 'Play the note the bass clef marks.',
            ru: 'Сыграйте ноту, которую отмечает басовый ключ.',
          },
          answer: { notes: ['F'] },
        },
      ],
    },
    {
      heading: { en: 'Lines and spaces in the bass', ru: 'Линейки и промежутки в басу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The lines read G B D F A from the bottom. The spaces read A C E G. The C position sits from the second space up.',
            ru: 'Линейки снизу: соль, си, ре, фа, ля. Промежутки: ля, до, ми, соль. Позиция до начинается со второго промежутка.',
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
            en: 'is a low note under the tune, often one long note a bar. In C the two most used are C and G, fingers 5 and 1.',
            ru: '— низкая нота под мелодией, часто одна долгая нота на такт. В до мажоре чаще всего это до и соль, пальцы 5 и 1.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 G3/1 G3/1 C3/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play the two bass notes the left hand uses most in C.',
            ru: 'Сыграйте два баса, которые левая рука чаще всего берёт в до мажоре.',
          },
          answer: { notes: ['C', 'G'] },
        },
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
            en: 'Play the key under the left thumb in the C position.',
            ru: 'Сыграйте клавишу под большим пальцем левой руки в позиции до.',
          },
          answer: { notes: ['G'] },
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
