import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** My Practice Plan, lesson 5: the left hand's ladder, from the root alone to tenths and walk-ups. */
const leftHand: Lesson = {
  id: 'left-hand',
  title: { en: 'The left hand’s ladder', ru: 'Лестница левой руки' },
  summary: {
    en: 'Climb from the root alone to octaves, open fifths, 1–5–8, tenths and walk-ups, and practise the left hand on its own.',
    ru: 'Поднимитесь от одного баса к октавам, пустым квинтам, 1–5–8, децимам и ходам вверх, и занимайтесь левой рукой отдельно.',
  },
  after: ['rhythm-first'],
  sections: [
    {
      heading: { en: 'Root and octave', ru: 'Бас и октава' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Begin with the root alone on beat 1. Then play the root and its octave above, a half note each.',
            ru: 'Начните с одного баса на «раз». Затем бас и его октава выше, по половинной.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C2/2 C3/2 F2/2 F3/2' },
      ],
    },
    {
      heading: { en: 'The open fifth', ru: 'Пустая квинта' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The open fifth', ru: 'Пустая квинта' },
          text: {
            en: 'is the root and 5th together. It sounds full and leaves the 3rd to the right hand.',
            ru: '— бас и квинта вместе. Звучит полно и оставляет терцию правой руке.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 5 | 3 5 1', hands: 'C2 G2 | E4 G4 C5' },
            { symbol: 'F', degrees: '1 5 | 1 3 5', hands: 'F2 C3 | F4 A4 C5' },
            { symbol: 'G', degrees: '1 5 | 5 1 3', hands: 'G2 D3 | D4 G4 B4' },
            { symbol: 'C', degrees: '1 5 | 3 5 1', hands: 'C2 G2 | E4 G4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Root, fifth, octave', ru: 'Бас, квинта, октава' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play 1, 5, 8 in eighth notes, then back to the 5th. It fills the bar with movement under held chords.',
            ru: 'Играйте 1, 5, 8 восьмыми и обратно к квинте. Это наполняет такт движением под выдержанными аккордами.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C2/8 G2/8 C3/8 G2/8 C2/8 G2/8 C3/8 G2/8 F2/8 C3/8 F3/8 C3/8 F2/8 C3/8 F3/8 C3/8',
        },
      ],
    },
    {
      heading: { en: 'Tenths', ru: 'Децимы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tenth', ru: 'Децима' },
          text: {
            en: 'is the root with the 3rd an octave higher. It sounds warm and wide. Roll it from the bottom if your hand cannot reach.',
            ru: '— бас с терцией на октаву выше. Звучит тепло и широко. Если рука не достаёт, берите её арпеджато снизу.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 3 | 5 1', hands: 'C3 E4 | G4 C5' },
            { symbol: 'F', degrees: '1 3 | 5 1', hands: 'F2 A3 | C4 F4' },
            { symbol: 'G', degrees: '1 3 | 5 1', hands: 'G2 B3 | D4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Walk-ups', ru: 'Ходы баса' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A walk-up', ru: 'Ход вверх' },
          text: {
            en: 'climbs to the next chord’s root by step, a note a beat. From C to F: C, D, E, F.',
            ru: 'поднимается к басу следующего аккорда по ступеням, по звуку на долю. От до к фа: до, ре, ми, фа.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 F2/1' },
      ],
      takeaway: {
        en: 'Practise the left hand alone until it runs without thought.',
        ru: 'Занимайтесь левой рукой отдельно, пока она не пойдёт сама.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Walk up from G to C.', ru: 'Пройдите вверх от соль к до.' },
          answer: { notes: ['G', 'A', 'B', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the open fifth of D: D and A.',
            ru: 'Сыграйте пустую квинту от ре: ре и ля.',
          },
          answer: { notes: ['D', 'A'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Arpeggios in the Player', ru: 'Арпеджио в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('C') },
        },
        {
          kind: 'link',
          title: {
            en: 'I – IV – V – I round the circle of fifths',
            ru: 'I – IV – V – I по квинтовому кругу',
          },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR, walk: 'fifths' },
        },
      ],
    },
  ],
}

export default leftHand
