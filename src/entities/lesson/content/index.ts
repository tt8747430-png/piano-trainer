import type { Lesson } from '../model/types'
import accompanyingAHymn from './accompanying-a-hymn'
import alteredDominants from './altered-dominants'
import artOfAccompaniment from './art-of-accompaniment'
import balanceOfAccompaniment from './balance-of-accompaniment'
import bassAndChords from './bass-and-chords'
import bassClef from './bass-clef'
import bothHands from './both-hands'
import brokenChords from './broken-chords'
import cadences from './cadences'
import calledToPlayExam from './called-to-play-exam'
import calledToPlayTwoExam from './called-to-play-two-exam'
import chordFamily from './chord-family'
import chordFunctions from './chord-functions'
import chordMatrix from './chord-matrix'
import chordPulse from './chord-pulse'
import chordsAndInversionsInSixEight from './chords-and-inversions-in-six-eight'
import chromaticScale from './chromatic-scale'
import commonProgressions from './common-progressions'
import dominantSevenths from './dominant-sevenths'
import findingHome from './finding-home'
import fiveWays from './five-ways'
import gospelPassingChords from './gospel-passing-chords'
import gospelProgressions from './gospel-progressions'
import gospelReharmonisation from './gospel-reharmonisation'
import guideTones from './guide-tones'
import handsAndFingers from './hands-and-fingers'
import intervals from './intervals'
import inversions from './inversions'
import jazzChordSymbols from './jazz-chord-symbols'
import jazzVoicings from './jazz-voicings'
import joiningChords from './joining-chords'
import keySignatures from './key-signatures'
import leftHandWays from './left-hand-ways'
import majorAndMinorChords from './major-and-minor-chords'
import majorScales from './major-scales'
import melodicFiguration from './melodic-figuration'
import minorScales from './minor-scales'
import minorTwoFiveLevels from './minor-two-five-levels'
import modalHarmony from './modal-harmony'
import modes from './modes'
import ninthChords from './ninth-chords'
import ninthsInASong from './ninths-in-a-song'
import octavesAndChords from './octaves-and-chords'
import passingChords from './passing-chords'
import pentatonicAndBlues from './pentatonic-and-blues'
import pentatonicImprovisation from './pentatonic-improvisation'
import playingByChords from './playing-by-chords'
import progressionsInOrder from './progressions-in-order'
import readingChordSymbols from './reading-chord-symbols'
import readingNotes from './reading-notes'
import reharmonisingAMelody from './reharmonising-a-melody'
import rhythmAndMeter from './rhythm-and-meter'
import rightHandChords from './right-hand-chords'
import rightHandFive from './right-hand-five'
import rightHandInSixEight from './right-hand-in-six-eight'
import rightHandInTwelveEight from './right-hand-in-twelve-eight'
import rightHandRuns from './right-hand-runs'
import rightHandSixths from './right-hand-sixths'
import rightHandTechniques from './right-hand-techniques'
import scalesThroughTheChanges from './scales-through-the-changes'
import sevenTypes from './seven-types'
import seventhByTheKey from './seventh-by-the-key'
import seventhChords from './seventh-chords'
import seventhsInASong from './sevenths-in-a-song'
import sixEightAndTwelveEight from './six-eight-and-twelve-eight'
import sixthAndSusChords from './sixth-and-sus-chords'
import sixthsInCompoundTime from './sixths-in-compound-time'
import songsByPlan from './songs-by-plan'
import sustainPedal from './sustain-pedal'
import tensions from './tensions'
import theBlues from './the-blues'
import thinkingInDegrees from './thinking-in-degrees'
import triads from './triads'
import twoFiveOne from './two-five-one'
import wholeAndHalfSteps from './whole-and-half-steps'

/** Every lesson, in the order the curriculum teaches them (ADR 0051): a course owns the order. */
export const LESSONS: readonly Lesson[] = [
  findingHome,
  handsAndFingers,
  bothHands,
  sustainPedal,
  readingNotes,
  bassClef,
  rhythmAndMeter,
  wholeAndHalfSteps,
  majorScales,
  minorScales,
  keySignatures,
  chromaticScale,
  pentatonicAndBlues,
  intervals,
  triads,
  inversions,
  readingChordSymbols,
  chordFamily,
  chordFunctions,
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
  bassAndChords,
  brokenChords,
  commonProgressions,
  cadences,
  seventhChords,
  dominantSevenths,
  sixthAndSusChords,
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
  progressionsInOrder,
  passingChords,
  reharmonisingAMelody,
  jazzChordSymbols,
  seventhsInASong,
  ninthChords,
  ninthsInASong,
  thinkingInDegrees,
  twoFiveOne,
  chordPulse,
  melodicFiguration,
  jazzVoicings,
  gospelProgressions,
  gospelPassingChords,
  gospelReharmonisation,
  modes,
  modalHarmony,
  chordMatrix,
  tensions,
  alteredDominants,
  minorTwoFiveLevels,
  scalesThroughTheChanges,
  pentatonicImprovisation,
  theBlues,
  guideTones,
]
