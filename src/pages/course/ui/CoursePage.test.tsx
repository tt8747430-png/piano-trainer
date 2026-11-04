import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Editor } from '@tiptap/core'
import { afterEach, describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { courseById, courseRecord, type CourseRecord } from '@/entities/course'
import { createFakeAuth } from '@/shared/api/auth'
import { keepContent } from '@/shared/api/content'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { BLOCK_PRESETS } from '@/shared/lib/style'
import { stubTextLayout } from '@/shared/test/layout'

const gorshkov = courseById('gorshkov')!

describe('A course', () => {
  it('lists its own lessons in order under one way in, its first', async () => {
    await renderApp('/courses/gorshkov')
    expect(
      await screen.findByRole('heading', { level: 1, name: gorshkov.title.en }),
    ).toBeInTheDocument()
    const region = screen.getByRole('region', { name: 'Lessons' })
    const hrefs = within(region)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(gorshkov.lessons.map((lesson) => `/courses/gorshkov/${lesson.id}`))
    expect(screen.getByRole('link', { name: /^Start course/ })).toHaveAttribute('href', hrefs[0])
    const total = gorshkov.lessons.length + gorshkov.songs.length
    expect(screen.getByText(`0 of ${total} learned`)).toBeInTheDocument()
    const facts = screen.getByRole('list', { name: 'About this course' })
    expect(facts).toHaveTextContent(`Advanced`)
    expect(facts).toHaveTextContent(`${gorshkov.weeks} weeks`)
    expect(facts).toHaveTextContent(`${gorshkov.lessons.length} lessons`)
    expect(facts).toHaveTextContent(`${gorshkov.songs.length} songs`)
  })

  it('ends on its guided songs', async () => {
    await renderApp('/courses/gorshkov')
    const songs = await screen.findByRole('region', { name: 'Guided songs' })
    expect(
      within(songs)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(gorshkov.songs.map((id) => `/songs/${id}`))
  })

  it('continues with the first lesson not learned, then its songs, then offers a review', async () => {
    const { progressStore } = await renderApp('/courses/gorshkov')
    await screen.findByRole('heading', { level: 1 })
    const [first, second] = gorshkov.lessons
    act(() =>
      progressStore.setState({ learned: { [`course:gorshkov/${first?.id}`]: '2026-10-01' } }),
    )
    expect(screen.getByRole('link', { name: /^Continue/ })).toHaveAttribute(
      'href',
      `/courses/gorshkov/${second?.id}`,
    )
    const [row, secondRow] = within(screen.getByRole('region', { name: 'Lessons' })).getAllByRole(
      'link',
    )
    expect(row).not.toHaveAttribute('aria-current')
    expect(row).toHaveAccessibleName(/^Lesson 1:.*, learned$/)
    expect(secondRow).not.toHaveAccessibleName(/learned/)
    act(() =>
      progressStore.setState({
        learned: Object.fromEntries(
          gorshkov.lessons.map((lesson) => [`course:gorshkov/${lesson.id}`, '2026-10-01']),
        ),
      }),
    )
    expect(screen.getByRole('link', { name: /^Continue/ })).toHaveAttribute(
      'href',
      `/songs/${gorshkov.songs[0]}`,
    )
    act(() =>
      progressStore.setState({
        learned: Object.fromEntries([
          ...gorshkov.lessons.map((lesson) => [`course:gorshkov/${lesson.id}`, '2026-10-01']),
          ...gorshkov.songs.map((id) => [`piece:${id}`, '2026-10-01']),
        ]),
      }),
    )
    expect(screen.getByRole('link', { name: /^Review/ })).toHaveAttribute(
      'href',
      `/courses/gorshkov/${first?.id}`,
    )
    expect(screen.getByText('Course complete')).toBeInTheDocument()
  })

  it('rings a lesson as its sections are read, the one Continue leads to ringed in honey alone', async () => {
    const { progressStore } = await renderApp('/courses/gorshkov')
    await screen.findByRole('heading', { level: 1 })
    const [first, , third] = gorshkov.lessons
    const sections = third?.sections.length ?? 0
    act(() =>
      progressStore.setState({
        read: {
          [`course:gorshkov/${first?.id}`]: [0],
          [`course:gorshkov/${third?.id}`]: [0],
        },
      }),
    )
    const rows = within(screen.getByRole('region', { name: 'Lessons' })).getAllByRole('link')
    expect(rows[2]).toHaveAccessibleName(new RegExp(`, ${Math.round(100 / sections)}% read$`))
    // The first is where Continue leads: its honey ring says so.
    expect(rows[0]).toHaveAttribute('aria-current', 'step')
  })

  it('goes back to the Courses when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/courses/gorshkov')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.location.search).toMatchObject({ view: 'courses' })
  })

  it('is not found for a course there is not, nor a lesson it does not have', async () => {
    await renderApp('/courses/nothing')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/courses/seven-types', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: courseById('seven-types')?.title.ru })
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('a course’s About (R29 B9)', () => {
  afterEach(() => keepContent([]))

  it('an editor’s Edit adds a block with /', async () => {
    stubTextLayout()
    const user = userEvent.setup()
    const owner = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }
    const auth = createFakeAuth({ accounts: [{ ...owner, role: 'editor' }] })
    await auth.signIn(owner.email, owner.password)
    const content = createFakeContentEditing({
      items: [{ kind: 'course', id: gorshkov.id, body: courseRecord(gorshkov), meta: {} }],
    })
    await renderApp('/courses/gorshkov', { auth, contentEditing: content })
    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    const doc = await screen.findByRole('textbox', { name: 'About' })
    const editor = (doc as HTMLElement & { editor: Editor }).editor
    act(() => void editor.commands.focus('end'))
    await waitFor(() => expect(editor.view.dom).toHaveFocus())
    await user.keyboard('/rule')
    const menu = await screen.findByRole('listbox', { name: 'Insert' })
    expect(within(menu).getByRole('option', { name: /Rule/ })).toBeInTheDocument()
    await user.keyboard('{Enter}')
    await user.keyboard('Practise slowly')
    await waitFor(
      async () => {
        const draft = await content.draft('course', gorshkov.id)
        const body = draft.ok ? (draft.value?.body as CourseRecord | undefined) : undefined
        expect(body?.about).toEqual([
          {
            heading: { en: '', ru: '' },
            blocks: [
              { kind: 'note', rule: { en: 'Practise slowly', ru: '' }, text: { en: '', ru: '' } },
            ],
          },
        ])
      },
      { timeout: 3000 },
    )
  })

  it('styles a block from its ⋯ › Style, in a sheet with the style editor', async () => {
    stubTextLayout()
    const user = userEvent.setup()
    const owner = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }
    const auth = createFakeAuth({ accounts: [{ ...owner, role: 'editor' }] })
    await auth.signIn(owner.email, owner.password)
    const about = [
      { heading: { en: '', ru: '' }, blocks: [{ kind: 'text', text: { en: 'Hi', ru: 'Привет' } }] },
    ]
    const content = createFakeContentEditing({
      items: [
        { kind: 'course', id: gorshkov.id, body: { ...courseRecord(gorshkov), about }, meta: {} },
      ],
    })
    await renderApp(`/courses/${gorshkov.id}/edit`, { auth, contentEditing: content })
    const doc = await screen.findByRole('textbox', { name: 'About' })
    const editor = (doc as HTMLElement & { editor: Editor }).editor
    expect(doc).toHaveTextContent('Hi')
    act(() => void editor.commands.focus('start'))
    await waitFor(() => expect(editor.view.dom).toHaveFocus())
    await user.click(await screen.findByRole('button', { name: 'More: Text' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Style' }))
    const sheet = await screen.findByRole('dialog', { name: 'Style: Text' })
    await user.click(within(sheet).getByRole('button', { name: 'Night' }))
    await waitFor(
      async () => {
        const draft = await content.draft('course', gorshkov.id)
        const body = draft.ok ? (draft.value?.body as CourseRecord | undefined) : undefined
        expect(body?.about?.[0]?.blocks[0]).toEqual({
          ...about[0]?.blocks[0],
          style: BLOCK_PRESETS.night,
        })
      },
      { timeout: 3000 },
    )
    expect(doc.querySelector('p[data-block-style]')).toHaveTextContent('Hi')
  })

  it('a learner sees the styled blocks', async () => {
    keepContent([
      {
        kind: 'course',
        id: gorshkov.id,
        version: 'v2',
        body: {
          ...courseRecord(gorshkov),
          about: [
            {
              heading: { en: 'Why this course', ru: 'Зачем этот курс' },
              style: BLOCK_PRESETS.night,
              blocks: [
                {
                  kind: 'text',
                  text: { en: 'To play from the page.', ru: 'Чтобы играть с листа.' },
                  style: BLOCK_PRESETS.soft,
                },
              ],
            },
          ],
        },
      },
    ])
    await renderApp('/courses/gorshkov')
    const about = await screen.findByRole('region', { name: 'About' })
    const heading = within(about).getByRole('heading', { level: 2, name: 'Why this course' })
    const words = within(about).getByText('To play from the page.')
    const styled = (element: HTMLElement) => element.closest<HTMLElement>('[data-block-style]')
    expect(styled(heading)?.style.getPropertyValue('--block-surface')).toBe('#1d2130')
    expect(styled(words)?.style.getPropertyValue('--block-radius')).toBe('var(--block-radius-4)')
    expect(styled(words)?.style.getPropertyValue('--block-surface')).toBe('var(--paint-sky)')
  })

  it('shows nothing where it has none', async () => {
    await renderApp('/courses/gorshkov')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('region', { name: 'About' })).not.toBeInTheDocument()
  })
})
