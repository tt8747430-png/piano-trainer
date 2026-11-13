import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
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
    await user.click(screen.getByRole('button', { name: 'Back to the music' }))
    expect(view()).toHaveAttribute('data-following', 'true')
    expect(view()).toHaveAttribute('data-returns', '1')
    expect(screen.queryByRole('button', { name: 'Back to the music' })).toBeNull()
  })

  it('a scroll while stopped pauses nothing', () => {
    renderWithSettings(<View playing={false} />)
    fireEvent.wheel(view())
    expect(view()).toHaveAttribute('data-following', 'true')
    expect(screen.queryByRole('button', { name: 'Back to the music' })).toBeNull()
  })
})
