import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

/** Mastering Chords, lesson 3: a major chord's three positions, and the nearest one. */
const majorInversions: Lesson = {
  id: 'major-inversions',
  title: { en: 'Major chord inversions', ru: 'Обращения мажорного аккорда' },
  summary: {
    en: 'The same three notes stacked three ways. Learn to spot each by its 4th, and to reach the nearest one so chords join smoothly.',
    ru: 'Те же три звука, сложенные тремя способами. Научитесь узнавать каждый по кварте и брать ближайший, чтобы аккорды соединялись плавно.',
  },
  sections: [
    {
      heading: { en: 'Root position', ru: 'Основной вид' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Root position:', ru: 'Основной вид:' },
          text: {
            en: 'the root at the bottom, then the 3rd and the 5th. Two 3rds stacked: C, E, G.',
            ru: 'основной тон внизу, над ним терция и квинта. Две терции одна над другой: до, ми, соль.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 3 5', hands: 'C4 E4 G4' },
            { symbol: 'F', degrees: '1 3 5', hands: 'F4 A4 C5' },
            { symbol: 'G', degrees: '1 3 5', hands: 'G4 B4 D5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'First inversion', ru: 'Первое обращение' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'First inversion:', ru: 'Первое обращение (секстаккорд):' },
          text: {
            en: 'the root moves up an octave, so the 3rd is at the bottom. C becomes E, G, C.',
            ru: 'основной тон переносится на октаву вверх, и внизу оказывается терция. C превращается в ми, соль, до.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C/E', degrees: '3 5 1', hands: 'E4 G4 C5' },
            { symbol: 'F/A', degrees: '3 5 1', hands: 'A4 C5 F5' },
            { symbol: 'G/B', degrees: '3 5 1', hands: 'B3 D4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Second inversion', ru: 'Второе обращение' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Second inversion:', ru: 'Второе обращение (квартсекстаккорд):' },
          text: {
            en: 'the 3rd moves up too, so the 5th is at the bottom. C becomes G, C, E.',
            ru: 'вверх переносится и терция, и внизу оказывается квинта. C превращается в соль, до, ми.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C/G', degrees: '5 1 3', hands: 'G3 C4 E4' },
            { symbol: 'F/C', degrees: '5 1 3', hands: 'C4 F4 A4' },
            { symbol: 'G/D', degrees: '5 1 3', hands: 'D4 G4 B4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Find the 4th', ru: 'Найдите кварту' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'D', degrees: '1 3 5', hands: 'D4 F♯4 A4' },
            { symbol: 'D/F♯', degrees: '3 5 1', hands: 'F♯4 A4 D5' },
            { symbol: 'D/A', degrees: '5 1 3', hands: 'A3 D4 F♯4' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Root position has two 3rds. A 4th on top means first inversion, a 4th at the bottom second. The root is always the 4th’s upper note.',
            ru: 'В основном виде две терции. Кварта сверху — первое обращение, кварта снизу — второе. Основной тон всегда верхний звук кварты.',
          },
        },
      ],
    },
    {
      heading: { en: 'The nearest inversion', ru: 'Ближайшее обращение' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 3 5', hands: 'C4 E4 G4' },
            { symbol: 'F/C', degrees: '5 1 3', hands: 'C4 F4 A4' },
            { symbol: 'G/B', degrees: '3 5 1', hands: 'B3 D4 G4' },
            { symbol: 'C', degrees: '1 3 5', hands: 'C4 E4 G4' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'From C to F, keep the shared C and step the others up a little: C, F, A. Every chord stays under the hand.',
            ru: 'От C к F оставьте общий звук до, а остальные чуть сдвиньте вверх: до, фа, ля. Каждый аккорд остаётся под рукой.',
          },
        },
      ],
    },
    {
      heading: { en: 'With a bass', ru: 'С басом' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand plays each root low. The right hand takes the nearest inversion, so the chords join smoothly.',
            ru: 'Левая рука берёт основной тон в басу. Правая играет ближайшее обращение, и аккорды соединяются плавно.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
            { symbol: 'F', degrees: '1 | 5 1 3', hands: 'F2 | C4 F4 A4' },
            { symbol: 'G', degrees: '1 | 3 5 1', hands: 'G2 | B3 D4 G4' },
            { symbol: 'C', degrees: '1 | 1 3 5', hands: 'C3 | C4 E4 G4' },
          ],
        },
        {
          kind: 'link',
          title: { en: 'I–IV–V–I in the Player', ru: 'I–IV–V–I в плеере' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C major in first inversion: E at the bottom.',
            ru: 'Сыграйте до мажор в первом обращении: ми внизу.',
          },
          answer: { notes: ['E', 'G', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play F major in second inversion: C at the bottom.',
            ru: 'Сыграйте фа мажор во втором обращении: до внизу.',
          },
          answer: { notes: ['C', 'F', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G major in first inversion.',
            ru: 'Сыграйте соль мажор в первом обращении.',
          },
          answer: { notes: ['B', 'D', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play D major in second inversion.',
            ru: 'Сыграйте ре мажор во втором обращении.',
          },
          answer: { notes: ['A', 'D', 'F#'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Inversions of C in the Player', ru: 'Обращения до мажора в плеере' },
          target: { opens: 'exercise', exercise: 'inversions', root: note('C'), quality: 'maj' },
        },
        {
          kind: 'link',
          title: { en: 'Name chords in the Quiz', ru: 'Названия аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'name-chord' },
        },
        {
          kind: 'link',
          title: {
            en: 'I–IV–V–I through every key',
            ru: 'I–IV–V–I во всех тональностях',
          },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR, walk: 'fifths' },
        },
      ],
    },
  ],
}

export default majorInversions
