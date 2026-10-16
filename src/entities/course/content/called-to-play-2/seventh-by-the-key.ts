import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 1, «Септаккорд (7 chord)»: maj7 or 7 as the key’s notes decide, the 7th taken under the chord. */
const seventhByTheKey: Lesson = {
  id: 'seventh-by-the-key',
  title: { en: 'The 7th chord in a key', ru: 'Септаккорд по тональности' },
  summary: {
    en: 'Choose maj7 or 7 by the key, the 7th under the chord.',
    ru: 'Выбирайте maj7 или 7 по тональности, септиму — под аккордом.',
  },
  sections: [
    {
      heading: { en: 'One more note', ru: 'Ещё одна нота' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A 7th chord is a major or minor chord plus the 7th above its root. Maj7 sounds soft and bright, 7 tenser.',
            ru: 'Септаккорд — это мажорный или минорный аккорд плюс септима от основного тона. Maj7 звучит мягко и светло, 7 — напряжённее.',
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
            en: 'The song’s key tells you which 7th to take: the chord is built from the key’s own notes.',
            ru: 'Какой септаккорд взять, подсказывает тональность песни: аккорд строится из её звуков.',
          },
        },
        { kind: 'chords', symbols: ['Am7', 'D7', 'GMaj7', 'Em7'] },
        {
          kind: 'note',
          text: {
            en: 'In E minor, with its one sharp: Am7, D7, GMaj7, Em7.',
            ru: 'В ми миноре с одним диезом: Am7, D7, GMaj7, Em7.',
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
            en: 'In a song, add the note below the chord, as in way 5.1, and it is a 7th chord.',
            ru: 'В песне добавьте ноту под аккордом, как в виде 5.1, — и получится септаккорд.',
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
            en: 'Play Am7.',
            ru: 'Сыграйте Am7.',
          },
          answer: { chord: 'Am7' },
        },
        {
          kind: 'link',
          title: {
            en: '«О молитва, о молитва!» in the Player',
            ru: '«О молитва, о молитва!» в плеере',
          },
          target: { opens: 'piece', piece: 'molitva' },
        },
      ],
    },
  ],
}

export default seventhByTheKey
