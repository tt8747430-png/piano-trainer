import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const F_MAJOR = { tonic: note('F'), minor: false }
const G_MAJOR = { tonic: note('G'), minor: false }

const gospelProgressions: Lesson = {
  id: 'gospel-progressions',
  title: { en: 'Gospel progressions', ru: 'Госпел-последовательности' },
  summary: {
    en: 'Play the chord progressions gospel is built on, with 7th chords and a gospel rhythm.',
    ru: 'Играйте последовательности, на которых строится госпел, септаккордами и в госпел-ритме.',
  },
  sections: [
    {
      heading: { en: 'The gospel sound', ru: 'Звучание госпела' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Gospel keeps each chord’s job in the key but makes the chord fuller. Players add 7ths and 9ths on almost every beat.',
            ru: 'Госпел сохраняет задачу каждого аккорда в тональности, но делает его полнее. Септимы и ноны звучат почти на каждой доле.',
          },
        },
        { kind: 'chords', symbols: ['C', 'CMaj7', 'CMaj9'] },
      ],
    },
    {
      heading: { en: 'The hymn: I–IV–I–V', ru: 'Гимн: I–IV–I–V' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Old hymns use this plain change. It moves back and forth between home and its two neighbours, IV and V.',
            ru: 'Это простая смена аккордов старых гимнов. Она ходит туда и обратно между тоникой и её соседями, IV и V.',
          },
        },
        { kind: 'progression', numerals: 'I IV I V', key: G_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The standard: I–iii–IV–V', ru: 'Стандарт: I–iii–IV–V' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This one climbs toward the dominant. The roots go up a 3rd, then one step at a time.',
            ru: 'Эта последовательность поднимается к доминанте. Основные тоны идут вверх на терцию, затем по одной ступени.',
          },
        },
        { kind: 'progression', numerals: 'I iii IV V', key: F_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The lift: IV–V–iii–vi', ru: 'Подъём: IV–V–iii–vi' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This one starts on IV and lands on the minor vi instead of home. From there the song can go on.',
            ru: 'Эта последовательность начинается с IV и приходит не домой, а на минорную vi. Оттуда песня может идти дальше.',
          },
        },
        { kind: 'progression', numerals: 'IV V iii vi', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The 7–3–6', ru: '7–3–6' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'It is named for its bass notes, the key’s 7th, 3rd and 6th. In C they are B, E and A. Together they make a minor ii V i into Am.',
            ru: 'Она названа по басу: VII, III и VI ступени тональности. В до мажоре это си, ми и ля. Вместе они дают минорный ii–V–i в Am.',
          },
        },
        { kind: 'progression', numerals: 'vii° III vi', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The resolution: V–IV–I', ru: 'Разрешение: V–IV–I' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Here V goes home through IV instead of straight to I. That softens the dominant’s pull.',
            ru: 'Здесь V идёт домой не прямо, а через IV. От этого тяготение доминанты мягче.',
          },
        },
        { kind: 'progression', numerals: 'V IV I', key: F_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The walk-up', ru: 'Подход снизу' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The walk-up', ru: 'Подход снизу' },
          text: {
            en: 'is a gospel ending that climbs home by whole steps: ♭VI, ♭VII, I. Its first two roots come from minor, each played as a dominant 7th.',
            ru: '— госпел-окончание, которое поднимается к тонике целыми тонами: ♭VI, ♭VII, I. Первые два основных тона взяты из минора, на каждом звучит доминантсептаккорд.',
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
            en: 'The right hand plays between the beats and holds one chord over a beat. The bass walks on every beat.',
            ru: 'Правая рука играет между долями и тянет один аккорд через следующую долю. Левая шагает басом на каждую долю.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'r/8 E5/8 r/8 E5/8~ E5/8 E5/8 r/4 r/8 F5/8 r/8 F5/8~ F5/8 F5/8 r/4',
          bass: 'C3 G2 C3 E3 F3 C3 F3 F♯3',
        },
        {
          kind: 'note',
          text: {
            en: 'The top staff shows each chord’s top note. F♯ walks the bass up to G.',
            ru: 'На верхнем стане только верхний звук каждого аккорда. Фа-диез ведёт бас вверх, к соль.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the iii7 of C major.', ru: 'Сыграйте iii7 до мажора.' },
          answer: { chord: 'Em7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the 7–3–6’s first chord in C: the half-diminished 7th on B.',
            ru: 'Сыграйте первый аккорд 7–3–6 в до мажоре: полууменьшённый септаккорд от си.',
          },
          answer: { chord: 'Bm7♭5' },
        },
        {
          kind: 'link',
          title: { en: 'Practise the lift in the Player', ru: 'Подъём в плеере' },
          target: { opens: 'player', numerals: 'IV V iii vi', key: C_MAJOR, size: 'sevenths' },
        },
        {
          kind: 'link',
          title: { en: 'The 7–3–6 through all the keys', ru: '7–3–6 по всем тональностям' },
          target: {
            opens: 'player',
            numerals: 'vii° III vi',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default gospelProgressions
