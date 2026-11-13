import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Sixteen-Week Practice Plan, lesson 4: rhythm patterns before more chords, in 4/4 and 3/4. */
const rhythmFirst: Lesson = {
  id: 'rhythm-first',
  title: { en: 'Rhythm before more chords', ru: 'Ритм прежде новых аккордов' },
  summary: {
    en: 'Five accompaniment rhythms on the same chords: quarters, eighths, the 3 + 3 + 2 syncopation, the waltz, and the hands in turn.',
    ru: 'Пять ритмов аккомпанемента на одних аккордах: четверти, восьмые, синкопа 3 + 3 + 2, вальс и руки по очереди.',
  },
  after: ['chords-by-number'],
  sections: [
    {
      heading: { en: 'Chords on every beat', ru: 'Аккорд на каждую долю' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Three chords with a good rhythm beat ten chords played flat. The left hand holds the root. The right hand plays the chord on each beat.',
            ru: 'Три аккорда с хорошим ритмом лучше десяти, сыгранных ровно и плоско. Левая рука держит бас. Правая играет аккорд на каждую долю.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4 G4 G4 G4 A4 A4 A4 A4',
          bass: 'C3/1 F2/1',
        },
      ],
    },
    {
      heading: { en: 'Eighth notes', ru: 'Восьмые' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Split each beat in two and count 1 and 2 and. Play the chord on every eighth, the off-beats lighter.',
            ru: 'Разделите каждую долю на две и считайте «раз-и-два-и». Играйте аккорд на каждую восьмую, слабые легче.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4/8 G4/8 G4/8 G4/8 G4/8 G4/8 G4/8 G4/8 A4/8 A4/8 A4/8 A4/8 A4/8 A4/8 A4/8 A4/8',
          bass: 'C3/1 F2/1',
        },
      ],
    },
    {
      heading: { en: 'Syncopation', ru: 'Синкопа' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Syncopation', ru: 'Синкопа' },
          text: {
            en: 'puts the accent off the beat. The 3 + 3 + 2 rhythm plays on 1, on the “and” of 2, and on 4.',
            ru: 'переносит ударение со слабой доли. Ритм 3 + 3 + 2 звучит на «раз», на «и» после двух и на «четыре».',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4/4. G4/4. G4/4 A4/4. A4/4. A4/4',
          bass: 'C3/1 F2/1',
        },
      ],
      takeaway: {
        en: 'Syncopation is what makes the same chords sound like pop and gospel.',
        ru: 'Синкопа делает те же аккорды похожими на поп и госпел.',
      },
    },
    {
      heading: { en: 'Three beats: the waltz', ru: 'Три доли: вальс' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Many hymns are in 3/4. The bass plays on 1, the chord on 2 and 3. Keep the 1 a little stronger.',
            ru: 'Многие гимны в размере 3/4. Бас звучит на «раз», аккорд на «два» и «три». «Раз» чуть сильнее.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'r/4 G4 G4 r/4 A4 A4',
          bass: 'C3/2. F2/2.',
          meter: '3/4',
        },
      ],
    },
    {
      heading: { en: 'The hands in turn', ru: 'Руки по очереди' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand plays the bass on 1 and 3. The right hand answers with the chord on 2 and 4. The hands take turns, so the sound stays clear.',
            ru: 'Левая рука играет бас на «раз» и «три». Правая отвечает аккордом на «два» и «четыре». Руки чередуются, и звук остаётся прозрачным.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'r/4 G4 r/4 G4 r/4 A4 r/4 A4',
          bass: 'C3 r/4 G2 r/4 F2 r/4 C3 r/4',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'The patterns change to chord IV in bar 2. Play it.',
            ru: 'Во втором такте фактура переходит на аккорд IV. Сыграйте его.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'I – IV – V – I in the Player', ru: 'I – IV – V – I в плеере' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default rhythmFirst
