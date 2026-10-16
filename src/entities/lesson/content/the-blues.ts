import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const TWELVE_BARS = 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7'

const theBlues: Lesson = {
  id: 'the-blues',
  title: { en: 'The twelve-bar blues', ru: 'Двенадцатитактовый блюз' },
  summary: {
    en: 'Learn the twelve-bar blues chord by chord, add a left-hand shuffle, then phrase over it with the blues scale.',
    ru: 'Выучить двенадцатитактовый блюз по аккордам, добавить шаффл в левой руке и строить фразы на блюзовой гамме.',
  },
  sections: [
    {
      heading: { en: 'Three chords, twelve bars', ru: 'Три аккорда, двенадцать тактов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Three dominant 7ths, on I, IV and V. In C: C7, F7, G7.',
            ru: 'Три доминантсептаккорда, на I, IV и V. В до: C7, F7, G7.',
          },
        },
        { kind: 'progression', numerals: TWELVE_BARS, key: C_MAJOR },
        {
          kind: 'steps',
          steps: [
            { en: 'Bars 1 to 4: I.', ru: 'Такты 1–4: I.' },
            { en: 'Bars 5, 6: IV. Bars 7, 8: I.', ru: 'Такты 5–6: IV. Такты 7–8: I.' },
            { en: 'Bars 9 to 12: V, IV, I, V.', ru: 'Такты 9–12: V, IV, I, V.' },
          ],
        },
      ],
    },
    {
      heading: { en: 'A left-hand shuffle', ru: 'Шаффл в левой руке' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A shuffle', ru: 'Шаффл' },
          text: {
            en: 'rocks the left hand between root and 5th, then root and 6th, a pair to each beat. Swing the eighths: long, short.',
            ru: '— это покачивание левой руки: основной тон с квинтой, затем с секстой, по паре на долю. Свингуйте восьмые: длинная, короткая.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C7', degrees: '1 5 | 3 ♭7', hands: 'C3 G3 | E4 B♭4' },
            { symbol: 'C7', degrees: '1 6 | 3 ♭7', hands: 'C3 A3 | E4 B♭4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'One scale over all three', ru: 'Одна гамма на все три' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The C blues scale fits over C7, F7 and G7. Over C7, slide from E♭ up to E. That slide is the bent sound of the blues.',
            ru: 'Блюзовая гамма от до подходит к C7, F7 и G7. Над C7 скользите от ми-бемоля к ми. Так звучит блюзовый «изгиб».',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'blues' },
        { kind: 'notes', clef: 'treble', notes: 'E♭4/8 E4/8 G4 B♭4/8 G4/8 C5/2' },
      ],
    },
    {
      heading: { en: 'Four bars to a phrase', ru: 'Четыре такта на фразу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A blues is sung in three lines of four bars. In each line, play a phrase in bars 1 and 2. Rest in bars 3 and 4.',
            ru: 'Блюз поют тремя строками по четыре такта. В каждой играйте фразу в тактах 1–2. В тактах 3–4 молчите.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/8 B♭4/8 C5 B♭4/8 G4/8 E♭4 C4/1' },
        {
          kind: 'link',
          title: {
            en: 'The twelve-bar blues in the Player',
            ru: 'Двенадцатитактовый блюз в плеере',
          },
          target: { opens: 'player', numerals: TWELVE_BARS, key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the blues’ IV7 in C.', ru: 'Сыграйте блюзовый IV7 в до мажоре.' },
          answer: { chord: 'F7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play the blues’ V7 in C.', ru: 'Сыграйте блюзовый V7 в до мажоре.' },
          answer: { chord: 'G7' },
        },
        {
          kind: 'link',
          title: { en: 'The C blues scale', ru: 'Блюзовая гамма от до' },
          target: { opens: 'scales', root: note('C'), scale: 'blues' },
        },
        {
          kind: 'link',
          title: { en: 'The blues through the keys', ru: 'Блюз по всем тональностям' },
          target: {
            opens: 'player',
            numerals: TWELVE_BARS,
            key: C_MAJOR,
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default theBlues
