import type { Lesson } from '@/entities/lesson'

/** 3/4 and the dotted half that fills its bar, then the pickup: a tune that starts before beat 1. */
const pickupAndDottedHalf: Lesson = {
  id: 'pickup-and-dotted-half',
  title: { en: 'The pickup and the dotted half note', ru: 'Затакт и половинная с точкой' },
  summary: {
    en: 'Count three beats to a bar in 3/4, and start a tune on a pickup before beat 1.',
    ru: 'Считать три доли в такте в размере 3/4 и начинать мелодию с затакта перед первой долей.',
  },
  sections: [
    {
      heading: { en: 'Three beats in a bar', ru: 'Три доли в такте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In 3/4 each bar holds three quarter-note beats. Count 1 2 3 and play beat 1 a little stronger than the other two.',
            ru: 'В размере 3/4 в такте три доли по четверти. Считайте «раз, два, три» и играйте первую долю чуть сильнее двух других.',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'C4 E4 G4 G4 E4 C4 D4 F4 A4 G4/2.' },
      ],
    },
    {
      heading: { en: 'A dotted half fills the bar', ru: 'Половинная с точкой заполняет такт' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A dotted half lasts three beats, so in 3/4 it fills a whole bar on its own. A half note and a quarter note together fill a bar too.',
            ru: 'Половинная с точкой длится три доли, поэтому в 3/4 она одна заполняет весь такт. Половинная и четверть вместе тоже заполняют такт.',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'E4 F4 G4 C5/2. G4/2 E4 C4/2.' },
      ],
    },
    {
      heading: { en: 'The pickup', ru: 'Затакт' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A pickup', ru: 'Затакт' },
          text: {
            en: 'is a note or two before the first full bar. The tune starts on a weak beat and leads into beat 1. Here the pickup G falls on beat 3.',
            ru: '— одна-две ноты перед первым полным тактом. Мелодия начинается со слабой доли и ведёт к «раз». Здесь затакт соль приходится на «три».',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '3/4',
          notes: 'r/2 G4 C5/2 E5 D5/2 C5 B4/2 G4 C5/2.',
        },
      ],
    },
    {
      heading: { en: 'How to count a pickup', ru: 'Как считать затакт' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'r/2. G4 C5/2 E5/2 D5 C5 B4 A4 G4/1' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find the beat the pickup falls on. In this 4/4 line it is beat 4.',
              ru: 'Найдите долю, на которую падает затакт. В этой строке в 4/4 это «четыре».',
            },
            {
              en: 'Count 1 2 3 silently, then play the pickup on 4.',
              ru: 'Просчитайте про себя «раз, два, три» и сыграйте затакт на «четыре».',
            },
            {
              en: 'Land on the next 1, the first full bar.',
              ru: 'Придите на следующий «раз», в первый полный такт.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'A two-note pickup', ru: 'Затакт из двух нот' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In 3/4 a pickup of two notes falls on beats 2 and 3. Count 1 silently, play the two notes, then land on the next 1.',
            ru: 'В 3/4 затакт из двух нот приходится на «два, три». Просчитайте «раз» про себя, сыграйте две ноты и придите на следующий «раз».',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'r/4 E4 F4 G4/2. G4 A4 B4 C5/2.' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play a pickup G, then land on the C above it on beat 1.',
            ru: 'Сыграйте затакт соль, затем придите на до выше на «раз».',
          },
          answer: { notes: ['G', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the two-note pickup E, F, then G on beat 1.',
            ru: 'Сыграйте затакт ми, фа, затем соль на «раз».',
          },
          answer: { notes: ['E', 'F', 'G'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'Auld Lang Syne starts on a one-beat pickup',
            ru: '«Старая дружба» начинается с затакта в одну долю',
          },
          target: { opens: 'piece', piece: 'auld-lang-syne' },
        },
        {
          kind: 'link',
          title: {
            en: 'Red River Valley starts on a two-beat pickup',
            ru: '«Долина Красной реки» начинается с затакта в две доли',
          },
          target: { opens: 'piece', piece: 'red-river-valley' },
        },
      ],
    },
  ],
}

export default pickupAndDottedHalf
