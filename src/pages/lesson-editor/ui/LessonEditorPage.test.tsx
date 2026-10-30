import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Editor } from '@tiptap/core'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES } from '@/entities/course'
import { LESSONS, lessonExamples, lessonPlace, type Lesson } from '@/entities/lesson'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { stubTextLayout } from '@/shared/test/layout'

const LESSON = LESSONS.find((lesson) => lessonPlace(lesson.id))!
const COURSE = COURSES.find((course) => course.lessons.length > 0)!
const COURSE_LESSON = COURSE.lessons[0]!
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

const editing = () =>
  createFakeContentEditing({
    items: [
      { kind: 'lesson', id: LESSON.id, body: LESSON, meta: {} },
      { kind: 'lesson', id: `${COURSE.id}/${COURSE_LESSON.id}`, body: COURSE_LESSON, meta: {} },
    ],
  })

/** The lesson's document, and the editor behind it. */
async function lessonDoc() {
  const doc = await screen.findByRole('textbox', { name: 'The lesson' })
  return { doc, editor: (doc as HTMLElement & { editor: Editor }).editor }
}

/** The document's line of this type and these words. */
const line = (doc: HTMLElement, selector: string) => doc.querySelector<HTMLElement>(selector)!

/** Puts the caret at the end of `element`'s words. */
async function caretAtEnd(editor: Editor, element: HTMLElement) {
  const at = editor.view.posAtDOM(element, element.childNodes.length)
  editor.commands.setTextSelection(at)
  editor.commands.focus()
  await waitFor(() => expect(editor.view.dom).toHaveFocus())
}

/** Publishes the draft once it is saved: the bar's Publish, then the dialog's. */
async function publish(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByText('Draft · saved', {}, { timeout: 3000 })
  await user.click(screen.getByRole('button', { name: 'Publish' }))
  await user.click(
    within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
  )
}

const saved = async (content: ReturnType<typeof editing>, id = LESSON.id) => {
  const draft = await content.draft('lesson', id)
  return draft.ok ? (draft.value?.body as Lesson | undefined) : undefined
}

