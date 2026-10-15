import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const tensions: Lesson = {
  id: 'tensions',
  title: { en: 'Available tensions', ru: 'Доступные тенсии' },
  summary: {
    en: 'The 9ths, 11ths and 13ths each kind of 7th chord can take, and the one note each must avoid.',
    ru: 'Ноны, ундецимы и терцдецимы, которые может взять каждый вид септаккорда, и нота, которой каждому следует избегать.',
  },
  sections: [
    {
      heading: { en: 'Above the 7th', ru: 'Над септимой' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tension', ru: 'Тенсия' },
          text: {
            en: 'is a note above the 7th: the 9th, 11th or 13th. It colours the chord without changing its job.',
            ru: '— нота над септимой: нона, ундецима или терцдецима. Она окрашивает аккорд, не меняя его функции.',
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
            en: 'A tension fits when it sits a whole step above a chord tone. A half step above one clashes: that is an avoid note.',
            ru: 'Тенсия подходит, если стоит на тон выше звука аккорда. На полутон выше — она режет слух: это нота, которой избегают.',
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
            en: 'CMaj7 takes the 9th, the raised 11th and the 13th. The plain 11th, F, rubs against E.',
            ru: 'CMaj7 берёт нону, повышенную ундециму и терцдециму. Чистая ундецима, фа, трётся о ми.',
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
            en: 'Dm7 takes the 9th and the 11th freely. In a ii–V its 13th, B, can blur the move to G.',
            ru: 'Dm7 свободно берёт нону и ундециму. В обороте ii–V его терцдецима, си, может смазать переход к G.',
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
            en: 'G7 takes the 9th and 13th, and also the altered ♭9, ♯9, ♯11 and ♭13. Only the plain 11th clashes.',
            ru: 'G7 берёт нону и терцдециму, а также альтерированные ♭9, ♯9, ♯11 и ♭13. Режет слух только чистая ундецима.',
          },
        },
        { kind: 'chords', symbols: ['G9', 'G13', 'G7♭9', 'G7#11'] },
        {
          kind: 'link',
          title: { en: 'G7’s tensions on Chords', ru: 'Тенсии G7 в разделе «Аккорды»' },
          target: { opens: 'tensions', chord: 'd7', root: note('G') },
        },
      ],
    },
    {
      heading: { en: 'Leave out the 5th', ru: 'Опустите квинту' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Ten fingers rarely hold every note. Drop the 5th first, then the root, which the bass already plays.',
            ru: 'Десяти пальцам редко хватает на все ноты. Сначала опустите квинту, затем основной тон: его уже играет бас.',
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
      ],
    },
  ],
}

export default tensions
