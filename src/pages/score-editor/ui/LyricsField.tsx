import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { sungAt, sungNear, syllableAt, verseCount } from '@/features/score-editor'
import { cn } from '@/shared/lib'
import { ToolKey } from '@/shared/ui'
import { InputGroup, InputGroupInput } from '@/shared/ui/primitives/input-group'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The keys that save the syllable and move to the tune's next note, as Flat's Lyrics field does. */
const ON = new Set([' ', 'ArrowRight', 'Enter'])
/** A mark typed at the end of a syllable saves it with the mark and moves on: `-` a word going on, `_` a melisma. */
const MARKS = new Set(['-', '_'])

/**
 * The words under the tune, written one syllable at a time (ADR 0093, Flat's Lyrics): the field
 * shows what the tune's note at the caret sings in the verse, and saves it as the caret leaves.
 * Space, → or Enter save and go to the next note of the tune, ← back; `-` or `_` typed save with the
 * mark and go on; ↓ the next verse (a new one past the last), ↑ the one before; Escape closes.
 * Greyed where the caret stands on no note of the tune (a rest, an empty place).
 */
export function LyricsField({ verse }: { verse: number }) {
  const { t } = useTranslation('editor')
  const { actions, view } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const note = sungAt(draft, caret)
  const shown = syllableAt(draft, caret, verse)
  const count = verseCount(draft)
  const [text, setText] = useState(shown)
  const field = useRef<HTMLInputElement | null>(null)
  useEffect(() => field.current?.focus(), [])
  const save = (typed = text) => {
    if (note && typed.trim() !== shown) actions.dispatch({ type: 'syllable', verse, text: typed })
  }
  const go = (direction: -1 | 1, typed = text) => {
    save(typed)
    const next = sungNear(draft, caret, direction)
    if (next !== null) actions.dispatch({ type: 'place', tick: next, layer })
  }
  const toVerse = (next: number) => {
    save()
    view.openLyrics(Math.max(0, next))
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event
    if (ON.has(key)) go(1)
    else if (key === 'ArrowLeft') go(-1)
    else if (key === 'ArrowDown') toVerse(verse + 1)
    else if (key === 'ArrowUp') toVerse(verse - 1)
    else if (key === 'Escape') {
      save()
      view.openLyrics(null)
    } else if (MARKS.has(key) && text.trim() !== '' && !text.endsWith('_')) go(1, text + key)
    else return
    event.preventDefault()
  }
  return (
    <div className="flex items-center gap-1">
      <span className="min-w-16 text-sm text-muted-foreground">
        {t('lyrics.verse', { n: verse + 1 })}
      </span>
      <InputGroup className={cn('h-10 flex-1 rounded-xl bg-card')}>
        <InputGroupInput
          ref={field}
          aria-label={t('lyrics.field')}
          value={text}
          disabled={note === null}
          placeholder={note === null ? t('lyrics.noNote') : undefined}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => save()}
          className="font-serif text-lg md:text-lg"
        />
      </InputGroup>
      <ToolKey
        label={t('lyrics.previousVerse')}
        disabled={verse === 0}
        className="h-10 w-10 flex-none landscape-phone:h-10"
        onClick={() => toVerse(verse - 1)}
      >
        <ChevronUp aria-hidden />
      </ToolKey>
      <ToolKey
        label={t('lyrics.nextVerse')}
        disabled={verse >= count}
        className="h-10 w-10 flex-none landscape-phone:h-10"
        onClick={() => toVerse(verse + 1)}
      >
        <ChevronDown aria-hidden />
      </ToolKey>
    </div>
  )
}
