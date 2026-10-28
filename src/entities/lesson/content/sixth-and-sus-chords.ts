import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const sixthAndSusChords: Lesson = {
  id: 'sixth-and-sus-chords',
  title: {
    en: '6th, added and suspended chords',
    ru: 'Аккорды с секстой, добавленными тонами и задержанием',
  },
  summary: {
    en: 'Colour a triad by adding a 6th or a 9th, or by swapping its 3rd for a 2nd or a 4th. Tell add9 from 9, and C6 from Am7.',
    ru: 'Окрашивать трезвучие, добавляя сексту или нону либо заменяя терцию секундой или квартой. Отличать add9 от 9, а C6 от Am7.',
  },
  sections: [
    {
      heading: { en: 'The 6th chord', ru: 'Аккорд с секстой' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A 6th chord', ru: 'Аккорд с секстой' },
          text: {
            en: 'adds the major 6th to a triad: C E G A. It sounds warm and settled. It does not pull to another chord.',
            ru: 'добавляет к трезвучию большую сексту: до, ми, соль, ля. Он звучит тепло и устойчиво и не тянет к другому аккорду.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C6'] },
        { kind: 'chords', symbols: ['Cm', 'Cm6'] },
      ],
    },
    {
      heading: { en: 'C6 or Am7?', ru: 'C6 или Am7?' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C6 and Am7 hold the same four notes: C, E, G, A. The bass decides which chord you hear.',
            ru: 'В C6 и Am7 одни и те же четыре звука: до, ми, соль, ля. Какой аккорд слышен, решает бас.',
          },
        },
        {
          kind: 'variants',
          variants: [
            {
              label: { en: 'C in the bass', ru: 'До в басу' },
              caption: { en: 'C6 · settled, major', ru: 'C6 · устойчиво, мажор' },
              example: {
                kind: 'voicings',
                voicings: [{ symbol: 'C6', degrees: '1 | 3 5 6', hands: 'C3 | E4 G4 A4' }],
              },
            },
            {
              label: { en: 'A in the bass', ru: 'Ля в басу' },
              caption: { en: 'Am7 · soft, minor', ru: 'Am7 · мягко, минор' },
              example: {
                kind: 'voicings',
                voicings: [{ symbol: 'Am7', degrees: '1 | 5 ♭7 ♭3', hands: 'A2 | E4 G4 C5' }],
              },
            },
          ],
        },
      ],
      takeaway: {
        en: 'C6 is Am7 over C, and Cm6 is Am7♭5 over C.',
        ru: 'C6 — это Am7 над до, а Cm6 — Am7♭5 над до.',
      },
    },
    {
      heading: { en: 'Added 9th and 6/9', ru: 'Добавленная нона и 6/9' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Cadd9 adds the 9th, D, with no 7th. C6/9 adds both the 6th and the 9th, A and D.',
            ru: 'Cadd9 добавляет нону, ре, без септимы. C6/9 добавляет и сексту, и нону: ля и ре.',
          },
        },
        { kind: 'chords', symbols: ['Cadd9', 'C6/9'] },
      ],
    },
    {
      heading: { en: 'add9, 9 and maj9', ru: 'add9, 9 и maj9' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Add', ru: 'Add' },
          text: {
            en: 'means no 7th: Cadd9 is C E G D. C9 adds B♭ as well, and Cmaj9 adds B.',
            ru: 'значит «без септимы»: Cadd9 — до, ми, соль, ре. C9 добавляет ещё си-бемоль, а Cmaj9 — си.',
          },
        },
        { kind: 'chords', symbols: ['Cadd9', 'C9', 'CMaj9'], apart: true },
        {
          kind: 'note',
          text: {
            en: 'Keep the 9th high: D above G sounds open, near a low C muddy.',
            ru: 'Держите нону высоко: ре над соль звучит прозрачно, ре рядом с низким до — грязно.',
          },
        },
      ],
      takeaway: {
        en: 'A 9 chord has a 7th under its 9th. An add9 chord has none.',
        ru: 'В нонаккорде под ноной есть септима. В add9 её нет.',
      },
    },
    {
      heading: { en: '6/9: a pentatonic chord', ru: '6/9: пентатоника в аккорде' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [{ symbol: 'C6/9', degrees: '1 | 3 5 6 9', hands: 'C3 | E4 G4 A4 D5' }],
        },
        {
          kind: 'text',
          text: {
            en: 'C6/9 holds C, D, E, G and A: the whole C major pentatonic. With no half step, it never clashes.',
            ru: 'C6/9 содержит до, ре, ми, соль и ля — всю мажорную пентатонику от до. Без полутонов он никогда не режет слух.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'pent' },
      ],
      takeaway: {
        en: 'A 6/9 chord is its root’s major pentatonic, played at once.',
        ru: 'Аккорд 6/9 — это мажорная пентатоника от его основного тона, взятая разом.',
      },
    },
    {
      heading: { en: 'sus4 falls to the 3rd', ru: 'sus4 разрешается в терцию' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A suspended chord', ru: 'Аккорд с задержанием' },
          text: {
            en: 'swaps the 3rd for another note. In Csus4 the 4th, F, replaces E and wants to fall back to it.',
            ru: 'заменяет терцию другим звуком. В Csus4 кварта, фа, стоит вместо ми и стремится в него вернуться.',
          },
        },
        { kind: 'chords', symbols: ['Csus4', 'C'] },
      ],
    },
    {
      heading: { en: 'sus2 stays open', ru: 'sus2 звучит открыто' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'sus2 puts the 2nd in place of the 3rd. With no 3rd it is neither major nor minor. It can hold for a whole bar.',
            ru: 'sus2 ставит секунду вместо терции. Без терции он ни мажорный, ни минорный. На нём можно стоять целый такт.',
          },
        },
        { kind: 'chords', symbols: ['Csus2', 'C'] },
      ],
    },
    {
      heading: { en: 'sus2 is a sus4 a 5th lower', ru: 'sus2 — это sus4 квинтой ниже' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Csus2 and Gsus4 share C, D and G. Every sus2 is the sus4 a 5th above. A sus chord is never minor: it has no 3rd.',
            ru: 'Csus2 и Gsus4 состоят из до, ре и соль. Любой sus2 — это sus4 квинтой выше. Минорного sus не бывает: в нём нет терции.',
          },
        },
        { kind: 'chords', symbols: ['Csus2', 'Gsus4'], apart: true },
      ],
      takeaway: {
        en: 'The same three notes make Csus2 and Gsus4.',
        ru: 'Одни и те же три звука дают Csus2 и Gsus4.',
      },
    },
    {
      heading: { en: '7sus4 before V7', ru: '7sus4 перед V7' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G7sus4 delays the dominant 7th. Its C falls to B, making G7. Then G7 resolves home to C.',
            ru: 'G7sus4 оттягивает доминантсептаккорд. Его до опускается в си, и получается G7. Затем G7 разрешается в C.',
          },
        },
        { kind: 'chords', symbols: ['G7sus4', 'G7', 'C'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play Cm6.', ru: 'Сыграйте Cm6.' },
          answer: { chord: 'Cm6' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Dsus4.', ru: 'Сыграйте Dsus4.' },
          answer: { chord: 'Dsus4' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Fadd9.', ru: 'Сыграйте Fadd9.' },
          answer: { chord: 'Fadd9' },
        },
        {
          kind: 'question',
          ask: { en: 'Play G6/9.', ru: 'Сыграйте G6/9.' },
          answer: { chord: 'G6/9' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'entry' },
        },
      ],
    },
  ],
}

export default sixthAndSusChords
