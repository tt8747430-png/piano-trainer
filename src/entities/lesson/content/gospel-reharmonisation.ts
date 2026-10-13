import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelReharmonisation: Lesson = {
  id: 'gospel-reharmonisation',
  title: { en: 'Gospel reharmonisation', ru: 'Госпел-реармонизация' },
  summary: {
    en: 'A hymn’s plain chords made rich: 9ths, the sus, IV over V, the minor iv, tensions.',
    ru: 'Простые аккорды гимна богаче: ноны, sus, IV над V, минорная iv, тенсии.',
  },
  level: 3,
  module: 'gospel',
  sections: [
    {
      heading: { en: 'Plain chords made rich', ru: 'Простые аккорды — богаче' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Reharmonisation', ru: 'Реармонизация' },
          text: {
            en: 'puts richer chords under the same tune. Add a major 9th on I and IV, a dominant 9th on V. The harmony stays, it sounds fuller.',
            ru: '— более богатые аккорды под той же мелодией. Добавьте большой нонаккорд на I и IV, доминантнонаккорд на V. Гармония та же, но полнее.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
        { kind: 'chords', symbols: ['CMaj9', 'FMaj9', 'G9'] },
      ],
    },
    {
      heading: { en: 'From sus to the dominant', ru: 'От sus к доминанте' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A sus4 chord', ru: 'В аккорде sus4' },
          text: {
            en: 'has the 4th in place of the 3rd. Hold it over the dominant, then let it fall to the 3rd.',
            ru: 'кварта стоит вместо терции. Задержите её над доминантой, затем опустите в терцию.',
          },
        },
        { kind: 'chords', symbols: ['G7sus4', 'G7', 'C'] },
        {
          kind: 'note',
          text: {
            en: 'Gospel players linger on the sus.',
            ru: 'В госпеле на sus задерживаются подольше.',
          },
        },
      ],
    },
    {
      heading: { en: 'IV over V', ru: 'IV над V' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play IV over the dominant’s root: F/G. A soft dominant, it has no 3rd to push it home.',
            ru: 'Сыграйте IV над основным тоном доминанты: F/G. Это мягкая доминанта, в ней нет терции, которая толкает домой.',
          },
        },
        { kind: 'chords', symbols: ['F/G', 'C'] },
      ],
    },
    {
      heading: { en: 'The minor iv', ru: 'Минорная iv' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Borrow iv from the minor key: F, Fm, C. Its A♭ falls to G, the sound of an Amen.',
            ru: 'Возьмите iv из минора: F, Fm, C. Его ля-бемоль спускается в соль. Так звучит «аминь».',
          },
        },
        { kind: 'chords', symbols: ['F', 'Fm', 'C'] },
      ],
    },
    {
      heading: { en: 'The tensions', ru: 'Тенсии' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Tensions', ru: 'Тенсии' },
          text: {
            en: 'are 9ths, 11ths and 13ths added above a 7th chord. A dominant 7th takes the most, altered or not.',
            ru: '— ноны, ундецимы и терцдецимы над септаккордом. Больше всего их принимает доминантсептаккорд, альтерированных и нет.',
          },
        },
        { kind: 'chords', symbols: ['G7', 'G9', 'G13', 'G7♭9'] },
        {
          kind: 'link',
          title: { en: 'G7’s tensions', ru: 'Тенсии G7' },
          target: { opens: 'tensions', chord: 'd7', root: note('G') },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C major’s iv chord, borrowed from the minor.',
            ru: 'Сыграйте аккорд iv ступени до мажора, взятый из минора.',
          },
          answer: { chord: 'Fm' },
        },
        {
          kind: 'link',
          title: { en: 'C in Reharmonise', ru: 'До в «Гармонизации мелодии»' },
          target: { opens: 'reharmonise', key: C_MAJOR, note: note('C') },
        },
      ],
    },
  ],
}

export default gospelReharmonisation
