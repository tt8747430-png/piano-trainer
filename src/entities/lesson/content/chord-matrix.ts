import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const SECONDARY_DOMINANTS = 'I V/ii ii V/iii iii V/IV IV V/V V V/vi vi V I'

/** The Chord Matrix sheet (Jazz Lab): a key's chords as a family, and the chords that lead to them. */
const chordMatrix: Lesson = {
  id: 'chord-matrix',
  title: { en: 'The chord matrix', ru: 'Матрица аккордов' },
  summary: {
    en: 'Map the chords a song in one key can use: its own seven, the dominants that lead to them, and chords borrowed from minor.',
    ru: 'Карта аккордов для песни в одной тональности: свои семь, доминанты к ним и аккорды из минора.',
  },
  sections: [
    {
      heading: { en: 'The chord family', ru: 'Семья аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The seven chords built on a key’s scale are its family. Most pop songs use only these. Let It Be is one of them.',
            ru: 'Семь аккордов, построенных на гамме тональности, — её семья. Большинство поп-песен обходятся только ими. Let It Be — одна из таких.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'], apart: true },
        { kind: 'progression', numerals: 'I V vi IV I V IV I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'The extended family', ru: 'Расширенная семья' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A secondary dominant', ru: 'Побочная доминанта' },
          text: {
            en: 'is a dominant 7th that leads to a chord other than I. It stands a 5th above that chord: E7 leads to Am, A7 to Dm. Every chord but B° has one.',
            ru: '— доминантсептаккорд, который ведёт не к I, а к другому аккорду. Он стоит на квинту выше него: E7 ведёт к Am, A7 к Dm. Такая доминанта есть у каждого аккорда, кроме B°.',
          },
        },
        { kind: 'progression', numerals: SECONDARY_DOMINANTS, key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'Follow the arrows', ru: 'Следуйте за стрелками' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A secondary dominant makes the ear expect its chord. Here E goes to Am, as expected. D promises G, then moves to F instead.',
            ru: 'После побочной доминанты слух ждёт её аккорд. Здесь E приходит в Am, как и ожидалось. D обещает G, но уходит в F.',
          },
        },
        { kind: 'progression', numerals: 'I V/vi vi IV V I vi V/V IV I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Distant cousins', ru: 'Дальние родственники' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A secondary dominant can bring its own ii first: a minor 7th, or half-diminished when its target is minor.',
            ru: 'Перед побочной доминантой может стоять свой ii. Это малый септаккорд, а если она ведёт к минорному аккорду, полууменьшённый.',
          },
        },
        {
          kind: 'progression',
          numerals: 'vi ii V I V/IV IV ii°/vi V/vi vi',
          key: C_MAJOR,
          size: 'sevenths',
        },
        {
          kind: 'note',
          text: {
            en: 'Fly Me to the Moon: C7 leads to F, later Bø and E7 lead into Am.',
            ru: 'Fly Me to the Moon: C7 ведёт к F, позже Bø и E7 ведут в Am.',
          },
        },
      ],
    },
    {
      heading: { en: 'Borrowed from minor', ru: 'Аккорды из минора' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A borrowed chord', ru: 'Заимствованный аккорд' },
          text: {
            en: 'comes from the minor key on the same tonic, C minor in C major. Used once, it sounds dark and magical. Clocks borrows Gm.',
            ru: '— это аккорд из одноимённого минора: из до минора в до мажоре. Взятый один раз, он звучит темно и волшебно. Clocks берёт Gm.',
          },
        },
        { kind: 'chords', symbols: ['Cm', 'D°', 'E♭', 'Fm', 'Gm', 'A♭', 'B♭'], apart: true },
        { kind: 'progression', numerals: 'I v v ii', key: C_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'Borrow rarely, or the effect wears off.',
            ru: 'Берите их редко, иначе эффект пропадёт.',
          },
        },
      ],
    },
    {
      heading: { en: 'Write a ballad', ru: 'Напишите балладу' },
      blocks: [
        {
          kind: 'progression',
          numerals: 'I iii vi V/V V ii°/vi V/vi vi IV iv I V/ii ii V I',
          key: C_MAJOR,
          size: 'sevenths',
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Start on C or Am. Fill 16 bars with chords from this lesson.',
              ru: 'Начните с C или Am. Заполните 16 тактов аккордами из этого урока.',
            },
            {
              en: 'Follow each secondary dominant with its chord.',
              ru: 'После каждой побочной доминанты ставьте её аккорд.',
            },
            {
              en: 'Use mostly the family. Borrow from minor once or twice.',
              ru: 'В основном берите аккорды семьи. Из минора берите раз или два.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the dominant 7th that leads to Dm.',
            ru: 'Сыграйте доминантсептаккорд, ведущий к Dm.',
          },
          answer: { chord: 'A7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the chord on the 6th degree that C major borrows from C minor.',
            ru: 'Сыграйте аккорд VI ступени, который до мажор берёт из до минора.',
          },
          answer: { chord: 'A♭' },
        },
        {
          kind: 'link',
          title: {
            en: 'Practise secondary dominants in the Player',
            ru: 'Побочные доминанты в плеере',
          },
          target: {
            opens: 'player',
            numerals: SECONDARY_DOMINANTS,
            key: C_MAJOR,
            size: 'sevenths',
          },
        },
        {
          kind: 'link',
          title: { en: 'The same through all 12 keys', ru: 'То же во всех 12 тональностях' },
          target: {
            opens: 'player',
            numerals: SECONDARY_DOMINANTS,
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default chordMatrix
