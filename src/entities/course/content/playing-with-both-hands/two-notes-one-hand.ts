import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const twoNotesOneHand: Lesson = {
  id: 'two-notes-one-hand',
  title: { en: 'Playing multiple notes with one hand', ru: 'Несколько нот одной рукой' },
  summary: {
    en: 'Play 3rds in the right hand and 5ths in the left.',
    ru: 'Играть терции правой рукой и квинты левой.',
  },
  sections: [
    {
      heading: { en: 'Two notes at once', ru: 'Две ноты сразу' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An interval', ru: 'Интервал' },
          text: {
            en: 'is the distance between two notes. Played together, it is harmonic. One after the other, melodic.',
            ru: '— расстояние между двумя нотами. Вместе — гармонический, по очереди — мелодический.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
      ],
    },
    {
      heading: { en: 'A tune in 3rds', ru: 'Мелодия терциями' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 3rd', ru: 'Терция' },
          text: {
            en: 'spans three letters, C up to E: line to line or space to space. Press both keys at the same moment.',
            ru: 'охватывает три ступени, от до до ми: с линейки на линейку или с промежутка на промежуток. Нажимайте обе клавиши разом.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'E–G', caption: '3–5', hands: '| E4 G4' },
            { symbol: 'D–F', caption: '2–4', hands: '| D4 F4' },
            { symbol: 'C–E', caption: '1–3', hands: '| C4 E4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'The 5th in the left hand', ru: 'Квинта в левой руке' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 5th', ru: 'Квинта' },
          text: {
            en: 'spans five letters, C up to G. The left hand plays it with fingers 5 and 1, an open, strong bass.',
            ru: 'охватывает пять ступеней, от до до соль. Левая рука берёт её пальцами 5 и 1 — открытый, крепкий бас.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C–G', hands: 'C3 G3 |' },
            { symbol: 'F–C', hands: 'F2 C3 |' },
            { symbol: 'G–D', hands: 'G2 D3 |' },
            { symbol: 'C–G', hands: 'C3 G3 |' },
          ],
        },
      ],
    },
    {
      heading: { en: 'A tune over a 5th', ru: 'Мелодия над квинтой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hold C and G in the left hand through all of Frère Jacques.',
            ru: 'Держите до и соль в левой руке весь «Братец Яков».',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 G3 | C4' },
            { symbol: 'C', hands: 'C3 G3 | E4' },
            { symbol: 'C', hands: 'C3 G3 | G4' },
          ],
        },
        {
          kind: 'link',
          title: { en: 'Frère Jacques in the Player', ru: '«Братец Яков» в плеере' },
          target: { opens: 'piece', piece: 'frere-jacques' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the 3rd under fingers 2 and 4 in the C position.',
            ru: 'Сыграйте терцию под вторым и четвёртым пальцами в позиции до.',
          },
          answer: { notes: ['D', 'F'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play a 3rd up from E.', ru: 'Сыграйте терцию вверх от ми.' },
          answer: { notes: ['E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play a 5th up from F.', ru: 'Сыграйте квинту вверх от фа.' },
          answer: { notes: ['F', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Intervals from C', ru: 'Интервалы от до' },
          target: { opens: 'intervals', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Intervals by ear in the Quiz', ru: 'Интервалы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'intervals-by-ear' },
        },
      ],
    },
  ],
}

export default twoNotesOneHand
