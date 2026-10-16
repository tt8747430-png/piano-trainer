import type { Lesson } from '../model/types'
import alteredDominants from './altered-dominants'
import bassAndChords from './bass-and-chords'
import bassClef from './bass-clef'
import brokenChords from './broken-chords'
import cadences from './cadences'
import chordFamily from './chord-family'
import chordFunctions from './chord-functions'
import chordMatrix from './chord-matrix'
import chromaticScale from './chromatic-scale'
import commonProgressions from './common-progressions'
import compoundMeter from './compound-meter'
import dominantSevenths from './dominant-sevenths'
import dottedNotesAndTies from './dotted-notes-and-ties'
import findingHome from './finding-home'
import gospelPassingChords from './gospel-passing-chords'
import gospelProgressions from './gospel-progressions'
import gospelReharmonisation from './gospel-reharmonisation'
import guideTones from './guide-tones'
import intervalQuality from './interval-quality'
import intervals from './intervals'
import inversions from './inversions'
import jazzChordSymbols from './jazz-chord-symbols'
import jazzVoicings from './jazz-voicings'
import keySignatures from './key-signatures'
import majorScales from './major-scales'
import minorScales from './minor-scales'
import minorTwoFiveLevels from './minor-two-five-levels'
import modalHarmony from './modal-harmony'
import modes from './modes'
import ninthChords from './ninth-chords'
import passingChords from './passing-chords'
import pentatonicAndBlues from './pentatonic-and-blues'
import pentatonicImprovisation from './pentatonic-improvisation'
import progressionsInOrder from './progressions-in-order'
import readingChordSymbols from './reading-chord-symbols'
import readingNotes from './reading-notes'
import reharmonisingAMelody from './reharmonising-a-melody'
import rhythmAndMeter from './rhythm-and-meter'
import scalesThroughTheChanges from './scales-through-the-changes'
import seventhChords from './seventh-chords'
import sixthAndSusChords from './sixth-and-sus-chords'
import syncopationAndSwing from './syncopation-and-swing'
import tensions from './tensions'
import theBlues from './the-blues'
import transposition from './transposition'
import triads from './triads'
import twoFiveOne from './two-five-one'
import wholeAndHalfSteps from './whole-and-half-steps'

/** Every lesson of the journeys, in the order they are read (`journeys.ts`). */
export const LESSONS: readonly Lesson[] = [
  findingHome,
  readingNotes,
  bassClef,
  rhythmAndMeter,
  dottedNotesAndTies,
  wholeAndHalfSteps,
  majorScales,
  intervals,
  intervalQuality,
  triads,
  readingChordSymbols,
  keySignatures,
  minorScales,
  transposition,
  inversions,
  chordFamily,
  chordFunctions,
  bassAndChords,
  brokenChords,
  commonProgressions,
  cadences,
  compoundMeter,
  syncopationAndSwing,
  seventhChords,
  dominantSevenths,
  sixthAndSusChords,
  chromaticScale,
  pentatonicAndBlues,
  theBlues,
  progressionsInOrder,
  passingChords,
  reharmonisingAMelody,
  gospelProgressions,
  gospelPassingChords,
  gospelReharmonisation,
  modes,
  modalHarmony,
  jazzChordSymbols,
  ninthChords,
  chordMatrix,
  tensions,
  twoFiveOne,
  minorTwoFiveLevels,
  alteredDominants,
  jazzVoicings,
  guideTones,
  scalesThroughTheChanges,
  pentatonicImprovisation,
]
