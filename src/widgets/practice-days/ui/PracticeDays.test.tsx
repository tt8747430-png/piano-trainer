import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { i18n } from '@/shared/i18n'
import { createMemoryStorage } from '@/shared/lib'
import { PracticeDays } from './PracticeDays'

const NOW = new Date(2026, 9, 11, 18)

function renderDays(days: string[]) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  store.setState({ days })
  renderWithSettings(
    <ProgressStoreProvider store={store}>
      <PracticeDays now={NOW} />
    </ProgressStoreProvider>,
  )
}

describe('PracticeDays', () => {
  it('invites a first day when none is practised', () => {
    renderDays([])
    expect(screen.getByRole('heading', { name: 'Practice' })).toBeInTheDocument()
    expect(screen.queryByText(/Days in a row/)).not.toBeInTheDocument()
    expect(screen.getByText('Practise today to start a run of days.')).toBeInTheDocument()
  })

  it('counts the days in a row and names each of the last seven, today last', () => {
    renderDays(['2026-10-06', '2026-10-09', '2026-10-10', '2026-10-11'])
    expect(screen.getByText('Days in a row: 3')).toBeInTheDocument()
    expect(screen.getByText('Practised today.')).toBeInTheDocument()
    const week = within(screen.getByRole('list', { name: 'The last seven days' }))
    expect(week.getAllByRole('listitem').map((day) => day.textContent)).toEqual([
      'MMonday, October 5: not practised',
      'TTuesday, October 6: practised',
      'WWednesday, October 7: not practised',
      'TThursday, October 8: not practised',
      'FFriday, October 9: practised',
      'SSaturday, October 10: practised',
      'SSunday, October 11: practised',
    ])
  })

  it('keeps a run that ended yesterday, for today to carry on', () => {
    renderDays(['2026-10-09', '2026-10-10'])
    expect(screen.getByText('Days in a row: 2')).toBeInTheDocument()
    expect(screen.getByText('Practise today to keep it going.')).toBeInTheDocument()
  })

  it('speaks Russian', () => {
    renderDays(['2026-10-11'])
    act(() => void i18n.changeLanguage('ru'))
    expect(screen.getByText('Дней подряд: 1')).toBeInTheDocument()
  })
})
