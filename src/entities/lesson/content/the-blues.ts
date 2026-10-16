import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const TWELVE_BARS = 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7'

const theBlues: Lesson = {
  id: 'the-blues',
  title: { en: 'The twelve-bar blues', ru: 'Двенадцатитактовый блюз' },
  summary: {
    en: 'Play the twelve-bar blues with a shuffle and the blues scale.',
    ru: 'Играть двенадцатитактовый блюз с шаффлом и блюзовой гаммой.',
  },
  sections: [
    {
      heading: { en: 'Three chords, twelve bars', ru: 'Три аккорда, двенадцать тактов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The blues plays I, IV and V, each a dominant 7th: in C, C7, F7 and G7.',
            ru: 'Блюз играет I, IV и V, каждый — доминантсептаккорд: в до мажоре C7, F7 и G7.',
          },
        },
        { kind: 'progression', numerals: TWELVE_BARS, key: C_MAJOR },
        {
          kind: 'steps',
          steps: [
            { en: 'Bars 1–4: I.', ru: 'Такты 1–4: I.' },
            { en: 'Bars 5–6: IV. Bars 7–8: I.', ru: 'Такты 5–6: IV. Такты 7–8: I.' },
            { en: 'Bars 9–12: V, IV, I, V.', ru: 'Такты 9–12: V, IV, I, V.' },
          ],
        },
      ],
    },
    {
      heading: { en: 'A left-hand shuffle', ru: 'Шаффл в левой руке' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Rock between the 5th and the 6th over the root, a pair to each beat. Swing the eighths: long, short.',
            ru: 'Покачивайтесь между квинтой и секстой над основным тоном, по паре на долю. Свингуйте восьмые: длинная, короткая.',
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
            en: 'The C blues scale fits C7, F7 and G7. Slide from E♭ up to E over C7 for the blues’ bent sound.',
            ru: 'Блюзовая гамма от до подходит к C7, F7 и G7. Над C7 скользите от ми-бемоля к ми: так звучит блюзовый «изгиб».',
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
            en: 'The blues sings in three lines of four bars. Play a phrase in bars 1–2 and rest in 3–4.',
            ru: 'Блюз поётся тремя строками по четыре такта. Играйте фразу в тактах 1–2 и молчите в 3–4.',
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
