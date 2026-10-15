import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const newRightHandNotes: Lesson = {
  id: 'new-right-hand-notes',
  title: { en: 'New notes for the right hand', ru: 'Новые ноты для правой руки' },
  summary: {
    en: 'A, B and the C above: reached by opening the hand, or by moving it to the G position.',
    ru: 'Ля, си и до второй октавы: к ним тянется раскрытая рука или переходит в позицию соль.',
  },
  sections: [
    {
      heading: { en: 'Above G', ru: 'Выше соль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'After G come A, B and C again. That C, an octave above middle C, sits in the third space.',
            ru: 'После соль идут ля, си и снова до. Это до второй октавы, в третьем промежутке.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5 B4 A4 G4 F4 E4 D4 C4/2' },
        {
          kind: 'question',
          ask: {
            en: 'From the G above middle C, play G, A, B and C going up.',
            ru: 'От соль первой октавы сыграйте вверх соль, ля, си и до.',
          },
          answer: { notes: ['G', 'A', 'B', 'C'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Open the hand', ru: 'Раскройте руку' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An extension', ru: 'Растяжка' },
          text: {
            en: 'opens the hand to reach one key past the position. Twinkle reaches A this way.',
            ru: '— рука раскрывается, чтобы достать клавишу за пределами позиции. Так в «Звёздочке» берётся ля.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4 G4 G4 A4 A4 G4/2 F4 F4 E4 E4 D4 D4 C4/2' },
        {
          kind: 'note',
          text: {
            en: 'Fingers 1 1 4 4 5 5 4, then 4 4 3 3 2 2 1.',
            ru: 'Пальцы 1 1 4 4 5 5 4, затем 4 4 3 3 2 2 1.',
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
            en: 'puts the thumb on the G above middle C. Fingers 1 to 5 then play G, A, B, C, D.',
            ru: '— большой палец на соль первой октавы. Пальцы 1–5 играют соль, ля, си, до, ре.',
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
      heading: { en: 'Moving the hand', ru: 'Смена позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the hand’s shape, lift it, and land the thumb on the new key. Move during a long note or a rest.',
            ru: 'Сохраните форму руки, приподнимите её и поставьте большой палец на новую клавишу. Переходите на долгой ноте или паузе.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4/2 r/1 B4 A4 G4/2' },
        {
          kind: 'note',
          text: {
            en: 'Fingers 3 2 1 in both places.',
            ru: 'В обеих позициях пальцы 3 2 1.',
          },
        },
      ],
    },
    {
      heading: { en: 'Lightly Row', ru: '«Лодочка»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Moved to the G position, this tune starts on D, finger 5, and skips down to B. Later it climbs back up by step.',
            ru: 'Перенесённая в позицию соль, мелодия начинается с ре пятым пальцем и скачком спускается к си. Потом поднимается обратно по ступеням.',
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
      heading: { en: 'Ode to Joy', ru: '«Ода к радости»' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A dotted note', ru: 'Нота с точкой' },
          text: {
            en: 'lasts half as long again. In Ode to Joy, a dotted quarter and an eighth make two beats.',
            ru: 'длится в полтора раза дольше. В «Оде к радости» четверть с точкой и восьмая занимают две доли.',
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
            en: 'In the G position, play from the thumb up to finger 5.',
            ru: 'В позиции соль сыграйте от большого пальца вверх до пятого.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the key finger 5 reaches for in Twinkle.',
            ru: 'Сыграйте клавишу, к которой тянется пятый палец в «Звёздочке».',
          },
          answer: { notes: ['A'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the first three different notes of Ode to Joy here: B, C, D.',
            ru: 'Сыграйте три первые разные ноты «Оды к радости» здесь: си, до, ре.',
          },
          answer: { notes: ['B', 'C', 'D'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Twinkle in the Player', ru: '«Звёздочка» в плеере' },
          target: { opens: 'piece', piece: 'twinkle' },
        },
        {
          kind: 'link',
          title: { en: 'Lightly Row in the Player', ru: '«Лодочка» в плеере' },
          target: { opens: 'piece', piece: 'lightly-row' },
        },
        {
          kind: 'link',
          title: { en: 'Ode to Joy in the Player', ru: '«Ода к радости» в плеере' },
          target: { opens: 'piece', piece: 'ode' },
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
