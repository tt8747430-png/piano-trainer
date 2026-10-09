import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { lessonById, type Lesson } from '@/entities/lesson'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { note } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from '@/shared/lib/services'
import { LessonView } from './LessonView'

function firstLesson(): Lesson {
  const lesson = lessonById('reading-chord-symbols')
  if (!lesson) throw new Error('the first lesson is missing')
  return lesson
}

/** A lesson as the one route of a memory router, so its links build their addresses. */
async function renderLesson(lesson: Lesson = firstLesson()) {
  const audio = createFakeAudio()
  const store = createSettingsStore({
    storage: createMemoryStorage(),
    languages: ['en'],
    finePointer: false,
  })
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <LessonView lesson={lesson} /> }),
    history: createMemoryHistory(),
  })
  render(
    <SettingsStoreProvider store={store}>
      <ServicesProvider services={{ audio, midi: createFakeMidi() }}>
        <RouterProvider router={router} />
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  await screen.findByRole('group', { name: 'Keyboard' })
  return { audio }
}

const notes = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('LessonView', () => {
  it('reads its sections in order', async () => {
    await renderLesson()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Reading chord symbols',
      'Chord numbers: 2 or 9? 6 or 13?',
      'Naming any chord in 7 steps',
    ])
  })

  it('plays a chord example and marks its tones on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson()
    const cm = screen.getByRole('button', { name: 'Cm' })
    await user.click(cm)
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([60, 63, 67])
    expect(cm).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('♭3')
  })

  it('stops an example on a second tap', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson()
    await user.click(screen.getByRole('button', { name: 'C9' }))
    await user.click(screen.getByRole('button', { name: 'C9' }))
    expect(audio.stops).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'C9' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('writes each example as the lesson does, though the kernel names two of them alike', async () => {
    await renderLesson()
    const numbers = screen.getByRole('heading', { name: 'Chord numbers: 2 or 9? 6 or 13?' })
    const section = numbers.parentElement ?? document.body
    for (const name of ['C2', 'Cadd9', 'C6']) {
      expect(within(section).getByRole('button', { name })).toBeInTheDocument()
    }
  })
})

const WORKSHEET: Lesson = {
  id: 'worksheet',
  title: { en: 'A worksheet', ru: 'Листок' },
  summary: { en: 'Every block.', ru: 'Каждый блок.' },
  level: 1,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Examples', ru: 'Примеры' },
      blocks: [
        { kind: 'grid', quality: 'min' },
        { kind: 'scale', root: note('D'), scale: 'dorian' },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        { kind: 'notes', clef: 'bass', notes: 'G2 B2 D3 F3 A3' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play E minor.', ru: 'Сыграйте ми минор.' },
          answer: { chord: 'Em' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play a major third above F.', ru: 'Большая терция от фа.' },
          answer: { notes: ['F', 'A'] },
        },
        {
          kind: 'link',
          title: { en: 'D Dorian in Scales', ru: 'Ре дорийский в гаммах' },
          target: { place: 'scales', root: note('D'), scale: 'dorian' },
        },
        {
          kind: 'link',
          title: { en: 'Cm7 in Chords', ru: 'Cm7 в аккордах' },
          target: { place: 'chords', chord: 'Cm7' },
        },
      ],
    },
  ],
}

