import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ToolKey } from './ToolKey'

describe('ToolKey', () => {
  it('is a key named by its label, on or off as a toggle, greyed out of reach', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <>
        <ToolKey label="Quarter note" pressed onClick={onClick}>
          ♩
        </ToolKey>
        <ToolKey label="Rest" span="wide">
          𝄽
        </ToolKey>
        <ToolKey label="Dotted" disabled>
          .
        </ToolKey>
      </>,
    )
    const quarter = screen.getByRole('button', { name: 'Quarter note' })
    expect(quarter).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Rest' })).not.toHaveAttribute('aria-pressed')
    expect(screen.getByRole('button', { name: 'Rest' })).toHaveClass('col-span-2')
    expect(screen.getByRole('button', { name: 'Dotted' })).toBeDisabled()
    await user.click(quarter)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('says what a term means in its tooltip and to a screen reader, never on its face', async () => {
    const user = userEvent.setup()
    render(
      <ToolKey label="Dolce" description="Sweetly">
        dolce
      </ToolKey>,
    )
    const dolce = screen.getByRole('button', { name: 'Dolce' })
    expect(dolce).toHaveAccessibleDescription('Sweetly')
    expect(screen.getByText('Sweetly')).not.toBeVisible()
    await user.hover(dolce)
    await waitFor(() =>
      expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveTextContent('Sweetly'),
    )
  })

  it('greyed, says why in its tooltip and to a screen reader', () => {
    render(
      <ToolKey
        label="Staccato"
        reason="Choose a note first: these change the notes chosen."
        disabled
      >
        .
      </ToolKey>,
    )
    const staccato = screen.getByRole('button', { name: 'Staccato' })
    expect(staccato).toBeDisabled()
    expect(staccato).toHaveAttribute('title', 'Choose a note first: these change the notes chosen.')
    expect(staccato).toHaveAccessibleDescription(
      'Choose a note first: these change the notes chosen.',
    )
  })

  it('says no reason while it works', () => {
    render(
      <ToolKey label="Staccato" reason="Choose a note first: these change the notes chosen.">
        .
      </ToolKey>,
    )
    const staccato = screen.getByRole('button', { name: 'Staccato' })
    expect(staccato).not.toHaveAttribute('title')
    expect(staccato).toHaveAccessibleDescription('')
  })
})
