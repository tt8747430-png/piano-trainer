import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/shared/i18n'
import { InfoTip } from './InfoTip'

describe('InfoTip', () => {
  it('keeps its explanation out of sight until its button, named for the control, opens it', async () => {
    const user = userEvent.setup()
    render(<InfoTip name="Key size">Fit fills the width with the keys a page shows.</InfoTip>)
    const button = screen.getByRole('button', { name: 'About Key size' })
    expect(screen.queryByText(/fills the width/)).toBeNull()
    await user.click(button)
    const tip = await screen.findByRole('dialog', { name: 'Key size' })
    expect(tip).toHaveTextContent('Fit fills the width with the keys a page shows.')
  })

  it('closes at Escape, the focus back on its button', async () => {
    const user = userEvent.setup()
    render(<InfoTip name="Touch">How hard a key must be struck to sound loud.</InfoTip>)
    const button = screen.getByRole('button', { name: 'About Touch' })
    await user.click(button)
    await screen.findByRole('dialog', { name: 'Touch' })
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(button).toHaveFocus()
  })

  it('closes at a tap anywhere else', async () => {
    const user = userEvent.setup()
    render(
      <>
        <InfoTip name="Pedal">Reversed, for a pedal that holds the notes while it is up.</InfoTip>
        <p>Elsewhere</p>
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'About Pedal' }))
    await screen.findByRole('dialog', { name: 'Pedal' })
    await user.click(screen.getByText('Elsewhere'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('names its button in the learner’s language', async () => {
    await i18n.changeLanguage('ru')
    render(
      <InfoTip name="Педаль">Обратная — для педали, которая держит ноты, когда отпущена.</InfoTip>,
    )
    expect(screen.getByRole('button', { name: 'Подробнее: Педаль' })).toBeInTheDocument()
  })
})
