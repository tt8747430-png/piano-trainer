import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 2: major and minor chords, told apart by ear and by semitones. */
const majorAndMinorChords: Lesson = {
  id: 'major-and-minor-chords',
  title: { en: 'Major and minor chords', ru: 'Мажорные и минорные аккорды' },
  summary: {
    en: 'Tell major from minor by ear and by semitones.',
    ru: 'Отличайте мажор от минора на слух и по полутонам.',
  },
  sections: [
    {
      heading: { en: 'Major and minor', ru: 'Мажор и минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A major chord sounds bright and is written as a letter: C. A minor chord sounds soft and is written with m: Cm.',
            ru: 'Мажорный аккорд звучит светло и пишется буквой: C. Минорный звучит мягко и пишется с m: Cm.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm'], apart: true },
      ],
    },
    {
      heading: { en: '4 or 3 semitones', ru: '4 или 3 полутона' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count the semitones from the first note to the second: 4 in a major chord, 3 in a minor one.',
            ru: 'Посчитайте полутоны от первого звука до второго: в мажорном аккорде их 4, в минорном 3.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        { kind: 'interval', root: note('C'), interval: 'm3' },
      ],
    },
    {
      heading: { en: 'On every white key', ru: 'От каждой белой клавиши' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play both on every white key, each hand alone, then together.',
            ru: 'Сыграйте оба от каждой белой клавиши, каждой рукой отдельно, затем вместе.',
          },
        },
        {
          kind: 'chords',
          symbols: ['C', 'Cm', 'D', 'Dm', 'E', 'Em', 'F', 'Fm', 'G', 'Gm', 'A', 'Am', 'B', 'Bm'],
          apart: true,
        },
      ],
    },
    {
      heading: { en: 'Four chords you like', ru: 'Четыре аккорда на выбор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Choose four chords you like and play them in turn: smoothly, evenly and softly.',
            ru: 'Выберите четыре понравившихся аккорда и сыграйте их по очереди: плавно, ровно и мягко.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'F', 'G'] },
      ],
    },
    {
      heading: { en: 'The table of all chords', ru: 'Таблица всех аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Both chords on all twelve roots, to look up as you play.',
            ru: 'Оба аккорда от всех двенадцати звуков — чтобы сверяться во время игры.',
          },
        },
        { kind: 'grid', quality: 'maj' },
        { kind: 'grid', quality: 'min' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play D major.', ru: 'Сыграйте ре мажор.' },
          answer: { chord: 'D' },
        },
        {
          kind: 'question',
          ask: { en: 'Play D minor.', ru: 'Сыграйте ре минор.' },
          answer: { chord: 'Dm' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play E major: it takes a black key.',
            ru: 'Сыграйте ми мажор: в нём есть чёрная клавиша.',
          },
          answer: { chord: 'E' },
        },
      ],
    },
  ],
}

export default majorAndMinorChords
