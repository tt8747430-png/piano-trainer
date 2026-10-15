import { METHOD_BOOK_NAMES } from '@/entities/book'
import type { PieceId } from '@/entities/piece'
import type { ChordFamily, ScaleKind } from '@/shared/lib/music'
import type { Course, PracticeStep } from '../model/types'

const chords = (family: ChordFamily): PracticeStep => ({ kind: 'chords', family })
const scales = (...kinds: ScaleKind[]): PracticeStep[] =>
  kinds.map((scale) => ({ kind: 'scale', scale }))
const pieces = (...ids: PieceId[]): PracticeStep[] =>
  ids.map((pieceId) => ({ kind: 'piece', pieceId }))

/** A method book's course takes the book's own title in both languages. */
const book = (id: keyof typeof METHOD_BOOK_NAMES) => ({
  en: METHOD_BOOK_NAMES[id],
  ru: METHOD_BOOK_NAMES[id],
})

/**
 * The curriculum (ADR 0051): every course in the order it is taught, stage by stage, beginner to
 * professional. A course lists its lessons in order and then what to practise: the songs and studies
 * that use what it taught, a chord family, scales. The method books are courses placed where their
 * material is learned. Every lesson and every piece is in exactly one course.
 */
export const COURSES: readonly Course[] = [
  // Beginner: find your way, read, play your first chords.
  {
    id: 'first-steps',
    stage: 'beginner',
    title: { en: 'First steps at the piano', ru: 'Первые шаги за фортепиано' },
    summary: {
      en: 'The keyboard’s map, sitting and hand shape, finger numbers, both hands, and the sustain pedal.',
      ru: 'Карта клавиатуры, посадка и форма руки, номера пальцев, две руки вместе и правая педаль.',
    },
    lessons: ['finding-home', 'hands-and-fingers', 'both-hands', 'sustain-pedal'],
    practice: pieces('ode'),
  },
  {
    id: 'reading-music',
    stage: 'beginner',
    title: { en: 'Reading music', ru: 'Чтение нот' },
    summary: {
      en: 'The treble and bass clefs on the grand staff, note values and counting, sharps and flats.',
      ru: 'Скрипичный и басовый ключи на большом нотном стане, длительности и счёт, диезы и бемоли.',
    },
    lessons: ['reading-notes', 'bass-clef', 'rhythm-and-meter', 'whole-and-half-steps'],
    practice: pieces('silent'),
  },
  {
    id: 'scales-and-keys',
    stage: 'beginner',
    title: { en: 'Scales and keys', ru: 'Гаммы и тональности' },
    summary: {
      en: 'Major and minor scales with their fingering, key signatures round the circle of fifths, the chromatic, pentatonic and blues scales.',
      ru: 'Мажорные и минорные гаммы с аппликатурой, ключевые знаки по квинтовому кругу, хроматическая, пентатоника и блюз.',
    },
    lessons: [
      'major-scales',
      'minor-scales',
      'key-signatures',
      'chromatic-scale',
      'pentatonic-and-blues',
    ],
    practice: scales(
      'major',
      'natural',
      'harmonic',
      'melodic',
      'pent',
      'mpent',
      'majorBlues',
      'blues',
    ),
  },
  {
    id: 'chord-basics',
    stage: 'beginner',
    title: { en: 'Chords', ru: 'Аккорды' },
    summary: {
      en: 'Intervals, the four triads, inversions, reading chord symbols, and the chords of a key with their jobs.',
      ru: 'Интервалы, четыре вида трезвучий, обращения, чтение буквенных обозначений и аккорды тональности с их функциями.',
    },
    lessons: [
      'intervals',
      'triads',
      'inversions',
      'reading-chord-symbols',
      'chord-family',
      'chord-functions',
    ],
    practice: [chords('tri'), ...pieces('amazing')],
  },
  {
    id: 'called-to-play',
    stage: 'beginner',
    title: book('called-to-play'),
    summary: {
      en: 'Your first accompaniments: the five ways of the left hand, songs by their plan, and the right hand’s techniques.',
      ru: 'Первые аккомпанементы: пять способов левой руки, песни по плану и приёмы правой руки.',
    },
    lessons: [
      'playing-by-chords',
      'major-and-minor-chords',
      'five-ways',
      'songs-by-plan',
      'right-hand-techniques',
      'right-hand-runs',
      'right-hand-chords',
      'right-hand-five',
      'right-hand-sixths',
      'art-of-accompaniment',
      'called-to-play-exam',
    ],
    practice: pieces(
      'ex3',
      'exm1',
      'exm2',
      'exm3',
      'ex5',
      'ex6',
      'ex7',
      'ex8',
      'ex9',
      'hgta',
      'nojs',
      'came',
      'fellow',
      'friend',
      'glory',
      'face',
      'together',
      'mercy',
      'wonder',
      'soon',
      'house',
      'lift',
      'heaven',
      'wander',
    ),
  },
  // Intermediate: accompany a song from its chord chart.
  {
    id: 'accompaniment',
    stage: 'intermediate',
    title: { en: 'Accompaniment', ru: 'Аккомпанемент' },
    summary: {
      en: 'Bass and chords, broken chords, the progressions songs are made of, and the cadences that end their lines.',
      ru: 'Бас и аккорды, ломаные аккорды, последовательности, из которых сделаны песни, и каденции в конце фраз.',
    },
    lessons: ['bass-and-chords', 'broken-chords', 'common-progressions', 'cadences'],
    practice: pieces('bz1', 'bz2', 'bz3', 'bz5'),
  },
  {
    id: 'sixths-and-sevenths',
    stage: 'intermediate',
    title: { en: 'Sixths and sevenths', ru: 'Секстаккорды и септаккорды' },
    summary: {
      en: 'The five 7th chords, the dominant 7th and where it pulls, and the 6th, suspended and added chords.',
      ru: 'Пять септаккордов, доминантсептаккорд и его тяготение, аккорды с секстой, задержанием и добавленными тонами.',
    },
    lessons: ['seventh-chords', 'dominant-sevenths', 'sixth-and-sus-chords'],
    practice: [chords('six'), chords('sev')],
  },
  {
    id: 'called-to-play-2',
    stage: 'intermediate',
    title: book('called-to-play-2'),
    summary: {
      en: 'Its level 2: the ways in 6/8 and 12/8, octaves, the 7th chord in a key, joining chords and balance.',
      ru: 'Второй уровень: способы в 6/8 и 12/8, октавы, септаккорд в тональности, соединение аккордов и баланс.',
    },
    lessons: [
      'seventh-by-the-key',
      'octaves-and-chords',
      'six-eight-and-twelve-eight',
      'right-hand-in-six-eight',
      'chords-and-inversions-in-six-eight',
      'right-hand-in-twelve-eight',
      'sixths-in-compound-time',
      'joining-chords',
      'left-hand-ways',
      'balance-of-accompaniment',
      'called-to-play-two-exam',
    ],
    practice: pieces(
      'molitva',
      'zemlya',
      'otchizna',
      'dveri',
      'angely',
      'idti',
      'posmotri',
      'brat',
      'prosti',
      'posylaet',
      'derznovenie',
      'skala',
      'vyshina',
      'legenda',
      'ktoya',
      'vboge',
      'buri',
      'kryl',
      'potoki',
      'milost',
      'nuzhdayus',
      'vselennaya',
      'letom',
      'prostil',
      'nebesa',
    ),
  },
  {
    id: 'seven-types',
    stage: 'intermediate',
    title: book('seven-types'),
    summary: {
      en: 'N. V. Bobrova’s seven types of accompaniment, each on one hymn, then a hymn accompanied from its chords.',
      ru: 'Семь типов аккомпанемента Н. В. Бобровой на одном гимне, затем гимн, сопровождаемый по аккордам.',
    },
    lessons: ['seven-types', 'accompanying-a-hymn'],
    practice: pieces('otche', 'bz6', 'bz8', 'bz10', 'bz12', 'bz15'),
  },
  // Advanced: colour and movement.
  {
    id: 'progressions',
    stage: 'advanced',
    title: { en: 'Progressions', ru: 'Гармонические последовательности' },
    summary: {
      en: 'Chords round the circle, passing chords between two chords, and new chords under a melody note.',
      ru: 'Аккорды по квинтовому кругу, проходящие аккорды между двумя аккордами и новые аккорды под нотой мелодии.',
    },
    lessons: ['progressions-in-order', 'passing-chords', 'reharmonising-a-melody'],
    practice: pieces('bz13', 'bz16', 'bz17', 'bz18'),
  },
  {
    id: 'gorshkov',
    stage: 'advanced',
    title: book('gorshkov'),
    summary: {
      en: 'Vasily Gorshkov’s course: jazz chord symbols, 7th and 9th chords in songs, thinking in degrees, the ii–V–I, pulse and texture.',
      ru: 'Курс Василия Горшкова: джазовые обозначения, септ- и нонаккорды в песнях, мышление ступенями, ii–V–I, пульсация и фактура.',
    },
    lessons: [
      'jazz-chord-symbols',
      'sevenths-in-a-song',
      'ninth-chords',
      'ninths-in-a-song',
      'thinking-in-degrees',
      'two-five-one',
      'chord-pulse',
      'melodic-figuration',
      'jazz-voicings',
    ],
    practice: [chords('nin'), ...pieces('romashki', 'olen', 'wafriend', 'metel')],
  },
  {
    id: 'gospel',
    stage: 'advanced',
    title: { en: 'Gospel', ru: 'Госпел' },
    summary: {
      en: 'Gospel’s progressions, its passing chords and how it reharmonises a hymn.',
      ru: 'Последовательности госпела, его проходящие аккорды и то, как он переармонизует гимн.',
    },
    lessons: ['gospel-progressions', 'gospel-passing-chords', 'gospel-reharmonisation'],
    practice: [],
  },
  {
    id: 'modes',
    stage: 'advanced',
    title: { en: 'Modes', ru: 'Лады' },
    summary: {
      en: 'The seven modes of the major scale by their colour note, and the chords and progressions each one gives.',
      ru: 'Семь ладов мажорной гаммы по их характерной ноте, и аккорды и последовательности каждого лада.',
    },
    lessons: ['modes', 'modal-harmony'],
    practice: scales('dorian', 'mixolydian', 'lydian', 'phrygian', 'locrian'),
  },
  // Professional: jazz harmony and improvisation.
  {
    id: 'jazz-harmony',
    stage: 'professional',
    title: { en: 'Jazz harmony', ru: 'Джазовая гармония' },
    summary: {
      en: 'Every chord as a stack, the available tensions, altered dominants, the minor ii–V–i and a scale for each chord.',
      ru: 'Каждый аккорд как надстройка, доступные тенсии, альтерированные доминанты, минорная ii–V–i и гамма для каждого аккорда.',
    },
    lessons: [
      'chord-matrix',
      'tensions',
      'altered-dominants',
      'minor-two-five-levels',
      'scales-through-the-changes',
    ],
    practice: [chords('alt')],
  },
  {
    id: 'improvisation',
    stage: 'professional',
    title: { en: 'Improvisation', ru: 'Импровизация' },
    summary: {
      en: 'Melodies of your own: the pentatonic over a progression, the twelve-bar blues, and guide tones through the changes.',
      ru: 'Свои мелодии: пентатоника над последовательностью, двенадцатитактовый блюз и направляющие тоны по гармонии.',
    },
    lessons: ['pentatonic-improvisation', 'the-blues', 'guide-tones'],
    practice: [],
  },
]
