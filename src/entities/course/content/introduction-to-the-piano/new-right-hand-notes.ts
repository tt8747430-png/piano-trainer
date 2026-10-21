import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const newRightHandNotes: Lesson = {
  id: 'new-right-hand-notes',
  title: { en: 'New notes for the right hand', ru: 'Новые ноты для правой руки' },
  summary: {
    en: 'Learn A, B and the C above, stretch the hand to reach them and move to the G position.',
    ru: 'Выучить ля, си и до второй октавы, дотягиваться до них и переходить в позицию соль.',
  },
  sections: [
    {
      heading: { en: 'The notes above G', ru: 'Ноты выше соль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'After G come A, B and then C again. This C is an octave above middle C. It sits in the third space of the treble staff.',
            ru: 'После соль идут ля, си и снова до. Это до второй октавы, на октаву выше до первой. Оно стоит в третьем промежутке скрипичного стана.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5 B4 A4 G4 F4 E4 D4 C4/2' },
      ],
    },
    {
      heading: { en: 'Stretch to reach A', ru: 'Дотянитесь до ля' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An extension', ru: 'Растяжка' },
          text: {
            en: 'opens the hand to reach a key past the position. In Twinkle, finger 5 stretches to A.',
            ru: '— рука раскрывается, чтобы взять клавишу за пределами позиции. В «Звёздочке» пятый палец тянется к ля.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4 G4 G4 A4 A4 G4/2 F4 F4 E4 E4 D4 D4 C4/2' },
        {
          kind: 'note',
          text: {
            en: 'Fingers: 1 1 4 4 5 5 4, then 4 4 3 3 2 2 1.',
            ru: 'Пальцы: 1 1 4 4 5 5 4, затем 4 4 3 3 2 2 1.',
          },
        },
        {
          kind: 'link',
          title: { en: 'Twinkle in the Player', ru: '«Звёздочка» в плеере' },
          target: { opens: 'piece', piece: 'twinkle' },
        },
      ],
    },
    {
      heading: { en: 'The G position', ru: 'Позиция соль' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The G position', ru: 'Позиция соль' },
          text: {
            en: 'puts the right thumb on the G above middle C. Fingers 1 to 5 then play G, A, B, C and D.',
            ru: '— большой палец правой руки на соль первой октавы. Пальцы с первого по пятый играют соль, ля, си, до и ре.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 A4 B4 C5 D5 C5 B4 A4 G4/1' },
        {
          kind: 'link',
          title: { en: 'The five-finger position on G', ru: 'Позиция пяти пальцев от соль' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('G') },
        },
      ],
    },
    {
      heading: { en: 'Move the hand', ru: 'Смена позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the hand’s shape, lift it, and land the thumb on the new key. Move during a long note or a rest so the music does not stop.',
            ru: 'Сохраните форму руки, приподнимите её и поставьте большой палец на новую клавишу. Переходите на долгой ноте или паузе, чтобы музыка не прерывалась.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4/2 r/1 B4 A4 G4/2' },
      ],
    },
    {
      heading: { en: 'Lightly Row', ru: '«Лодочка»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play this tune in the G position. Start on D with finger 5, skip down to B, then climb back up by step.',
            ru: 'Играйте эту мелодию в позиции соль. Начните с ре пятым пальцем, скачком спуститесь к си, потом поднимитесь обратно шагами.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'D5 B4 B4/2 C5 A4 A4/2 G4 A4 B4 C5 D5 D5 D5/2' },
        {
          kind: 'link',
          title: { en: 'Lightly Row in the Player', ru: '«Лодочка» в плеере' },
          target: { opens: 'piece', piece: 'lightly-row' },
        },
      ],
    },
    {
      heading: { en: 'Dotted notes in Ode to Joy', ru: 'Ноты с точкой в «Оде к радости»' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A dot', ru: 'Точка' },
          text: {
            en: 'after a note makes it half as long again. A dotted quarter lasts one and a half beats, so with an eighth it fills two beats.',
            ru: 'после ноты удлиняет её наполовину. Четверть с точкой длится полторы доли, а вместе с восьмой заполняет две доли.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes:
            'B4 B4 C5 D5 D5 C5 B4 A4 G4 G4 A4 B4 B4/4. A4/8 A4/2 B4 B4 C5 D5 D5 C5 B4 A4 G4 G4 A4 B4 A4/4. G4/8 G4/2',
        },
        {
          kind: 'link',
          title: { en: 'Ode to Joy in the Player', ru: '«Ода к радости» в плеере' },
          target: { opens: 'piece', piece: 'ode' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'In the G position, play each finger in turn, from the thumb up to finger 5.',
            ru: 'В позиции соль сыграйте по очереди каждым пальцем, от большого до пятого.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the key finger 5 stretches to in Twinkle.',
            ru: 'Сыграйте клавишу, к которой тянется пятый палец в «Звёздочке».',
          },
          answer: { notes: ['A'] },
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

export default newRightHandNotes
