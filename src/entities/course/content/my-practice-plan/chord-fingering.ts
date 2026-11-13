import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Sixteen-Week Practice Plan: fingering triads, their inversions and 7th chords in both hands. */
const chordFingering: Lesson = {
  id: 'chord-fingering',
  title: { en: 'Fingering chords', ru: 'Аппликатура аккордов' },
  summary: {
    en: 'The fingers for triads in every position and for 7th chords, in both hands, and how to keep the shape as the hand moves.',
    ru: 'Аппликатура трезвучий во всех положениях и септаккордов, обеими руками, и как сохранять форму руки при переходах.',
  },
  after: ['chord-shapes'],
  sections: [
    {
      heading: { en: 'Root position', ru: 'Основной вид' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Right hand 1-3-5, left hand 5-3-1. The right thumb takes the lowest note, the left thumb the highest.',
            ru: 'Правая рука 1-3-5, левая 5-3-1. Большой палец правой руки берёт нижний звук, левой — верхний.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 3 5 | 1 3 5', hands: 'C3 E3 G3 | C4 E4 G4' },
            { symbol: 'F', degrees: '1 3 5 | 1 3 5', hands: 'F2 A2 C3 | F4 A4 C5' },
            { symbol: 'G', degrees: '1 3 5 | 1 3 5', hands: 'G2 B2 D3 | G4 B4 D5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Inversions', ru: 'Обращения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'First inversion: right hand 1-2-5, left hand 5-3-1. Second inversion: right hand 1-3-5, left hand 5-2-1. The 2nd finger sits beside the wide gap, the 4th.',
            ru: 'Секстаккорд: правая 1-2-5, левая 5-3-1. Квартсекстаккорд: правая 1-3-5, левая 5-2-1. Второй палец стоит рядом с широким промежутком, квартой.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 3 5 | 1 3 5', hands: 'C3 E3 G3 | C4 E4 G4' },
            { symbol: 'C/E', degrees: '3 5 1 | 3 5 1', hands: 'E3 G3 C4 | E4 G4 C5' },
            { symbol: 'C/G', degrees: '5 1 3 | 5 1 3', hands: 'G2 C3 E3 | G4 C5 E5' },
          ],
        },
      ],
      takeaway: {
        en: 'Find the 4th in the chord: the 2nd finger goes next to it.',
        ru: 'Найдите кварту в аккорде: второй палец ставится рядом с ней.',
      },
    },
    {
      heading: { en: 'Seventh chords', ru: 'Септаккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Four notes: right hand 1-2-3-5, left hand 5-3-2-1. When the top two notes are a 2nd apart, the right hand plays 1-2-4-5.',
            ru: 'Четыре звука: правая 1-2-3-5, левая 5-3-2-1. Если два верхних звука на секунду друг от друга, правая играет 1-2-4-5.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'CMaj7', degrees: '1 3 5 7 | 1 3 5 7', hands: 'C3 E3 G3 B3 | C4 E4 G4 B4' },
            { symbol: 'CMaj7/E', degrees: '| 3 5 7 1', hands: '| E4 G4 B4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Keep the shape', ru: 'Сохраняйте форму' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From chord to chord, keep the same fingers and let the arm carry the hand. Fingers stay relaxed, the wrist level, the weight from the arm.',
            ru: 'От аккорда к аккорду сохраняйте те же пальцы, а руку переносит предплечье. Пальцы свободны, запястье ровное, вес идёт от руки.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'Em', 'F', 'G'], apart: true },
      ],
    },
    {
      heading: { en: 'Black keys', ru: 'Чёрные клавиши' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Black keys sit further in. Move the whole hand forward into the keys instead of stretching the fingers. The fingering stays the same.',
            ru: 'Чёрные клавиши дальше от края. Продвиньте всю руку вглубь клавиатуры, не растягивая пальцы. Аппликатура та же.',
          },
        },
        { kind: 'chords', symbols: ['E♭', 'A♭', 'D♭'], apart: true },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C major in first inversion with 1-2-5: E, G, C.',
            ru: 'Сыграйте до мажор секстаккордом пальцами 1-2-5: ми, соль, до.',
          },
          answer: { notes: ['E', 'G', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play F major in second inversion with 1-3-5.',
            ru: 'Сыграйте фа мажор квартсекстаккордом пальцами 1-3-5.',
          },
          answer: { notes: ['C', 'F', 'A'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Inversions in the Player', ru: 'Обращения в плеере' },
          target: { opens: 'exercise', exercise: 'inversions', root: note('C') },
        },
      ],
    },
  ],
}

export default chordFingering
