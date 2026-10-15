import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const brokenChords: Lesson = {
  id: 'broken-chords',
  title: { en: 'Broken chords and arpeggios', ru: 'Ломаные аккорды и арпеджио' },
  summary: {
    en: 'A chord one note at a time: broken in one hand, climbing through both, rocking and rolling in 6/8.',
    ru: 'Аккорд по одному звуку: ломаный в одной руке, восходящий через обе, покачивающийся и катящийся в 6/8.',
  },
  sections: [
    {
      heading: { en: 'One note at a time', ru: 'По одному звуку' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A broken chord', ru: 'Ломаный аккорд' },
          text: {
            en: 'plays its notes one at a time, not all at once. It keeps a slow song moving without getting louder.',
            ru: '— аккорд, звуки которого берут по одному, а не разом. Он движет медленную песню, не делая её громче.',
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
      heading: { en: 'Arpeggios through both hands', ru: 'Арпеджио через обе руки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An arpeggio', ru: 'Арпеджио' },
          text: {
            en: 'climbs the chord in one line, from the left hand into the right: 1 5 1 below, 3 5 1 above.',
            ru: 'поднимается по аккорду одной линией, из левой руки в правую: внизу 1 5 1, вверху 3 5 1.',
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
            en: 'Catch the bass with the pedal and change it with each chord.',
            ru: 'Берите бас на педаль и меняйте её с каждым аккордом.',
          },
        },
      ],
    },
    {
      heading: { en: 'Up and back down', ru: 'Вверх и обратно' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'An arpeggio need not stop at the top. Turn back down before the next chord, eight eighths to a bar.',
            ru: 'Арпеджио не обязано останавливаться наверху. Повернув вниз, вернитесь к следующему аккорду: восемь восьмых в такте.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes:
            'C4/8 E4/8 G4/8 C5/8 E5/8 C5/8 G4/8 E4/8 C4/8 F4/8 A4/8 C5/8 F5/8 C5/8 A4/8 F4/8 B3/8 D4/8 G4/8 B4/8 D5/8 B4/8 G4/8 D4/8 C4/1',
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
            en: 'rocks instead of climbing: lowest, top, middle, top. Keep the hand still over the chord.',
            ru: 'покачивается, а не поднимается: нижний, верхний, средний, верхний. Рука лежит над аккордом неподвижно.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes:
            'C3/8 G3/8 E3/8 G3/8 C3/8 G3/8 E3/8 G3/8 C3/8 A3/8 F3/8 A3/8 C3/8 A3/8 F3/8 A3/8 B2/8 G3/8 D3/8 G3/8 B2/8 G3/8 D3/8 G3/8 C3/1',
        },
        {
          kind: 'note',
          text: {
            en: 'C, then F over C, then G over B: the nearest chords, so the hand barely moves.',
            ru: 'До мажор, затем фа мажор над до, потом соль мажор над си: ближайшие аккорды, рука почти не сдвигается.',
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
            en: 'In 6/8 the left hand rolls up and back over each bar: root, 5th, octave, 10th, octave, 5th.',
            ru: 'В 6/8 левая рука катится вверх и обратно в каждом такте: основной тон, квинта, октава, децима, октава, квинта.',
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
          title: { en: 'C major’s arpeggio in the Player', ru: 'Арпеджио до мажора в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('C'), quality: 'maj' },
        },
        {
          kind: 'link',
          title: { en: 'I–vi–IV–V in the Player', ru: 'I–vi–IV–V в плеере' },
          target: { opens: 'player', numerals: 'I vi IV V', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default brokenChords
