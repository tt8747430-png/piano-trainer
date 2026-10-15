import type { Course } from '../../model/types'
import seventhByTheKey from './seventh-by-the-key'
import octavesAndChords from './octaves-and-chords'
import sixEightAndTwelveEight from './six-eight-and-twelve-eight'
import rightHandInSixEight from './right-hand-in-six-eight'
import chordsAndInversionsInSixEight from './chords-and-inversions-in-six-eight'
import rightHandInTwelveEight from './right-hand-in-twelve-eight'
import sixthsInCompoundTime from './sixths-in-compound-time'
import joiningChords from './joining-chords'
import leftHandWays from './left-hand-ways'
import balanceOfAccompaniment from './balance-of-accompaniment'
import calledToPlayTwoExam from './called-to-play-two-exam'

const course: Course = {
  id: 'called-to-play-2',
  shelf: 'method-books',
  stage: 'intermediate',
  title: { en: 'Called to Play for Him, level 2', ru: 'Призван играть для Него. Уровень 2' },
  summary: {
    en: 'The workbook’s level 2: the 7th chord in a key, octaves, the ways in 6/8 and 12/8, joining chords, and an accompaniment in balance.',
    ru: 'Второй уровень рабочей тетради: септаккорд в тональности, октавы, способы в 6/8 и 12/8, соединение аккордов и баланс аккомпанемента.',
  },
  weeks: 11,
  lessons: [
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
  ],
  songs: [
    'molitva',
    'zemlya',
    'otchizna',
    'dveri',
    'angely',
    'idti',
    'posmotri',
    'brat',
    'prosti',
    'posylaet',
    'derznovenie',
    'skala',
    'vyshina',
    'legenda',
    'ktoya',
    'vboge',
    'buri',
    'kryl',
    'potoki',
    'milost',
    'nuzhdayus',
    'vselennaya',
    'letom',
    'prostil',
    'nebesa',
  ],
}

export default course
