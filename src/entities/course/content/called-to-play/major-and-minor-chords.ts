import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 2: major and minor chords, told apart by ear and by semitones. */
const majorAndMinorChords: Lesson = {
  id: 'major-and-minor-chords',
  title: { en: 'Major and minor chords', ru: 'Мажорные и минорные аккорды' },
  summary: {
    en: 'Hear major and minor, count their semitones, and play both on every white key.',
    ru: 'Слышите мажор и минор, считайте полутоны и играйте оба от каждой белой клавиши.',
  },
  sections: [
    {
      heading: { en: 'Bright and soft', ru: 'Светлый и мягкий' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play C, then Cm, and listen. The major chord sounds bright. The minor chord sounds softer and sadder.',
            ru: 'Сыграйте C, затем Cm и послушайте. Мажорный аккорд звучит светло. Минорный звучит мягче и грустнее.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm'], apart: true },
        {
          kind: 'note',
          text: {
            en: 'A letter alone names a major chord: C. A letter with m names a minor one: Cm.',
            ru: 'Буква без знаков означает мажорный аккорд: C. Буква с m — минорный: Cm.',
          },
        },
      ],
    },
    {
      heading: { en: '4 or 3 semitones', ru: '4 или 3 полутона' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A semitone', ru: 'Полутон' },
          text: {
            en: 'is the step to the very next key, black or white. From the bottom note to the middle one, major has 4 semitones and minor has 3.',
            ru: '— это шаг на соседнюю клавишу, чёрную или белую. От нижнего звука до среднего в мажоре 4 полутона, в миноре 3.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        { kind: 'interval', root: note('C'), interval: 'm3' },
      ],
    },
    {
      heading: { en: 'Only the middle note moves', ru: 'Меняется только средний звук' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A major chord and its minor share the bottom and top notes. For minor, lower the middle note one semitone. Play each pair, each hand alone, then together.',
            ru: 'У мажорного и минорного аккорда общие нижний и верхний звуки. Для минора опустите средний звук на полутон. Играйте каждую пару каждой рукой, затем вместе.',
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
      heading: { en: 'Four chords in a row', ru: 'Четыре аккорда подряд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Choose four chords you like and play them in turn, over and over. Change chords without a gap, evenly and softly. Here is one choice.',
            ru: 'Выберите четыре понравившихся аккорда и играйте их по кругу. Меняйте аккорды без пауз, ровно и мягко. Вот один вариант.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'F', 'G'] },
      ],
    },
    {
      heading: {
        en: 'Both chords on all twelve keys',
        ru: 'Оба аккорда от всех двенадцати звуков',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The tables show major and minor on every root, black keys too. Look a chord up here while you play.',
            ru: 'В таблицах мажор и минор от каждого звука, включая чёрные клавиши. Сверяйтесь с ними во время игры.',
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
            en: 'Play E major. It takes a black key.',
            ru: 'Сыграйте ми мажор. В нём есть чёрная клавиша.',
          },
          answer: { chord: 'E' },
        },
      ],
    },
  ],
}

export default majorAndMinorChords
