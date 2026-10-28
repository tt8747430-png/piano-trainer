import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LESSONS } from '@/entities/lesson'
import { createFakeContent } from '@/shared/api/content'
import { renderApp } from '../testing/render-app'

describe('a screen whose content is not on the device', () => {
  it('opens once its music is brought onto the device', async () => {
    const content = createFakeContent({ away: [['piece', 'bz5']] })
    await renderApp('/songs/bz5', { content })
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(content.has('piece', 'bz5')).toBe(true)
  })

  it('says it opens once the learner is back online, offline', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const content = createFakeContent({ away: [['piece', 'bz5']], online: () => false })
    await renderApp('/play/bz5', { content })
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'You’re offline. This screen opens once you’re back online.',
    )
  })

  it('is not found where the server will not give it', async () => {
    const [lesson] = LESSONS
    const content = createFakeContent({ refused: [['lesson', lesson?.id ?? '']] })
    await renderApp(`/lessons/${lesson?.id}`, { content })
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
