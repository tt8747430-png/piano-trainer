import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChoiceCard } from './ChoiceCard'

const OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'audible', label: 'Audible', example: 'Clicks for one bar' },
  { value: 'visual', label: 'Visual', example: '3, 2, 1 on the screen' },
] as const

function draw(onChange = vi.fn()) {
  render(
    <ChoiceCard
      title="Count-in"
      setting="playback.countdown"
      options={OPTIONS}
      value="audible"
      onChange={onChange}
    />,
  )
  return onChange
}

describe('ChoiceCard', () => {
  it('draws every option with its example', () => {
    draw()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByText('Clicks for one bar')).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Count-in' })).toBeInTheDocument()
  })

  it('marks the chosen one', () => {
    draw()
    expect(screen.getByRole('radio', { name: /Audible/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Visual/ })).not.toBeChecked()
  })

  it('chooses on tap', async () => {
    const user = userEvent.setup()
    const onChange = draw()
    await user.click(screen.getByRole('radio', { name: /Visual/ }))
    expect(onChange).toHaveBeenCalledWith('visual')
  })

  it('arrow keys choose the next option', async () => {
    const user = userEvent.setup()
    const onChange = draw()
    screen.getByRole('radio', { name: /Audible/ }).focus()
    await user.keyboard('{ArrowDown}')
    expect(onChange).toHaveBeenCalledWith('visual')
  })

  it('names its setting', () => {
    draw()
    expect(document.querySelector('[data-setting="playback.countdown"]')).not.toBeNull()
  })

  it('wraps a long label', () => {
    draw()
    expect(screen.getByText('Audible')).toHaveClass('break-words')
  })
})
