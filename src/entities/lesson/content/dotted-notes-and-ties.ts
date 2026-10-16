import type { Lesson } from '../model/types'

const dottedNotesAndTies: Lesson = {
  id: 'dotted-notes-and-ties',
  title: { en: 'Dotted notes, ties and the pickup', ru: 'Точки, лиги и затакт' },
  summary: {
    en: 'Make notes longer with dots and ties, count silences, and start a tune before the first full bar.',
    ru: 'Удлиняйте ноты точками и лигами, считайте паузы и начинайте мелодию до первого полного такта.',
  },
  sections: [
    {
      heading: { en: 'The dot adds half', ru: 'Точка добавляет половину' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A dot', ru: 'Точка' },
          text: {
            en: 'after a note makes it half as long again. A dotted half lasts three beats, two plus one. A dotted quarter lasts a beat and a half.',
            ru: 'после ноты удлиняет её наполовину. Половинная с точкой длится три доли, две плюс одна. Четвертная с точкой длится полторы доли.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/2. G4 C5/4. D5/8 E5/2' },
      ],
    },
    {
      heading: { en: 'Ties', ru: 'Лиги' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tie', ru: 'Лига' },
          text: {
            en: 'is a curved line joining two notes of the same pitch. Play the first note and hold it through the second without playing again. A tie can cross a barline.',
            ru: '— дуга, которая соединяет две ноты одной высоты. Сыграйте первую ноту и держите её всю длину второй, не повторяя. Лига может проходить через тактовую черту.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 G4 C5/2~ C5/2 B4/2 C5/1' },
      ],
    },
    {
      heading: { en: 'Tie or dot?', ru: 'Лига или точка?' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'These two bars sound the same. Inside a bar, a dot is quicker to read. Across a barline you need a tie.',
            ru: 'Эти два такта звучат одинаково. Внутри такта точку читать быстрее. Через тактовую черту нужна лига.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/4. D5/8 E5/2' },
        { kind: 'notes', clef: 'treble', notes: 'C5/4~ C5/8 D5/8 E5/2' },
      ],
    },
    {
      heading: { en: 'Rests', ru: 'Паузы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A rest', ru: 'Пауза' },
          text: {
            en: 'is a counted silence. Each note value has a matching rest. A dot makes a rest longer, just as it does a note.',
            ru: '— молчание, которое считают. У каждой длительности есть своя пауза. Точка удлиняет паузу так же, как ноту.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'r/1 C5/2 r/2 C5 r C5 r C5/8 r/8 C5/8 r/8 C5/4. r/8',
        },
        {
          kind: 'note',
          text: { en: 'Lift your hand during a rest.', ru: 'На паузе снимайте руку с клавиш.' },
        },
      ],
    },
    {
      heading: { en: 'The pickup', ru: 'Затакт' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A pickup', ru: 'Затакт' },
          text: {
            en: 'is one or more notes before the first full bar. Here rests fill the missing beats. Count 1 2 and come in on 3.',
            ru: '— одна или несколько нот перед первым полным тактом. Здесь недостающие доли заполняют паузы. Сосчитайте «раз, два» и вступайте на «три».',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'r/2 G4 C5/2 E5 D5/2 B4 C5/2 r/4' },
      ],
    },
    {
      heading: { en: 'The dotted eighth', ru: 'Восьмая с точкой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A dotted eighth lasts three quarters of a beat. The sixteenth after it fills the last quarter, just before the next beat.',
            ru: 'Восьмая с точкой длится три четверти доли. Шестнадцатая после неё заполняет последнюю четверть, прямо перед следующей долей.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8. D4/16 E4/8. F4/16 G4/8. A4/16 B4/8. C5/16 C5/1',
        },
        {
          kind: 'note',
          text: {
            en: 'Play the short note short and late. That gives the rhythm its bounce.',
            ru: 'Короткую ноту играйте коротко и поздно. От этого ритм пружинит.',
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
            en: 'Play C, D and E rising: a dotted quarter, an eighth, a half.',
            ru: 'Сыграйте до, ре и ми вверх: четвертную с точкой, восьмую, половинную.',
          },
          answer: { notes: ['C', 'D', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the pickup line’s first three notes: G, then the C and E above it.',
            ru: 'Сыграйте первые три ноты строки с затактом: соль, затем до и ми над ней.',
          },
          answer: { notes: ['G', 'C', 'E'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default dottedNotesAndTies
