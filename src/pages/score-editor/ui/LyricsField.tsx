import { ChevronDown, ChevronUp } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { sungAt, sungNear, syllableAt, verseCount } from '@/features/score-editor'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useFieldText } from '../model/use-field-text'
import { SheetField } from './SheetField'

/** A mark typed at the end of a syllable saves it with the mark and moves on: `-` a word going on, `_` a melisma. */
const MARKS = new Set(['-', '_'])

/** A step to another verse beside the field: a tap leaves the cursor in it. */
function VerseStep({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      disabled={disabled}
      onPointerDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="rounded-xl"
    >
      {children}
    </Button>
  )
}

/**
 * The words under the tune, typed one syllable at a time under the note they are sung on (ADR 0093,
 * 0096, Flat's Lyrics): the field stands on the caret's note's syllable in its verse, on the staff the
 * words are on, and writes what it holds there as it moves on or is left. Space, → or Enter go to the
 * tune's next note, ← back; `-` or `_` typed save with the mark and go on; ↓ the next verse (a new
 * one past the last), ↑ the one before, as its steps beside it do; Escape out.
 */
export function LyricsField({ anchor, verse }: { anchor: HTMLElement | null; verse: number }) {
  const { t } = useTranslation('editor')
  const {
    actions: { dispatch },
    view,
  } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const shown = syllableAt(draft, caret, verse)
  const count = verseCount(draft)
  const at = `${caret} ${verse}`
  const { text, setText } = useFieldText(shown, at)
  const save = (typed = text) => {
    if (sungAt(draft, caret) && typed.trim() !== shown)
      dispatch({ type: 'syllable', verse, text: typed })
  }
  const go = (direction: -1 | 1, typed = text) => {
    save(typed)
    const next = sungNear(draft, caret, direction)
    if (next !== null) dispatch({ type: 'place', tick: next, layer })
  }
  const toVerse = (next: number) => {
    save()
    view.openField({ kind: 'lyrics', verse: Math.max(0, Math.min(next, count)) })
  }
  const onKey = ({ key }: KeyboardEvent<HTMLInputElement>): boolean => {
    if (key === ' ') go(1)
    else if (key === 'ArrowDown') toVerse(verse + 1)
    else if (key === 'ArrowUp') toVerse(verse - 1)
    else if (MARKS.has(key) && text.trim() !== '' && !text.endsWith('_')) go(1, text + key)
    else return false
    return true
  }
  return (
    <SheetField
      kind="lyrics"
      anchor={anchor}
      label={t('lyrics.field')}
      text={text}
      onText={setText}
      at={at}
      onGo={go}
      onKey={onKey}
      onClose={() => {
        save()
        view.openField(null)
      }}
      beside={
        <>
          <VerseStep
            label={t('lyrics.previousVerse')}
            disabled={verse === 0}
            onClick={() => toVerse(verse - 1)}
          >
            <ChevronUp aria-hidden />
          </VerseStep>
          <VerseStep
            label={t('lyrics.nextVerse')}
            disabled={verse >= count}
            onClick={() => toVerse(verse + 1)}
          >
            <ChevronDown aria-hidden />
          </VerseStep>
        </>
      }
    />
  )
}
