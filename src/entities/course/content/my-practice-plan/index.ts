import type { Course } from '../../model/types'
import arrangingAHymn from './arranging-a-hymn'
import byEar from './by-ear'
import chordShapes from './chord-shapes'
import chordsByNumber from './chords-by-number'
import improvising from './improvising'
import leftHand from './left-hand'
import passingChords from './passing-chords'
import rhythmFirst from './rhythm-first'
import thePlan from './the-plan'
import voicings from './voicings'

/**
 * The owner's practice plan: the advice their saved piano videos repeat most, as ten lessons in the
 * order a church and gospel player needs them.
 */
const course: Course = {
  id: 'my-practice-plan',
  shelf: 'chords',
  stage: 'intermediate',
  title: { en: 'My Practice Plan', ru: 'Мой план занятий' },
  summary: {
    en: 'A daily plan in ten lessons: chord shapes in every key, rhythm and the left hand, shells and rootless voicings, passing chords, arranging a hymn, improvising and playing by ear.',
    ru: 'План на каждый день в десяти уроках: аккорды во всех тональностях, ритм и левая рука, шеллы и аккорды без баса, проходящие аккорды, обработка гимна, импровизация и игра на слух.',
  },
  weeks: 12,
  lessons: [
    thePlan,
    chordShapes,
    chordsByNumber,
    rhythmFirst,
    leftHand,
    voicings,
    passingChords,
    arrangingAHymn,
    improvising,
    byEar,
  ],
  songs: [],
}

export default course
