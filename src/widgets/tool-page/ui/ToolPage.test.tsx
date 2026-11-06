import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('a tool’s page (R29 B11)', () => {
  it('keeps a tool’s one setting in place, with no gear (R32)', async () => {
    await renderApp('/practice/tuner')
    await screen.findByRole('heading', { level: 1, name: 'Tuner' })
    expect(screen.getByRole('button', { name: 'Higher A4' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Tuner settings' })).toBeNull()
  })

  it('has its readout in the middle, its settings in place and its Start floating', async () => {
    await renderApp('/practice/metronome')
    await screen.findByRole('heading', { level: 1, name: 'Metronome' })
    expect(screen.getByRole('region', { name: 'Metronome' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('combobox', { name: 'Subdivision' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Metronome settings' })).toBeNull()
  })
})
