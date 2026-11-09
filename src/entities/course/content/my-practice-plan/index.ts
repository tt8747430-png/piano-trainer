import type { Course } from '../../model/types'
import arpeggios from './arpeggios'
import arrangingAHymn from './arranging-a-hymn'
import byEar from './by-ear'
import chordFingering from './chord-fingering'
import chordShapes from './chord-shapes'
import chordsByNumber from './chords-by-number'
import diminishedChords from './diminished-chords'
import improvising from './improvising'
import inversionDrills from './inversion-drills'
import leftHand from './left-hand'
import passingChords from './passing-chords'
import rhythmFirst from './rhythm-first'
import sixteenWeeks from './sixteen-weeks'
import thePlan from './the-plan'
import voicings from './voicings'

/**
 * The owner's practice plan: the advice their saved piano videos repeat most, as fifteen lessons in the
 * order a church and gospel player needs them.
 */
const course: Course = {
  id: 'my-practice-plan',
  shelf: 'chords',
  stage: 'intermediate',
  title: { en: 'My Practice Plan', ru: 'Мой план занятий' },
  summary: {
    en: 'A sixteen-week plan in fifteen lessons: chord shapes and their fingering in every key, inversion drills, arpeggios, rhythm and the left hand, shells and rootless voicings, diminished and passing chords, arranging a hymn, improvising and playing by ear.',
    ru: 'План на шестнадцать недель в пятнадцати уроках: аккорды и их аппликатура во всех тональностях, упражнения на обращения, арпеджио, ритм и левая рука, шеллы и аккорды без баса, уменьшённые и проходящие аккорды, обработка гимна, импровизация и игра на слух.',
  },
  weeks: 16,
  lessons: [
    thePlan,
    sixteenWeeks,
    chordShapes,
    chordFingering,
    inversionDrills,
    arpeggios,
    chordsByNumber,
    rhythmFirst,
    leftHand,
    voicings,
    diminishedChords,
    passingChords,
    arrangingAHymn,
    improvising,
    byEar,
  ],
  songs: [],
}

export default course
