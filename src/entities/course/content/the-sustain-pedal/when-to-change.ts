import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const whenToChange: Lesson = {
  id: 'when-to-change',
  title: { en: 'When to change the pedal', ru: 'Когда менять педаль' },
  summary: {
    en: 'Change the pedal when the chord changes, and use less of it over runs and low notes.',
    ru: 'Менять педаль со сменой аккорда и брать её меньше на пассажах и низких звуках.',
  },
  sections: [
    {
      heading: { en: 'Change when the chord changes', ru: 'Смена вместе с аккордом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Harmony', ru: 'Гармония' },
          text: {
            en: 'is the chord under the music. Notes of one chord sound well together, so change the pedal only when the chord changes. Here that is once a bar.',
            ru: '— аккорд, на котором стоит музыка. Звуки одного аккорда хорошо звучат вместе, поэтому меняйте педаль только со сменой аккорда. Здесь это раз в такт.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 E4 G4 E4 F4 A4 C5 A4 G4 B4 D5 B4 C5/1',
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the notes that can share one pedal over the C chord.',
            ru: 'Сыграйте звуки, которые могут звучать на одной педали над аккордом C.',
          },
          answer: { notes: ['C', 'E', 'G'] },
        },
      ],
    },
    {
      heading: { en: 'Steps blur', ru: 'Поступенное движение смазывается' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A passing note', ru: 'Проходящий звук' },
          text: {
            en: 'is a note outside the chord that steps between chord notes. Under a held pedal, a run of steps blurs. So scales get little pedal or none.',
            ru: 'не входит в аккорд и соединяет его звуки шагом. На педали поступенный пассаж сливается в пятно, поэтому гаммы играют почти без неё.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
        {
          kind: 'question',
          ask: {
            en: 'Play the passing note between C and E.',
            ru: 'Сыграйте проходящий звук между до и ми.',
          },
          answer: { notes: ['D'] },
        },
      ],
    },
    {
      heading: { en: 'Low notes ring longest', ru: 'Низкие звуки тянутся дольше' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The same chord sounds thick low down and clear up high. In the bass, change the pedal more often or press it less deep.',
            ru: 'Один и тот же аккорд внизу звучит густо, а наверху прозрачно. В басу меняйте педаль чаще или нажимайте её мельче.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C2 E2 G2 |' },
            { symbol: 'C', hands: '| C5 E5 G5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Plan the pedal in a song', ru: 'Педаль в песне' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Mark each chord change, even two in one bar.',
              ru: 'Отметьте каждую смену аккорда, даже если их две в такте.',
            },
            {
              en: 'Change the pedal just after each mark.',
              ru: 'Меняйте педаль сразу после каждой отметки.',
            },
            {
              en: 'Over a run, lift the pedal or press it less.',
              ru: 'На пассаже снимайте педаль или берите её мельче.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I vi IV V', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'Aura Lee in the Player', ru: '«Аура Ли» в плеере' },
          target: { opens: 'piece', piece: 'aura-lee' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the chord that comes after C in I vi IV V.',
            ru: 'Сыграйте аккорд, который идёт после C в I vi IV V.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'link',
          title: { en: 'I vi IV V in the Player', ru: 'I vi IV V в плеере' },
          target: { opens: 'player', numerals: 'I vi IV V', key: C_MAJOR },
        },
        {
          kind: 'link',
          title: { en: 'Shenandoah in the Player', ru: '«Шенандоа» в плеере' },
          target: { opens: 'piece', piece: 'shenandoah' },
        },
        {
          kind: 'link',
          title: { en: 'Brahms’ Lullaby in the Player', ru: '«Колыбельная» Брамса в плеере' },
          target: { opens: 'piece', piece: 'brahms-lullaby' },
        },
      ],
    },
  ],
}

export default whenToChange
