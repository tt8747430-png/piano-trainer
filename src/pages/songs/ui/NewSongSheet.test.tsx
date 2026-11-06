import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

async function openNewSong() {
  const user = userEvent.setup()
  await renderApp('/songs')
  await user.click(await screen.findByRole('button', { name: 'New' }))
  await user.click(await screen.findByRole('button', { name: 'New song' }))
  const sheet = await screen.findByRole('dialog', { name: 'New song' })
  return { user, sheet }
}

describe('New song (A34)', () => {
  it('names its steps', async () => {
    const { user, sheet } = await openNewSong()
    const steps = within(sheet).getByRole('list', { name: 'Steps' })
    expect(
      within(steps)
        .getAllByRole('listitem')
        .map((step) => step.textContent),
    ).toEqual(['Title', 'Instruments', 'Time and key'])
    expect(within(steps).getByText('Title').closest('li')).toHaveAttribute('aria-current', 'step')
    await user.type(within(sheet).getByRole('textbox', { name: 'Title' }), 'Dawn')
    await user.click(within(sheet).getByRole('button', { name: 'Next' }))
    await user.click(within(sheet).getByRole('button', { name: 'Next' }))
    expect(within(steps).getByText('Time and key').closest('li')).toHaveAttribute(
      'aria-current',
      'step',
    )
    // Its fields by their names, Flat's.
    for (const name of ['Time signature', 'Key signature', 'Tempo', 'Number of bars'])
      expect(within(sheet).getByRole('heading', { name })).toBeInTheDocument()
    // The pickup is the time signature's own wheel, beside Current (R31-E).
    expect(within(sheet).getByRole('spinbutton', { name: 'Pickup beats' })).toBeInTheDocument()
  })

  it('one way to add an instrument', async () => {
    const { user, sheet } = await openNewSong()
    await user.type(within(sheet).getByRole('textbox', { name: 'Title' }), 'Dawn')
    await user.click(within(sheet).getByRole('button', { name: 'Next' }))
    // An instrument not in the score: its + alone; added, it counts with − 1 +.
    expect(within(sheet).queryByRole('button', { name: 'One Alto fewer' })).not.toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: 'One more Alto' }))
    expect(within(sheet).getByRole('status', { name: 'Alto: 1' })).toBeInTheDocument()
    expect(within(sheet).getAllByRole('button', { name: 'One Alto fewer' })).toHaveLength(1)
    expect(within(sheet).getAllByRole('button', { name: 'One more Alto' })).toHaveLength(1)
  })
})
