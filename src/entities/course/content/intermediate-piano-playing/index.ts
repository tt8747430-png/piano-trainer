import type { Course } from '../../model/types'
import dottedQuarter from './dotted-quarter'
import fingeringTechniques from './fingering-techniques'
import flats from './flats'
import keyJumps from './key-jumps'
import naturalSign from './natural-sign'
import sharps from './sharps'
import sixEight from './six-eight'
import threeFour from './three-four'

const course: Course = {
  id: 'intermediate-piano-playing',
  shelf: 'intermediate',
  stage: 'intermediate',
  title: { en: 'Intermediate Piano Playing', ru: 'Игра на фортепиано: средний уровень' },
  summary: {
    en: 'Fingering for phrases longer than five notes, sharps, flats and naturals, dotted rhythms, 3/4 and 6/8, and leaps across the keys, played in four folk and classical songs.',
    ru: 'Аппликатура для фраз длиннее пяти нот, диезы, бемоли и бекары, пунктирный ритм, размеры 3/4 и 6/8 и скачки по клавиатуре — в четырёх народных и классических пьесах.',
  },
  weeks: 8,
  lessons: [
    fingeringTechniques,
    sharps,
    flats,
    dottedQuarter,
    threeFour,
    keyJumps,
    sixEight,
    naturalSign,
  ],
  songs: ['minuet-g', 'greensleeves', 'house-rising-sun', 'scarborough-fair'],
}

export default course
