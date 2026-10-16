import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const pentatonicAndBlues: Lesson = {
  id: 'pentatonic-and-blues',
  title: { en: 'Pentatonic and blues scales', ru: 'Пентатоника и блюзовая гамма' },
  summary: {
    en: 'Play the major and minor pentatonic and both blues scales.',
    ru: 'Играть мажорную и минорную пентатонику и обе блюзовые гаммы.',
  },
  sections: [
    {
      heading: { en: 'Major pentatonic: 1 2 3 5 6', ru: 'Мажорная пентатоника: 1 2 3 5 6' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The major pentatonic', ru: 'Мажорная пентатоника' },
          text: {
            en: 'is the major scale without its 4th and 7th. With no half steps, no note clashes.',
            ru: '— мажорная гамма без четвёртой и седьмой ступеней. Без полутонов ни одна нота не режет слух.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'pent' },
        {
          kind: 'note',
          text: {
            en: 'The black keys alone are G♭ major pentatonic.',
            ru: 'Одни чёрные клавиши — это соль-бемоль-мажорная пентатоника.',
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
            en: 'holds the notes of the major pentatonic a minor 3rd up. A minor shares C major’s.',
            ru: 'состоит из нот мажорной пентатоники на малую терцию выше. У ля минорной те же ноты, что у до мажорной.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'mpent' },
      ],
    },
    {
      heading: { en: 'The blues scale adds ♭5', ru: 'Блюзовая гамма добавляет ♭5' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The blues scale', ru: 'Блюзовая гамма' },
          text: {
            en: 'is the minor pentatonic with one more note: the ♭5, the blue note. Pass through it, do not stop on it.',
            ru: '— минорная пентатоника с ещё одной нотой, ♭5, «блюзовой нотой». Проходите через неё, не останавливаясь.',
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
          text: {
            en: 'The major pentatonic with a ♭3 that slides up into the 3rd: the sound of gospel and country runs.',
            ru: 'Мажорная пентатоника с ♭3, которая соскальзывает в терцию: так звучат пассажи в госпеле и кантри.',
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
            en: 'The C major pentatonic fits C, F and G alike. Play it as a fill between the melody’s lines.',
            ru: 'До-мажорная пентатоника подходит и к C, и к F, и к G. Играйте её как подыгрыш между фразами мелодии.',
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
