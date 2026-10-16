import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const SECONDARY_DOMINANTS = 'I V/ii ii V/iii iii V/IV IV V/V V V/vi vi V I'

/** The Chord Matrix sheet (Jazz Lab): a key's chords as a family, and the chords that lead to them. */
const chordMatrix: Lesson = {
  id: 'chord-matrix',
  title: { en: 'The chord matrix', ru: 'Матрица аккордов' },
  summary: {
    en: 'Find a key’s chords, the dominants leading to them, and borrowed chords.',
    ru: 'Находите аккорды тональности, доминанты к ним и аккорды из минора.',
  },
  sections: [
    {
      heading: { en: 'The chord family', ru: 'Семья аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A key’s seven chords are its family. Most pop songs, Let It Be among them, use no others.',
            ru: 'Семь аккордов тональности — её семья. Большинству поп-песен, и Let It Be тоже, других не нужно.',
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
          lead: { en: 'A secondary dominant', ru: 'Вторичная доминанта' },
          text: {
            en: 'is the dominant of a chord other than I, a 5th above it. Every chord but B° has one.',
            ru: '— доминанта к аккорду, который не является I, на квинту выше него. Она есть у каждого аккорда, кроме B°.',
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
            en: 'After a secondary dominant the ear expects its chord. Here E leads to Am, but D, promising G, goes to F.',
            ru: 'После вторичной доминанты слух ждёт её аккорд. Здесь E ведёт к Am, а D обещает G, но уходит в F.',
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
            en: 'A secondary dominant can bring its own ii: a minor 7th, or half-diminished when its chord is minor.',
            ru: 'Вторичная доминанта может привести свой ii: малый септаккорд или полууменьшённый, если её аккорд минорный.',
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
            en: 'Fly Me to the Moon: C7 leads to F, then Bø–E7 is a minor ii–V into Am.',
            ru: 'Fly Me to the Moon: C7 ведёт к F, затем Bø–E7 — минорный ii–V в Am.',
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
            en: 'comes from the minor key on the same tonic. One sounds dark and magical: Clocks borrows Gm.',
            ru: 'берут из одноимённого минора. Один такой аккорд звучит темно и волшебно: Clocks берёт Gm.',
          },
        },
        { kind: 'chords', symbols: ['Cm', 'D°', 'E♭', 'Fm', 'Gm', 'A♭', 'B♭'], apart: true },
        { kind: 'progression', numerals: 'I v v ii', key: C_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'Borrow sparingly, or the magic is lost.',
            ru: 'Берите их скупо, иначе волшебство пропадёт.',
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
              en: 'Start on C or Am. Fill 16 bars from the matrix.',
              ru: 'Начните с C или Am. Заполните 16 тактов из матрицы.',
            },
            {
              en: 'Resolve each secondary dominant where its arrow points.',
              ru: 'Разрешайте каждую вторичную доминанту туда, куда указывает её стрелка.',
            },
            {
              en: 'Use mostly the family. Borrow from minor once or twice.',
              ru: 'В основном берите семью. Из минора — раз или два.',
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
          title: { en: 'Secondary dominants in the Player', ru: 'Вторичные доминанты в плеере' },
          target: {
            opens: 'player',
            numerals: SECONDARY_DOMINANTS,
            key: C_MAJOR,
            size: 'sevenths',
          },
        },
        {
          kind: 'link',
          title: { en: 'In all 12 keys', ru: 'Во всех 12 тональностях' },
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
