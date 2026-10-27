import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChromeShownContext } from '../model/chrome-shown'
import { ScoreBar } from './ScoreBar'

const parts = (
  <ScoreBar
    lead={<button type="button">Close</button>}
    actions={<button type="button">Setup</button>}
    tools={<div role="toolbar" aria-label="Tools" />}
  />
)

describe('ScoreBar (ADR 0115)', () => {
  it('is one surface holding the lead, the actions and the tools, in that order', () => {
    render(parts)
    const bar = document.querySelector('header[data-area="bar"]')
    expect(bar).toHaveClass('score-bar')
    const areas = [...(bar?.children ?? [])].map((child) => child.getAttribute('data-area'))
    expect(areas).toEqual(['lead', 'actions', 'tools'])
    expect(screen.getByRole('button', { name: 'Close' }).closest('[data-area="lead"]')).not.toBe(
      null,
    )
    expect(screen.getByRole('toolbar', { name: 'Tools' }).closest('header')).toBe(bar)
  })

  it('steps aside whole, out of reach, its room kept', () => {
    render(<ChromeShownContext value={{ dock: true, bar: false }}>{parts}</ChromeShownContext>)
    const bar = document.querySelector('header[data-area="bar"]')
    expect(bar).toHaveAttribute('data-hidden')
    expect(bar).toHaveAttribute('inert')
  })
})
