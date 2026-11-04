import { screen, waitFor, within } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

/**
 * Answers the app's question (`confirm`, R17) with its act, checking the question asked where
 * `title` says it. The act is pressed once the question has settled open, and the question is
 * waited out: under a full suite's load an act pressed mid-opening can be lost.
 */
export async function confirmAsked(
  user: ReturnType<typeof userEvent.setup>,
  action: string,
  title?: string,
) {
  const dialog = await screen.findByRole('alertdialog', title === undefined ? {} : { name: title })
  expect(dialog).toBeInTheDocument()
  await waitFor(() => expect(dialog).not.toHaveAttribute('data-starting-style'))
  await user.click(within(dialog).getByRole('button', { name: action }))
  await waitFor(() => expect(dialog).not.toBeInTheDocument())
}
