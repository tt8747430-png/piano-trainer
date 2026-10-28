import type { Lesson } from '../model/types'

/**
 * Locked hands, the block-chord style: the right hand's close four-note chord under each melody note,
 * the left hand doubling the melody an octave down, both moving as one; passing notes harmonised by an
 * approach chord, the key's own or a diminished 7th a half step above.
 */
const lockedHands: Lesson = {
  id: 'locked-hands',
  after: ['rootless-voicings'],
  title: { en: 'Locked hands and block chords', ru: 'Блок-аккорды: «сцепленные руки»' },
  summary: {
    en: 'Harmonise a melody note by note: a close chord under it in the right hand, the melody again an octave down in the left.',
    ru: 'Гармонизовать мелодию нота за нотой: плотный аккорд под ней в правой руке и та же мелодия октавой ниже в левой.',
  },
  sections: [
    {
      heading: { en: 'The melody on top, twice', ru: 'Мелодия наверху, дважды' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Locked hands', ru: '«Сцепленные руки»' },
          text: {
            en: 'puts a close four-note chord under each melody note in the right hand. The left hand plays the melody an octave lower.',
            ru: '— это плотный четырёхзвучный аккорд под каждой нотой мелодии в правой руке. Левая играет ту же мелодию октавой ниже.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'CMaj7', degrees: '3 | 5 7 1 3', hands: 'E4 | G4 B4 C5 E5' },
            { symbol: 'G7', degrees: '5 | ♭7 1 3 5', hands: 'D4 | F4 G4 B4 D5' },
          ],
        },
      ],
      takeaway: {
        en: 'Both hands hold the melody: the right on top, the left an octave below.',
        ru: 'Обе руки держат мелодию: правая сверху, левая октавой ниже.',
      },
    },
    {
      heading: { en: 'A chord for every note', ru: 'Аккорд на каждую ноту' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The hands move together, as one block. Here the melody is E, D, D, E over Cmaj7, Dm7, G7 and Cmaj7.',
            ru: 'Руки движутся вместе, одним блоком. Здесь мелодия ми, ре, ре, ми над Cmaj7, Dm7, G7 и Cmaj7.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'CMaj7', degrees: '3 | 5 7 1 3', hands: 'E4 | G4 B4 C5 E5' },
            { symbol: 'Dm7', degrees: '1 | ♭3 5 ♭7 1', hands: 'D4 | F4 A4 C5 D5' },
            { symbol: 'G7', degrees: '5 | ♭7 1 3 5', hands: 'D4 | F4 G4 B4 D5' },
            { symbol: 'CMaj7', degrees: '3 | 5 7 1 3', hands: 'E4 | G4 B4 C5 E5' },
          ],
        },
      ],
      takeaway: {
        en: 'Every melody note gets its own chord, so the line moves in parallel.',
        ru: 'Каждая нота мелодии получает свой аккорд, и голоса движутся параллельно.',
      },
    },
    {
      heading: { en: 'Approach chords', ru: 'Подводящие аккорды' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An approach chord', ru: 'Подводящий аккорд' },
          text: {
            en: 'harmonises a passing note. Use the key’s own chord, or the diminished 7th a half step above the target.',
            ru: 'гармонизует проходящую ноту. Возьмите аккорд тональности или уменьшённый септаккорд на полутон выше цели.',
          },
        },
        {
          kind: 'variants',
          variants: [
            {
              label: { en: 'Diatonic', ru: 'Диатонический' },
              caption: {
                en: 'Dm7 under D, then back to Cmaj7',
                ru: 'Dm7 под ре, затем снова Cmaj7',
              },
              example: {
                kind: 'voicings',
                voicings: [
                  { symbol: 'Dm7', degrees: '1 | ♭3 5 ♭7 1', hands: 'D4 | F4 A4 C5 D5' },
                  { symbol: 'CMaj7', degrees: '3 | 5 7 1 3', hands: 'E4 | G4 B4 C5 E5' },
                ],
              },
            },
            {
              label: { en: 'Diminished', ru: 'Уменьшённый' },
              caption: {
                en: 'E♭°7 slides down to Dm7: A and C hold',
                ru: 'E♭°7 сползает в Dm7: ля и до стоят',
              },
              example: {
                kind: 'voicings',
                voicings: [
                  { symbol: 'E♭°7', degrees: '1 | ♭3 ♭5 𝄫7 1', hands: 'E♭4 | G♭4 A4 C5 E♭5' },
                  { symbol: 'Dm7', degrees: '1 | ♭3 5 ♭7 1', hands: 'D4 | F4 A4 C5 D5' },
                ],
              },
            },
          ],
        },
      ],
      takeaway: {
        en: 'Use locked hands for a phrase or a chorus’s last eight bars, not the whole tune.',
        ru: 'Играйте «сцепленными руками» фразу или последние восемь тактов, а не всю пьесу.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play Cmaj7 with E on top in the right hand, from G up.',
            ru: 'Сыграйте правой рукой Cmaj7 с ми наверху, от соль вверх.',
          },
          answer: { notes: ['G', 'B', 'C', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G7 with D on top in the right hand, from F up.',
            ru: 'Сыграйте правой рукой G7 с ре наверху, от фа вверх.',
          },
          answer: { notes: ['F', 'G', 'B', 'D'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Cmaj7 in Chords', ru: 'Cmaj7 в разделе «Аккорды»' },
          target: { opens: 'chords', chord: 'CMaj7' },
        },
      ],
    },
  ],
}

export default lockedHands
