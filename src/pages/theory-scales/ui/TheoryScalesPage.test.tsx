import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { FakeAudio } from '@/shared/api/audio'

describe('Theory → Scales', () => {
  it('spells E♭ harmonic minor with its C♭ and names its structure', async () => {
    renderApp('/theory/scales?root=Eb&kind=harmonic')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'E♭ harmonic minor' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent('C♭')
    expect(screen.getByText('W H W W H W+H H')).toBeInTheDocument()
  })

  it('labels the keys with right-hand fingers when asked', async () => {
    const user = userEvent.setup()
    renderApp('/theory/scales')
    await user.click(await screen.findByRole('button', { name: 'RH fingers' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('1')
  })

  it('links to the relative minor', async () => {
    renderApp('/theory/scales?root=G&kind=major')
    expect(await screen.findByRole('link', { name: 'E natural minor' })).toBeInTheDocument()
  })

  describe('practice', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }))
    afterEach(() => vi.useRealTimers())

    it('plays up and down and lights each key as it sounds', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const { services } = renderApp('/theory/scales')
      await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
      expect((services.audio as FakeAudio).played).toHaveLength(1)
      act(() => vi.advanceTimersByTime(150))
      const keyboard = screen.getByRole('group', { name: 'Keyboard' })
      expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-primary')
    })
  })
})
