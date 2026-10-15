import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

/** The Chord Matrix sheet (Jazz Lab): a key's chords as a family, and the chords that lead to them. */
const chordMatrix: Lesson = {
  id: 'chord-matrix',
  title: { en: 'The chord matrix', ru: 'Матрица аккордов' },
  summary: {
    en: 'A key’s family of chords, the dominants that lead to them, and chords borrowed from minor.',
    ru: 'Семья аккордов тональности, доминанты, ведущие к ним, и аккорды, взятые из минора.',
  },
  sections: [
    {
      heading: { en: 'The chord family', ru: 'Семья аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A key’s seven chords are its family. Most pop songs use no others.',
            ru: 'Семь аккордов тональности — её семья. Большинству поп-песен других не нужно.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'], apart: true },
        { kind: 'progression', numerals: 'I V vi IV I V IV I', key: C_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'Let It Be uses only the family. B° is rare in pop: it was once a dominant.',
            ru: 'Let It Be обходится одной семьёй. B° в поп-музыке редок: когда-то он был доминантой.',
          },
        },
      ],
    },
    {
      heading: { en: 'The extended family', ru: 'Расширенная семья' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each chord but B° has its own dominant, a 5th above it, pulling to it.',
            ru: 'У каждого аккорда, кроме B°, есть своя доминанта на квинту выше, которая тянет к нему.',
          },
        },
        {
          kind: 'progression',
          numerals: 'I V/ii ii V/iii iii V/IV IV V/V V V/vi vi V I',
          key: C_MAJOR,
          size: 'sevenths',
        },
        {
          kind: 'note',
          text: {
            en: 'These are secondary dominants, each with a note from outside the key.',
            ru: 'Это вторичные доминанты, у каждой есть звук извне тональности.',
          },
        },
      ],
    },
    {
      heading: { en: 'Follow the arrows', ru: 'Следуйте за стрелками' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'After a secondary dominant the ear expects its chord. Yesterday shows both ways.',
            ru: 'После вторичной доминанты слух ждёт её аккорд. Yesterday показывает оба пути.',
          },
        },
        { kind: 'progression', numerals: 'I V/vi vi IV V I vi V/V IV I', key: C_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'E7 leads to Am, as expected. D7 promises G, but F comes: the expectation is broken.',
            ru: 'E7 ведёт к Am, как и ожидалось. D7 обещает G, но приходит F: ожидание обмануто.',
          },
        },
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
      heading: { en: 'The upside-down world', ru: 'Изнанка' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C minor’s family can visit C major. One borrowed chord sounds dark and magical.',
            ru: 'Семья до минора может заглянуть в до мажор. Один взятый аккорд звучит темно и волшебно.',
          },
        },
        { kind: 'chords', symbols: ['Cm', 'D°', 'E♭', 'Fm', 'Gm', 'A♭', 'B♭'], apart: true },
        { kind: 'progression', numerals: 'I v v ii', key: C_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'Clocks borrows Gm. Use these chords sparingly, or the magic is lost.',
            ru: 'Clocks берёт Gm. Используйте такие аккорды скупо, иначе волшебство пропадёт.',
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
            en: 'Play the dominant that leads to Dm.',
            ru: 'Сыграйте доминанту, ведущую к Dm.',
          },
          answer: { chord: 'A7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C major’s chord borrowed from C minor on the 6th degree.',
            ru: 'Сыграйте аккорд VI ступени, взятый до мажором из до минора.',
          },
          answer: { chord: 'A♭' },
        },
        {
          kind: 'link',
          title: { en: 'Secondary dominants in the Player', ru: 'Вторичные доминанты в плеере' },
          target: {
            opens: 'player',
            numerals: 'I V/ii ii V/iii iii V/IV IV V/V V V/vi vi V I',
            key: C_MAJOR,
            size: 'sevenths',
          },
        },
        {
          kind: 'link',
          title: { en: 'In all 12 keys', ru: 'Во всех 12 тональностях' },
          target: {
            opens: 'player',
            numerals: 'I V/ii ii V/iii iii V/IV IV V/V V V/vi vi V I',
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
