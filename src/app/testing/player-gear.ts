import { screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

/**
 * Opens the Player's gear (R29, R32: the home of the Player's settings) and turns its pages by their
 * rows' names, in turn: the sheet at the last page.
 */
export async function openPlayerGear(
  user: UserEvent,
  ...rows: readonly RegExp[]
): Promise<HTMLElement> {
  await user.click(await screen.findByRole('button', { name: 'Player settings' }))
  for (const row of rows)
    await user.click(
      await within(await screen.findByRole('dialog')).findByRole('button', { name: row }),
    )
  return screen.findByRole('dialog')
}
