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
    en: 'A. Savchenko’s method for accompanying a song from its chords. Learn five ways to lay out a chord, play songs by a written plan, then add one right-hand technique at a time, each on its own study.',
    ru: 'Метод А. Савченко: как аккомпанировать песне по аккордам. Вы освоите пять способов изложить аккорд, сыграете песни по готовому плану и добавите техники правой руки, по одной на каждый этюд.',
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
