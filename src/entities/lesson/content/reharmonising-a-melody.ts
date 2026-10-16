import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const reharmonisingAMelody: Lesson = {
  id: 'reharmonising-a-melody',
  title: { en: 'Reharmonising a melody note', ru: 'Новая гармония для ноты мелодии' },
  summary: {
    en: 'Find the chords that hold one melody note, from triads to 7th chords, and choose between them.',
    ru: 'Находить аккорды, в которые входит нота мелодии, от трезвучий до септаккордов, и выбирать из них.',
  },
  sections: [
    {
      heading: { en: 'One note, many chords', ru: 'Одна нота — много аккордов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Reharmonising', ru: 'Реармонизация' },
          text: {
            en: 'means putting a new chord under a melody note. The note must be in the chord. In C major, E is in C, Am and Em.',
            ru: '— это новый аккорд под нотой мелодии. Нота должна входить в аккорд. В до мажоре ми есть в C, Am и Em.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'Em'], melody: note('E') },
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
            en: 'Larger chords give more choices. E is the 7th of FMaj7, the 9th of Dm9 and the 3rd of C7. C7 then leads on to F.',
            ru: 'Аккорды побольше дают больше вариантов. Ми — септима FMaj7, нона Dm9 и терция C7. А C7 ведёт дальше в F.',
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
            en: 'To choose, play the chords before and after. Pick the one whose bass moves smoothly. Change the chord under long notes only.',
            ru: 'Чтобы выбрать, сыграйте аккорды до и после. Берите тот, где бас движется плавно. Меняйте аккорд только под долгими нотами.',
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
