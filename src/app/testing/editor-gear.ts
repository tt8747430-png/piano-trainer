import { screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

/**
 * Opens the score editor's gear (R31-E) and turns its pages by their rows' names, in turn: the sheet
 * at the last page.
 */
export async function openGear(user: UserEvent, ...rows: readonly RegExp[]): Promise<HTMLElement> {
  await user.click(await screen.findByRole('button', { name: 'Score settings' }))
  for (const row of rows)
    await user.click(
      await within(await screen.findByRole('dialog')).findByRole('button', { name: row }),
    )
  return screen.findByRole('dialog')
}

/** Record a take from the note band's Record, beside its Play (the boards): it records at once where it can. */
export async function recordTake(user: UserEvent): Promise<void> {
  const [band] = await screen.findAllByRole('group', { name: 'What the caret is on' })
  if (!band) throw new Error('the note band')
  await user.click(within(band).getByRole('button', { name: 'Record a take' }))
}
