import type { LocaleResources } from '../../types'

export const practice: LocaleResources['practice'] = {
  inPlayer: 'Играть в плеере',
  walk: 'Аккорды по ступеням',
  chromatic: 'По полутонам',
  title: 'Практика',
  subjects: {
    chords: 'Аккорды',
    scales: 'Гаммы и тональности',
    progressions: 'Последовательности',
    intervals: 'Интервалы',
    accompaniment: 'Аккомпанемент',
    exercises: 'Упражнения',
    quiz: 'Проверка',
  },
  inside: {
    chords: 'Построить · Найти · Тенсии',
    scales: 'Гамма · Аккорды · Тональность',
    progressions: 'В любой тональности · Проходящие аккорды · Регармонизация',
    intervals: 'На клавишах, вверх и вниз',
    accompaniment: 'Called to Play · Боброва · Стили',
    exercises: 'Техника · Барри Харрис · Piano With Jonny',
    quiz: 'Аккорды · Гаммы и тональности · На слух · Чтение',
  },
  chords: { build: 'Построить', find: 'Найти' },
  accompaniment: {
    styles: 'Стили',
    yours: 'Свои',
    noneYours: 'Здесь хранятся фактуры, которые вы отметили, создали или скрыли.',
    allHidden: 'Все фактуры здесь скрыты. Они хранятся на странице «Свои».',
  },
  progression: 'Последовательность',
  keyProgressions: 'Последовательности в этой тональности',
  groups: {
    technique: 'Техника пальцев',
    barryHarris: 'Барри Харрис',
    jonny: 'Piano With Jonny',
  },
  quizGroups: {
    chords: 'Аккорды',
    scales: 'Гаммы и тональности',
    ear: 'На слух',
    reading: 'Чтение',
  },
  gaps: 'На проверку: {{count}}',
}