describe('the lesson editor (ADR 0116, round 21)', () => {
  beforeEach(stubTextLayout)

  it('is in an editor’s lesson bar, never a learner’s', async () => {
    await renderApp(`/lessons/${LESSON.id}`, { auth: await signedInAs('editor') })
    expect(await screen.findByRole('link', { name: 'Edit the lesson' })).toHaveAttribute(
      'href',
      `/lessons/${LESSON.id}/edit`,
    )
  })

  it('is not in a learner’s', async () => {
    await renderApp(`/lessons/${LESSON.id}`, { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'Edit the lesson' })).not.toBeInTheDocument()
  })

  it('opens the lesson as one document, its status and Publish in the bar', async () => {
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    const { doc } = await lessonDoc()
    expect(line(doc, 'p[data-lesson-title]')).toHaveTextContent(LESSON.title.en)
    expect(doc.querySelectorAll('h2')).toHaveLength(LESSON.sections.length)
    expect(screen.getByText('Published', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled()
    expect(screen.queryByRole('radio', { name: 'Preview' })).not.toBeInTheDocument()
  })

  it('saves the title typed to the draft, then publishes the lesson with it', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const { doc, editor } = await lessonDoc()
    await caretAtEnd(editor, line(doc, 'p[data-lesson-title]'))
    await user.keyboard(' again')
    await publish(user)
    expect(
      await screen.findByText('Published. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(content.body('lesson', LESSON.id)).toMatchObject({
      id: LESSON.id,
      title: { en: `${LESSON.title.en} again`, ru: LESSON.title.ru },
      sections: LESSON.sections,
    })
  })

  it('writes Russian in the same document once the bar says so, the English left as it was', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await lessonDoc()
    await user.click(screen.getByRole('radio', { name: 'RU · Русский' }))
    const { doc, editor } = await lessonDoc()
    expect(line(doc, 'p[data-lesson-title]')).toHaveTextContent(LESSON.title.ru)
    await caretAtEnd(editor, line(doc, 'h2'))
    await user.keyboard('!')
    await waitFor(
      async () =>
        expect((await saved(content))?.sections[0]?.heading).toEqual({
          en: LESSON.sections[0]?.heading.en,
          ru: `${LESSON.sections[0]?.heading.ru}!`,
        }),
      { timeout: 3000 },
    )
  })

  it('says where words are missing, and publishes nothing until they are there', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('admin'),
      contentEditing: content,
    })
    const { doc, editor } = await lessonDoc()
    const summary = line(doc, 'p[data-lesson-summary]')
    editor.commands.setTextSelection({
      from: editor.view.posAtDOM(summary, 0),
      to: editor.view.posAtDOM(summary, summary.childNodes.length),
    })
    editor.commands.focus()
    await waitFor(() => expect(doc).toHaveFocus())
    await user.keyboard('{Backspace}')
    await waitFor(() =>
      expect(line(doc, 'p[data-lesson-summary]')).toHaveAttribute(
        'data-placeholder',
        'What it teaches, in a sentence',
      ),
    )
    await publish(user)
    expect(
      await screen.findByText(
        'Every text needs words in both languages, and every example must read. Put them right, then publish.',
      ),
    ).toBeInTheDocument()
    expect(content.body('lesson', LESSON.id)).toEqual(LESSON)
  })

  it('opens a draft kept with words missing as it was left, not as published', async () => {
    const content = editing()
    const left = { ...LESSON, summary: { en: '', ru: LESSON.summary.ru } }
    await content.saveDraft('lesson', LESSON.id, { body: left, meta: {} })
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const { doc } = await lessonDoc()
    expect(line(doc, 'p[data-lesson-summary]')).toHaveTextContent('')
    expect(screen.getByText('Draft · not published')).toBeInTheDocument()
  })

  it('edits a course’s lesson as the database keys it, by its course', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/courses/${COURSE.id}/${COURSE_LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const { doc, editor } = await lessonDoc()
    await caretAtEnd(editor, line(doc, 'p[data-lesson-title]'))
    await user.keyboard('!')
    await waitFor(
      async () =>
        expect((await saved(content, `${COURSE.id}/${COURSE_LESSON.id}`))?.title.en).toBe(
          `${COURSE_LESSON.title.en}!`,
        ),
      { timeout: 3000 },
    )
  })

  it('writes a row of chords in its block, says the symbol that does not read, and publishes it once it reads', async () => {
    const user = userEvent.setup()
    const lesson = LESSONS.find(
      (each) =>
        lessonPlace(each.id) && lessonExamples(each).some((example) => example.kind === 'chords'),
    )!
    const content = createFakeContentEditing({
      items: [{ kind: 'lesson', id: lesson.id, body: lesson, meta: {} }],
    })
    await renderApp(`/lessons/${lesson.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const chords = (await screen.findAllByRole('textbox', { name: 'Chords' }))[0]!
    await user.clear(chords)
    await user.type(chords, 'C Qx G7')
    expect(chords).toHaveAccessibleDescription('“Qx” doesn’t read')
    await publish(user)
    expect(
      await screen.findByText(
        'Every text needs words in both languages, and every example must read. Put them right, then publish.',
      ),
    ).toBeInTheDocument()
    await user.clear(chords)
    await user.type(chords, 'C Am G7')
    expect(chords).not.toHaveAccessibleDescription()
    await publish(user)
    expect(
      await screen.findByText('Published. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(JSON.stringify(content.body('lesson', lesson.id))).toContain('["C","Am","G7"]')
  })

  it('inserts a block of a kind from the toolbar after the one the caret is in', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const { doc, editor } = await lessonDoc()
    await caretAtEnd(editor, line(doc, 'h2'))
    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' })
    await user.click(within(toolbar).getByRole('button', { name: 'Insert' }))
    await user.click(await screen.findByRole('button', { name: 'Rule' }))
    await user.keyboard('Play it slowly')
    await waitFor(
      async () =>
        expect((await saved(content))?.sections[0]?.blocks[0]).toEqual({
          kind: 'note',
          rule: { en: 'Play it slowly', ru: '' },
          text: { en: '', ru: '' },
        }),
      { timeout: 3000 },
    )
  })

  it('opens the / menu at an empty line, filtered as typed, and puts the block in its place', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const { doc, editor } = await lessonDoc()
    await caretAtEnd(editor, line(doc, 'h2'))
    await user.keyboard('{Enter}/prog')
    const menu = await screen.findByRole('listbox', { name: 'Blocks' })
    expect(
      within(menu)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Progression'])
    await user.keyboard('{Enter}')
    expect(screen.queryByRole('listbox', { name: 'Blocks' })).not.toBeInTheDocument()
    await waitFor(
      async () =>
        expect((await saved(content))?.sections[0]?.blocks[0]).toMatchObject({
          kind: 'progression',
          numerals: 'I IV V I',
        }),
      { timeout: 3000 },
    )
  })

  it('moves the block the caret is in with Alt+arrows, and deletes one from its menu with Undo', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const first = LESSON.sections[0]!.blocks
    const { doc, editor } = await lessonDoc()
    const paragraph = doc.querySelector<HTMLElement>('h2 + p')!
    await caretAtEnd(editor, paragraph)
    await user.keyboard('{Alt>}{ArrowUp}{/Alt}')
    await waitFor(
      async () => {
        const blocks = (await saved(content))?.sections
        expect(blocks?.[0]?.heading.en).toBe('')
        expect(blocks?.[0]?.blocks[0]).toEqual(first[0])
      },
      { timeout: 3000 },
    )
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    await user.click(screen.getByRole('button', { name: 'Block' }))
    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    expect(await screen.findByText('Deleted: Text')).toBeVisible()
    expect(doc.querySelector('h2 + p')).not.toBe(paragraph)
    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' })
    await user.click(
      screen.getAllByRole('button', { name: 'Undo' }).find((each) => !toolbar.contains(each))!,
    )
    await waitFor(async () => expect((await saved(content))?.sections).toEqual(LESSON.sections), {
      timeout: 3000,
    })
  })

  it('tells a learner it is an editor’s, with the way back', async () => {
    await renderApp(`/lessons/${LESSON.id}/edit`, { auth: await signedInAs('learner') })
    expect(await screen.findByText('Only an editor edits a lesson.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to the lesson' })).toHaveAttribute(
      'href',
      `/lessons/${LESSON.id}`,
    )
  })
})
