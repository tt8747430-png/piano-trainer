import { fireEvent, screen, within } from '@testing-library/react'
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

const renderCalendar = (days: string[]) => {
  const store = createProgressStore({ storage: createMemoryStorage() })
  store.setState({ days })
  renderWithSettings(
    <ProgressStoreProvider store={store}>
      <PracticeCalendar title="Activity" />
    </ProgressStoreProvider>,
  )
  return screen.getByRole('region', { name: 'Activity' })
}

describe('PracticeCalendar', () => {
  it('shows this month, saying which days were practised', () => {
    const month = renderCalendar(['2026-10-02', '2026-10-10', '2026-09-30'])
    expect(month).toHaveTextContent('October 2026')
    expect(within(month).getByText('Friday 2 October: practised')).toBeInTheDocument()
    expect(within(month).getByText('Saturday 10 October: practised')).toBeInTheDocument()
    expect(within(month).getByText('Sunday 11 October: not practised')).toBeInTheDocument()
    expect(within(month).getAllByText(/: practised$/)).toHaveLength(2)
  })

  it('goes back to the months before, never past this one', () => {
    const month = renderCalendar(['2026-10-02', '2026-09-30'])
    expect(within(month).getByRole('button', { name: 'Next month' })).toBeDisabled()
    fireEvent.click(within(month).getByRole('button', { name: 'Previous month' }))
    expect(month).toHaveTextContent('September 2026')
    expect(within(month).getByText('Wednesday 30 September: practised')).toBeInTheDocument()
    expect(within(month).getByRole('button', { name: 'Next month' })).toBeEnabled()
  })
})
