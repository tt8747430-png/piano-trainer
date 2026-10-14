import type { LocaleResources } from '../../types'

export const learn: LocaleResources['learn'] = {
  title: 'Обучение',
  module: {
    fundamentals: 'Основы',
    accompaniment: 'Аккомпанемент',
    gospel: 'Госпел',
  },
  views: { label: 'Показать', journey: 'Путь', courses: 'Курсы' },
  shelves: { subjects: 'Темы', courses: 'Курсы' },
  course: {
    start: 'Начать',
    continue: 'Продолжить',
    lessons: 'Уроки',
    count: 'Уроков: {{count}}',
  },
  moduleAbout: {
    fundamentals: 'Ноты, гаммы, аккорды и тональности — с первой клавиши.',
    accompaniment: 'Бас и аккорды, последовательности, проходящие аккорды и реармонизация.',
    gospel: 'Последовательности, проходящие аккорды и реармонизация госпела.',
    'called-to-play': '«Призван играть для Него» Александра Савченко, уровень 1.',
    'called-to-play-2':
      'Его уровень 2: те же виды в 6/8 и 12/8, октавы, соединение аккордов, баланс.',
    'seven-types': '«Семь основных видов аккомпанемента» Н. В. Бобровой, на гимнах.',
    gorshkov: 'Курс по аккомпанементу Василия Горшкова: септаккорды и нонаккорды, 2-5-1, фактура.',
  },
  coursePractice: 'Фактуры и пьесы',
  progress: 'Изучено {{learned}} из {{total}}',
  place: 'Урок {{n}} из {{total}}',
  placeLabel: 'Где этот урок',
  contents: 'В этом уроке',
  example: {
    over: 'На аккордах «{{piece}}»',
    openInPlayer: 'Открыть в плеере',
    inProgressions: 'Открыть в последовательностях',
  },
  track: {
    next: 'Следующий урок',
    all: 'Все уроки: {{module}}',
  },
  question: {
    answer: 'Ответить на клавишах',
    chosen: 'Нот: {{chosen}} из {{total}}',
    right: 'Верно',
    wrong: 'Не совсем',
    show: 'Показать ответ',
    shown: 'Ответ на клавишах',
    again: 'Ещё раз',
  },
}
