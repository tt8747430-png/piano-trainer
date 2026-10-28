import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepStrip } from './StepStrip'

const KINDS = [
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'dorian', label: 'Dorian', reason: 'Not here' },
  { value: 'blues', label: 'Blues' },
] as const

describe('StepStrip', () => {
  it('is a radio group of every option in a row, the chosen one checked', () => {
    render(<StepStrip label="Scale" value="minor" options={KINDS} onChange={() => {}} />)
    const strip = screen.getByRole('radiogroup', { name: 'Scale' })
    expect(
      within(strip)
        .getAllByRole('radio')
        .map((each) => each.textContent),
    ).toEqual(['Major', 'Minor', 'Dorian', 'Blues'])
    expect(within(strip).getByRole('radio', { name: 'Minor' })).toBeChecked()
  })

  it('chooses an option tapped', async () => {
    const onChange = vi.fn()
    render(<StepStrip label="Scale" value="major" options={KINDS} onChange={onChange} />)
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Blues' }))
    expect(onChange).toHaveBeenCalledWith('blues')
  })

  it('steps to the previous and the next option that can be chosen, past one greyed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <StepStrip label="Scale" value="minor" options={KINDS} onChange={onChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Next: Scale' }))
    expect(onChange).toHaveBeenLastCalledWith('blues')
    await user.click(screen.getByRole('button', { name: 'Previous: Scale' }))
    expect(onChange).toHaveBeenLastCalledWith('major')
    rerender(<StepStrip label="Scale" value="blues" options={KINDS} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Next: Scale' })).toBeDisabled()
    rerender(<StepStrip label="Scale" value="major" options={KINDS} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Previous: Scale' })).toBeDisabled()
  })

  it('greys an option that cannot be chosen, saying why', () => {
    render(<StepStrip label="Scale" value="major" options={KINDS} onChange={() => {}} />)
    const dorian = screen.getByRole('radio', { name: 'Dorian' })
    expect(dorian).toHaveAttribute('data-disabled')
    expect(dorian).toHaveAccessibleDescription('Not here')
  })
})
