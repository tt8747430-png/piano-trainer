import type { Course } from '../../model/types'
import pitchAndThePiano from './pitch-and-the-piano'
import theStaff from './the-staff'
import theTrebleClef from './the-treble-clef'
import aboveTheTrebleStaff from './above-the-treble-staff'
import theBassClef from './the-bass-clef'
import belowTheBassStaff from './below-the-bass-staff'
import accidentals from './accidentals'

const course: Course = {
  id: 'intro-to-music-reading',
  shelf: 'beginner',
  stage: 'beginner',
  title: { en: 'Intro to Music Reading', ru: 'Введение в чтение нот' },
  summary: {
    en: 'Read music from the keys up: pitch and the octave, the staff and its two clefs, ledger lines above and below, and sharps, flats and naturals.',
    ru: 'Чтение нот от клавиатуры: высота звука и октава, нотный стан и два ключа, добавочные линейки сверху и снизу, диезы, бемоли и бекары.',
  },
  weeks: 7,
  lessons: [
    pitchAndThePiano,
    theStaff,
    theTrebleClef,
    aboveTheTrebleStaff,
    theBassClef,
    belowTheBassStaff,
    accidentals,
  ],
  songs: ['yankee-doodle', 'oh-susanna'],
}

export default course
