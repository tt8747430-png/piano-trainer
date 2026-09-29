import type { Lesson } from '../model/types'
import chordFamily from './chord-family'
import chromaticScale from './chromatic-scale'
import findingHome from './finding-home'
import intervals from './intervals'
import inversions from './inversions'
import keySignatures from './key-signatures'
import majorScales from './major-scales'
import minorScales from './minor-scales'
import readingChordSymbols from './reading-chord-symbols'
import readingNotes from './reading-notes'
import rhythmAndMeter from './rhythm-and-meter'
import seventhChords from './seventh-chords'
import triads from './triads'
import wholeAndHalfSteps from './whole-and-half-steps'

/** Every lesson, in the order Learn lists them: the Fundamentals, from the keys to key signatures. */
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
]
