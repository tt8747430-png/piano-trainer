import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const D_MINOR = { tonic: note('D'), minor: true }

const thinkingInDegrees: Lesson = {
  id: 'thinking-in-degrees',
  title: { en: 'Thinking in degrees', ru: 'Мышление ступенями' },
  summary: {
    en: 'Find a song’s key, name its chords by degree, and play it in any key.',
    ru: 'Найти тональность песни, назвать её аккорды ступенями и сыграть её в любой тональности.',
  },
  sections: [
    {
      heading: { en: 'Find the key first', ru: 'Сначала найдите тональность' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Degrees carry a song into any key, so first find its key.',
            ru: 'Ступени переносят песню в любую тональность, поэтому сначала найдите, в какой она тональности.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: D_MINOR,
          notes: 'A4 G4 F4 E4 D4/1',
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'The key signature, right nine times in ten.',
              ru: 'Ключевые знаки: верны в девяти случаях из десяти.',
            },
            {
              en: 'The melody’s last note, often the tonic.',
              ru: 'Последняя нота мелодии: часто это тоника.',
            },
            {
              en: 'The first and last chords, usually home.',
              ru: 'Первый и последний аккорды: обычно это тонический аккорд.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'The key’s chords', ru: 'Аккорды тональности' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A degree', ru: 'Ступень' },
          text: {
            en: 'is a note’s place in the key’s scale, numbered I to VII. “Ромашковые поля” is in D minor, and each degree carries a chord. V uses the raised 7th, C♯.',
            ru: '— место звука в гамме тональности, от I до VII. «Ромашковые поля» — в ре миноре, и на каждой ступени стоит аккорд. На V — с повышенной VII ступенью, до-диезом.',
          },
        },
        {
          kind: 'chords',
          symbols: ['Dm7', 'Em7♭5', 'FMaj7', 'Gm7', 'A7', 'B♭Maj7', 'C7'],
          apart: true,
        },
      ],
    },
    {
      heading: { en: 'Name each chord by its degree', ru: 'Назовите каждый аккорд по ступени' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each chord becomes its degree’s numeral: i7 iv9 Vsus4 i7.',
            ru: 'Каждый аккорд записывается цифрой своей ступени: i7 iv9 Vsus4 i7.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'Gm9', 'Asus4', 'Dm7'] },
        {
          kind: 'steps',
          steps: [
            { en: 'The numeral is the degree.', ru: 'Цифра — это ступень.' },
            {
              en: 'Upper case is major, lower case minor.',
              ru: 'Заглавная цифра — мажор, строчная — минор.',
            },
            {
              en: 'The rest of the chord follows it.',
              ru: 'Всё остальное в аккорде пишется после цифры.',
            },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Gorshkov writes Im7 IVm9 Vsus4 Im7.',
            ru: 'Горшков пишет так: Im7 IVm9 Vsus4 Im7.',
          },
        },
      ],
    },
    {
      heading: { en: 'Play it in any key', ru: 'Играйте в любой тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The degrees stay the same and only the key changes. In G minor, i7 iv9 Vsus4 i7 is Gm7 Cm9 Dsus4 Gm7.',
            ru: 'Ступени остаются, меняется только тональность. В соль миноре i7 iv9 Vsus4 i7 — это Gm7 Cm9 Dsus4 Gm7.',
          },
        },
        { kind: 'chords', symbols: ['Gm7', 'Cm9', 'Dsus4', 'Gm7'] },
        {
          kind: 'link',
          title: { en: 'i7 iv9 Vsus4 i7 through the keys', ru: 'i7 iv9 Vsus4 i7 по тональностям' },
          target: { opens: 'player', numerals: 'i7 iv9 Vsus4 i7', key: D_MINOR, walk: 'fifths' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the vi chord of G major.',
            ru: 'Сыграйте аккорд vi ступени соль мажора.',
          },
          answer: { chord: 'Em' },
        },
        {
          kind: 'question',
          ask: { en: 'Play the IV chord of D major.', ru: 'Сыграйте аккорд IV ступени ре мажора.' },
          answer: { chord: 'G' },
        },
        {
          kind: 'link',
          title: { en: '“Ромашковые поля” in the Player', ru: '«Ромашковые поля» в плеере' },
          target: { opens: 'piece', piece: 'romashki' },
        },
        {
          kind: 'link',
          title: {
            en: '“Ромашковые поля”’s chords in any key',
            ru: 'Аккорды «Ромашковых полей» в любой тональности',
          },
          target: {
            opens: 'song-chords',
            chords: 'Dm7 Gm9 Asus4 Dm9 Gm9 Csus4 Am7 D D/F# Gm7 Csus4 FMaj9 Bb Gm Em7b5 Asus4 A',
          },
        },
      ],
    },
  ],
}

export default thinkingInDegrees
