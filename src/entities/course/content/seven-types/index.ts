import type { Course } from '../../model/types'
import sevenTypes from './seven-types'
import accompanyingAHymn from './accompanying-a-hymn'

const course: Course = {
  id: 'seven-types',
  shelf: 'method-books',
  stage: 'intermediate',
  title: { en: 'Bobrova: seven types of accompaniment', ru: 'Боброва: семь видов аккомпанемента' },
  summary: {
    en: 'N. V. Bobrova’s seven types of accompaniment, all heard on one hymn. Then you accompany hymns and the songs of her songbook from their chords.',
    ru: 'Семь видов аккомпанемента Н. В. Бобровой, все на одном гимне. Затем вы аккомпанируете гимнам и песням её сборника по аккордам.',
  },
  weeks: 4,
  lessons: [sevenTypes, accompanyingAHymn],
  songs: [
    'otche',
    'amazing',
    'silent',
    'bz1',
    'bz2',
    'bz3',
    'bz5',
    'bz6',
    'bz8',
    'bz10',
    'bz12',
    'bz13',
    'bz15',
    'bz16',
    'bz17',
    'bz18',
  ],
}

export default course
