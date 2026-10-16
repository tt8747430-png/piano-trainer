import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding major scales', ru: 'Как устроены мажорные гаммы' },
  summary: {
    en: 'Build any major scale from its steps and finger it.',
    ru: 'Строить любую мажорную гамму по ступеням и знать её аппликатуру.',
  },
  sections: [
    {
      heading: { en: 'Half steps and whole steps', ru: 'Полутоны и тоны' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half step', ru: 'Полутон' },
          text: {
            en: 'is the very next key, black or white: E to F. A whole step is two half steps: C to D.',
            ru: '— соседняя клавиша, чёрная или белая: ми — фа. Тон — два полутона: до — ре.',
          },
        },
        { kind: 'interval', root: note('E'), interval: 'm2' },
        { kind: 'interval', root: note('C'), interval: 'M2' },
      ],
    },
    {
      heading: { en: 'The major pattern', ru: 'Схема мажора' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A major scale', ru: 'Мажорная гамма' },
          text: {
            en: 'climbs whole, whole, half, whole, whole, whole, half. From C it takes only white keys.',
            ru: 'поднимается так: тон, тон, полутон, тон, тон, тон, полутон. От до в ней только белые клавиши.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Two tetrachords', ru: 'Два тетрахорда' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tetrachord', ru: 'Тетрахорд' },
          text: {
            en: 'is four notes stepping whole, whole, half. A major scale is two, a whole step apart: C D E F, then G A B C.',
            ru: '— четыре ноты через тон, тон, полутон. Мажорная гамма — два тетрахорда через тон: до ре ми фа и соль ля си до.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
      ],
    },
    {
      heading: { en: 'One more sharp each time', ru: 'Каждый раз на один диез больше' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C major’s upper tetrachord starts G major. Its 7th rises to F♯ to keep the pattern.',
            ru: 'Верхний тетрахорд до мажора начинает соль мажор. Его седьмая ступень повышается до фа-диеза, чтобы сохранить схему.',
          },
        },
        { kind: 'scale', root: note('G'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Round the circle of fifths', ru: 'По квинтовому кругу' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The circle of fifths', ru: 'Квинтовый круг' },
          text: {
            en: 'puts each key a 5th above the last, one sharp more. Past F♯ the flats shrink back to F major’s one B♭.',
            ru: 'ставит каждую тональность квинтой выше, на диез больше. После фа-диез мажора бемолей всё меньше, до одного си-бемоля фа мажора.',
          },
        },
        { kind: 'scale', root: note('F'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'The thumb crossing', ru: 'Подкладывание большого пальца' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The thumb crossing', ru: 'Подкладывание' },
          text: {
            en: 'joins a scale’s groups of three and four fingers. The thumb moves under while 2 and 3 play, ready over F.',
            ru: 'соединяет группы из трёх и четырёх пальцев. Большой палец уходит под руку, пока играют второй и третий, и ждёт над фа.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 E4 D4 C4/2' },
      ],
    },
    {
      heading: { en: 'Fingering the black keys', ru: 'Аппликатура на чёрных клавишах' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In flat keys the thumb takes white keys only, the long fingers the black. D♭ major puts the thumb on F and C.',
            ru: 'В бемольных тональностях большой палец берёт только белые клавиши, длинные пальцы — чёрные. В ре-бемоль мажоре большой палец на фа и до.',
          },
        },
        { kind: 'scale', root: note('D', -1), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play a whole step up from E.', ru: 'Сыграйте тон вверх от ми.' },
          answer: { notes: ['E', 'F#'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the upper tetrachord of G major.',
            ru: 'Сыграйте верхний тетрахорд соль мажора.',
          },
          answer: { notes: ['D', 'E', 'F#', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play C major up one octave.', ru: 'Сыграйте до мажор вверх на октаву.' },
          answer: { notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'C major in the Player', ru: 'До мажор в плеере' },
          target: { opens: 'exercise', exercise: 'scale', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Build scales in the Quiz', ru: 'Построение гамм в тестах' },
          target: { opens: 'quiz', trainer: 'build-scale' },
        },
      ],
    },
  ],
}

export default understanding
