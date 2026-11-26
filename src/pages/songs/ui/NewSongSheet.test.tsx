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

describe('New song (R72’s one sheet)', () => {
  it('asks a name, the staves, tempo and bars, a key and a time, creating once named', async () => {
    const { user, sheet } = await openNewSong()
    for (const name of ['Staves', 'Key', 'Time'])
      expect(within(sheet).getByRole('radiogroup', { name })).toBeInTheDocument()
    for (const name of ['Tempo', 'Bars'])
      expect(within(sheet).getByRole('group', { name })).toBeInTheDocument()
    // The piano, C major and 4/4 to start, as Flat’s new score.
    expect(within(sheet).getByRole('radio', { name: /^Piano/ })).toBeChecked()
    expect(within(sheet).getByRole('radio', { name: '4/4' })).toBeChecked()
    expect(within(sheet).getByText('C major · no sharps or flats')).toBeInTheDocument()
    expect(within(sheet).getByRole('button', { name: 'Create' })).toBeDisabled()
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Dawn')
    expect(within(sheet).getByRole('button', { name: 'Create' })).toBeEnabled()
  })

  it('steps the tempo and the bars it starts with', async () => {
    const { user, sheet } = await openNewSong()
    const tempo = within(sheet).getByRole('group', { name: 'Tempo' })
    const bars = within(sheet).getByRole('group', { name: 'Bars' })
    expect(within(tempo).getByRole('status')).toHaveTextContent('♩ = 80')
    expect(within(bars).getByRole('status')).toHaveTextContent('8')
    await user.click(within(tempo).getByRole('button', { name: 'Faster' }))
    await user.click(within(bars).getByRole('button', { name: 'One bar fewer' }))
    expect(within(tempo).getByRole('status')).toHaveTextContent('♩ = 84')
    expect(within(bars).getByRole('status')).toHaveTextContent('7')
  })

  it('names the key chosen by its signature, the tile tapped again going back to C major', async () => {
    const { user, sheet } = await openNewSong()
    await user.click(within(sheet).getByRole('radio', { name: 'G major' }))
    expect(within(sheet).getByRole('radio', { name: 'G major' })).toBeChecked()
    expect(within(sheet).getByText('G major')).toBeInTheDocument()
    await user.click(within(sheet).getByRole('radio', { name: 'G major' }))
    expect(within(sheet).getByText('C major · no sharps or flats')).toBeInTheDocument()
  })
})
