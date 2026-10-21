import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PageCanvas } from './PageCanvas'

const canvas = (onClick = vi.fn()) => {
  render(
    <PageCanvas column={794}>
      <button type="button" onClick={onClick}>
        Bar 1
      </button>
    </PageCanvas>,
  )
  return screen.getByRole('region', { name: /^Pages/ })
}

describe('PageCanvas', () => {
  it('zooms in and out by its buttons, saying how far', async () => {
    const user = userEvent.setup()
    canvas()
    expect(screen.getByText('100 %')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(screen.getByText('125 %')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zoom out' }))
    expect(screen.getByText('100 %')).toBeInTheDocument()
  })

  it('zooms with Ctrl and the wheel, and moves with the wheel alone', () => {
    const region = canvas()
    fireEvent.wheel(region, { deltaY: -600, ctrlKey: true })
    expect(screen.getByText('200 %')).toBeInTheDocument()
    fireEvent.wheel(region, { deltaY: 100 })
    expect(screen.getByText('200 %')).toBeInTheDocument()
  })

  it('lets a click reach what it holds', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    canvas(onClick)
    await user.click(screen.getByRole('button', { name: 'Bar 1' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
