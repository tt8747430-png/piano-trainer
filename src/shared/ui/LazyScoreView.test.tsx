import { act, render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { note, placeScale } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import { stubIntersectionObserver } from '@/shared/test/intersection'
import { LazyScoreView } from './LazyScoreView'
import { staffHeight } from './score/size'

const cMajor = () =>
  notate(
    scaleRun(
      { notes: placeScale(note('C'), 'major') },
      {
        rhythm: 'even',
        hands: 'rh',
        key: { tonic: note('C'), minor: false },
      },
    ),
  )

describe('LazyScoreView', () => {
  it('keeps the staff’s space while it loads, then engraves the score', async () => {
    const score = cMajor()
    const { container } = render(<LazyScoreView score={score} />)
    await waitFor(() =>
      expect(container.querySelector('[data-slot="score"] svg')).toBeInTheDocument(),
    )
  })

  it('engraves nothing, and loads no engraver, until the staff is on screen', async () => {
    const screen = stubIntersectionObserver({ visible: false })
    const { container } = render(<LazyScoreView score={cMajor()} />)
    await act(() => Promise.resolve())
    expect(container.querySelector('[data-slot="score"]')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveStyle({ height: `${staffHeight(undefined)}px` })
    act(() => screen.show())
    await waitFor(() =>
      expect(container.querySelector('[data-slot="score"] svg')).toBeInTheDocument(),
    )
  })
})
