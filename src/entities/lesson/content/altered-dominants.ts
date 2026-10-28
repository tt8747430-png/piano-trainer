import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MINOR = { tonic: note('C'), minor: true }

const alteredDominants: Lesson = {
  id: 'altered-dominants',
  title: {
    en: 'Altered dominants and the tritone sub',
    ru: 'Альтерированные доминанты и тритоновая замена',
  },
  summary: {
    en: 'Add tension to V7 by moving its 5th or 9th, or swap it for the chord a tritone away.',
    ru: 'Добавьте V7 напряжения, сдвинув квинту или нону, или замените его аккордом через тритон.',
  },
  sections: [
    {
      heading: { en: 'What an altered dominant is', ru: 'Что такое альтерированная доминанта' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An altered dominant', ru: 'Альтерированная доминанта' },
          text: {
            en: 'is a dominant 7th with its 5th or 9th moved a half step. The new note adds tension for the next chord to release.',
            ru: '— это доминантсептаккорд, у которого квинта или нона сдвинута на полутон. Новая нота даёт напряжение, а следующий аккорд его снимает.',
          },
        },
        { kind: 'chords', symbols: ['G7', 'G7♭9', 'C'] },
        {
          kind: 'note',
          text: {
            en: 'Hear the extra pull in the middle chord.',
            ru: 'Услышьте, как сильнее тянет средний аккорд.',
          },
        },
      ],
    },
    {
      heading: { en: '♭9 in a minor key', ru: '♭9 в миноре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C minor already has A♭ in its scale. So its V7 takes a ♭9 by itself: G7♭9. The A♭ then falls a half step to G.',
            ru: 'В гамме до минора уже есть ля-бемоль. Поэтому его V7 сам берёт ♭9: G7♭9. Ля-бемоль затем спускается на полутон в соль.',
          },
        },
        { kind: 'progression', numerals: 'V7♭9 i', key: C_MINOR },
      ],
    },
    {
      heading: { en: '♯9, the blues dominant', ru: '♯9, блюзовая доминанта' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7♯9 keeps its major 3rd, B, and puts B♭ on top. You hear major and minor at once.',
            ru: 'G7♯9 сохраняет большую терцию си и ставит наверх си-бемоль. Мажор и минор звучат одновременно.',
          },
        },
        { kind: 'chords', symbols: ['G7#9'] },
      ],
    },
    {
      heading: { en: '♯5 rises to the 3rd', ru: '♯5 поднимается в терцию' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7♯5 raises its 5th, D, to D♯. Then D♯ rises one more half step to E, the 3rd of C.',
            ru: 'G7♯5 повышает квинту ре до ре-диеза. Затем ре-диез поднимается ещё на полутон в ми, терцию до мажора.',
          },
        },
        { kind: 'chords', symbols: ['G7#5', 'C'] },
      ],
    },
    {
      heading: { en: 'All of them at once: alt', ru: 'Всё сразу: alt' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7alt uses ♭9, ♯9, ♭5 and ♭13 together. Its notes come from A♭ melodic minor, played from G.',
            ru: 'G7alt берёт ♭9, ♯9, ♭5 и ♭13 вместе. Его звуки — из ля-бемоль мелодического минора, сыгранного от соль.',
          },
        },
        { kind: 'chords', symbols: ['G7alt', 'C'] },
        { kind: 'scale', root: note('A', -1), scale: 'melodic' },
      ],
    },
    {
      heading: { en: 'The tritone substitute', ru: 'Тритоновая замена' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tritone substitute', ru: 'Тритоновая замена' },
          text: {
            en: 'is the dominant 7th three whole steps away. D♭7 shares G7’s F and B, so it can replace G7.',
            ru: '— это доминантсептаккорд на три тона дальше. В D♭7 те же фа и си, что в G7, поэтому он может заменить G7.',
          },
        },
        { kind: 'progression', numerals: 'ii7 ♭II7 Imaj7', key: C_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'Its bass falls by half steps: D, D♭, C.',
            ru: 'Бас спускается по полутонам: ре, ре-бемоль, до.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play G7♭9.', ru: 'Сыграйте G7♭9.' },
          answer: { chord: 'G7♭9' },
        },
        {
          kind: 'question',
          ask: { en: 'Play G7♯9.', ru: 'Сыграйте G7♯9.' },
          answer: { chord: 'G7#9' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the tritone substitute for G7.',
            ru: 'Сыграйте тритоновую замену для G7.',
          },
          answer: { chord: 'D♭7' },
        },
        {
          kind: 'link',
          title: {
            en: 'The tritone sub through all the keys',
            ru: 'Тритоновая замена во всех тональностях',
          },
          target: { opens: 'player', numerals: 'ii7 ♭II7 Imaj7', key: C_MAJOR, walk: 'fifths' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'entry' },
        },
      ],
    },
  ],
}

export default alteredDominants