describe('LessonView’s worksheet', () => {
  it('plays a grid of one chord on all twelve roots', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson(WORKSHEET)
    await user.click(screen.getByRole('button', { name: 'G#m' }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([68, 71, 75])
  })

  it('runs a scale and a line of notes on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson(WORKSHEET)
    const dorian = screen.getByRole('figure', { name: 'D Dorian' })
    await user.click(within(dorian).getByRole('button', { name: 'Play' }))
    expect(notes(audio.played.at(-1)?.sounds ?? []).slice(0, 3)).toEqual([62, 64, 65])
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('♭3')
    const figures = screen.getAllByRole('figure')
    await user.click(within(figures.at(-1) ?? document.body).getByRole('button', { name: 'Play' }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([43, 47, 50, 53, 57])
  })

  it('answers a quiz on the keys: chosen, checked, fixed and right', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson(WORKSHEET)
    const quiz = screen.getByRole('group', { name: 'Play E minor.' })
    await user.click(within(quiz).getByRole('button', { name: 'Answer on the keys' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'E4' }))
    await user.click(within(keyboard).getByRole('button', { name: 'G sharp 4' }))
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    expect(within(quiz).getByRole('status')).toHaveTextContent('Not quite')
    await user.click(within(keyboard).getByRole('button', { name: 'G sharp 4' }))
    await user.click(within(keyboard).getByRole('button', { name: 'G4' }))
    await user.click(within(keyboard).getByRole('button', { name: 'B4' }))
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    expect(within(quiz).getByRole('status')).toHaveTextContent('Right')
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([64, 67, 71])
  })

  it('plays a notes answer as a line, one note after another', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson(WORKSHEET)
    const quiz = screen.getByRole('group', { name: 'Play a major third above F.' })
    await user.click(within(quiz).getByRole('button', { name: 'Answer on the keys' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    await user.click(within(quiz).getByRole('button', { name: 'Show the answer' }))
    const sounds = audio.played.at(-1)?.sounds ?? []
    expect(new Set(sounds.map((sound) => (sound.kind === 'note' ? sound.at : null))).size).toBe(2)
  })

  it('shows a quiz’s answer, and opening another quiz closes the first', async () => {
    const user = userEvent.setup()
    await renderLesson(WORKSHEET)
    const first = screen.getByRole('group', { name: 'Play E minor.' })
    await user.click(within(first).getByRole('button', { name: 'Answer on the keys' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    await user.click(within(first).getByRole('button', { name: 'Check' }))
    await user.click(within(first).getByRole('button', { name: 'Show the answer' }))
    expect(within(keyboard).getByRole('button', { name: 'G4' })).toHaveTextContent('♭3')
    const second = screen.getByRole('group', { name: 'Play a major third above F.' })
    await user.click(within(second).getByRole('button', { name: 'Answer on the keys' }))
    expect(within(first).getByRole('button', { name: 'Answer on the keys' })).toBeInTheDocument()
    expect(within(keyboard).getByRole('button', { name: 'G4' })).not.toHaveTextContent('♭3')
  })

  it('links into the references on what it names', async () => {
    await renderLesson(WORKSHEET)
    expect(screen.getByRole('link', { name: 'D Dorian in Scales' }).getAttribute('href')).toBe(
      '/practice/scales?root=D&kind=dorian',
    )
    const chords = screen.getByRole('link', { name: 'Cm7 in Chords' }).getAttribute('href') ?? ''
    expect(chords).toMatch(/^\/practice\/chords\?/)
    expect(chords).toMatch(/[?&]triad=min(&|$)/)
    expect(chords).toMatch(/[?&]size=7(&|$)/)
  })
})

const C_MAJOR = { tonic: note('C'), minor: false }

/** A lesson with a pattern over its piece, a progression, and links into the tools and the Player. */
const ACCOMPANIMENT: Lesson = {
  id: 'accompaniment',
  title: { en: 'Accompaniment', ru: 'Аккомпанемент' },
  summary: { en: 'Patterns.', ru: 'Фактуры.' },
  level: 1,
  category: 'accompaniment',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Ways', ru: 'Способы' },
      blocks: [
        { kind: 'pattern', pattern: 'M2', piece: 'ex3' },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
        {
          kind: 'link',
          title: { en: 'C to F in Passing chords', ru: 'Из C в F' },
          target: { place: 'passing-chords', key: C_MAJOR, from: 'C', to: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'E in Reharmonise', ru: 'Ми в реармонизации' },
          target: { place: 'reharmonise', key: C_MAJOR, note: note('E') },
        },
        {
          kind: 'link',
          title: { en: 'The hymn in the Player', ru: 'Гимн в плеере' },
          target: { place: 'piece', piece: 'otche', pattern: 'r4' },
        },
      ],
    },
  ],
}

describe('LessonView’s accompaniment', () => {
  it('plays a pattern over its piece, and opens the piece in the Player with it', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson(ACCOMPANIMENT)
    const card = screen.getByRole('article', { name: '2 · Broken chords' })
    expect(card).toHaveTextContent('Right hand rocks in 8ths between the upper notes')
    expect(card).toHaveTextContent('Lesson 3: C – Dm – G – C – F – C – G – C')
    await user.click(within(card).getByRole('button', { name: 'Play' }))
    expect(notes(audio.played.at(-1)?.sounds ?? []).length).toBeGreaterThan(8)
    expect(within(card).getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    expect(
      within(card).getByRole('link', { name: 'Open in the Player' }).getAttribute('href'),
    ).toBe('/play/ex3?pattern=M2')
  })

  it('plays a progression as the tool’s row, and opens it in Progressions', async () => {
    await renderLesson(ACCOMPANIMENT)
    expect(
      within(screen.getByRole('list', { name: 'Chords' }))
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['Dm7ii', 'G7V', 'CMaj7I'])
    const tool = screen.getByRole('link', { name: 'Open in Progressions' }).getAttribute('href')
    expect(tool).toMatch(/^\/practice\/progressions\?/)
    expect(tool).toMatch(/[?&]p=ii-V-I(&|$)/)
    expect(tool).toMatch(/[?&]key=C(&|$)/)
    expect(tool).toMatch(/[?&]size=sevenths(&|$)/)
  })

  it('links into the tools and the Player on what it names', async () => {
    await renderLesson(ACCOMPANIMENT)
    const passing = screen.getByRole('link', { name: 'C to F in Passing chords' })
    expect(passing.getAttribute('href')).toMatch(/^\/practice\/progressions\/passing\?/)
    expect(passing.getAttribute('href')).toMatch(/[?&]from=C(&|$)/)
    expect(passing.getAttribute('href')).toMatch(/[?&]to=F(&|$)/)
    const reharmonise = screen.getByRole('link', { name: 'E in Reharmonise' }).getAttribute('href')
    expect(reharmonise).toMatch(/^\/practice\/progressions\/reharmonise\?/)
    expect(reharmonise).toMatch(/[?&]note=E(&|$)/)
    expect(screen.getByRole('link', { name: 'The hymn in the Player' }).getAttribute('href')).toBe(
      '/play/otche?pattern=r4',
    )
  })
})
