import type { Lesson } from '../model/types'

const dottedNotesAndTies: Lesson = {
  id: 'dotted-notes-and-ties',
  title: { en: 'Dotted notes, ties and the pickup', ru: 'Точки, лиги и затакт' },
  summary: {
    en: 'Read and count dots, ties, rests and the pickup.',
    ru: 'Читайте и считайте точки, лиги, паузы и затакт.',
  },
  sections: [
    {
      heading: { en: 'The dot adds half', ru: 'Точка добавляет половину' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A dot', ru: 'Точка' },
          text: {
            en: 'after a note adds half its value. A dotted half lasts three beats, a dotted quarter a beat and a half.',
            ru: 'после ноты добавляет половину её длительности. Половинная с точкой длится три доли, четвертная с точкой — полторы.',
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
            en: 'joins two notes of the same pitch. Play the first and hold it through the second, even across a barline.',
            ru: 'соединяет две ноты одной высоты. Сыграйте первую и держите её всю длину второй, даже через тактовую черту.',
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
            en: 'These two bars sound the same. Inside a bar, the dot is quicker to read. Across a barline, only a tie will do.',
            ru: 'Эти два такта звучат одинаково. Внутри такта точку читать проще. Через тактовую черту годится только лига.',
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
            en: 'is a silence with a value. Each note value has its rest, and a dot lengthens a rest as it does a note.',
            ru: '— молчание определённой длительности. У каждой ноты своя пауза, и точка удлиняет паузу так же, как ноту.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'r/1 C5/2 r/2 C5 r C5 r C5/8 r/8 C5/8 r/8 C5/4. r/8',
        },
        {
          kind: 'note',
          text: { en: 'Lift the hand on a rest.', ru: 'На паузе снимайте руку.' },
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
            en: 'comes before the first full bar. Here rests stand for the missing beats: count “1 2”, play on 3.',
            ru: '— звуки перед первым полным тактом. Здесь недостающие доли заменяют паузы: сосчитайте «раз, два» и вступайте на «три».',
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
            en: 'A dotted eighth lasts three quarters of a beat. The sixteenth after it takes the last quarter, just before the next beat.',
            ru: 'Восьмая с точкой длится три четверти доли. Шестнадцатая после неё занимает последнюю четверть, перед самой следующей долей.',
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
            en: 'Keep the short note short and late, or the figure loses its spring.',
            ru: 'Короткую ноту играйте коротко и поздно, иначе фигура теряет упругость.',
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
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default dottedNotesAndTies
