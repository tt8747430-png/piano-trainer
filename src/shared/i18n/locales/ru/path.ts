import type { LocaleResources } from '../../types'

export const path: LocaleResources['path'] = {
  title: 'Путь',
  continue: 'Продолжить',
  allLearned: 'Весь путь пройден.',
  toSongs: 'Открыть песни',
  toCheck: 'Аккордов на проверку: {{count}}',
  known: 'Знаю {{known}} из {{total}}',
  progress: '{{learned}} из {{total}}',
  recent: 'Недавно играли',
  days: {
    title: 'Занятия',
    inARow: 'Дней подряд: {{count}}',
    start: 'Позанимайтесь сегодня, чтобы начать серию.',
    keep: 'Позанимайтесь сегодня, чтобы не прервать серию.',
    done: 'Сегодня вы уже занимались.',
    week: 'Последние семь дней',
    practised: '{{day}}: занимались',
    missed: '{{day}}: не занимались',
  },
  kind: {
    chords: 'Аккорды',
    scale: 'Гамма',
    study: 'Этюд',
    song: 'Песня',
    progression: 'Последовательность',
  },
}
