import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelReharmonisation: Lesson = {
  id: 'gospel-reharmonisation',
  title: { en: 'Gospel reharmonisation', ru: 'Госпел-реармонизация' },
  summary: {
    en: 'A hymn’s plain chords made rich: 7ths and 9ths, the sus that falls to the dominant, IV over V, the minor iv, and the tensions a chord takes.',
    ru: 'Простые аккорды гимна становятся богаче: септаккорды и нонаккорды, sus, который разрешается в доминанту, IV над V, минорная iv и допустимые напряжения.',
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
          text: {
            en: 'Start from a hymn’s triads and add to them: a major 9th on I and IV, a dominant 9th on V. The harmony is the same; it only sounds fuller.',
            ru: 'Начните с трезвучий гимна и добавьте к ним: большой нонаккорд на I и IV, доминантнонаккорд на V. Гармония та же — она только звучит полнее.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
        { kind: 'chords', symbols: ['CMaj9', 'FMaj9', 'G9'] },
      ],
    },
    {
      heading: { en: 'Sus to dominant', ru: 'От sus к доминанте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hold the 4th over the dominant, then let it fall to the 3rd: G7sus4, G7, C. Gospel players linger on the sus.',
            ru: 'Задержите кварту над доминантой, затем опустите её в терцию: G7sus4, G7, C. В госпел на sus задерживаются подольше.',
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
            en: 'Play the IV chord over the dominant’s root: F/G is a soft dominant, with no 3rd to push it home.',
            ru: 'Сыграйте аккорд IV над основным тоном доминанты: F/G — мягкая доминанта, без терции, которая толкает домой.',
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
            ru: 'Возьмите iv из минора: F, Fm, C. Его ля-бемоль спускается в соль — звучание «аминь».',
          },
        },
        { kind: 'chords', symbols: ['F', 'Fm', 'C'] },
      ],
    },
    {
      heading: { en: 'The tensions', ru: 'Напряжения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A dominant 7th takes the most colour: 9ths and 13ths, altered or not. Available tensions shows which notes a chord takes and which to avoid.',
            ru: 'Доминантсептаккорд принимает больше всего красок: ноны и терцдецимы, альтерированные и нет. Допустимые напряжения показывают, какие ноты аккорд принимает, а каких избегать.',
          },
        },
        {
          kind: 'link',
          title: { en: 'G7’s tensions', ru: 'Напряжения G7' },
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
          title: { en: 'C in Reharmonise', ru: 'До в реармонизации' },
          target: { place: 'reharmonise', key: C_MAJOR, note: note('C') },
        },
      ],
    },
  ],
}

export default gospelReharmonisation
