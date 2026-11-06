import { screen, waitFor, within } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

/**
 * Answers the app's question (`confirm`, R17) with its act, checking the question asked where
 * `title` says it. The act is pressed once the question has settled open, and the question is
 * waited out: under a full suite's load an act pressed mid-opening can be lost, and the question can
 * take longer than a second to leave; a press lost before it was taken is pressed again.
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
  // Under load a press can land before the dialog takes it: pressed again only while the dialog
  // still stands open, never once it has begun to close (its act already done).
  const gone = () => expect(dialog).not.toBeInTheDocument()
  try {
    await waitFor(gone, { timeout: 2500 })
  } catch {
    const act = within(dialog).queryByRole('button', { name: action })
    if (act && !dialog.hasAttribute('data-ending-style')) await user.click(act)
    await waitFor(gone, { timeout: 5000 })
  }
}
