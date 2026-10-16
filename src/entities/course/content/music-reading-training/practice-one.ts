import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Reading drill: every note of the course's positions mixed, the treble staff and the bass in turn. */
const practiceOne: Lesson = {
  id: 'practice-one',
  title: { en: 'Practice and repetition 1', ru: 'Практика и повторение 1' },
  summary: {
    en: 'Review every position so far: read lines in both clefs, then pass a tune from hand to hand.',
    ru: 'Повторить все позиции: читать строки в обоих ключах, затем передавать мелодию из руки в руку.',
  },
  sections: [
    {
      heading: { en: 'Treble warm-up', ru: 'Разминка в скрипичном ключе' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Right thumb on middle C, the C position. Play each line once slowly, then once a little faster.',
            ru: 'Первый палец правой руки на до первой октавы, в позиции до. Сыграйте каждую строку сначала медленно, затем чуть быстрее.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 E4 C4/2 D4 F4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'treble', notes: 'G4 E4 F4 D4 E4 C4 D4/2 E4 G4 F4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Bass warm-up', ru: 'Разминка в басовом ключе' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Left thumb on C3, finger 5 on F2. Read from two landmarks: G2 on the bottom line and C3 in the second space.',
            ru: 'Первый палец левой руки на до малой октавы, пятый на фа. Читайте от двух ориентиров: соль на нижней линейке и до во втором промежутке.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 B2 A2 G2 F2 A2 C3/2 B2 G2 A2 B2 C3/1' },
        { kind: 'notes', clef: 'bass', notes: 'F2 G2 A2 F2 G2 B2 A2/2 C3 A2 G2 B2 C3/1' },
      ],
    },
    {
      heading: { en: 'Landmarks in both clefs', ru: 'Ориентиры в обоих ключах' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each clef marks its own note: the treble clef G4, the bass clef F3. Middle C sits between the two staves and belongs to both.',
            ru: 'Каждый ключ отмечает свою ноту: скрипичный — соль, басовый — фа. До первой октавы стоит между станами и принадлежит обоим.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 G4/2 E4/2 C4/2' },
        { kind: 'notes', clef: 'bass', notes: 'C4/2 F3/2 A3/2 C4/2' },
      ],
    },
    {
      heading: { en: 'The left hand higher up', ru: 'Левая рука выше' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Now the left hand plays the two higher positions. In the first line, finger 5 is on C3. In the second, it is on F3.',
            ru: 'Теперь левая рука играет в двух верхних позициях. В первой строке пятый палец на до, во второй — на фа.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 D3 C3 E3 D3/2 E3 D3 C3 D3 C3/1' },
        { kind: 'notes', clef: 'bass', notes: 'F3 G3 A3 B3 A3 F3 G3/2 B3 G3 A3 F3 G3/1' },
      ],
    },
    {
      heading: { en: 'Hands in turn', ru: 'Руки по очереди' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Here the tune passes from hand to hand. Play the treble line with the right hand, then answer it with the left on the bass line.',
            ru: 'Здесь мелодия переходит из руки в руку. Сыграйте строку в скрипичном ключе правой рукой, затем ответьте левой по басовой строке.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4/2 F4 E4 D4/2 E4 D4 C4 D4 E4/1' },
        { kind: 'notes', clef: 'bass', notes: 'A2 B2 C3/2 B2 A2 G2/2 A2 G2 F2 G2 A2/1' },
      ],
    },
    {
      heading: { en: 'In 3/4', ru: 'В размере 3/4' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'These lines have three beats to a bar. Play beat 1 a little stronger and keep counting 1 2 3.',
            ru: 'В этих строках по три доли в такте. Играйте первую долю чуть сильнее и не теряйте счёт «раз, два, три».',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'C4 E4 G4 F4/2 D4 E4 G4 E4 C4/2.' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'C3 A2 F2 G2/2 B2 A2 F2 A2 C3/2.' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the bottom line of the treble staff, then of the bass staff.',
            ru: 'Сыграйте нижнюю линейку скрипичного стана, затем басового.',
          },
          answer: { notes: ['E', 'G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bass staff’s middle line, then the treble staff’s.',
            ru: 'Сыграйте среднюю линейку басового стана, затем скрипичного.',
          },
          answer: { notes: ['D', 'B'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bass staff’s top line, then middle C.',
            ru: 'Сыграйте верхнюю линейку басового стана, затем до первой октавы.',
          },
          answer: { notes: ['A', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'The C position in the Player', ru: 'Позиция до в плеере' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
  ],
}

export default practiceOne
