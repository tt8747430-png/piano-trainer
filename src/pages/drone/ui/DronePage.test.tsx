import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Practice → Drone (R29 B11)', () => {
  it('starts and stops the chosen drone', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/practice/drone')
    await screen.findByRole('heading', { level: 1, name: 'Drone' })
    // C and its fifth, in the octave below middle C, by default.
    await user.click(screen.getByRole('button', { name: 'Start drone' }))
    expect(await screen.findByText('Sounding: C3 · G3')).toBeInTheDocument()
    expect(audio.drones).toHaveLength(1)
    expect(audio.drones[0]).toMatchObject({ keys: [48, 55], stopped: false })
    // A change while it sounds is heard at once, and saved.
    await user.click(screen.getByRole('radio', { name: /Minor/ }))
    expect(audio.drones[0]?.stopped).toBe(true)
    expect(audio.drones[1]).toMatchObject({ keys: [48, 51, 55], stopped: false })
    expect(settingsStore.getState().drone.kind).toBe('minor')
    await user.click(screen.getByRole('button', { name: 'Octave higher' }))
    expect(audio.drones.at(-1)).toMatchObject({ keys: [60, 63, 67], stopped: false })
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.drones.every((drone) => drone.stopped)).toBe(true)
    expect(screen.getByText('Press play to hear the drone')).toBeInTheDocument()
  })
})
