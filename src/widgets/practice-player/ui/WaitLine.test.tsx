import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { WaitLine } from './WaitLine'

const finished = (score: number) =>
  ({ kind: 'finished', score, hardest: null, slips: {}, pauses: {}, bars: 8 }) as const

describe('WaitLine', () => {
  it('says a clean pass was clean', () => {
    renderWithSettings(<WaitLine feedback={finished(100)} />)
    expect(screen.getByText('Played through without a slip')).toBeInTheDocument()
  })

  it("says a pass's score, its acts left to Played through", () => {
    renderWithSettings(<WaitLine feedback={finished(82)} />)
    expect(screen.getByText('Played through · Score 82%')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
