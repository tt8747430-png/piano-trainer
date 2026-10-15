import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const twoNotesOneHand: Lesson = {
  id: 'two-notes-one-hand',
  title: { en: 'Playing multiple notes with one hand', ru: 'Несколько нот одной рукой' },
  summary: {
    en: 'Two notes at once in one hand: 3rds in the right hand, open 5ths in the left, and a tune over a held 5th.',
    ru: 'Две ноты сразу одной рукой: терции в правой, открытые квинты в левой и мелодия над выдержанной квинтой.',
  },
  sections: [
    {
      heading: { en: 'Two notes at once', ru: 'Две ноты сразу' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An interval', ru: 'Интервал' },
          text: {
            en: 'is the distance between two notes. Played together it is harmonic. Played one after the other it is melodic.',
            ru: '— расстояние между двумя нотами. Взятые вместе, они дают гармонический интервал, по очереди — мелодический.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
      ],
    },
    {
      heading: { en: 'The 3rd', ru: 'Терция' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 3rd', ru: 'Терция' },
          text: {
            en: 'spans three letters, C up to E. On the staff it goes line to line or space to space. It sounds sweet.',
            ru: 'охватывает три ступени, от до до ми. На стане — с линейки на линейку или с промежутка на промежуток. Звучит мягко.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C–E', caption: '1–3', hands: '| C4 E4' },
            { symbol: 'D–F', caption: '2–4', hands: '| D4 F4' },
            { symbol: 'E–G', caption: '3–5', hands: '| E4 G4' },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the 3rd under fingers 2 and 4 in the C position.',
            ru: 'Сыграйте терцию под вторым и четвёртым пальцами в позиции до.',
          },
          answer: { notes: ['D', 'F'] },
        },
      ],
    },
    {
      heading: { en: 'A tune in 3rds', ru: 'Мелодия терциями' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Add a 3rd above each note of E, D, C. Fingers 3–5, 2–4 and 1–3 move down together.',
            ru: 'Добавьте терцию над каждой нотой ми, ре, до. Пальцы 3–5, 2–4 и 1–3 спускаются вместе.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'E–G', hands: '| E4 G4' },
            { symbol: 'D–F', hands: '| D4 F4' },
            { symbol: 'C–E', hands: '| C4 E4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Press both keys at exactly the same moment.',
            ru: 'Нажимайте обе клавиши строго одновременно.',
          },
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
        {
          kind: 'link',
          title: { en: 'Intervals from C', ru: 'Интервалы от до' },
          target: { opens: 'intervals', root: note('C') },
        },
      ],
    },
    {
      heading: { en: 'A tune over a 5th', ru: 'Мелодия над квинтой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hold C and G in the left hand through Frère Jacques. The whole tune sits well over this one 5th.',
            ru: 'Держите до и соль в левой руке весь «Братец Яков». Вся мелодия хорошо ложится на эту квинту.',
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
          ask: { en: 'Play a 3rd up from C.', ru: 'Сыграйте терцию вверх от до.' },
          answer: { notes: ['C', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play a 5th up from F.', ru: 'Сыграйте квинту вверх от фа.' },
          answer: { notes: ['F', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the left hand’s 5th on G.',
            ru: 'Сыграйте квинту левой руки от соль.',
          },
          answer: { notes: ['G', 'D'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play a 3rd up from E.',
            ru: 'Сыграйте терцию вверх от ми.',
          },
          answer: { notes: ['E', 'G'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Intervals by ear in the Quiz', ru: 'Интервалы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'intervals-by-ear' },
        },
        {
          kind: 'link',
          title: { en: 'Frère Jacques in the Player', ru: '«Братец Яков» в плеере' },
          target: { opens: 'piece', piece: 'frere-jacques' },
        },
      ],
    },
  ],
}

export default twoNotesOneHand
