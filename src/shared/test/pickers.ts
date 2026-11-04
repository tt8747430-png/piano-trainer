import { screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** A picker's value: its button, named "Label: value". */
export const picker = (label: string): HTMLElement =>
  screen.getByRole('button', { name: new RegExp(`^${escaped(label)}: `) })

/** A picker's value as its button says it ("C♯", "D major"). */
export const pickerValue = (label: string): string =>
  (picker(label).getAttribute('aria-label') ?? '').slice(label.length + 2)

/** Opens a picker and taps one of its cells or wedges (`PitchPicker`, `NotePicker`, `KeyCircle`). */
export async function pickIn(user: UserEvent, label: string, choice: string): Promise<void> {
  await user.click(await screen.findByRole('button', { name: new RegExp(`^${escaped(label)}: `) }))
  const panel = await screen.findByRole('radiogroup', { name: label })
  await user.click(within(panel).getByRole('radio', { name: choice }))
}

/**
 * Opens a `KeyPicker`, sets its mode (Major · Minor) to the key's and taps the key's cell, or No sharps
 * or flats for C major and A minor ("G major", "E♭ minor").
 */
export async function pickKey(user: UserEvent, key: string, label = 'Key'): Promise<void> {
  await user.click(await screen.findByRole('button', { name: new RegExp(`^${escaped(label)}: `) }))
  const minor = key.endsWith(' minor')
  const mode = await screen.findByRole('radio', { name: minor ? 'Minor' : 'Major' })
  if (mode.getAttribute('aria-checked') !== 'true') await user.click(mode)
  await user.click(screen.getByRole('button', { name: new RegExp(`(^|· )${escaped(key)}$`) }))
}

/** Opens a `MenuPicker` and chooses one of its options. */
export async function pickMenu(user: UserEvent, label: string, option: string): Promise<void> {
  await user.click(await screen.findByRole('button', { name: new RegExp(`^${escaped(label)}: `) }))
  const list = await screen.findByRole('listbox', { name: label })
  await user.click(within(list).getByRole('option', { name: option }))
}

/** Opens a `MenuPicker` and reads its options' names, then closes it. */
export async function menuOptions(user: UserEvent, label: string): Promise<string[]> {
  await user.click(picker(label))
  const list = await screen.findByRole('listbox', { name: label })
  const names = within(list)
    .getAllByRole('option')
    .map((option) => option.textContent ?? '')
  await user.keyboard('{Escape}')
  return names
}
