import { render, screen, waitFor } from '@testing-library/react'
import { Play } from 'lucide-react'
import { beforeEach, describe, expect, it } from 'vitest'
import { stubResizeObserver } from '@/shared/test/resize'
import { Fab, FloatingActions, FloatingHost } from './FloatingActions'
import type { FloatingPlace } from './floating-context'

const root = () => document.documentElement.style

function renderActions(place: FloatingPlace = 'center') {
  return render(
    <FloatingHost place={place} labels={false} screen="/">
      <p>The page</p>
      <FloatingActions>
        <Fab label="Play" icon={Play} />
      </FloatingActions>
    </FloatingHost>,
  )
}

describe('FloatingHost', () => {
  // The actions laid out 56px tall and 124px wide; the page keeps a gap of 12px clear of them.
  beforeEach(() => stubResizeObserver({ height: 56, width: 124 }))

  it('tells the page the room its actions take, a gap included, at the foot or at the side', async () => {
    renderActions()
    expect(await screen.findByRole('button', { name: 'Play' })).toBeInTheDocument()
    await waitFor(() => expect(root().getPropertyValue('--floating-block')).toBe('68px'))
    expect(root().getPropertyValue('--floating-inline')).toBe('136px')
  })

  it('says which side they stand at where they stand beside the page', () => {
    const { container } = renderActions('left')
    expect(container.querySelector('[data-slot=floating-host]')).toHaveAttribute(
      'data-place',
      'left',
    )
  })

  it('takes no room once the screen has gone', async () => {
    const { unmount } = renderActions()
    await waitFor(() => expect(root().getPropertyValue('--floating-block')).toBe('68px'))
    unmount()
    expect(root().getPropertyValue('--floating-block')).toBe('')
    expect(root().getPropertyValue('--floating-inline')).toBe('')
  })
})
