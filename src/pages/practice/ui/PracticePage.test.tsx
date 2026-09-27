import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Practice', () => {
  it('lists the studies and the progressions, each opening on Practice', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    const studies = screen.getByRole('region', { name: 'Studies' })
    expect(within(studies).getAllByRole('link')[0]?.getAttribute('href')).toMatch(
      /^\/practice\/studies\//,
    )
    const progressions = screen.getByRole('region', { name: 'Progressions' })
    expect(within(progressions).getAllByRole('link')[0]?.getAttribute('href')).toMatch(
      /^\/practice\/progressions\//,
    )
  })
})
