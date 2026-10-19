import type { ChordFamily, ScaleKind } from '@/shared/lib/music'
import type { Journey, JourneyStep } from '../model/journey'

const lessons = (...ids: string[]): JourneyStep[] =>
  ids.map((lessonId) => ({ kind: 'lesson', lessonId }))
const chords = (family: ChordFamily): JourneyStep => ({ kind: 'chords', family })
const scales = (...kinds: ScaleKind[]): JourneyStep[] =>
  kinds.map((scale) => ({ kind: 'scale', scale }))

/**
 * The Lessons (ADR 0053): four journeys, beginner to professional, each in chapters. A chapter lists
 * its lessons in the order they are read, then the chord family or the scales its Check asks. Every
 * lesson is in exactly one chapter.
 */
export const JOURNEYS: readonly Journey[] = [
  {
    id: 'foundations',
    stage: 'beginner',
    title: { en: 'Foundations', ru: 'Основы' },
    goal: {
      en: 'Find any key, read notes on both staves, count a rhythm, then build a major scale and your first chords.',
      ru: 'Находить любую клавишу, читать ноты в обоих ключах, считать ритм, строить гамму и первые аккорды.',
    },
    chapters: [
      {
        id: 'keyboard-and-staff',
        title: { en: 'The keyboard and the staff', ru: 'Клавиатура и нотный стан' },
        steps: lessons('finding-home', 'reading-notes', 'bass-clef'),
      },
      {
        id: 'rhythm',
        title: { en: 'Rhythm and meter', ru: 'Ритм и размер' },
        steps: lessons('rhythm-and-meter', 'dotted-notes-and-ties'),
      },
      {
        id: 'steps-and-scales',
        title: {
          en: 'Half steps, whole steps and the major scale',
          ru: 'Полутоны, тоны и мажорная гамма',
        },
        steps: [...lessons('whole-and-half-steps', 'major-scales'), ...scales('major')],
      },
      {
        id: 'intervals',
        title: { en: 'Intervals', ru: 'Интервалы' },
        steps: lessons('intervals', 'interval-quality'),
      },
      {
        id: 'first-chords',
        title: { en: 'Your first chords', ru: 'Первые аккорды' },
        steps: [...lessons('triads', 'reading-chord-symbols'), chords('tri')],
      },
    ],
  },
  {
    id: 'fluency',
    stage: 'intermediate',
    title: { en: 'Fluency', ru: 'Свобода' },
    goal: {
      en: 'Know every key and its chords, accompany a melody, and hear where a progression is going.',
      ru: 'Знать каждую тональность и её аккорды, аккомпанировать мелодии и слышать, куда ведёт последовательность.',
    },
    chapters: [
      {
        id: 'keys',
        title: { en: 'Keys and their signatures', ru: 'Тональности и ключевые знаки' },
        steps: [
          ...lessons('key-signatures', 'minor-scales', 'transposition'),
          ...scales('natural', 'harmonic', 'melodic'),
        ],
      },
      {
        id: 'chords-of-a-key',
        title: { en: 'The chords of a key', ru: 'Аккорды тональности' },
        steps: lessons('inversions', 'chord-family', 'chord-functions'),
      },
      {
        id: 'accompanying',
        title: { en: 'Accompanying a melody', ru: 'Аккомпанемент мелодии' },
        steps: lessons('bass-and-chords', 'broken-chords'),
      },
      {
        id: 'progressions',
        title: { en: 'Progressions and cadences', ru: 'Последовательности и каденции' },
        steps: lessons('common-progressions', 'cadences'),
      },
      {
        id: 'compound-time',
        title: { en: 'Compound time and swing', ru: 'Размеры 6/8, 12/8 и свинг' },
        steps: lessons('compound-meter', 'syncopation-and-swing'),
      },
      {
        id: 'sevenths',
        title: { en: 'Sixths and sevenths', ru: 'Секстаккорды и септаккорды' },
        steps: [
          ...lessons('seventh-chords', 'dominant-sevenths', 'sixth-and-sus-chords'),
          chords('six'),
          chords('sev'),
        ],
      },
    ],
  },
  {
    id: 'musicianship',
    stage: 'advanced',
    title: { en: 'Musicianship', ru: 'Музыкальность' },
    goal: {
      en: 'Play the blues and gospel, move between chords smoothly, give a melody new chords, and use the modes.',
      ru: 'Играть блюз и госпел, плавно переходить между аккордами, подбирать мелодии новые аккорды и пользоваться ладами.',
    },
    chapters: [
      {
        id: 'blues',
        title: { en: 'The chromatic, pentatonic and blues', ru: 'Хроматика, пентатоника и блюз' },
        steps: [
          ...lessons('chromatic-scale', 'pentatonic-and-blues', 'the-blues'),
          ...scales('pent', 'mpent', 'majorBlues', 'blues'),
        ],
      },
      {
        id: 'moving-harmony',
        title: { en: 'Harmony in motion', ru: 'Гармония в движении' },
        steps: lessons('progressions-in-order', 'passing-chords', 'reharmonising-a-melody'),
      },
      {
        id: 'gospel',
        title: { en: 'Gospel', ru: 'Госпел' },
        steps: lessons('gospel-progressions', 'gospel-passing-chords', 'gospel-reharmonisation'),
      },
      {
        id: 'modes',
        title: { en: 'The modes', ru: 'Лады' },
        steps: [
          ...lessons('modes', 'modal-harmony'),
          ...scales('dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'),
        ],
      },
    ],
  },
  {
    id: 'mastery',
    stage: 'professional',
    title: { en: 'Mastery', ru: 'Мастерство' },
    goal: {
      en: 'Read and voice any jazz chord, play the ii–V–I in every colour, and solo through the changes.',
      ru: 'Читать и расставлять любой джазовый аккорд, играть ii–V–I во всех красках и импровизировать по гармонии.',
    },
    chapters: [
      {
        id: 'jazz-chords',
        title: { en: 'Jazz chords', ru: 'Джазовые аккорды' },
        steps: [
          ...lessons('jazz-chord-symbols', 'ninth-chords', 'chord-matrix', 'tensions'),
          chords('nin'),
        ],
      },
      {
        id: 'two-five-one',
        title: { en: 'The ii–V–I', ru: 'ii–V–I' },
        steps: [
          ...lessons('two-five-one', 'minor-two-five-levels', 'altered-dominants'),
          chords('alt'),
        ],
      },
      {
        id: 'soloing',
        title: { en: 'Voicing and soloing', ru: 'Голосоведение и импровизация' },
        steps: lessons(
          'jazz-voicings',
          'guide-tones',
          'scales-through-the-changes',
          'pentatonic-improvisation',
        ),
      },
    ],
  },
]
