import type { Lesson } from '@/entities/lesson'

/** 3/4 and the dotted half that fills its bar, then the pickup: a tune that starts before beat 1. */
const pickupAndDottedHalf: Lesson = {
  id: 'pickup-and-dotted-half',
  title: { en: 'The pickup and the dotted half note', ru: 'Затакт и половинная с точкой' },
  summary: {
    en: 'Count bars of three in 3/4, fill one with a dotted half, and start a tune on a pickup before beat 1.',
    ru: 'Считайте такты на три в размере 3/4, заполняйте такт половинной с точкой и начинайте мелодию с затакта.',
  },
  sections: [
    {
      heading: { en: 'Three beats in a bar', ru: 'Три доли в такте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In 3/4 each bar holds three quarter-note beats. Count 1 2 3, leaning on 1.',
            ru: 'В размере 3/4 в такте три доли, каждая — четверть. Считайте «раз, два, три» с опорой на «раз».',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'C4 E4 G4 G4 E4 C4 D4 F4 A4 G4/2.' },
        {
          kind: 'note',
          text: {
            en: 'A waltz moves in 3/4: strong, weak, weak.',
            ru: 'Вальс идёт в размере 3/4: сильная, слабая, слабая.',
          },
        },
      ],
    },
    {
      heading: { en: 'A dotted half fills the bar', ru: 'Половинная с точкой заполняет такт' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A dotted half lasts three beats, so in 3/4 it fills a bar alone. Play on 1 and hold through 2 and 3.',
            ru: 'Половинная с точкой длится три доли и в 3/4 одна заполняет такт. Играйте на «раз» и держите на «два, три».',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'E4 F4 G4 C5/2. B4 A4 G4 C4/2.' },
      ],
    },
    {
      heading: { en: 'Half and quarter', ru: 'Половинная и четверть' },
      blocks: [
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'C4/2 E4 G4/2 E4 F4/2 D4 C4/2.' },
        {
          kind: 'text',
          text: {
            en: 'A half and a quarter also make three beats. Hold the half through 1 and 2, then play on 3.',
            ru: 'Половинная и четверть тоже дают три доли. Держите половинную на «раз, два» и играйте на «три».',
          },
        },
      ],
    },
    {
      heading: { en: 'The pickup', ru: 'Затакт' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A pickup', ru: 'Затакт' },
          text: {
            en: 'is a note or two before the first full bar. The tune starts on a weak beat and leans into beat 1.',
            ru: '— одна или несколько нот перед первым полным тактом. Мелодия начинается со слабой доли и приходит на «раз».',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '3/4',
          notes: 'r/2 G4 C5/2 E5 D5/2 C5 B4/2 G4 C5/2.',
        },
        {
          kind: 'note',
          text: {
            en: 'Here the beats before the pickup are written as a rest.',
            ru: 'Здесь доли перед затактом записаны паузой.',
          },
        },
      ],
    },
    {
      heading: { en: 'Counting a pickup', ru: 'Как считать затакт' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'r/2. G4 C5/2 E5/2 D5 C5 B4 A4 G4/1' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find the beat the pickup falls on: here 4.',
              ru: 'Найдите долю затакта: здесь «четыре».',
            },
            {
              en: 'Count 1 2 3 silently and play on 4.',
              ru: 'Просчитайте про себя «раз, два, три» и играйте на «четыре».',
            },
            {
              en: 'Land on the next 1, the bar’s strong beat.',
              ru: 'Придите на следующий «раз», сильную долю такта.',
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
            en: 'A pickup can take two beats. In 3/4 count 1 silently, then play on 2 and 3.',
            ru: 'Затакт может занимать две доли. В 3/4 просчитайте «раз» про себя и играйте на «два, три».',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'r/4 E4 F4 G4/2. G4 A4 B4 C5/2.' },
        {
          kind: 'note',
          text: {
            en: 'A song with a pickup often ends on a short bar. Together they make one whole bar.',
            ru: 'Песня с затактом часто заканчивается неполным тактом. Вместе они дают один полный такт.',
          },
        },
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
          kind: 'question',
          ask: {
            en: 'Play C5 as a dotted half in 3/4, counting 1 2 3.',
            ru: 'Сыграйте до второй октавы половинной с точкой в 3/4, считая «раз, два, три».',
          },
          answer: { notes: ['C'] },
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
