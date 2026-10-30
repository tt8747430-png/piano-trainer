import { Extension } from '@tiptap/core'
import { Placeholder } from '@tiptap/extensions'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { EditorContent, ReactNodeViewRenderer, useEditor, type JSONContent } from '@tiptap/react'
import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import { i18n, type Locale } from '@/shared/i18n'
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

/** A widget after the title and the summary, holding `host`: the properties, never typed into. */
const propertiesAt = (host: HTMLElement) =>
  Extension.create({
    name: 'lessonProperties',
    addProseMirrorPlugins: () => [
      new Plugin({
        props: {
          decorations: ({ doc }) => {
            const [title, summary] = [doc.maybeChild(0), doc.maybeChild(1)]
            if (!title || !summary) return null
            return DecorationSet.create(doc, [
              Decoration.widget(title.nodeSize + summary.nodeSize, host, {
                key: 'properties',
                side: -1,
                ignoreSelection: true,
                stopEvent: () => true,
              }),
            ])
          },
        },
      }),
    ],
  })

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
  properties,
}: {
  initial: Lesson
  /** The language written: the document opens anew on another. */
  locale: Locale
  onChange: (lesson: Lesson) => void
  /** The lesson's properties (Read first), under its title and summary as a page's are. */
  properties?: ReactNode
}) {
  // Where the properties stand in the document: a widget after the summary, outside what is typed.
  const [host] = useState(() => {
    const element = document.createElement('div')
    element.contentEditable = 'false'
    element.className = 'lesson-doc-properties'
    return element
  })
  const { t } = useTranslation('learn')
  const words = i18n.getFixedT(locale, 'learn')
  const base = useRef(initial)
  const slashKeys = useRef<SlashKeys | null>(null)
  const frame = useRef<HTMLDivElement>(null)
  const editor = useEditor({
    extensions: docExtensions({
      exampleView: ReactNodeViewRenderer(ExampleView),
      more: [
        ...(properties ? [propertiesAt(host)] : []),
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
      {/* The toolbar floats as the score editor's palette does (round 24): one raised capsule at
          the foot, over the phone's keyboard while it is up, else over the tab bar. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(max(var(--nav-bar),var(--kb-inset,0px))+0.5rem)] z-30 flex justify-center px-2 landscape-phone:left-rail lg:bottom-6 lg:left-sidebar lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed">
        <div className="pointer-events-auto max-w-full rounded-2xl border border-border bg-raised p-1 elevation-2">
          {toolbar}
        </div>
      </div>
      <div
        ref={frame}
        className="relative pr-10 pb-28 md:pr-0 md:pl-12"
        style={{ '--takeaway-label': JSON.stringify(words('edit.doc.takeaway')) } as CSSProperties}
      >
        <EditorContent editor={editor} />
        {properties ? createPortal(properties, host) : null}
        <BlockHandle editor={editor} frame={frame} />
        <SlashMenu editor={editor} locale={locale} frame={frame} keysRef={slashKeys} />
      </div>
    </DocLocale>
  )
}
