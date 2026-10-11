import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { WaitLine } from './WaitLine'

describe('WaitLine', () => {
  it('says a clean pass was clean, with Again and no loop to offer', () => {
    renderWithSettings(
      <WaitLine
        feedback={{ kind: 'finished', slips: 0, hardest: null }}
        onAgain={() => {}}
        onLoop={() => {}}
      />,
    )
    expect(screen.getByText('Finished without a slip')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Again' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Loop/ })).not.toBeInTheDocument()
  })

  it('counts a pass’s slips and loops the bars that had the most, numbered from 1', async () => {
    const onLoop = vi.fn()
    renderWithSettings(
      <WaitLine
        feedback={{ kind: 'finished', slips: 4, hardest: { first: 4, last: 5 } }}
        onAgain={() => {}}
        onLoop={onLoop}
      />,
    )
    expect(screen.getByText('Finished · slips: 4')).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Loop bars 5–6' }))
    expect(onLoop).toHaveBeenCalledWith({ first: 4, last: 5 })
  })
})
