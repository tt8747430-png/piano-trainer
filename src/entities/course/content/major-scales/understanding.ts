import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding major scales', ru: 'Как устроены мажорные гаммы' },
  summary: {
    en: 'The pattern of whole and half steps behind every major scale, its two tetrachords, and how the fingers get through it.',
    ru: 'Схема тонов и полутонов в основе любой мажорной гаммы, два её тетрахорда и как пальцы проходят её.',
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
            ru: '— это соседняя клавиша, чёрная или белая: ми — фа. Тон — это два полутона: до — ре.',
          },
        },
        { kind: 'interval', root: note('E'), interval: 'm2' },
        { kind: 'interval', root: note('C'), interval: 'M2' },
      ],
    },
    {
      heading: { en: 'The major pattern', ru: 'Схема мажора' },
      blocks: [
        { kind: 'scale', root: note('C'), scale: 'major' },
        {
          kind: 'text',
          lead: { en: 'A major scale', ru: 'Мажорная гамма' },
          text: {
            en: 'climbs whole, whole, half, whole, whole, whole, half. From C it takes only white keys.',
            ru: 'поднимается так: тон, тон, полутон, тон, тон, тон, полутон. От до в ней только белые клавиши.',
          },
        },
      ],
    },
    {
      heading: { en: 'Two tetrachords', ru: 'Два тетрахорда' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
        {
          kind: 'text',
          lead: { en: 'A tetrachord', ru: 'Тетрахорд' },
          text: {
            en: 'is four notes stepping whole, whole, half. A major scale is two of them, a whole step apart: C D E F, then G A B C.',
            ru: '— это четыре ноты через тон, тон, полутон. Мажорная гамма — два таких тетрахорда, между ними тон: до ре ми фа и соль ля си до.',
          },
        },
      ],
    },
    {
      heading: { en: 'One more sharp each time', ru: 'Каждый раз на один диез больше' },
      blocks: [
        { kind: 'scale', root: note('G'), scale: 'major' },
        {
          kind: 'text',
          text: {
            en: 'C major’s upper tetrachord starts G major. Its 7th must rise to F♯ to keep the pattern. Each key a 5th higher adds one sharp.',
            ru: 'Верхний тетрахорд до мажора начинает соль мажор. Его седьмая ступень повышается до фа-диеза, чтобы сохранить схему. Каждая тональность квинтой выше добавляет один диез.',
          },
        },
      ],
    },
    {
      heading: { en: 'Round the circle of fifths', ru: 'По квинтовому кругу' },
      blocks: [
        { kind: 'scale', root: note('F'), scale: 'major' },
        {
          kind: 'text',
          lead: { en: 'The circle of fifths', ru: 'Квинтовый круг' },
          text: {
            en: 'puts every key a 5th from the last. Sharps grow to F♯, then flats shrink back to F major’s one B♭. This course follows it.',
            ru: 'ставит каждую тональность квинтой выше предыдущей. Диезов становится больше до фа-диез мажора, затем бемолей меньше, до одного си-бемоля фа мажора. Курс идёт по нему.',
          },
        },
      ],
    },
    {
      heading: { en: 'How fingering works', ru: 'Как устроена аппликатура' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Both hands number their fingers 1 to 5 from the thumb.',
              ru: 'Пальцы нумеруются от 1 до 5, начиная с большого, на обеих руках.',
            },
            {
              en: 'A scale is played in groups of three and four fingers.',
              ru: 'Гамма играется группами из трёх и четырёх пальцев.',
            },
            {
              en: 'The thumb joins the groups, keeping off the black keys where it can.',
              ru: 'Большой палец соединяет группы и по возможности не встаёт на чёрные клавиши.',
            },
          ],
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
      ],
    },
    {
      heading: { en: 'The thumb crossing', ru: 'Подкладывание большого пальца' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 E4 D4 C4/2' },
        {
          kind: 'text',
          lead: { en: 'The thumb crossing', ru: 'Подкладывание' },
          text: {
            en: 'moves the thumb under the hand while 2 and 3 play, so it is already over F. Keep the wrist level and the arm gliding.',
            ru: '— большой палец уходит под руку, пока играют второй и третий, и уже ждёт над фа. Запястье ровное, рука движется плавно.',
          },
        },
      ],
    },
    {
      heading: { en: 'Fingering the black keys', ru: 'Аппликатура на чёрных клавишах' },
      blocks: [
        { kind: 'scale', root: note('D', -1), scale: 'major' },
        {
          kind: 'text',
          text: {
            en: 'In flat keys the thumb takes the white keys only, and the long fingers take the black. D♭ major puts the thumb on F and C.',
            ru: 'В бемольных тональностях большой палец берёт только белые клавиши, а длинные пальцы — чёрные. В ре-бемоль мажоре большой палец стоит на фа и до.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play C major up one octave.', ru: 'Сыграйте до мажор вверх на октаву.' },
          answer: { notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], rising: true },
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
          ask: {
            en: 'Play a whole step up from E.',
            ru: 'Сыграйте тон вверх от ми.',
          },
          answer: { notes: ['E', 'F#'], rising: true },
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
