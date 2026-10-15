import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const sustainPedal: Lesson = {
  id: 'sustain-pedal',
  title: { en: 'The sustain pedal', ru: 'Правая педаль' },
  summary: {
    en: 'What the right pedal does, how to press it, and the legato pedal: changing just after each chord.',
    ru: 'Что делает правая педаль, как её нажимать, и запаздывающая педаль: смена сразу после аккорда.',
  },
  sections: [
    {
      heading: { en: 'The right pedal holds the sound', ru: 'Правая педаль продлевает звук' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The sustain pedal', ru: 'Правая (демпферная) педаль' },
          text: {
            en: 'lifts the dampers off the strings, so notes ring after the keys come up. Songs use it almost always.',
            ru: 'поднимает демпферы со струн, и ноты звучат после того, как клавиши отпущены. В песнях она нужна почти всегда.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
        {
          kind: 'note',
          text: {
            en: 'The left pedal makes the sound softer.',
            ru: 'Левая педаль делает звук тише.',
          },
        },
      ],
    },
    {
      heading: { en: 'Heel down, ball of the foot', ru: 'Пятка на полу, нажим подушечкой' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Keep the heel on the floor.', ru: 'Пятка стоит на полу.' },
            {
              en: 'Press with the ball of the foot.',
              ru: 'Нажимайте подушечкой стопы.',
            },
            {
              en: 'Go all the way down and all the way up, without a knock.',
              ru: 'Нажимайте и отпускайте до конца, без стука.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C, press the pedal, then lift your hand.',
            ru: 'Сыграйте до мажор, нажмите педаль и снимите руку.',
          },
          answer: { chord: 'C' },
        },
      ],
    },
    {
      heading: { en: 'Change just after the chord', ru: 'Смена сразу после аккорда' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The legato pedal:', ru: 'Запаздывающая педаль:' },
          text: {
            en: 'play the new chord, then lift the pedal and press it again at once. Say “chord, up, down”.',
            ru: 'сыграйте новый аккорд, затем отпустите педаль и сразу нажмите снова. Проговаривайте: «аккорд, вверх, вниз».',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C'] },
        {
          kind: 'note',
          text: {
            en: 'Space and the rail’s Pedal hold it too.',
            ru: 'Пробел и кнопка «Педаль» на панели тоже её держат.',
          },
        },
      ],
    },
    {
      heading: { en: 'Never across a change', ru: 'Не держите через смену' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Two chords under one pedal blur. Change at every new chord, and take less pedal in the bass.',
            ru: 'Два аккорда на одной педали сливаются. Меняйте на каждом новом аккорде, а в басу берите педаль мельче.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the chord F: F, A, C.', ru: 'Сыграйте аккорд F: фа, ля, до.' },
          answer: { chord: 'F' },
        },
        {
          kind: 'question',
          ask: { en: 'Play the chord G: G, B, D.', ru: 'Сыграйте аккорд G: соль, си, ре.' },
          answer: { chord: 'G' },
        },
      ],
    },
  ],
}

export default sustainPedal
