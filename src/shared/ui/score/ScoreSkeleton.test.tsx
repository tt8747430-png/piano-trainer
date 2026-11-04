import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreSkeleton } from './ScoreSkeleton'

describe('ScoreSkeleton (A34)', () => {
  it('draws its systems’ staves at their final size and says where they stand', () => {
    const { container } = render(
      <ScoreSkeleton systems={3} staves={2} scale={1.5} bars={{ at: 12, of: 48 }} />,
    )
    // Three systems of two staves, five lines each.
    expect(container.querySelectorAll('line')).toHaveLength(3 * 2 * 5)
    expect(screen.getByText('Bar 12 of 48')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading the music')
  })

  it('names no bar where it stands for a staff alone', () => {
    render(<ScoreSkeleton systems={1} staves={1} />)
    expect(screen.queryByText(/^Bar /)).not.toBeInTheDocument()
  })
})
