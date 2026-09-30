import { render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { note, placeScale } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import { LazyScoreView } from './LazyScoreView'

describe('LazyScoreView', () => {
  it('keeps the staff’s space while it loads, then engraves the score', async () => {
    const score = notate(
      scaleRun(
        { notes: placeScale(note('C'), 'major') },
        {
          rhythm: 'even',
          hands: 'rh',
          key: { tonic: note('C'), minor: false },
        },
      ),
    )
    const { container } = render(<LazyScoreView score={score} scale={1} fingers={false} />)
    await waitFor(() =>
      expect(container.querySelector('[data-slot="score"] svg')).toBeInTheDocument(),
    )
  })
})
