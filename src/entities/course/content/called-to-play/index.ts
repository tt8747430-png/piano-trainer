import type { Course } from '../../model/types'
import playingByChords from './playing-by-chords'
import majorAndMinorChords from './major-and-minor-chords'
import fiveWays from './five-ways'
import songsByPlan from './songs-by-plan'
import rightHandTechniques from './right-hand-techniques'
import rightHandRuns from './right-hand-runs'
import rightHandChords from './right-hand-chords'
import rightHandFive from './right-hand-five'
import rightHandSixths from './right-hand-sixths'
import artOfAccompaniment from './art-of-accompaniment'
import calledToPlayExam from './called-to-play-exam'

const course: Course = {
  id: 'called-to-play',
  shelf: 'method-books',
  stage: 'beginner',
  title: { en: 'Called to Play for Him', ru: 'Призван играть для Него' },
  summary: {
    en: 'A. Savchenko’s method of accompaniment: the five ways of the left hand, songs played by their plan, and the right hand’s techniques, each on its study.',
    ru: 'Метод аккомпанемента А. Савченко: пять способов левой руки, песни по плану и приёмы правой руки, каждый на своём этюде.',
  },
  weeks: 11,
  lessons: [
    playingByChords,
    majorAndMinorChords,
    fiveWays,
    songsByPlan,
    rightHandTechniques,
    rightHandRuns,
    rightHandChords,
    rightHandFive,
    rightHandSixths,
    artOfAccompaniment,
    calledToPlayExam,
  ],
  songs: [
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
  ],
}

export default course
