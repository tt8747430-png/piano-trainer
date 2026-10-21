import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const brokenChords: Lesson = {
  id: 'broken-chords',
  title: { en: 'Broken chords and arpeggios', ru: 'Ломаные аккорды и арпеджио' },
  summary: {
    en: 'Play a chord one note at a time: rising, rocking, or spread across both hands.',
    ru: 'Играйте аккорд по одному звуку: вверх, покачиваясь или через обе руки.',
  },
  sections: [
    {
      heading: { en: 'One note at a time', ru: 'По одному звуку' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A broken chord', ru: 'Ломаный аккорд' },
          text: {
            en: 'is a chord played one note at a time instead of all together. In a slow song it keeps the sound moving without making it louder.',
            ru: '— аккорд, звуки которого берут по одному, а не вместе. В медленной песне он держит движение и не делает звук громче.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '3/4',
          notes: 'C4 E4 G4 C4 F4 A4 B3 D4 G4 C4/2.',
        },
      ],
    },
    {
      heading: { en: 'The Alberti bass', ru: 'Альбертиев бас' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The Alberti bass', ru: 'Альбертиев бас' },
          text: {
            en: 'is a left-hand broken chord that rocks back and forth: lowest note, top, middle, top. Set fingers 5, 3 and 1 on the three notes and keep the hand still.',
            ru: '— ломаный аккорд в левой руке, который покачивается: нижний звук, верхний, средний, верхний. Поставьте пальцы 5, 3 и 1 на три звука и не двигайте руку.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes:
            'C3/8 G3/8 E3/8 G3/8 C3/8 G3/8 E3/8 G3/8 C3/8 A3/8 F3/8 A3/8 C3/8 A3/8 F3/8 A3/8 B2/8 G3/8 D3/8 G3/8 B2/8 G3/8 D3/8 G3/8 C3/1',
        },
      ],
    },
    {
      heading: { en: 'Arpeggios through both hands', ru: 'Арпеджио через обе руки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An arpeggio', ru: 'Арпеджио' },
          text: {
            en: 'is a broken chord that keeps climbing. The left hand plays root, 5th, root. Then the right hand plays 3rd, 5th, root.',
            ru: '— ломаный аккорд, который поднимается всё выше. Здесь левая рука играет основной тон, квинту и основной тон. Правая продолжает: терция, квинта, основной тон.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 5 1 | 3 5 1', hands: 'C2 G2 C3 | E4 G4 C5' },
            { symbol: 'Am', degrees: '1 5 1 | ♭3 5 1', hands: 'A1 E2 A2 | C4 E4 A4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Pedal from the bass note. Change it with each chord.',
            ru: 'Берите педаль с басовой ноты. Меняйте её с каждым аккордом.',
          },
        },
      ],
    },
    {
      heading: { en: 'Rolling in 6/8', ru: 'Волна в 6/8' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A 6/8 bar has six eighth notes. The left hand fills them by rolling up and back: root, 5th, octave, 10th, octave, 5th.',
            ru: 'В такте 6/8 шесть восьмых. Левая рука заполняет их волной вверх и обратно: основной тон, квинта, октава, децима, октава, квинта.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          meter: '6/8',
          notes:
            'C3/8 G3/8 C4/8 E4/8 C4/8 G3/8 F2/8 C3/8 F3/8 A3/8 F3/8 C3/8 G2/8 D3/8 G3/8 B3/8 G3/8 D3/8 C3/2.',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play F major broken upwards, one note at a time.',
            ru: 'Сыграйте фа мажор ломаным аккордом вверх, по одному звуку.',
          },
          answer: { notes: ['F', 'A', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the notes A minor’s arpeggio climbs through.',
            ru: 'Сыграйте звуки, по которым поднимается арпеджио ля минора.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'link',
          title: {
            en: 'Practise C major’s arpeggio in the Player',
            ru: 'Арпеджио до мажора в плеере',
          },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('C'), quality: 'maj' },
        },
      ],
    },
  ],
}

export default brokenChords
