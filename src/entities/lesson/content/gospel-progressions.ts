import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const gospelProgressions: Lesson = {
  id: 'gospel-progressions',
  title: { en: 'Gospel progressions', ru: 'Госпел-последовательности' },
  summary: {
    en: 'The progressions gospel is built on, coloured with 7ths: the lift, the standard, the hymn, the 7–3–6, the resolution and the walk-up, and the gospel rhythm.',
    ru: 'Последовательности, на которых строится госпел, раскрашенные септаккордами: подъём, стандарт, гимн, 7–3–6, разрешение и подход снизу, и госпел-ритм.',
  },
  level: 3,
  category: 'gospel',
  module: 'gospel',
  sections: [
    {
      heading: { en: 'The gospel sound', ru: 'Звучание госпел' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Gospel takes the church’s progressions and colours them: 7th and 9th chords on almost every beat, chords that lift toward the next one, and a bass that walks. The chord is the same; it only sounds fuller.',
            ru: 'Госпел берёт церковные последовательности и раскрашивает их: септаккорды и нонаккорды почти на каждой доле, аккорды, которые тянутся к следующему, и идущий бас. Аккорд тот же, он только звучит полнее.',
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
            en: 'IV–V–iii–vi rises from the subdominant and lands on the minor vi, ready to go on.',
            ru: 'IV–V–iii–vi поднимается от субдоминанты и приходит на минорную vi, готовую идти дальше.',
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
            en: 'I–iii–IV–V climbs to the dominant: up a third, then step by step. Here it is in F major.',
            ru: 'I–iii–IV–V поднимается к доминанте: на терцию вверх, затем по ступеням. Здесь — в фа мажоре.',
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
            en: 'I–IV–I–V is the old hymn’s plain change, back and forth between home and its neighbours. Here it is in G major.',
            ru: 'I–IV–I–V — простая смена старого гимна, туда и обратно между домом и соседями. Здесь — в соль мажоре.',
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
            en: 'Gospel players name it by its bass: the 7th, 3rd and 6th notes of the key. It is a ii–V–i into the relative minor: a half-diminished 7th, a dominant 7th, and the minor vi they pull to. In C major: Bm7♭5, E7, Am7.',
            ru: 'Госпел-музыканты называют её по басу: VII, III и VI ступени тональности. Это ii–V–i в параллельный минор: полууменьшённый септаккорд, доминантсептаккорд и минорная vi, к которой они тянут. В до мажоре: Bm7♭5, E7, Am7.',
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
            en: 'V–IV–I steps back through IV on the way home, softening the dominant’s pull. Here it is in F major.',
            ru: 'V–IV–I возвращается домой через IV и смягчает тяготение доминанты. Здесь — в фа мажоре.',
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
          text: {
            en: '♭VI–♭VII–I climbs to the tonic by whole steps from the flat side: the gospel ending, borrowed from the minor key.',
            ru: '♭VI–♭VII–I поднимается к тонике целыми тонами со стороны бемолей: госпел-окончание, взятое из минора.',
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
            en: 'The gospel rhythm plays syncopated chords over a moving bass. Hear it over a study’s plain chords.',
            ru: 'Госпел-ритм — это синкопированные аккорды над движущимся басом. Послушайте его на простых аккордах этюда.',
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
          title: { en: 'Gospel in Progressions', ru: 'Госпел в последовательностях' },
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
