import type { Lesson } from '../model/types'
import accompanyingAHymn from './accompanying-a-hymn'
import artOfAccompaniment from './art-of-accompaniment'
import bassAndChords from './bass-and-chords'
import brokenChords from './broken-chords'
import calledToPlayExam from './called-to-play-exam'
import chordFamily from './chord-family'
import chordFunctions from './chord-functions'
import chordMatrix from './chord-matrix'
import chordPulse from './chord-pulse'
import chromaticScale from './chromatic-scale'
import commonProgressions from './common-progressions'
import findingHome from './finding-home'
import fiveWays from './five-ways'
import gospelPassingChords from './gospel-passing-chords'
import gospelProgressions from './gospel-progressions'
import gospelReharmonisation from './gospel-reharmonisation'
import intervals from './intervals'
import jazzChordSymbols from './jazz-chord-symbols'
import jazzVoicings from './jazz-voicings'
import inversions from './inversions'
import keySignatures from './key-signatures'
import majorAndMinorChords from './major-and-minor-chords'
import majorScales from './major-scales'
import melodicFiguration from './melodic-figuration'
import minorScales from './minor-scales'
import minorTwoFiveLevels from './minor-two-five-levels'
import ninthChords from './ninth-chords'
import ninthsInASong from './ninths-in-a-song'
import passingChords from './passing-chords'
import playingByChords from './playing-by-chords'
import progressionsInOrder from './progressions-in-order'
import readingChordSymbols from './reading-chord-symbols'
import readingNotes from './reading-notes'
import reharmonisingAMelody from './reharmonising-a-melody'
import rhythmAndMeter from './rhythm-and-meter'
import rightHandChords from './right-hand-chords'
import rightHandFive from './right-hand-five'
import rightHandRuns from './right-hand-runs'
import rightHandSixths from './right-hand-sixths'
import rightHandTechniques from './right-hand-techniques'
import scalesThroughTheChanges from './scales-through-the-changes'
import sevenTypes from './seven-types'
import seventhsInASong from './sevenths-in-a-song'
import seventhChords from './seventh-chords'
import songsByPlan from './songs-by-plan'
import thinkingInDegrees from './thinking-in-degrees'
import triads from './triads'
import twoFiveOne from './two-five-one'
import wholeAndHalfSteps from './whole-and-half-steps'
import balanceOfAccompaniment from './balance-of-accompaniment'
import calledToPlayTwoExam from './called-to-play-two-exam'
import chordsAndInversionsInSixEight from './chords-and-inversions-in-six-eight'
import joiningChords from './joining-chords'
import leftHandWays from './left-hand-ways'
import octavesAndChords from './octaves-and-chords'
import rightHandInSixEight from './right-hand-in-six-eight'
import rightHandInTwelveEight from './right-hand-in-twelve-eight'
import seventhByTheKey from './seventh-by-the-key'
import sixEightAndTwelveEight from './six-eight-and-twelve-eight'
import sixthsInCompoundTime from './sixths-in-compound-time'

/**
 * Every lesson, in the order Learn lists them: the subjects, Fundamentals from the keys to key
 * signatures, Accompaniment from bass and chords to scales through the changes, then Gospel; then the
 * courses, each in its own order: Called to Play's two levels, Боброва's, Gorshkov's.
 */
export const LESSONS: readonly Lesson[] = [
  findingHome,
  readingNotes,
  rhythmAndMeter,
  wholeAndHalfSteps,
  majorScales,
  chromaticScale,
  intervals,
  triads,
  seventhChords,
  readingChordSymbols,
  inversions,
  minorScales,
  chordFamily,
  chordFunctions,
  keySignatures,
  bassAndChords,
  brokenChords,
  commonProgressions,
  progressionsInOrder,
  chordMatrix,
  minorTwoFiveLevels,
  passingChords,
  reharmonisingAMelody,
  scalesThroughTheChanges,
  gospelProgressions,
  gospelPassingChords,
  gospelReharmonisation,
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
  seventhByTheKey,
  octavesAndChords,
  sixEightAndTwelveEight,
  rightHandInSixEight,
  chordsAndInversionsInSixEight,
  rightHandInTwelveEight,
  sixthsInCompoundTime,
  joiningChords,
  leftHandWays,
  balanceOfAccompaniment,
  calledToPlayTwoExam,
  sevenTypes,
  accompanyingAHymn,
  jazzChordSymbols,
  seventhsInASong,
  ninthChords,
  ninthsInASong,
  thinkingInDegrees,
  twoFiveOne,
  chordPulse,
  melodicFiguration,
  jazzVoicings,
]
