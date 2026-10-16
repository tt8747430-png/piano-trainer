import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 1, «Септаккорд (7 chord)»: maj7 or 7 as the key’s notes decide, the 7th taken under the chord. */
const seventhByTheKey: Lesson = {
  id: 'seventh-by-the-key',
  title: { en: 'The 7th chord in a key', ru: 'Септаккорд по тональности' },
  summary: {
    en: 'Add a fourth note to a chord. The key tells you whether it is Maj7 or 7.',
    ru: 'Добавьте к аккорду четвёртый звук. Тональность подскажет, Maj7 это или 7.',
  },
  sections: [
    {
      heading: { en: 'One more note', ru: 'Ещё один звук' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 7th chord', ru: 'Септаккорд' },
          text: {
            en: 'is a major or minor chord plus the 7th above its root. CMaj7 adds B and sounds soft and bright. C7 adds B♭ and sounds tenser.',
            ru: '— это мажорный или минорный аккорд плюс септима от основного тона. CMaj7 добавляет си и звучит мягко и светло. C7 добавляет си-бемоль и звучит напряжённее.',
          },
        },
        { kind: 'chords', symbols: ['C7', 'CMaj7'], apart: true },
      ],
    },
    {
      heading: { en: 'The key decides', ru: 'Решают знаки тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Build every 7th chord from the key’s own notes. E minor has one sharp, F♯, so you get these:',
            ru: 'Стройте каждый септаккорд из звуков тональности. В ми миноре один диез, фа-диез, и получаются такие аккорды:',
          },
        },
        { kind: 'chords', symbols: ['Am7', 'D7', 'GMaj7', 'Em7'] },
        {
          kind: 'note',
          text: {
            en: 'D7 takes C and GMaj7 takes F♯: both are notes of E minor.',
            ru: 'В D7 звучит до, а в GMaj7 фа-диез: оба звука из ми минора.',
          },
        },
      ],
    },
    {
      heading: { en: 'The 7th under the chord', ru: 'Септима под аккордом' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In a song, play the 7th just below the chord in the right hand, as way 5.1 does. The chord itself stays in place.',
            ru: 'В песне берите септиму правой рукой прямо под аккордом, как в виде 5.1. Сам аккорд остаётся на месте.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C7', hands: 'C3 | B♭3 C4 E4 G4' },
            { symbol: 'CMaj7', hands: 'C3 | B3 C4 E4 G4' },
            { symbol: 'Am7', hands: 'A2 | G3 A3 C4 E4' },
            { symbol: 'G7', hands: 'G2 | F3 G3 B3 D4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play 7th chords on every white key, major and minor.',
              ru: 'Играйте септаккорды от всех белых клавиш, мажорные и минорные.',
            },
            {
              en: 'Each hand alone, then together, in different octaves.',
              ru: 'Каждой рукой отдельно, затем вместе, в разных октавах.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play Am7: A, C, E and G.',
            ru: 'Сыграйте Am7: ля, до, ми и соль.',
          },
          answer: { chord: 'Am7' },
        },
        {
          kind: 'link',
          title: {
            en: '“О молитва, о молитва!” in the Player',
            ru: '«О молитва, о молитва!» в плеере',
          },
          target: { opens: 'piece', piece: 'molitva' },
        },
      ],
    },
  ],
}

export default seventhByTheKey
