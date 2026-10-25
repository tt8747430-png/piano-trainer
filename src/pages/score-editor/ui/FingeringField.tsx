import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { fingeredAt, isHandLayer, notesOf, startNear } from '@/features/score-editor'
import { FINGERS, type Finger } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useFieldText } from '../model/use-field-text'
import { SheetField } from './SheetField'

/** What the field keeps of what is typed: the fingers, 1 to 5, and the spaces between them. */
const typedFingers = (text: string) => text.replace(/[^1-5 ]/g, '')

/** The fingers typed, bottom up: each digit one finger, the spaces between them optional. */
const fingersOf = (text: string): Finger[] =>
  [...text].flatMap((typed) => FINGERS.filter((finger) => String(finger) === typed))

/**
 * The fingering field (ADR 0096, Dorico's): the fingers of the notes at the caret, typed where they
 * print (over an upper staff's notes, under the lower staff's), a chord's bottom up (`1 3 5`, or `135`: each digit one finger), or the chord's one note chosen
 * alone; digits 1 to 5 and spaces only, a phone's digits keyboard up. What it holds is written as it
 * goes on or is left: Enter or → to the staff's next note, ← back, Escape out; emptied, the fingers
 * come off; more fingers than notes mark it and write nothing.
 */
export function FingeringField({ anchor }: { anchor: HTMLElement | null }) {
  const { t } = useTranslation('editor')
  const {
    store,
    actions: { dispatch },
    view,
  } = useScoreEditorContext()
  const notes = useEditorState(useShallow(fingeredAt))
  const at = useEditorState((state) => `${state.layer} ${state.caret} ${state.chordNote}`)
  // The lower staff's fingers print under its notes, as a piano score prints them: typed there.
  const under = useEditorState((state) => state.layer === 'lh')
  const shown = notes.flatMap((n) => (n.finger === undefined ? [] : [n.finger])).join(' ')
  const [text, setText] = useFieldText(shown, at)
  // The place where more fingers were typed than it has notes: marked there until it changes.
  const [wrongAt, setWrongAt] = useState<string | null>(null)

  /** The fingers typed written on the notes; false where there are more than notes. */
  const write = (): boolean => {
    const fingers = fingersOf(text)
    if (fingers.join(' ') === shown) return true
    if (fingers.length > notes.length) return false
    dispatch({ type: 'fingers', fingers })
    return true
  }
  const go = (direction: -1 | 1) => {
    if (!write()) {
      setWrongAt(at)
      return
    }
    const { draft, layer, caret } = store.getState()
    if (!isHandLayer(layer)) return
    const next = startNear(notesOf(draft, layer), caret, direction)
    if (next !== null) dispatch({ type: 'place', tick: next, layer })
  }
  return (
    <SheetField
      kind="fingering"
      anchor={anchor}
      under={under}
      label={t('fingering')}
      text={text}
      onText={(next) => {
        setText(typedFingers(next))
        setWrongAt(null)
      }}
      at={at}
      error={wrongAt === at ? t('tooManyFingers') : undefined}
      onGo={go}
      onClose={() => {
        write()
        view.openField(null)
      }}
    />
  )
}
