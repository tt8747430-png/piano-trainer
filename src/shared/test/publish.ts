import { screen } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'

/**
 * Publishes an editor's draft the one way (R29 B6): its bar's Publish opens its Publish page, where
 * the rights are ticked and Publish (or Publish new version) pressed. Waits for the draft to be saved
 * first, and for the toast that says how it went.
 */
export async function publishOnItsPage(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByText('Saved · not published', {}, { timeout: 3000 })
  await user.click(screen.getByRole('link', { name: 'Publish' }))
  await tickAndPublish(user)
}

/** On a Publish page: the rights ticked, then Publish or Publish new version. */
export async function tickAndPublish(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('checkbox', { name: /I confirm/ }))
  await user.click(screen.getByRole('button', { name: /^Publish( new version)?$/ }))
}
