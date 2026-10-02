import { useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { readChordSymbol } from '@/shared/lib/music'
import { TypedField } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'

/**
 * The chord at the caret, typed: Enter sets it and moves to the next bar (adding one past the last),
 * Tab to the next beat, Escape leaves the field.
 */
export function ChordField({ symbol }: { symbol: string }) {
  const { t } = useTranslation('editor')
  const {
    actions,
    meta: { chordFieldRef },
  } = useScoreEditorContext()
  const [text, setText] = useState(symbol)
  const chord = readChordSymbol(text)
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.blur()
      return
    }
    const advance =
      event.key === 'Enter' ? 'barAdding' : event.key === 'Tab' && !event.shiftKey ? 'beat' : null
    if (!advance || !chord) return
    event.preventDefault()
    actions.dispatch({ type: 'chord', chord, advance })
  }
  return (
    <TypedField
      ref={chordFieldRef}
      label={t('chord.field')}
      value={text}
      error={chord ? null : t('chord.invalid')}
      onChange={setText}
      onKeyDown={onKeyDown}
      className="w-40 shrink-0"
    />
  )
}
