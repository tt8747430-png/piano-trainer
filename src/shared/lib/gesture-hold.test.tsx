import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ReleaseReason, useGestureHold } from './gesture-hold'

function Surface({
  name,
  onRelease,
  surface = true,
}: {
  name: string
  onRelease: (reason: ReleaseReason) => void
  surface?: boolean
}) {
  const { surface: bundle, hold, drop } = useGestureHold(onRelease)
  const marked = surface ? bundle : { ref: bundle.ref }
  return (
    <div data-testid={name} {...marked} onPointerDown={() => hold()}>
      <button type="button" onClick={drop}>
        {`drop ${name}`}
      </button>
    </div>
  )
}

describe('useGestureHold', () => {
  it('releases the surface that was holding when another one claims', async () => {
    const user = userEvent.setup()
    const first = vi.fn()
    const second = vi.fn()
    render(
      <>
        <Surface name="a" onRelease={first} />
        <Surface name="b" onRelease={second} />
      </>,
    )

    await user.pointer({ target: screen.getByTestId('a'), keys: '[MouseLeft>]' })
    expect(first).not.toHaveBeenCalled()

    await user.pointer({ target: screen.getByTestId('b'), keys: '[MouseLeft>]' })
    expect(first).toHaveBeenCalledWith('claimed')
    expect(second).not.toHaveBeenCalled()
  })

  it('calls a touch on empty space a release, not a claim', async () => {
    const user = userEvent.setup()
    const onRelease = vi.fn()
    render(
      <>
        <Surface name="a" onRelease={onRelease} />
        <div data-testid="elsewhere">elsewhere</div>
      </>,
    )

    await user.pointer({ target: screen.getByTestId('a'), keys: '[MouseLeft>]' })
    await user.pointer({ target: screen.getByTestId('elsewhere'), keys: '[MouseLeft>]' })
    expect(onRelease).toHaveBeenCalledWith('outside')
  })

  it('leaves the holder alone while the touch stays inside it', async () => {
    const user = userEvent.setup()
    const onRelease = vi.fn()
    render(<Surface name="a" onRelease={onRelease} />)

    const surface = screen.getByTestId('a')
    await user.pointer({ target: surface, keys: '[MouseLeft>]' })
    await user.pointer({ target: screen.getByRole('button'), keys: '[MouseLeft>]' })
    expect(onRelease).not.toHaveBeenCalled()
  })

  it('stops watching once the holder has given the claim up itself', async () => {
    const user = userEvent.setup()
    const onRelease = vi.fn()
    render(
      <>
        <Surface name="a" onRelease={onRelease} />
        <div data-testid="elsewhere">elsewhere</div>
      </>,
    )

    await user.pointer({ target: screen.getByTestId('a'), keys: '[MouseLeft>]' })
    await user.click(screen.getByRole('button', { name: 'drop a' }))
    await user.pointer({ target: screen.getByTestId('elsewhere'), keys: '[MouseLeft>]' })
    expect(onRelease).not.toHaveBeenCalled()
  })

  it('gives the claim up when the holder unmounts', async () => {
    const user = userEvent.setup()
    const onRelease = vi.fn()
    const { unmount } = render(<Surface name="a" onRelease={onRelease} />)

    await user.pointer({ target: screen.getByTestId('a'), keys: '[MouseLeft>]' })
    unmount()
    render(<div data-testid="elsewhere">elsewhere</div>)
    await user.pointer({ target: screen.getByTestId('elsewhere'), keys: '[MouseLeft>]' })
    expect(onRelease).not.toHaveBeenCalled()
  })
})
