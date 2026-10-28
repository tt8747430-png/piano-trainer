import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const twoNotesOneHand: Lesson = {
  id: 'two-notes-one-hand',
  title: { en: 'Two notes in one hand', ru: 'Две ноты одной рукой' },
  summary: {
    en: 'Press two keys with one hand: 3rds in the right hand, 5ths in the left, then a tune over a held 5th.',
    ru: 'Брать две клавиши одной рукой: терции правой, квинты левой, затем мелодия над выдержанной квинтой.',
  },
  sections: [
    {
      heading: { en: 'Two notes at once', ru: 'Две ноты сразу' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An interval', ru: 'Интервал' },
          text: {
            en: 'is the distance between two notes. Played together, it is a harmonic interval. Played one after the other, it is a melodic interval.',
            ru: '— расстояние между двумя нотами. Если ноты звучат вместе, интервал гармонический. Если по очереди, мелодический.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
      ],
    },
    {
      heading: { en: '3rds in the right hand', ru: 'Терции в правой руке' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 3rd', ru: 'Терция' },
          text: {
            en: 'spans three letter names, like C up to E. On the staff both notes sit on lines, or both in spaces. Press the two keys at the same moment.',
            ru: 'охватывает три ступени, например от до до ми. На нотоносце обе ноты стоят на линейках или обе между ними. Нажимайте две клавиши одновременно.',
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
        {
          kind: 'question',
          ask: {
            en: 'In the C position, play the 3rd under fingers 2 and 4.',
            ru: 'В позиции до сыграйте терцию под вторым и четвёртым пальцами.',
          },
          answer: { notes: ['D', 'F'] },
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
            en: 'spans five letter names, like C up to G. The left hand plays it with fingers 5 and 1. It makes a strong, open bass.',
            ru: 'охватывает пять ступеней, например от до до соль. Левая рука берёт её пятым и первым пальцами. Получается крепкий, открытый бас.',
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
          kind: 'question',
          ask: { en: 'Play a 5th up from F.', ru: 'Сыграйте квинту вверх от фа.' },
          answer: { notes: ['F', 'C'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'A tune over a 5th', ru: 'Мелодия над квинтой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hold C and G in the left hand through the whole of Frère Jacques. The right hand plays the tune above them.',
            ru: 'Держите до и соль левой рукой весь «Братец Яков». Правая рука играет над ними мелодию.',
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
          ask: { en: 'Play a 3rd up from E.', ru: 'Сыграйте терцию вверх от ми.' },
          answer: { notes: ['E', 'G'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Intervals from C', ru: 'Интервалы от до' },
          target: { opens: 'intervals', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Intervals by ear in the Quiz', ru: 'Интервалы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'intervals', drill: 'ear' },
        },
      ],
    },
  ],
}

export default twoNotesOneHand
