import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Editor } from '@tiptap/core'
import { beforeEach, describe, expect, it } from 'vitest'
import { publishOnItsPage } from '@/shared/test/publish'
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

/** Chooses the first example of `kind`, as a tap does: its toolbar, named by it, shows. */
async function chooseExample(kind: string, name: string) {
  act(() => document.querySelector<HTMLElement>(`[data-example="${kind}"]`)!.focus())
  return within(await screen.findByRole('toolbar', { name }))
}

/** Publishes the draft once it is saved: the bar's Publish, then the dialog's. */
/** Publish, the one way: the bar's Publish opens the Publish page (R29 B6). */
const publish = publishOnItsPage

const saved = async (content: ReturnType<typeof editing>, id = LESSON.id) => {
  const draft = await content.draft('lesson', id)
  return draft.ok ? (draft.value?.body as Lesson | undefined) : undefined
}

describe('the lesson editor (ADR 0116, round 21)', () => {
  beforeEach(stubTextLayout)

  it('puts the lesson into Edit from its bar’s Read · Edit, and back, the page in place', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp(`/lessons/${LESSON.id}`, {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    await waitFor(() => expect(router.state.location.pathname).toBe(`/lessons/${LESSON.id}/edit`))
    // The lesson's own title over it, as it reads.
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(LESSON.title.en)
    await user.click(await screen.findByRole('button', { name: 'Done' }))
    await waitFor(() => expect(router.state.location.pathname).toBe(`/lessons/${LESSON.id}`))
  })

  it('is not in a learner’s', async () => {
    await renderApp(`/lessons/${LESSON.id}`, { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('opens the lesson as one document, its status and Publish in the bar', async () => {
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    const { doc } = await lessonDoc()
    expect(line(doc, 'p[data-lesson-title]')).toHaveTextContent(LESSON.title.en)
    expect(doc.querySelectorAll('h2')).toHaveLength(LESSON.sections.length)
    expect(screen.queryByText('Not published')).not.toBeInTheDocument()
    // Publish opens the lesson's Publish page (R29 B6), the rights ticked there.
    expect(screen.getByRole('link', { name: 'Publish' })).toHaveAttribute(
      'href',
      `/lessons/${LESSON.id}/publish`,
    )
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

  it('writes Russian in the same document once the draft’s menu says so, the English left as it was', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await lessonDoc()
    await user.click(screen.getByRole('button', { name: 'Publishing' }))
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Русский' }))
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
    expect(screen.getByText('Not published')).toBeInTheDocument()
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
    // As it reads until it is worked on: a tap shows its toolbar, its Edit its fields in place.
    await screen.findByRole('textbox', { name: 'The lesson' })
    expect(screen.queryByRole('textbox', { name: 'Chords' })).not.toBeInTheDocument()
    await user.click(
      (await chooseExample('chords', 'Chords')).getByRole('button', { name: 'Edit' }),
    )
    const fields = await screen.findByRole('group', { name: 'Chords: its settings' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const chords = within(fields).getByRole('textbox', { name: 'Chords' })
    await user.clear(chords)
    await user.type(chords, 'C Qx G7')
    expect(chords).toHaveAccessibleDescription('“Qx” doesn’t read')
    const again = chords
    await user.clear(again)
    await user.type(again, 'C Am G7')
    expect(again).not.toHaveAccessibleDescription()
    await publish(user)
    expect(
      await screen.findByText('Published. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(JSON.stringify(content.body('lesson', lesson.id))).toContain('["C","Am","G7"]')
  })

  it('writes a voicing’s keys in its block’s fields, and publishes them', async () => {
    const user = userEvent.setup()
    const lesson = LESSONS.find(
      (each) =>
        lessonPlace(each.id) &&
        each.sections.some((section) => section.blocks.some((block) => block.kind === 'voicings')),
    )!
    const content = createFakeContentEditing({
      items: [{ kind: 'lesson', id: lesson.id, body: lesson, meta: {} }],
    })
    await renderApp(`/lessons/${lesson.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await screen.findByRole('textbox', { name: 'The lesson' })
    await user.click(
      (await chooseExample('voicings', 'Voicings')).getByRole('button', { name: 'Edit' }),
    )
    const keys = await screen.findByRole('textbox', {
      name: 'Voicing 1: Keys: left hand | right hand',
    })
    await user.clear(keys)
    await user.type(keys, 'C3 G3 | E4 B4')
    await user.keyboard('{Escape}')
    await publish(user)
    expect(
      await screen.findByText('Published. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(JSON.stringify(content.body('lesson', lesson.id))).toContain('C3 G3 | E4 B4')
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
    await user.click(await screen.findByRole('menuitem', { name: 'Rule' }))
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
    const menu = await screen.findByRole('listbox', { name: 'Insert' })
    expect(
      within(menu)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Progression'])
    await user.keyboard('{Enter}')
    expect(screen.queryByRole('listbox', { name: 'Insert' })).not.toBeInTheDocument()
    await waitFor(
      async () =>
        expect((await saved(content))?.sections[0]?.blocks[0]).toMatchObject({
          kind: 'progression',
          numerals: 'I IV V I',
        }),
      { timeout: 3000 },
    )
  })

  it('opens the / menu after words too, keeping them, and puts the block after their line', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const { doc, editor } = await lessonDoc()
    await caretAtEnd(editor, line(doc, 'h2'))
    await user.keyboard('{Enter}Play these /prog')
    const menu = await screen.findByRole('listbox', { name: 'Insert' })
    expect(within(menu).getByRole('option', { name: /Progression/ })).toBeInTheDocument()
    await user.keyboard('{Enter}')
    await waitFor(
      async () =>
        expect((await saved(content))?.sections[0]?.blocks.slice(0, 2)).toMatchObject([
          { kind: 'text', text: { en: 'Play these' } },
          { kind: 'progression' },
        ]),
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
    await user.click(screen.getByRole('button', { name: 'More: Text' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }))
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

  it('turns a block of words into a section’s heading from its gutter’s menu (round 28)', async () => {
    const user = userEvent.setup()
    const content = editing()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const { doc, editor } = await lessonDoc()
    const paragraph = doc.querySelector<HTMLElement>('h2 + p')!
    const words = paragraph.textContent
    await caretAtEnd(editor, paragraph)
    await user.click(screen.getByRole('button', { name: 'More: Text' }))
    expect(await screen.findByRole('menuitemcheckbox', { name: 'Text' })).toBeChecked()
    expect(screen.queryByRole('menuitem', { name: /Move/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Section heading' }))
    await waitFor(async () => expect((await saved(content))?.sections[1]?.heading.en).toBe(words), {
      timeout: 3000,
    })
  })

  it('hints how to insert on the empty line the caret is in, and on no other (round 28)', async () => {
    const user = userEvent.setup()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    const { doc, editor } = await lessonDoc()
    await caretAtEnd(editor, line(doc, 'h2'))
    await user.keyboard('{Enter}')
    const hint = 'Type / to insert music, a note and more'
    await waitFor(() =>
      expect(doc.querySelectorAll(`p[data-placeholder="${hint}"]`)).toHaveLength(1),
    )
    await caretAtEnd(editor, line(doc, 'h2'))
    await waitFor(() => expect(doc.querySelector(`p[data-placeholder="${hint}"]`)).toBeNull())
  })

  it('adds a line under a block from its gutter’s +, the Insert menu open on it (round 28)', async () => {
    const user = userEvent.setup()
    await renderApp(`/lessons/${LESSON.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: editing(),
    })
    const { doc, editor } = await lessonDoc()
    await caretAtEnd(editor, line(doc, 'h2'))
    await user.click(screen.getByRole('button', { name: 'Add below' }))
    const menu = await screen.findByRole('listbox', { name: 'Insert' })
    expect(within(menu).getByRole('option', { name: /Progression/ })).toBeInTheDocument()
  })

  it('duplicates and deletes an example from its toolbar, said with Undo (round 28)', async () => {
    const user = userEvent.setup()
    const lesson = LESSONS.find(
      (each) =>
        lessonPlace(each.id) && lessonExamples(each).some((example) => example.kind === 'chords'),
    )!
    await renderApp(`/lessons/${lesson.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: createFakeContentEditing({
        items: [{ kind: 'lesson', id: lesson.id, body: lesson, meta: {} }],
      }),
    })
    await lessonDoc()
    const count = () => document.querySelectorAll('[data-example="chords"]').length
    const before = count()
    await user.click(
      (await chooseExample('chords', 'Chords')).getByRole('button', { name: 'Duplicate' }),
    )
    await waitFor(() => expect(count()).toBe(before + 1))
    await user.click(
      (await chooseExample('chords', 'Chords')).getByRole('button', { name: 'Delete' }),
    )
    expect(await screen.findByText('Deleted: Chords')).toBeVisible()
    await waitFor(() => expect(count()).toBe(before))
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

describe('an example of notes on its own score (round 27)', () => {
  it('opens from the example’s Edit music, the draft saved, at its place among the examples of notes', async () => {
    const user = userEvent.setup()
    const lesson = LESSONS.find((each) =>
      each.sections.some((section) => section.blocks.some((block) => block.kind === 'notes')),
    )!
    const content = createFakeContentEditing({
      items: [{ kind: 'lesson', id: lesson.id, body: lesson, meta: {} }],
    })
    const { router } = await renderApp(`/lessons/${lesson.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await lessonDoc()
    await user.click(
      (await chooseExample('notes', 'Notes')).getByRole('button', { name: 'Edit music' }),
    )
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/lessons/${lesson.id}/example`),
    )
    // The first example of notes: its place the URL's default, left out.
    expect(router.state.location.search).not.toHaveProperty('n')
  }, 30_000)
})
