import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const newRightHandNotes: Lesson = {
  id: 'new-right-hand-notes',
  title: { en: 'New notes for the right hand', ru: 'Новые ноты для правой руки' },
  summary: {
    en: 'Reach A, B and high C, and move to the G position.',
    ru: 'Брать ля, си и до второй октавы, переходить в позицию соль.',
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
            ru: '— рука раскрывается к клавише за позицией. Так в «Звёздочке» берётся ля.',
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
            en: 'puts the thumb on the G above middle C. Fingers 1 to 5 play G, A, B, C, D.',
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
      heading: { en: 'Move the hand', ru: 'Смена позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the hand’s shape, lift it and land the thumb on the new key. Move during a long note or a rest.',
            ru: 'Сохраните форму руки, приподнимите её и поставьте большой палец на новую клавишу. Переходите на долгой ноте или паузе.',
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
            en: 'In the G position: start on D with finger 5, skip down to B, then climb back by step.',
            ru: 'В позиции соль: начните с ре пятым пальцем, скачком вниз к си, потом обратно по ступеням.',
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
            en: 'lasts half as long again. A dotted quarter and an eighth make two beats.',
            ru: 'длится в полтора раза дольше. Четверть с точкой и восьмая — две доли.',
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
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default newRightHandNotes
