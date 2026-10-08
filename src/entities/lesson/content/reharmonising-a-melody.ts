import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const reharmonisingAMelody: Lesson = {
  id: 'reharmonising-a-melody',
  title: { en: 'Reharmonising a melody note', ru: 'Новая гармония для ноты мелодии' },
  summary: {
    en: 'A melody note sits in more than one chord: the key’s triads that hold it, the 7th chords past them, and how to choose.',
    ru: 'Нота мелодии входит не в один аккорд: трезвучия тональности, в которых она есть, септаккорды за их пределами и как выбирать.',
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
          text: {
            en: 'E in C major is the 3rd of C, the 5th of Am and the root of Em: three colours under the same note. Change the chord on a long melody note and the line takes on a new light.',
            ru: 'Ми в до мажоре — терция C, квинта Am и основной тон Em: три краски под одной нотой. Смените аккорд под долгой нотой мелодии, и строка зазвучит по-новому.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'Em'] },
        {
          kind: 'link',
          title: { en: 'E in Reharmonise', ru: 'Ми в реармонизации' },
          target: { place: 'reharmonise', key: C_MAJOR, note: note('E') },
        },
      ],
    },
    {
      heading: { en: 'Past the triads', ru: 'Дальше трезвучий' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '7th chords hold the note in more ways: E is the 7th of FMaj7, the 9th of Dm9 and the 3rd of C7, which is the V7 of F and leads on to it.',
            ru: 'Септаккорды дают ещё больше вариантов: ми — септима FMaj7, нона Dm9 и терция C7, который к тому же V7 для F и ведёт в него.',
          },
        },
        { kind: 'chords', symbols: ['FMaj7', 'Dm9', 'C7'] },
      ],
    },
    {
      heading: { en: 'Choosing', ru: 'Как выбирать' },
      blocks: [
        {
          kind: 'note',
          text: {
            en: 'Choose a chord whose bass moves well from the chord before and toward the chord after, and keep the melody on top. A new chord on a long note is heard; on a quick passing note it is lost.',
            ru: 'Выбирайте аккорд, бас которого хорошо движется от предыдущего аккорда к следующему, и держите мелодию сверху. Новый аккорд на долгой ноте слышен, на быстрой проходящей — теряется.',
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
            en: 'G is in the melody: play the minor chord of C major that holds it.',
            ru: 'В мелодии соль: сыграйте минорный аккорд до мажора, в котором она есть.',
          },
          answer: { chord: 'Em' },
        },
        {
          kind: 'link',
          title: { en: 'G in Reharmonise', ru: 'Соль в реармонизации' },
          target: { place: 'reharmonise', key: C_MAJOR, note: note('G') },
        },
      ],
    },
  ],
}

export default reharmonisingAMelody
