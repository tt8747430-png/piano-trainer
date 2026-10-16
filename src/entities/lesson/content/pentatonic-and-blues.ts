import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const pentatonicAndBlues: Lesson = {
  id: 'pentatonic-and-blues',
  title: { en: 'Pentatonic and blues scales', ru: 'Пентатоника и блюзовая гамма' },
  summary: {
    en: 'Play the five-note scales, major and minor, then add one note to each for the two blues scales.',
    ru: 'Играть пятинотные гаммы, мажорную и минорную, и добавлять к каждой по ноте, чтобы получить две блюзовые гаммы.',
  },
  sections: [
    {
      heading: { en: 'Major pentatonic: 1 2 3 5 6', ru: 'Мажорная пентатоника: 1 2 3 5 6' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The major pentatonic', ru: 'Мажорная пентатоника' },
          text: {
            en: 'is a five-note scale: the major scale without its 4th and 7th. It has no half steps, so no two notes clash.',
            ru: '— это гамма из пяти нот: мажор без четвёртой и седьмой ступеней. В ней нет полутонов, поэтому ноты не режут слух.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'pent' },
        {
          kind: 'note',
          text: {
            en: 'Try the black keys alone: they make G♭ major pentatonic.',
            ru: 'Сыграйте одни чёрные клавиши: это соль-бемоль-мажорная пентатоника.',
          },
        },
      ],
    },
    {
      heading: { en: 'Minor pentatonic: 1 ♭3 4 5 ♭7', ru: 'Минорная пентатоника: 1 ♭3 4 5 ♭7' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The minor pentatonic', ru: 'Минорная пентатоника' },
          text: {
            en: 'uses the notes of the major pentatonic a minor 3rd above. A minor pentatonic has C major pentatonic’s notes, starting on A.',
            ru: 'состоит из нот мажорной пентатоники на малую терцию выше. В ля-минорной пентатонике ноты до-мажорной, но начинается она с ля.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'mpent' },
        {
          kind: 'text',
          text: { en: 'Play it and end on A.', ru: 'Сыграйте её и закончите на ля.' },
        },
      ],
    },
    {
      heading: { en: 'The blues scale adds ♭5', ru: 'Блюзовая гамма добавляет ♭5' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The blues scale', ru: 'Блюзовая гамма' },
          text: {
            en: 'is the minor pentatonic plus one note, the ♭5. This blue note is for passing through. Do not stop on it.',
            ru: '— это минорная пентатоника и ещё одна нота, ♭5. Через эту «блюзовую ноту» проходят, на ней не останавливаются.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'blues' },
      ],
    },
    {
      heading: { en: 'The major blues adds ♭3', ru: 'Мажорный блюз добавляет ♭3' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The major blues scale', ru: 'Мажорная блюзовая гамма' },
          text: {
            en: 'is the major pentatonic plus a ♭3 that slides up into the 3rd. Gospel and country runs use it.',
            ru: '— это мажорная пентатоника и ♭3, которая соскальзывает в терцию. Так звучат пассажи в госпеле и кантри.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'majorBlues' },
        { kind: 'notes', clef: 'treble', notes: 'D#4/8 E4/8 G4/8 A4/8 C5/2' },
      ],
    },
    {
      heading: { en: 'Where they fit', ru: 'Где они звучат' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The C major pentatonic fits over C, F and G. Play it as a fill, a short run between the melody’s lines.',
            ru: 'До-мажорная пентатоника подходит к C, F и G. Играйте её как подыгрыш, короткий пассаж между фразами мелодии.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C'] },
        { kind: 'notes', clef: 'treble', notes: 'G4/8 A4/8 C5/8 D5/8 E5/2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the C major pentatonic up from C.',
            ru: 'Сыграйте до-мажорную пентатонику вверх от до.',
          },
          answer: { notes: ['C', 'D', 'E', 'G', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the A minor pentatonic up from A.',
            ru: 'Сыграйте ля-минорную пентатонику вверх от ля.',
          },
          answer: { notes: ['A', 'C', 'D', 'E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the C blues scale up from C.',
            ru: 'Сыграйте блюзовую гамму от до вверх.',
          },
          answer: { notes: ['C', 'E♭', 'F', 'G♭', 'G', 'B♭'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'The C blues scale', ru: 'Блюзовая гамма от до' },
          target: { opens: 'scales', root: note('C'), scale: 'blues' },
        },
        {
          kind: 'link',
          title: { en: 'Scales by ear in the Quiz', ru: 'Гаммы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'scales-by-ear' },
        },
      ],
    },
  ],
}

export default pentatonicAndBlues
