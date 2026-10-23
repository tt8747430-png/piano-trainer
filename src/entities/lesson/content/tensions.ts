import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const tensions: Lesson = {
  id: 'tensions',
  title: { en: 'Available tensions', ru: 'Доступные тенсии' },
  summary: {
    en: 'Know which 9ths, 11ths and 13ths fit each kind of 7th chord, and which one clashes.',
    ru: 'Знать, какие ноны, ундецимы и терцдецимы подходят к каждому виду септаккорда, а какая режет слух.',
  },
  sections: [
    {
      heading: { en: 'Above the 7th', ru: 'Над септимой' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tension', ru: 'Тенсия' },
          text: {
            en: 'is a note above the 7th: the 9th, 11th or 13th. It adds colour. The chord still does the same job.',
            ru: '— это нота над септимой: нона, ундецима или терцдецима. Она добавляет краску, а функция аккорда остаётся прежней.',
          },
        },
        { kind: 'chords', symbols: ['CMaj7', 'CMaj9'] },
      ],
    },
    {
      heading: { en: 'A whole step above a chord tone', ru: 'На тон выше звука аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A tension a whole step above a chord tone fits. One a half step above a chord tone clashes. It is called an avoid note.',
            ru: 'Тенсия на тон выше звука аккорда подходит. На полутон выше — режет слух. Такую ноту называют избегаемой.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'CMaj9', degrees: '1 | 3 7 9', hands: 'C3 | E4 B4 D5' },
            {
              symbol: 'CMaj7',
              caption: '11 over 3',
              degrees: '1 | 3 7 11',
              hands: 'C3 | E4 B4 F5',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Major 7th: 9, ♯11, 13', ru: 'Большой мажорный септаккорд: 9, ♯11, 13' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'CMaj7 takes the 9th, the raised 11th and the 13th. The plain 11th, F, is a half step above E, so it clashes.',
            ru: 'CMaj7 берёт нону, повышенную ундециму и терцдециму. Чистая ундецима, фа, на полутон выше ми и режет слух.',
          },
        },
        { kind: 'chords', symbols: ['CMaj9', 'CMaj7#11', 'C6/9'] },
      ],
    },
    {
      heading: { en: 'Minor 7th: 9, 11, 13', ru: 'Малый минорный септаккорд: 9, 11, 13' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Dm7 takes the 9th and the 11th freely. Careful with the 13th, B: before G7 it can blur the change.',
            ru: 'Dm7 свободно берёт нону и ундециму. Осторожнее с терцдецимой, си: перед G7 она может смазать смену аккорда.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'Dm9', 'Dm11'] },
      ],
    },
    {
      heading: { en: 'Dominant 7th: all of them', ru: 'Доминантсептаккорд: все' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7 takes the 9th and 13th. It also takes the altered ♭9, ♯9, ♯11 and ♭13. Only the plain 11th clashes.',
            ru: 'G7 берёт нону и терцдециму. Подходят и альтерированные ♭9, ♯9, ♯11 и ♭13. Режет слух только чистая ундецима.',
          },
        },
        { kind: 'chords', symbols: ['G9', 'G13', 'G7♭9', 'G7#11'] },
      ],
    },
    {
      heading: { en: 'Leave out the 5th', ru: 'Опустите квинту' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Five fingers cannot hold every note. Drop the 5th first. Then drop the root from the right hand, because the bass plays it.',
            ru: 'Пять пальцев не возьмут все звуки. Сначала уберите квинту. Затем уберите основной тон из правой руки: его играет бас.',
          },
        },
        {
          kind: 'voicings',
          voicings: [{ symbol: 'G13', degrees: '1 | 3 13 ♭7 9', hands: 'G2 | B3 E4 F4 A4' }],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play CMaj9.', ru: 'Сыграйте CMaj9.' },
          answer: { chord: 'CMaj9' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Dm9.', ru: 'Сыграйте Dm9.' },
          answer: { chord: 'Dm9' },
        },
        {
          kind: 'question',
          ask: { en: 'Play G13.', ru: 'Сыграйте G13.' },
          answer: { chord: 'G13' },
        },
        {
          kind: 'link',
          title: { en: 'Build a chord in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
        {
          kind: 'link',
          title: { en: 'G7’s tensions on Chords', ru: 'Тенсии G7 в разделе «Аккорды»' },
          target: { opens: 'tensions', chord: 'd7', root: note('G') },
        },
      ],
    },
  ],
}

export default tensions
