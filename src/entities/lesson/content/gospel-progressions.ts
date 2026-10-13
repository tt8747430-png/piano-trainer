import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelProgressions: Lesson = {
  id: 'gospel-progressions',
  title: { en: 'Gospel progressions', ru: 'Госпел-последовательности' },
  summary: {
    en: 'The progressions gospel is built on, coloured with 7ths, and its rhythm.',
    ru: 'Последовательности, на которых строится госпел, с септаккордами, и его ритм.',
  },
  level: 3,
  module: 'gospel',
  sections: [
    {
      heading: { en: 'The gospel sound', ru: 'Звучание госпела' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Gospel keeps each chord’s role in the key but makes it richer: 7ths and 9ths on almost every beat, chords that lift toward the next, a walking bass.',
            ru: 'Госпел сохраняет роль каждого аккорда в тональности, но делает его богаче: септаккорды и нонаккорды почти на каждой доле, аккорды, тянущиеся к следующему, идущий бас.',
          },
        },
        { kind: 'chords', symbols: ['C', 'CMaj7', 'CMaj9'] },
      ],
    },
    {
      heading: { en: 'The lift', ru: 'Подъём' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'IV–V–iii–vi rises from the subdominant, IV, and lands on the minor vi. From there it is ready to go on.',
            ru: 'IV–V–iii–vi поднимается от субдоминанты, IV, и приходит на минорную vi. С неё можно идти дальше.',
          },
        },
        { kind: 'progression', numerals: 'IV V iii vi', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The standard', ru: 'Стандарт' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'I–iii–IV–V climbs to the dominant, V. It goes up a third, then step by step. Here it is in F major.',
            ru: 'I–iii–IV–V поднимается к доминанте, V. Сначала на терцию вверх, затем по ступеням. Здесь — в фа мажоре.',
          },
        },
        {
          kind: 'progression',
          numerals: 'I iii IV V',
          key: { tonic: note('F'), minor: false },
          size: 'sevenths',
        },
      ],
    },
    {
      heading: { en: 'The hymn', ru: 'Гимн' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'I–IV–I–V is the old hymn’s plain change. It moves back and forth between home, I, and its neighbours. Here it is in G major.',
            ru: 'I–IV–I–V — простая смена старого гимна. Она ходит туда и обратно между тоникой, I, и её соседями. Здесь — в соль мажоре.',
          },
        },
        {
          kind: 'progression',
          numerals: 'I IV I V',
          key: { tonic: note('G'), minor: false },
          size: 'sevenths',
        },
      ],
    },
    {
      heading: { en: 'The 7–3–6', ru: '7–3–6' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Named for its bass, the key’s 7th, 3rd and 6th notes, it is a ii–V–i into the relative minor.',
            ru: 'Она названа по басу, VII, III и VI ступеням тональности. Это ii–V–i в параллельный минор.',
          },
        },
        { kind: 'progression', numerals: 'vii° III vi', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The resolution', ru: 'Разрешение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'V–IV–I steps back through IV on the way home. This softens the dominant’s pull. Here it is in F major.',
            ru: 'V–IV–I возвращается домой через IV. Так тяготение доминанты становится мягче. Здесь — в фа мажоре.',
          },
        },
        {
          kind: 'progression',
          numerals: 'V IV I',
          key: { tonic: note('F'), minor: false },
          size: 'sevenths',
        },
      ],
    },
    {
      heading: { en: 'The walk-up', ru: 'Подход снизу' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The walk-up,', ru: 'Подход снизу,' },
          text: {
            en: '♭VI–♭VII–I, the gospel ending, climbs home by whole steps. Its roots come from minor, each played as a dominant 7th.',
            ru: '♭VI–♭VII–I, госпел-окончание, поднимается к тонике целыми тонами. Его основные тоны взяты из минора, и на каждом звучит доминантсептаккорд.',
          },
        },
        { kind: 'progression', numerals: '♭VI ♭VII I', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'In the rhythm', ru: 'В ритме' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The gospel rhythm plays syncopated chords, struck between the beats, over a moving bass. Hear it below over a study’s plain chords.',
            ru: 'Госпел-ритм — это синкопированные аккорды над движущимся басом. Они звучат между долями. Послушайте его ниже на простых аккордах этюда.',
          },
        },
        { kind: 'pattern', pattern: 'gospel', piece: 'ex3' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play the iii7 of C major.', ru: 'Сыграйте iii7 до мажора.' },
          answer: { chord: 'Em7' },
        },
        {
          kind: 'link',
          title: { en: 'The 7–3–6 in Progressions', ru: '7–3–6 в «Последовательностях»' },
          target: {
            place: 'progressions',
            numerals: 'vii° III vi',
            key: C_MAJOR,
            size: 'sevenths',
          },
        },
      ],
    },
  ],
}

export default gospelProgressions
