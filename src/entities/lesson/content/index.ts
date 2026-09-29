import type { Lesson } from '../model/types'
import accompanyingAHymn from './accompanying-a-hymn'
import bassAndChords from './bass-and-chords'
import brokenChords from './broken-chords'
import chordFamily from './chord-family'
import chromaticScale from './chromatic-scale'
import commonProgressions from './common-progressions'
import findingHome from './finding-home'
import fiveWays from './five-ways'
import intervals from './intervals'
import inversions from './inversions'
import keySignatures from './key-signatures'
import majorScales from './major-scales'
import minorScales from './minor-scales'
import passingChords from './passing-chords'
import readingChordSymbols from './reading-chord-symbols'
import readingNotes from './reading-notes'
import reharmonisingAMelody from './reharmonising-a-melody'
import rhythmAndMeter from './rhythm-and-meter'
import rightHandTechniques from './right-hand-techniques'
import sevenTypes from './seven-types'
import seventhChords from './seventh-chords'
import triads from './triads'
import wholeAndHalfSteps from './whole-and-half-steps'

/**
 * Every lesson, in the order Learn lists them: the Fundamentals, from the keys to key signatures; then
 * Accompaniment, from bass and chords on.
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
  keySignatures,
  bassAndChords,
  brokenChords,
  fiveWays,
  rightHandTechniques,
  sevenTypes,
  accompanyingAHymn,
  commonProgressions,
  passingChords,
  reharmonisingAMelody,
]
