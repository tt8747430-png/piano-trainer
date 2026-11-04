import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { setPlayback } from '@/features/set-preference'
import { BackToPlayhead } from '../ui/BackToPlayhead'
import { useFollow } from './use-follow'

function View({ playing }: { playing: boolean }) {
  const box = useRef<HTMLElement>(null)
  const follow = useFollow(box, playing)
  return (
    <section
      ref={box}
      aria-label="View"
      data-following={follow.following}
      data-returns={follow.returns}
    >
      <BackToPlayhead follow={follow} />
    </section>
  )
}

const view = () => screen.getByRole('region', { name: 'View' })

describe('the one follow rule (A37)', () => {
  it('pauses on a scroll by hand while it plays, and the pill brings it back', async () => {
    const user = userEvent.setup()
    renderWithSettings(<View playing />)
    expect(view()).toHaveAttribute('data-following', 'true')
    fireEvent.wheel(view())
    expect(view()).toHaveAttribute('data-following', 'false')
    await user.click(screen.getByRole('button', { name: 'Back to the playhead' }))
    expect(view()).toHaveAttribute('data-following', 'true')
    expect(view()).toHaveAttribute('data-returns', '1')
    expect(screen.queryByRole('button', { name: 'Back to the playhead' })).toBeNull()
  })

  it('goes back by itself after the delay Settings gives, from the last scroll', () => {
    vi.useFakeTimers()
    renderWithSettings(<View playing />)
    fireEvent.wheel(view())
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.touchMove(view())
    act(() => vi.advanceTimersByTime(4000))
    expect(view()).toHaveAttribute('data-following', 'false')
    act(() => vi.advanceTimersByTime(1000))
    expect(view()).toHaveAttribute('data-following', 'true')
    vi.useRealTimers()
  })

  it('a scroll while stopped pauses nothing; Follow the music off follows never', () => {
    const { settingsStore } = renderWithSettings(<View playing={false} />)
    fireEvent.wheel(view())
    expect(view()).toHaveAttribute('data-following', 'true')
    expect(screen.queryByRole('button', { name: 'Back to the playhead' })).toBeNull()
    act(() => setPlayback(settingsStore, { follow: false }))
    expect(view()).toHaveAttribute('data-following', 'false')
  })
})
