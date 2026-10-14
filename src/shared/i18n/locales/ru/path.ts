import type { LocaleResources } from '../../types'

export const path: LocaleResources['path'] = {
  continue: 'Продолжить',
  allLearned: 'Всё изучено.',
  toSongs: 'Открыть песни',
  toCheck: 'Аккордов на проверку: {{count}}',
  known: 'Знаю {{known}} из {{total}}',
  progress: '{{learned}} из {{total}}',
  recent: 'Недавно играли',
  days: {
    title: 'Занятия',
    inARow: 'Дней подряд: {{count}}',
    keep: 'Позанимайтесь сегодня, чтобы не прервать серию.',
    done: 'Сегодня вы уже занимались.',
    week: 'Последние семь дней',
    practised: '{{day}}: занимались',
    missed: '{{day}}: не занимались',
  },
  kind: {
    lesson: 'Урок',
    chords: 'Аккорды',
    scale: 'Гамма',
    study: 'Этюд',
    song: 'Песня',
  },
}
