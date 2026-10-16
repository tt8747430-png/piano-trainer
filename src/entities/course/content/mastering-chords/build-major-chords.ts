import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Mastering Chords, lesson 1: a major chord on any root, by counting semitones. */
const buildMajorChords: Lesson = {
  id: 'build-major-chords',
  title: { en: 'Build any major chord', ru: 'Мажорный аккорд от любой ноты' },
  summary: {
    en: 'Build a major chord on any of the twelve roots.',
    ru: 'Стройте мажорный аккорд от любой из двенадцати нот.',
  },
  sections: [
    {
      heading: { en: 'Four semitones, then three', ru: 'Четыре полутона, затем три' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Major chord:', ru: 'Мажорное трезвучие:' },
          text: {
            en: 'a root, the note 4 semitones above it, and the note 3 semitones above that. They are the root, the 3rd and the 5th.',
            ru: 'основной тон, звук на 4 полутона выше и звук ещё на 3 полутона выше. Это прима, терция и квинта.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'], apart: true },
      ],
    },
    {
      heading: { en: 'Count it from C', ru: 'Отсчитайте от до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From C, count four semitones up to E. From E, count three more up to G.',
            ru: 'От до отсчитайте четыре полутона вверх до ми. От ми — ещё три до соль.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        { kind: 'interval', root: note('E'), interval: 'm3' },
      ],
    },
    {
      heading: { en: 'On the white keys', ru: 'От белых клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C, F and G are all white. D, E and A have one black key in the middle. B has two.',
            ru: 'C, F и G — только белые клавиши. В D, E и A посередине одна чёрная. В B две чёрные.',
          },
        },
        { kind: 'chords', symbols: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], apart: true },
      ],
    },
    {
      heading: { en: 'On the black keys', ru: 'От чёрных клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D♭, E♭ and A♭ go black, white, black. G♭ is all black. B♭ is black, white, white.',
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
            en: 'Play them a 5th apart: C, G, D, A and on. Each chord shares a note with the last.',
            ru: 'Играйте их через квинту: C, G, D, A и дальше. У соседних аккордов есть общий звук.',
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
          target: { opens: 'quiz', trainer: 'build-chord' },
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
