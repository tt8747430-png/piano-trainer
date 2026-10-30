import type { Node } from '@tiptap/pm/model'
import type { TFunction } from 'i18next'
import type { LessonBlock } from '@/entities/lesson'
import { DOC } from '../../model/lesson-doc'
import type { Insertable } from './commands'

/** What a block is called in the editor: a note with a name is a rule. */
export const blockName = (block: LessonBlock) =>
  block.kind === 'note' && block.rule ? ('rule' as const) : block.kind

/** What a block of the document is called: an example by its kind, the rest by what it is. */
export function nodeName(node: Node, t: TFunction<'learn'>): string {
  const block = node.attrs['block'] as LessonBlock | null | undefined
  if (node.type.name === DOC.example && block) return t(`edit.blocks.${blockName(block)}`)
  if (node.type.name === DOC.note && node.childCount === 2) return t('edit.blocks.rule')
  switch (node.type.name) {
    case DOC.title:
    case DOC.summary:
    case DOC.heading:
    case DOC.paragraph:
    case DOC.steps:
    case DOC.note:
    case DOC.takeaway:
      return t(`edit.doc.kinds.${node.type.name}`)
    default:
      return t('edit.doc.block')
  }
}

/** What the Insert and slash menus call a kind. */
export const insertableName = (kind: Insertable, t: TFunction<'learn'>): string =>
  kind === 'section'
    ? t('edit.doc.section')
    : kind === 'takeaway'
      ? t('edit.doc.takeaway')
      : t(`edit.blocks.${kind}`)
