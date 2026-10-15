import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const reharmonisingAMelody: Lesson = {
  id: 'reharmonising-a-melody',
  title: { en: 'Reharmonising a melody note', ru: 'Новая гармония для ноты мелодии' },
  summary: {
    en: 'A melody note fits more than one chord: the key’s triads that hold it, the 7th chords beyond them, and how to choose.',
    ru: 'Нота мелодии входит в разные аккорды: в трезвучия тональности и в септаккорды. Как найти их и выбрать.',
  },
  sections: [
    {
      heading: { en: 'One note, many chords', ru: 'Одна нота — много аккордов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Reharmonising', ru: 'Реармонизация' },
          text: {
            en: 'means a new chord under a melody note. In C major, E sits in C, Am and Em.',
            ru: '— это новый аккорд под нотой мелодии. В до мажоре ми входит в C, Am и Em.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'Em'], melody: note('E') },
        {
          kind: 'text',
          text: {
            en: 'Change the chord under a long melody note, and the line sounds new.',
            ru: 'Смените аккорд под долгой нотой мелодии, и строка зазвучит по-новому.',
          },
        },
        {
          kind: 'link',
          title: { en: 'E in Reharmonise', ru: 'Ми в «Гармонизации мелодии»' },
          target: { opens: 'harmonise', key: C_MAJOR, note: note('E') },
        },
      ],
    },
    {
      heading: { en: 'Beyond the triads', ru: 'Дальше трезвучий' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '7th chords hold E in more ways: the 7th of FMaj7, the 9th of Dm9, the 3rd of C7, which leads on to F.',
            ru: 'Септаккорды дают больше вариантов: ми — септима FMaj7, нона Dm9 и терция C7, который ведёт в F.',
          },
        },
        { kind: 'chords', symbols: ['FMaj7', 'Dm9', 'C7'], melody: note('E') },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'G is in the melody. Play the minor chord of C major that holds it.',
            ru: 'В мелодии соль. Сыграйте минорный аккорд до мажора, в который она входит.',
          },
          answer: { chord: 'Em' },
        },
        {
          kind: 'note',
          text: {
            en: 'Choose a chord whose bass moves well from the one before to the one after. Keep the melody on top, and reharmonise long notes, not quick ones.',
            ru: 'Выбирайте аккорд, бас которого хорошо идёт от предыдущего к следующему. Держите мелодию сверху и меняйте гармонию на долгих нотах, а не на быстрых.',
          },
        },
        {
          kind: 'link',
          title: { en: 'G in Reharmonise', ru: 'Соль в «Гармонизации мелодии»' },
          target: { opens: 'harmonise', key: C_MAJOR, note: note('G') },
        },
      ],
    },
  ],
}

export default reharmonisingAMelody
