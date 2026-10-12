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
  level: 3,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'One note, many chords', ru: 'Одна нота — много аккордов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Reharmonising', ru: 'Реармонизация' },
          text: {
            en: 'means putting a new chord under a melody note. The note stays, the chord changes.',
            ru: '— это новый аккорд под нотой мелодии. Нота остаётся, аккорд меняется.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'In C major, E is the 3rd of C, the 5th of Am and the root of Em. Tap the three chords below: E stays on top.',
            ru: 'В до мажоре ми — терция C, квинта Am и основной тон Em. Нажмите три аккорда ниже: ми остаётся сверху.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'Em'], melody: note('E') },
        {
          kind: 'text',
          text: {
            en: 'Each chord gives the same note a new colour. Change the chord under a long melody note, and the line sounds new.',
            ru: 'Каждый аккорд по-своему окрашивает одну и ту же ноту. Смените аккорд под долгой нотой мелодии, и строка зазвучит по-новому.',
          },
        },
        {
          kind: 'link',
          title: { en: 'E in Reharmonise', ru: 'Ми в «Гармонизации мелодии»' },
          target: { place: 'reharmonise', key: C_MAJOR, note: note('E') },
        },
      ],
    },
    {
      heading: { en: 'Beyond the triads', ru: 'Дальше трезвучий' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '7th chords hold the note in more ways. E is the 7th of FMaj7, the 9th of Dm9 and the 3rd of C7.',
            ru: 'Септаккорды дают ещё больше вариантов. Ми — септима FMaj7, нона Dm9 и терция C7.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'C7 is also the V7 of F, so it leads on to F. Tap the three below, E on top again.',
            ru: 'C7 к тому же — V7 для F и ведёт в него. Нажмите три аккорда ниже: ми снова сверху.',
          },
        },
        { kind: 'chords', symbols: ['FMaj7', 'Dm9', 'C7'], melody: note('E') },
      ],
    },
    {
      heading: { en: 'Choosing', ru: 'Как выбирать' },
      blocks: [
        {
          kind: 'note',
          text: {
            en: 'Choose a chord whose bass moves well from the chord before and toward the chord after. Keep the melody on top. A new chord on a long note is heard. On a quick passing note it is lost.',
            ru: 'Выбирайте аккорд, бас которого удобно идёт от предыдущего аккорда к следующему. Держите мелодию сверху. Новый аккорд на долгой ноте слышен. На быстрой проходящей ноте он теряется.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'G is in the melody. Play the minor chord of C major that holds it.',
            ru: 'В мелодии соль. Сыграйте минорный аккорд до мажора, в который она входит.',
          },
          answer: { chord: 'Em' },
        },
        {
          kind: 'link',
          title: { en: 'G in Reharmonise', ru: 'Соль в «Гармонизации мелодии»' },
          target: { place: 'reharmonise', key: C_MAJOR, note: note('G') },
        },
      ],
    },
  ],
}

export default reharmonisingAMelody
