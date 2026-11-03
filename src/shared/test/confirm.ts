import { screen, within } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

/**
 * Answers the app's question (`confirm`, R17) with its act, checking the question asked where
 * `title` says it.
 */
export async function confirmAsked(
  user: ReturnType<typeof userEvent.setup>,
  action: string,
  title?: string,
) {
  const dialog = await screen.findByRole('alertdialog', title === undefined ? {} : { name: title })
  expect(dialog).toBeInTheDocument()
  await user.click(within(dialog).getByRole('button', { name: action }))
}
