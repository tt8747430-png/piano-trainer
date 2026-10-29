import { screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { PracticeCalendar } from './PracticeCalendar'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 11, 18))
})
afterEach(() => vi.useRealTimers())

describe('PracticeCalendar', () => {
  it('shows this month, saying which days were practised', () => {
    const store = createProgressStore({ storage: createMemoryStorage() })
    store.setState({ days: ['2026-10-02', '2026-10-10', '2026-09-30'] })
    renderWithSettings(
      <ProgressStoreProvider store={store}>
        <PracticeCalendar />
      </ProgressStoreProvider>,
    )
    const month = screen.getByRole('region', { name: 'This month' })
    expect(month).toHaveTextContent('October 2026')
    expect(within(month).getByText('Friday, October 2: practised')).toBeInTheDocument()
    expect(within(month).getByText('Saturday, October 10: practised')).toBeInTheDocument()
    expect(within(month).getByText('Sunday, October 11: not practised')).toBeInTheDocument()
    expect(within(month).getAllByText(/: practised$/)).toHaveLength(2)
  })
})
