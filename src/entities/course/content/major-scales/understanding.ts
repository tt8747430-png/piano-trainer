import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding major scales', ru: 'Как устроены мажорные гаммы' },
  summary: {
    en: 'Build any major scale from its pattern of steps, see how the keys follow one another and finger the scale.',
    ru: 'Строить любую мажорную гамму по схеме тонов и полутонов, понять, как тональности следуют друг за другом, и знать аппликатуру.',
  },
  sections: [
    {
      heading: { en: 'Half steps and whole steps', ru: 'Полутоны и тоны' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half step', ru: 'Полутон' },
          text: {
            en: 'goes to the very next key, black or white, as from E to F. A whole step is two half steps, as from C to D.',
            ru: '— переход на соседнюю клавишу, чёрную или белую, как от ми к фа. Тон — это два полутона, как от до к ре.',
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
            en: 'climbs eight notes by whole, whole, half, whole, whole, whole, half. Starting on C, this pattern uses only white keys.',
            ru: 'поднимается на восемь нот так: тон, тон, полутон, тон, тон, тон, полутон. От до эта схема даёт только белые клавиши.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Two halves', ru: 'Две половины' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tetrachord', ru: 'Тетрахорд' },
          text: {
            en: 'is four notes that step whole, whole, half. A major scale is two of them, joined by a whole step: C D E F, then G A B C.',
            ru: '— четыре ноты через тон, тон, полутон. Мажорная гамма состоит из двух тетрахордов, соединённых тоном: до ре ми фа и соль ля си до.',
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
            en: 'C major’s upper half, G A B C, is also the lower half of G major. To keep the pattern, G major raises its 7th note to F♯.',
            ru: 'Верхняя половина до мажора, соль ля си до, — это нижняя половина соль мажора. Чтобы сохранить схему, соль мажор повышает седьмую ступень до фа-диеза.',
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
            en: 'orders the keys a 5th apart, each with one more sharp. After F♯ major the keys use flats, fewer each time, down to F major’s one B♭.',
            ru: 'выстраивает тональности через квинту, каждую с ещё одним диезом. После фа-диез мажора идут бемольные, со всё меньшим числом знаков, до одного си-бемоля в фа мажоре.',
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
            en: 'joins a scale’s groups of three and four fingers. In C major, the thumb slides under while fingers 2 and 3 play, ready over F.',
            ru: 'соединяет группы из трёх и четырёх пальцев. В до мажоре большой палец уходит под руку, пока играют второй и третий, и ждёт над фа.',
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
            en: 'In flat keys the thumb plays only white keys, and the longer fingers take the black ones. In D♭ major the thumb plays F and C.',
            ru: 'В бемольных тональностях большой палец играет только белые клавиши, а длинные пальцы берут чёрные. В ре-бемоль мажоре большой палец играет фа и до.',
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
