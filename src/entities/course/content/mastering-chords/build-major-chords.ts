import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Mastering Chords, lesson 1: a major chord on any root, by counting semitones. */
const buildMajorChords: Lesson = {
  id: 'build-major-chords',
  title: { en: 'Build any major chord', ru: 'Мажорное трезвучие от любой ноты' },
  summary: {
    en: 'Count 4 semitones, then 3, to build a major chord on any of the twelve roots.',
    ru: 'Отсчитайте 4 полутона, затем 3, и постройте мажорное трезвучие от любой из двенадцати нот.',
  },
  sections: [
    {
      heading: { en: 'Count in semitones', ru: 'Считайте полутонами' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A semitone', ru: 'Полутон' },
          text: {
            en: 'is the step from one key to the very next, black or white. From C, count four semitones up to E. From E, count three more to G.',
            ru: '— шаг на соседнюю клавишу, чёрную или белую. От до отсчитайте четыре полутона вверх до ми. От ми ещё три до соль.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        { kind: 'interval', root: note('E'), interval: 'm3' },
      ],
    },
    {
      heading: { en: 'Four semitones, then three', ru: 'Четыре полутона, затем три' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A major chord', ru: 'Мажорное трезвучие' },
          text: {
            en: 'stacks those two steps on a root: 4 semitones, then 3. Its three notes are called the root, the 3rd and the 5th.',
            ru: 'складывает эти два шага от основного тона: 4 полутона, затем 3. Его три звука называются прима, терция и квинта.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'], apart: true },
      ],
    },
    {
      heading: { en: 'Roots on the white keys', ru: 'От белых клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Look at the colour of each chord’s keys. C, F and G are all white. D, E and A have a black key in the middle. B has two black keys.',
            ru: 'Посмотрите на цвет клавиш каждого аккорда. C, F и G — только белые. В D, E и A посередине чёрная. В B две чёрные.',
          },
        },
        { kind: 'chords', symbols: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], apart: true },
      ],
    },
    {
      heading: { en: 'Roots on the black keys', ru: 'От чёрных клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D♭, E♭ and A♭ go black, white, black. G♭ is all black. B♭ goes black, white, white.',
            ru: 'D♭, E♭ и A♭ — чёрная, белая, чёрная. G♭ — все чёрные. B♭ — чёрная, белая, белая.',
          },
        },
        { kind: 'chords', symbols: ['D♭', 'E♭', 'G♭', 'A♭', 'B♭'], apart: true },
      ],
    },
    {
      heading: { en: 'All twelve', ru: 'Все двенадцать' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the chords a 5th apart: C, G, D, A and on round. Each chord shares one note with the chord before it.',
            ru: 'Играйте аккорды через квинту: C, G, D, A и дальше по кругу. У каждого есть общий звук с предыдущим.',
          },
        },
        { kind: 'grid', quality: 'maj' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play E major.', ru: 'Сыграйте ми мажор.' },
          answer: { chord: 'E' },
        },
        {
          kind: 'question',
          ask: { en: 'Play A♭ major.', ru: 'Сыграйте ля-бемоль мажор.' },
          answer: { chord: 'A♭' },
        },
        {
          kind: 'question',
          ask: { en: 'Play B major.', ru: 'Сыграйте си мажор.' },
          answer: { chord: 'B' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'entry' },
        },
        {
          kind: 'link',
          title: { en: 'D major arpeggio in the Player', ru: 'Арпеджио ре мажор в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('D'), quality: 'maj' },
        },
      ],
    },
  ],
}

export default buildMajorChords
