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
    en: 'Level 2 of the workbook. Choose 7th chords by the key, play octaves, move the ways into 6/8 and 12/8, join chords smoothly, and balance bass, melody and accompaniment.',
    ru: 'Второй уровень рабочей тетради. Септаккорды по тональности, октавы, виды игры в 6/8 и 12/8, плавное соединение аккордов и баланс баса, мелодии и аккомпанемента.',
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
