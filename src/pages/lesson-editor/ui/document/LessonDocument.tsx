import { Placeholder } from '@tiptap/extensions'
import { EditorContent, ReactNodeViewRenderer, useEditor, type JSONContent } from '@tiptap/react'
import { useRef, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import { i18n, type Locale } from '@/shared/i18n'
import { useMediaQuery } from '@/shared/lib'
import { Pinned } from '@/shared/ui'
import { docExtensions } from '../../model/doc-schema'
import { DOC, docToLesson, lessonToDoc, type DocNode } from '../../model/lesson-doc'
import { BlockHandle } from './BlockHandle'
import { DocToolbar } from './DocToolbar'
import { DocLocale } from './doc-locale'
import { ExampleView } from './ExampleView'
import { SlashMenu, type SlashKeys } from './SlashMenu'
import './document.css'

type Words = ReturnType<typeof i18n.getFixedT<'learn'>>

/** What an empty line says, in the language written: what its words are for. */
function placeholderOf(type: string, parent: string, words: Words): string {
  if (parent === DOC.step) return words('edit.doc.placeholder.step')
  switch (type) {
    case DOC.title:
      return words('edit.doc.placeholder.title')
    case DOC.summary:
      return words('edit.doc.placeholder.summary')
    case DOC.heading:
      return words('edit.doc.placeholder.heading')
    case DOC.noteRule:
      return words('edit.doc.placeholder.noteRule')
    case DOC.noteText:
      return words('edit.doc.placeholder.noteText')
    case DOC.takeaway:
      return words('edit.doc.placeholder.takeaway')
    default:
      return words('edit.doc.placeholder.paragraph')
  }
}

/**
 * The lesson as one document, written in one language where it reads (round 21, Obsidian's Live
 * Preview): its title and summary, each section's heading, its words, steps and notes typed in place,
 * its examples drawn as the lesson shows them, each with its fields; a toolbar, a `/` menu, blocks
 * dragged by their handle or moved with Alt+↑/↓; TipTap's undo. Each change goes to `onChange` as
 * the lesson it writes, the other language as it was.
 */
export function LessonDocument({
  initial,
  locale,
  onChange,
}: {
  initial: Lesson
  /** The language written: the document opens anew on another. */
  locale: Locale
  onChange: (lesson: Lesson) => void
}) {
  const { t } = useTranslation('learn')
  const words = i18n.getFixedT(locale, 'learn')
  const base = useRef(initial)
  const slashKeys = useRef<SlashKeys | null>(null)
  const frame = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 48rem)')
  const editor = useEditor({
    extensions: docExtensions({
      exampleView: ReactNodeViewRenderer(ExampleView),
      more: [
        Placeholder.configure({
          includeChildren: true,
          showOnlyCurrent: false,
          placeholder: ({ editor: each, node, pos }) =>
            placeholderOf(node.type.name, each.state.doc.resolve(pos).parent.type.name, words),
        }),
      ],
    }),
    content: lessonToDoc(initial, locale) as JSONContent,
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: { class: 'lesson-doc', 'aria-label': t('edit.doc.label'), lang: locale },
      handleKeyDown: (_, event) => slashKeys.current?.(event) ?? false,
    },
    onUpdate: ({ editor: each }) => {
      const next = docToLesson(each.getJSON() as DocNode, base.current, locale)
      base.current = next
      onChange(next)
    },
  })
  const toolbar = <DocToolbar editor={editor} locale={locale} />
  return (
    <DocLocale value={locale}>
      {wide ? (
        <Pinned className="pb-2">{toolbar}</Pinned>
      ) : (
        // On a phone, over its keyboard while it is up, else over the tab bar.
        <div className="fixed inset-x-0 bottom-[max(var(--nav-bar),var(--kb-inset,0px))] z-30 border-t border-border bg-background px-2 pb-safe">
          {toolbar}
        </div>
      )}
      <div
        ref={frame}
        className="relative pb-24 md:pb-8 md:pl-12"
        style={{ '--takeaway-label': JSON.stringify(words('edit.doc.takeaway')) } as CSSProperties}
      >
        <EditorContent editor={editor} />
        <BlockHandle editor={editor} frame={frame} />
        <SlashMenu editor={editor} locale={locale} frame={frame} keysRef={slashKeys} />
      </div>
    </DocLocale>
  )
}
