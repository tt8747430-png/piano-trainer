import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { setSound } from '@/features/set-preference'
import { SoundButton } from './SoundButton'

async function openSound(props: Partial<Parameters<typeof SoundButton>[0]> = {}) {
  const user = userEvent.setup()
  const view = renderWithSettings(<SoundButton staves={false} recording={false} {...props} />)
  await user.click(screen.getByRole('button', { name: 'Sound' }))
  const popover = await screen.findByRole('dialog', { name: 'Sound' })
  return { ...view, user, popover }
}

/**
 * A volume's slider by its label. Its input stands in a thumb jsdom lays out nowhere, hidden, whose
 * name the queries then leave uncomputed.
 */
const volume = (popover: HTMLElement, name: string) =>
  within(popover)
    .getByText(name, { selector: '[data-slot="slider-label"]' })
    .closest('[data-slot="slider"]')
    ?.querySelector('input[type="range"]')

describe('SoundButton (ADR 0105)', () => {
  it('turns the count-in and the click on and off: the saved toggles', async () => {
    const { user, popover, settingsStore } = await openSound()
    const switches = within(popover).getAllByRole('switch')
    expect(switches.map((each) => each.getAttribute('aria-checked'))).toEqual(['false', 'false'])
    expect(switches[0]).toHaveAccessibleName('Count in')
    expect(switches[1]).toHaveAccessibleName('Click')
    await user.click(switches[0] as HTMLElement)
    await user.click(switches[1] as HTMLElement)
    expect(settingsStore.getState().practice).toMatchObject({ countIn: true, metronome: true })
  })

  it('has a volume for each hand and the click, and the staves and the recording where there are any', async () => {
    const plain = await openSound()
    expect(within(plain.popover).getAllByRole('slider', { hidden: true })).toHaveLength(3)
    for (const name of ['Right hand', 'Left hand', 'Click'])
      expect(volume(plain.popover, name)).toBeInTheDocument()
    expect(within(plain.popover).queryByRole('button', { name: 'Only the chords' })).toBeNull()
    plain.unmount()
    const full = await openSound({ staves: true, recording: true })
    expect(within(full.popover).getAllByRole('slider', { hidden: true })).toHaveLength(5)
    for (const name of ['Staves', 'Recording'])
      expect(volume(full.popover, name)).toBeInTheDocument()
  })

  it('saves a volume moved on its slider', async () => {
    const { user, popover, settingsStore } = await openSound()
    const left = volume(popover, 'Left hand') as HTMLInputElement
    expect(left).toHaveValue('100')
    left.focus()
    await user.keyboard('{ArrowLeft}')
    expect(settingsStore.getState().sound.lh).toBe(95)
  })

  it('turns the recording down and the hands up at “Only the chords”', async () => {
    const { user, popover, settingsStore } = await openSound({ recording: true })
    act(() => setSound(settingsStore, { rh: 40, lh: 10 }))
    await user.click(within(popover).getByRole('button', { name: 'Only the chords' }))
    expect(settingsStore.getState().sound).toMatchObject({ recording: 0, rh: 100, lh: 100 })
  })
})
