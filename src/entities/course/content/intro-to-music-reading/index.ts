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
    en: 'Learn to read notes, starting at the keyboard. You meet pitch and the octave, then the staff, the treble and bass clefs, ledger lines, and sharps, flats and naturals.',
    ru: 'Учимся читать ноты, начиная с клавиатуры. Сначала высота звука и октава, затем нотный стан, скрипичный и басовый ключи, добавочные линейки, диезы, бемоли и бекары.',
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
