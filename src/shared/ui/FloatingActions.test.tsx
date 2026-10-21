import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Play, Plus, Printer, Share } from 'lucide-react'
import { beforeEach, describe, expect, it } from 'vitest'
import { stubResizeObserver } from '@/shared/test/resize'
import {
  Fab,
  FabLink,
  FloatingActions,
  FloatingHost,
  SpeedDial,
  SpeedDialAction,
} from './FloatingActions'
import type { FloatingPlace } from './floating-context'

const root = () => document.documentElement.style

function page(place: FloatingPlace, path: string) {
  return (
    <FloatingHost place={place} labels={false} screen={path}>
      <main>
        <p>The page</p>
        <div role="toolbar" aria-label="Its own bar">
          <span>Its padding</span>
        </div>
      </main>
      <FloatingActions>
        <Fab label="Play" icon={Play} />
      </FloatingActions>
    </FloatingHost>
  )
}

function renderActions(place: FloatingPlace = 'center', path = '/') {
  return render(page(place, path))
}

const host = () => document.querySelector('[data-slot=floating-host]')

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

  it('folds away at a tap on the page and comes back at the next', async () => {
    const user = userEvent.setup()
    renderActions()
    await user.click(screen.getByText('The page'))
    expect(host()).toHaveAttribute('data-hidden')
    await user.click(screen.getByText('The page'))
    expect(host()).not.toHaveAttribute('data-hidden')
  })

  it('stays at a tap on a control of the page, its bars too', async () => {
    const user = userEvent.setup()
    renderActions()
    await user.click(screen.getByText('Its padding'))
    expect(host()).not.toHaveAttribute('data-hidden')
  })

  it('comes back on another screen, and stays back on returning to the one it left', async () => {
    const user = userEvent.setup()
    const { rerender } = renderActions('center', '/a')
    await user.click(screen.getByText('The page'))
    expect(host()).toHaveAttribute('data-hidden')
    rerender(page('center', '/b'))
    expect(host()).not.toHaveAttribute('data-hidden')
    rerender(page('center', '/a'))
    expect(host()).not.toHaveAttribute('data-hidden')
  })
})

describe('FabLink', () => {
  it('is a link named by its label, looking like the main floating button', () => {
    render(<FabLink label="Practise" icon={Play} render={<a href="/play/ode" />} />)
    const link = screen.getByRole('link', { name: 'Practise' })
    expect(link).toHaveAttribute('href', '/play/ode')
    expect(link).toHaveAttribute('title', 'Practise')
    expect(link).toHaveClass('size-14', 'rounded-full', 'bg-primary')
  })
})

describe('Fab', () => {
  it('is a round icon named by its label, honey and raised', () => {
    render(<Fab label="Play" icon={Play} />)
    expect(screen.getByRole('button', { name: 'Play' })).toHaveClass(
      'size-14',
      'rounded-full',
      'bg-primary',
      'elevation-2',
      'active:scale-96',
    )
  })

  it('says its name beside its icon where it is extended', () => {
    render(<Fab label="New song" icon={Plus} extended />)
    const button = screen.getByRole('button', { name: 'New song' })
    expect(button).toHaveTextContent('New song')
    expect(button).toHaveClass('h-14', 'rounded-full')
  })
})

describe('SpeedDial', () => {
  beforeEach(() => stubResizeObserver({ height: 48, width: 48 }))

  function renderDial() {
    return render(
      <FloatingHost place="right" labels={false} screen="/">
        <FloatingActions>
          <SpeedDial>
            <SpeedDialAction label="Share" icon={Share} />
            <SpeedDialAction label="Print" icon={Printer} />
          </SpeedDial>
        </FloatingActions>
      </FloatingHost>,
    )
  }

  it('is a 48px raised button, its actions each named in sight once open', async () => {
    const user = userEvent.setup()
    renderDial()
    const more = await screen.findByRole('button', { name: 'More actions' })
    expect(more).toHaveClass('size-12', 'bg-raised', 'elevation-1')
    await user.click(more)
    expect(more).toHaveAttribute('aria-expanded', 'true')
    // Names are chips in sight even where the floating buttons say no names.
    expect(screen.getByRole('button', { name: 'Print' })).toHaveTextContent('Print')
    expect(screen.getByText('Share')).not.toHaveClass('sr-only')
  })

  it('folds once an action is chosen, its actions leaving before they go', async () => {
    const user = userEvent.setup()
    renderDial()
    await user.click(await screen.findByRole('button', { name: 'More actions' }))
    await user.click(screen.getByRole('button', { name: 'Print' }))
    expect(screen.queryByRole('button', { name: 'Print' })).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Print')).not.toBeInTheDocument())
  })
})
