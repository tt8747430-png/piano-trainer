import type { Course } from '../model/types'
import calledToPlay from './called-to-play'
import calledToPlayTwo from './called-to-play-2'
import firstExercisesForBothHands from './first-exercises-for-both-hands'
import gorshkov from './gorshkov'
import howToPractise from './how-to-practise'
import improvisingWithChords from './improvising-with-chords'
import intermediatePianoPlaying from './intermediate-piano-playing'
import introToMusicReading from './intro-to-music-reading'
import introductionToThePiano from './introduction-to-the-piano'
import majorArpeggios from './major-arpeggios'
import majorScales from './major-scales'
import masteringChords from './mastering-chords'
import minorArpeggios from './minor-arpeggios'
import minorScales from './minor-scales'
import musicReadingTraining from './music-reading-training'
import playingWithBothHands from './playing-with-both-hands'
import rhythmBasics from './rhythm-basics'
import sevenTypes from './seven-types'
import theSustainPedal from './the-sustain-pedal'

/** Every course, shelf by shelf in the order Courses lists them (ADR 0053). */
export const COURSES: readonly Course[] = [
  introductionToThePiano,
  playingWithBothHands,
  introToMusicReading,
  rhythmBasics,
  intermediatePianoPlaying,
  theSustainPedal,
  howToPractise,
  firstExercisesForBothHands,
  majorScales,
  minorScales,
  musicReadingTraining,
  majorArpeggios,
  minorArpeggios,
  masteringChords,
  improvisingWithChords,
  calledToPlay,
  calledToPlayTwo,
  sevenTypes,
  gorshkov,
]
