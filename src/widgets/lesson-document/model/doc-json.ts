import type { JSONContent } from '@tiptap/core'
import type { DocNode } from './lesson-doc'

/** A document's node as TipTap takes it: the same node, its lists its own to change. */
export function toEditorJson(node: DocNode): JSONContent {
  const { content, marks, ...rest } = node
  return {
    ...rest,
    ...(content ? { content: content.map(toEditorJson) } : {}),
    ...(marks ? { marks: [...marks] } : {}),
  }
}

/** The editor's JSON as a document's node: what TipTap writes, read as it is. */
export function fromEditorJson(json: JSONContent): DocNode {
  const { type = '', attrs, content, marks, text } = json
  return {
    type,
    ...(attrs ? { attrs } : {}),
    ...(content ? { content: content.map(fromEditorJson) } : {}),
    ...(marks ? { marks } : {}),
    ...(text === undefined ? {} : { text }),
  }
}
