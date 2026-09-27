import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { lessonById } from '@/entities/lesson'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import type { Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from '@/shared/lib/services'
import { LessonView } from './LessonView'

function renderLesson() {
  const lesson = lessonById('reading-chord-symbols')
  if (!lesson) throw new Error('the first lesson is missing')
  const audio = createFakeAudio()
  const store = createSettingsStore({
    storage: createMemoryStorage(),
    languages: ['en'],
    finePointer: false,
  })
  render(
    <SettingsStoreProvider store={store}>
      <ServicesProvider services={{ audio, midi: createFakeMidi() }}>
        <LessonView lesson={lesson} />
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  return { audio }
}

const notes = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('LessonView', () => {
  it('reads its sections in order', () => {
    renderLesson()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Reading chord symbols',
      'Chord numbers: 2 or 9? 6 or 13?',
      'Naming any chord in 7 steps',
    ])
  })

  it('plays a chord example and marks its tones on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = renderLesson()
    const cm = screen.getByRole('button', { name: 'Cm' })
    await user.click(cm)
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([60, 63, 67])
    expect(cm).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('♭3')
  })

  it('stops an example on a second tap', async () => {
    const user = userEvent.setup()
    const { audio } = renderLesson()
    await user.click(screen.getByRole('button', { name: 'C9' }))
    await user.click(screen.getByRole('button', { name: 'C9' }))
    expect(audio.stops).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'C9' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('writes each example as the lesson does, though the kernel names two of them alike', () => {
    renderLesson()
    const numbers = screen.getByRole('heading', { name: 'Chord numbers: 2 or 9? 6 or 13?' })
    const section = numbers.parentElement ?? document.body
    for (const name of ['C2', 'Cadd9', 'C6']) {
      expect(within(section).getByRole('button', { name })).toBeInTheDocument()
    }
  })
})
