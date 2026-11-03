import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { setStaffVolume } from '@/features/set-preference'
import type { ScoreTrack } from '../model/score-tracks'
import { SoundButton } from './SoundButton'

const PIANO: readonly ScoreTrack[] = [
  { id: 'treble', label: 'Upper staff', clef: 'treble', drawn: true },
  { id: 'bass', label: 'Lower staff', clef: 'bass', drawn: true },
]
const FULL: readonly ScoreTrack[] = [
  { id: 'staff0', label: 'Voice', clef: 'treble', drawn: true },
  ...PIANO,
  { id: 'recording', label: 'Recording', drawn: false },
]

async function openSound(props: Partial<Parameters<typeof SoundButton>[0]> = {}) {
  const user = userEvent.setup()
  const view = renderWithSettings(
    <SoundButton tracks={PIANO} click={false} onClick={vi.fn()} {...props} />,
  )
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
  it('turns the count-in on and off, the saved toggle, and the click as the Player says', async () => {
    const onClick = vi.fn()
    const { user, popover, settingsStore } = await openSound({ click: true, onClick })
    const switches = within(popover).getAllByRole('switch')
    expect(switches.map((each) => each.getAttribute('aria-checked'))).toEqual(['false', 'true'])
    expect(switches[0]).toHaveAccessibleName('Count in')
    expect(switches[1]).toHaveAccessibleName('Metronome')
    await user.click(switches[0] as HTMLElement)
    await user.click(switches[1] as HTMLElement)
    expect(settingsStore.getState().practice).toMatchObject({ countIn: true, metronome: false })
    expect(onClick).toHaveBeenCalledWith(false)
  })

  it('has a volume for each track and the click, and Only the chords with a recording (A35)', async () => {
    const plain = await openSound()
    expect(within(plain.popover).getAllByRole('slider', { hidden: true })).toHaveLength(3)
    for (const name of ['Upper staff', 'Lower staff', 'Metronome'])
      expect(volume(plain.popover, name)).toBeInTheDocument()
    expect(within(plain.popover).queryByRole('button', { name: 'Only the chords' })).toBeNull()
    plain.unmount()
    const full = await openSound({ tracks: FULL })
    expect(within(full.popover).getAllByRole('slider', { hidden: true })).toHaveLength(5)
    for (const name of ['Voice', 'Recording'])
      expect(volume(full.popover, name)).toBeInTheDocument()
  })

  it('saves a volume moved on its slider', async () => {
    const { user, popover, settingsStore } = await openSound()
    const lower = volume(popover, 'Lower staff') as HTMLInputElement
    expect(lower).toHaveValue('100')
    lower.focus()
    await user.keyboard('{ArrowLeft}')
    expect(settingsStore.getState().sound.staves.bass).toBe(95)
  })

  it('turns the recording down and the piano up at “Only the chords”', async () => {
    const { user, popover, settingsStore } = await openSound({ tracks: FULL })
    act(() => setStaffVolume(settingsStore, 'bass', 10))
    await user.click(within(popover).getByRole('button', { name: 'Only the chords' }))
    expect(settingsStore.getState().sound).toMatchObject({
      recording: 0,
      staves: { treble: 100, bass: 100 },
    })
  })
})
