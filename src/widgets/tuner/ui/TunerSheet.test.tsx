import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { createFakeMicrophone } from '@/shared/api/audio'
import { TunerSheet } from './TunerSheet'

const RATE = 44_100
const tone = (frequency: number) =>
  Float32Array.from({ length: 4096 }, (_, i) => Math.sin((2 * Math.PI * frequency * i) / RATE))

describe('TunerSheet', () => {
  it('names the note it hears, its frequency and how far off it is', async () => {
    renderWithSettings(
      <TunerSheet
        open
        onOpenChange={vi.fn()}
        microphone={() => Promise.resolve(createFakeMicrophone(tone(440), RATE))}
      />,
    )
    expect(await screen.findByText('A4', {}, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getByText(/^440\.\d Hz · [+−]0 cents$/)).toBeInTheDocument()
    expect(screen.getByRole('meter', { name: 'Cents off' })).toHaveAttribute('aria-valuenow', '0')
  })

  it('says so where the microphone is refused', async () => {
    renderWithSettings(
      <TunerSheet
        open
        onOpenChange={vi.fn()}
        microphone={() => Promise.reject(new Error('NotAllowedError'))}
      />,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('The microphone is not available')
  })
})
