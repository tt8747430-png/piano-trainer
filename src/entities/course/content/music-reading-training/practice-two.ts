import type { Lesson } from '@/entities/lesson'

/** Reading drill: leaps, quicker values and both clefs, each hand moving between positions. */
const practiceTwo: Lesson = {
  id: 'practice-two',
  title: { en: 'Practice and repetition 2', ru: 'Практика и повторение 2' },
  summary: {
    en: 'Harder mixed reading: leaps across the hand, a hand moving between positions, eighth notes and lines for both hands in turn.',
    ru: 'Более трудное смешанное чтение: скачки на всю руку, смена позиций, восьмые и строки для обеих рук по очереди.',
  },
  sections: [
    {
      heading: { en: 'Leaps in the right hand', ru: 'Скачки в правой руке' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A leap', ru: 'Широкий скачок' },
          text: {
            en: 'is any move wider than a skip. Read it as an interval from the last note, not letter by letter.',
            ru: '— любое движение шире терции. Читайте его как интервал от предыдущей ноты, а не по буквам.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 G4 E4 C4 F4/2 D4/2 G4 C4 F4 D4 C4/1' },
        { kind: 'notes', clef: 'treble', notes: 'G4 C4 D4 G4 E4 G4 C4/2 F4 C4 E4 G4 C4/1' },
      ],
    },
    {
      heading: { en: 'Leaps in the left hand', ru: 'Скачки в левой руке' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Bottom line to second space is G2 to C3, a fourth. Under the staff to second space is F2 to C3, a fifth.',
            ru: 'С нижней линейки во второй промежуток — соль — до, кварта. Из-под стана во второй промежуток — фа — до, квинта.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 F2 G2 C3 A2 F2 C3/2 G2 C3 B2 F2 G2/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play the leap from F2 up to C3.',
            ru: 'Сыграйте скачок от фа большой октавы вверх к до малой.',
          },
          answer: { notes: ['F', 'C'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Moving between positions', ru: 'Смена позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand starts with finger 5 on C3, then moves up to F3. Move the hand as the whole note ends.',
            ru: 'Левая рука начинает с пятого пальца на до, затем переходит на фа. Перенесите руку, когда закончится целая.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 D3 C3/1 F3 G3 A3 B3 A3 F3 G3/2 F3/1' },
      ],
    },
    {
      heading: { en: 'Eighth notes', ru: 'Восьмые' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes:
            'C4/8 D4/8 E4/8 F4/8 G4 E4 F4/8 E4/8 D4/8 E4/8 C4/2 E4/8 F4/8 G4/8 E4/8 D4 G4 C4/1',
        },
        {
          kind: 'text',
          text: {
            en: 'Count 1 and 2 and through the eighths. Read them in groups of two, a beat at a time.',
            ru: 'Считайте «раз-и, два-и» на восьмых. Читайте их парами, по одной доле.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes:
            'C3/8 B2/8 A2/8 G2/8 F2 A2 G2/8 A2/8 B2/8 G2/8 C3/2 F2 A2 G2/8 B2/8 C3/8 B2/8 C3/1',
        },
      ],
    },
    {
      heading: { en: 'Both hands in turn', ru: 'Обе руки по очереди' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play each treble line, then the bass line that answers it, without a gap between.',
            ru: 'Сыграйте каждую строку в скрипичном ключе, затем ответную в басовом, без паузы между ними.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 E4 C4 E4 F4 D4 G4/2 E4 C4 D4 G4 C4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 A2 F2 A2 B2 G2 C3/2 A2 F2 G2 C3 F2/1' },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'E4 G4 C4 D4/2 G4 F4 D4 E4 C4/2.' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'F3 A3 C4 B3/2 G3 A3 F3 G3 F3/2.' },
      ],
    },
    {
      heading: { en: 'Rests and long notes', ru: 'Паузы и долгие ноты' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4 r/4 G4 r/4 E4/2. r/4 F4 D4 G4/2 C4/1' },
        { kind: 'notes', clef: 'bass', notes: 'r/4 C3 G2 C3 F2/2. r/4 A2 B2 G2/2 C3/1' },
        {
          kind: 'note',
          text: {
            en: 'Count the rests as firmly as the notes.',
            ru: 'Отсчитывайте паузы так же твёрдо, как ноты.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the leap from middle C to the treble clef’s G.',
            ru: 'Сыграйте скачок от до первой октавы к соль скрипичного ключа.',
          },
          answer: { notes: ['C', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bass clef’s F, then middle C above it.',
            ru: 'Сыграйте фа басового ключа, затем до первой октавы над ней.',
          },
          answer: { notes: ['F', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bottom line of the bass staff, then the second space.',
            ru: 'Сыграйте нижнюю линейку басового стана, затем второй промежуток.',
          },
          answer: { notes: ['G', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the treble staff’s second line, then the first space below it.',
            ru: 'Сыграйте вторую линейку скрипичного стана, затем первый промежуток под ней.',
          },
          answer: { notes: ['G', 'F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bass staff’s top space, then its top line.',
            ru: 'Сыграйте верхний промежуток басового стана, затем верхнюю линейку.',
          },
          answer: { notes: ['G', 'A'], rising: true },
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

export default practiceTwo
