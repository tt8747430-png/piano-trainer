import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelReharmonisation: Lesson = {
  id: 'gospel-reharmonisation',
  title: { en: 'Gospel reharmonisation', ru: 'Госпел-реармонизация' },
  summary: {
    en: 'A hymn’s plain chords made rich: 7ths and 9ths, the sus that falls to the dominant, IV over V, the minor iv, and a chord’s tensions.',
    ru: 'Простые аккорды гимна становятся богаче: септаккорды и нонаккорды, sus с разрешением в доминанту, IV над V, минорная iv и тенсии аккорда.',
  },
  level: 3,
  category: 'gospel',
  module: 'gospel',
  sections: [
    {
      heading: { en: 'Plain chords made rich', ru: 'Простые аккорды — богаче' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Reharmonisation', ru: 'Реармонизация' },
          text: {
            en: 'puts new or richer chords under the same tune.',
            ru: '— это новые или более богатые аккорды под той же мелодией.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Start from a hymn’s triads: C, F, G. Add a major 9th on I and IV, a dominant 9th on V.',
            ru: 'Начните с трезвучий гимна: C, F, G. Добавьте большой нонаккорд на I и IV и доминантнонаккорд на V.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Tap both rows below. The harmony is the same, it only sounds fuller.',
            ru: 'Нажмите оба ряда ниже. Гармония та же, она только звучит полнее.',
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
            en: 'has the 4th in place of the 3rd.',
            ru: 'кварта стоит вместо терции.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Hold the 4th over the dominant, then let it fall to the 3rd: G7sus4, G7, C. Gospel players linger on the sus.',
            ru: 'Задержите кварту над доминантой, затем опустите её в терцию: G7sus4, G7, C. В госпеле на sus задерживаются подольше.',
          },
        },
        { kind: 'chords', symbols: ['G7sus4', 'G7', 'C'] },
      ],
    },
    {
      heading: { en: 'IV over V', ru: 'IV над V' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the IV chord over the dominant’s root. F/G is an F chord with G in the bass.',
            ru: 'Сыграйте аккорд IV над основным тоном доминанты. F/G — аккорд F с басом соль.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'It is a soft dominant. It has no 3rd to push it home.',
            ru: 'Это мягкая доминанта. В ней нет терции, которая толкает домой.',
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
            en: 'are notes added above a 7th chord: 9ths, 11ths and 13ths.',
            ru: '— это ноты над септаккордом: ноны, ундецимы и терцдецимы.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'A dominant 7th takes the most colour: 9ths and 13ths, altered or not.',
            ru: 'Больше всего красок принимает доминантсептаккорд: ноны и терцдецимы, альтерированные и нет.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Available tensions shows which notes a chord takes and which to avoid. Open G7’s below.',
            ru: '«Доступные тенсии» показывают, какие ноты аккорд принимает, а каких избегать. Откройте тенсии G7 ниже.',
          },
        },
        {
          kind: 'link',
          title: { en: 'G7’s tensions', ru: 'Тенсии G7' },
          target: { place: 'tensions', chord: 'd7', root: note('G') },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play C major’s iv chord, borrowed from the minor.',
            ru: 'Сыграйте аккорд iv ступени до мажора, взятый из минора.',
          },
          answer: { chord: 'Fm' },
        },
        {
          kind: 'link',
          title: { en: 'C in Reharmonise', ru: 'До в «Гармонизации мелодии»' },
          target: { place: 'reharmonise', key: C_MAJOR, note: note('C') },
        },
      ],
    },
  ],
}

export default gospelReharmonisation
