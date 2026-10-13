import type { LocaleResources } from '../../types'

export const learn: LocaleResources['learn'] = {
  title: 'Обучение',
  module: {
    fundamentals: 'Основы',
    accompaniment: 'Аккомпанемент',
    gospel: 'Госпел',
  },
  tabs: { label: 'Уроки', subjects: 'Темы', courses: 'Курсы' },
  moduleAbout: {
    fundamentals: 'Ноты, гаммы, аккорды и тональности — с первой клавиши.',
    accompaniment: 'Бас и аккорды, последовательности, проходящие аккорды и реармонизация.',
    gospel: 'Последовательности, проходящие аккорды и реармонизация госпела.',
    'called-to-play': '«Призван играть для Него» Александра Савченко, уровень 1.',
    'seven-types': '«Семь основных видов аккомпанемента» Н. В. Бобровой, на гимнах.',
    gorshkov: 'Курс по аккомпанементу Василия Горшкова: септаккорды и нонаккорды, 2-5-1, фактура.',
  },
  coursePractice: 'Фактуры и пьесы',
  progress: 'Изучено {{learned}} из {{total}}',
  continue: 'Продолжить',
  place: 'Урок {{n}} из {{total}}',
  placeLabel: 'Где этот урок',
  contents: 'В этом уроке',
  example: {
    over: 'На аккордах «{{piece}}»',
    openInPlayer: 'Открыть в плеере',
    inProgressions: 'Открыть в последовательностях',
    tapHint: 'Нажмите на аккорд, ноту или такт: он прозвучит и появится на клавишах.',
  },
  track: {
    next: 'Следующий урок',
    previous: 'Предыдущий урок',
    all: 'Все уроки: {{module}}',
  },
  question: {
    answer: 'Ответить на клавишах',
    check: 'Проверить',
    right: 'Верно',
    wrong: 'Не совсем',
    show: 'Показать ответ',
    shown: 'Ответ на клавишах',
    again: 'Ещё раз',
  },
}
