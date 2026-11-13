import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Sixteen-Week Practice Plan, lesson 9: improvising from chord tones, approach notes, motifs and space. */
const improvising: Lesson = {
  id: 'improvising',
  title: { en: 'Improvising from chord tones', ru: 'Импровизация от звуков аккорда' },
  summary: {
    en: 'Start on one note with rhythm, land chord tones on strong beats, approach them by a half step, and grow a motif. The blues scale last.',
    ru: 'Начните с одного звука и ритма, ставьте звуки аккорда на сильные доли, подходите к ним полутоном и развивайте мотив. Блюзовая гамма — в конце.',
  },
  after: ['arranging-a-hymn'],
  sections: [
    {
      heading: { en: 'One note, many rhythms', ru: 'Один звук, много ритмов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Improvise on one note first, with rhythm alone. Then use two notes, then the chord’s three.',
            ru: 'Сначала импровизируйте на одном звуке, только ритмом. Затем на двух, затем на трёх звуках аккорда.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C5/8 C5/8 r/4 C5/8 r/8 C5/4 r/8 C5/8 C5/8 C5/8 C5/2',
          bass: 'C3/1 C3/1',
        },
      ],
      takeaway: {
        en: 'Rhythm alone can make one note sound like music.',
        ru: 'Один ритм способен превратить один звук в музыку.',
      },
    },
    {
      heading: { en: 'Chord tones on the beat', ru: 'Звуки аккорда на долю' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Target notes', ru: 'Опорные звуки' },
          text: {
            en: 'are chord tones you land on, on strong beats and at each change of chord. The 3rd and the 7th sound best.',
            ru: '— звуки аккорда, на которые вы приходите на сильных долях и при смене аккорда. Лучше всего звучат терция и септима.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'F4 A4 C5 A4 B4 G4 F4 D4',
          bass: 'D3/1 G2/1',
        },
      ],
    },
    {
      heading: { en: 'Approach notes', ru: 'Подходы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An approach note', ru: 'Подход' },
          text: {
            en: 'reaches a target from a half step below. An enclosure plays the notes above and below, then the target.',
            ru: 'приходит к опорному звуку на полтона снизу. Окружение берёт звуки сверху и снизу, потом опорный.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4/2 r/4 D♯4 E4/2 F4/8 D♯4/8 E4',
          bass: 'G2/1 C3/1',
        },
      ],
    },
    {
      heading: { en: 'A motif', ru: 'Мотив' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A motif', ru: 'Мотив' },
          text: {
            en: 'is a short idea. Play it, repeat it, then change one thing: the rhythm, the last note or the height.',
            ru: '— короткая мысль. Сыграйте её, повторите, затем измените одно: ритм, последний звук или высоту.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4/8 G4/8 A4 r/2 E4/8 G4/8 A4 r/2 E4/8 G4/8 C5 r/2',
          bass: 'C3/1 F2/1 C3/1',
        },
      ],
    },
    {
      heading: { en: 'The blues scale', ru: 'Блюзовая гамма' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Over a blues, the blues scale fits every chord. Do not run it up and down. Play short phrases and leave space between them.',
            ru: 'В блюзе блюзовая гамма подходит ко всем аккордам. Не гоняйте её вверх-вниз. Играйте короткие фразы и оставляйте паузы.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'blues' },
      ],
      takeaway: {
        en: 'Silence is part of the phrase. Leave as much space as you play.',
        ru: 'Пауза — часть фразы. Оставляйте столько же места, сколько играете.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Approach E from a half step below.',
            ru: 'Подойдите к ми на полтона снизу.',
          },
          answer: { notes: ['D♯', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the 3rd and 7th of G7, the notes to land on.',
            ru: 'Сыграйте терцию и септиму G7 — звуки, на которые приходят.',
          },
          answer: { notes: ['B', 'F'] },
        },
        {
          kind: 'link',
          title: { en: 'The blues scale on C', ru: 'Блюзовая гамма от до' },
          target: { opens: 'scales', root: note('C'), scale: 'blues' },
        },
        {
          kind: 'link',
          title: {
            en: 'A ii – V – I to improvise over, round the circle',
            ru: 'ii – V – I для импровизации по кругу',
          },
          target: {
            opens: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default improvising
