import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { FloatingBar, FloatingBarButton, FloatingBarPlay } from './FloatingBar'

describe('FloatingBar', () => {
  it('is a toolbar named by its label, a floating pill along the screen', () => {
    render(
      <FloatingBar label="Playback">
        <FloatingBarButton label="Back">
          <ChevronLeft aria-hidden />
        </FloatingBarButton>
      </FloatingBar>,
    )
    const bar = screen.getByRole('toolbar', { name: 'Playback' })
    expect(bar).toHaveClass('rounded-full', 'bg-raised', 'elevation-2', 'flex-row')
    expect(bar).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('stands as a column where it is asked to', () => {
    render(<FloatingBar label="Playback" orientation="column" />)
    const bar = screen.getByRole('toolbar', { name: 'Playback' })
    expect(bar).toHaveClass('flex-col')
    expect(bar).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('stands upright beside the page only where the floating actions do, or on a phone on its side', () => {
    const { rerender } = render(<FloatingBar label="Lesson" orientation="aside" />)
    expect(screen.getByRole('toolbar')).toHaveClass('flex-row', 'aside:flex-col')
    rerender(<FloatingBar label="Lesson" orientation="landscape-phone" />)
    expect(screen.getByRole('toolbar')).toHaveClass('flex-row', 'landscape-phone:flex-col')
  })
})

describe('FloatingBarButton', () => {
  it('is a round icon button named by its label', async () => {
    const onClick = vi.fn()
    render(
      <FloatingBarButton label="Next" onClick={onClick}>
        <ChevronRight aria-hidden />
      </FloatingBarButton>,
    )
    const next = screen.getByRole('button', { name: 'Next' })
    expect(next).toHaveClass('size-12', 'rounded-full')
    expect(next).toHaveAttribute('title', 'Next')
    await userEvent.setup().click(next)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is a link where it leads somewhere, looking the same', () => {
    render(
      <FloatingBarButton label="Next section" render={<a href="#section-2" />}>
        <ChevronRight aria-hidden />
      </FloatingBarButton>,
    )
    expect(screen.getByRole('link', { name: 'Next section' })).toHaveClass(
      'size-12',
      'rounded-full',
    )
  })

  it('keeps a hint of its own in its title', () => {
    render(
      <FloatingBarButton label="Back" title="Back (←)">
        <ChevronLeft aria-hidden />
      </FloatingBarButton>,
    )
    expect(screen.getByRole('button', { name: 'Back' })).toHaveAttribute('title', 'Back (←)')
  })
})

describe('FloatingBarPlay', () => {
  it('plays, named by what it plays, and says Stop while it sounds', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<FloatingBarPlay label="Play" playing={false} onClick={onClick} />)
    const play = screen.getByRole('button', { name: 'Play' })
    expect(play).toHaveAttribute('aria-pressed', 'false')
    expect(play).toHaveClass('size-14', 'rounded-full')
    await userEvent.setup().click(play)
    expect(onClick).toHaveBeenCalledOnce()
    rerender(<FloatingBarPlay label="Play" playing onClick={onClick} />)
    expect(screen.getByRole('button', { name: 'Stop' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps a hint of its own in its title', () => {
    render(<FloatingBarPlay label="Play" title="Play (Space)" playing={false} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Play' })).toHaveAttribute('title', 'Play (Space)')
  })
})
