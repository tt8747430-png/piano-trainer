import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useMediaQuery } from '@/shared/lib'
import { readChordSymbol } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { InputGroup, InputGroupInput } from '@/shared/ui/primitives/input-group'
import { CHORD_KEYPAD, typedOn } from '../model/chord-keypad'
import { useScoreEditorContext } from '../model/editor-context'

/** A keypad key: a row of them and the field fit the palette's three rows. */
const KEYPAD = 'h-8 px-0 landscape-phone:h-8'

/** A screen touched, not pointed at: its own keyboard would cover the palette, so the keypad types. */
const TOUCH = '(pointer: coarse)'

/**
 * The chord at the caret, typed (ADR 0065): a field in the lead sheet's serif over the chord keypad,
 * the letters, sharp and flat, qualities and numbers a symbol is made of. Enter (or ↵) sets it and
 * moves to the next bar, adding one past the last; Tab to the next beat; Escape leaves the field. On
 * a touch screen the keypad types and the phone's keyboard stays down; on a computer the keyboard
 * types too. `focus`: put the cursor in it as it opens (Enter in the chord row asked for it).
 */
export function ChordField({ symbol, focus = false }: { symbol: string; focus?: boolean }) {
  const { t } = useTranslation('editor')
  const {
    actions,
    meta: { chordFieldRef },
  } = useScoreEditorContext()
  const touch = useMediaQuery(TOUCH)
  const [text, setText] = useState(symbol)
  const chord = readChordSymbol(text)
  const field = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (focus) field.current?.focus()
  }, [focus])
  const set = (advance: 'barAdding' | 'beat') => {
    if (chord) actions.dispatch({ type: 'chord', chord, advance })
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.blur()
      return
    }
    const advance =
      event.key === 'Enter' ? 'barAdding' : event.key === 'Tab' && !event.shiftKey ? 'beat' : null
    if (!advance || !chord) return
    event.preventDefault()
    set(advance)
  }
  const wrong = text.trim() !== '' && !chord
  return (
    <>
      <div className="col-span-full flex items-center gap-1">
        <InputGroup className={cn('h-10 flex-1 rounded-xl bg-card', wrong && 'border-destructive')}>
          <InputGroupInput
            ref={(element) => {
              field.current = element
              chordFieldRef(element)
            }}
            aria-label={t('chord.field')}
            aria-invalid={wrong}
            title={wrong ? t('chord.invalid') : undefined}
            value={text}
            inputMode={touch ? 'none' : 'text'}
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
            className="font-display text-xl font-semibold md:text-xl"
          />
        </InputGroup>
        <ToolKey
          label={t('chord.set')}
          disabled={!chord}
          className="h-10 w-16 flex-none text-base font-semibold landscape-phone:h-10"
          onClick={() => set('barAdding')}
        >
          {t('chord.setShort')}
        </ToolKey>
      </div>
      {CHORD_KEYPAD.map((row, index) => (
        <div
          key={index}
          role="group"
          aria-label={t('chord.keypad')}
          className="col-span-full grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${row.length + (index === 1 ? 1 : 0)}, minmax(0, 1fr))`,
          }}
        >
          {row.map((key) => (
            <ToolKey
              key={key.shown}
              label={key.shown}
              className={cn(
                KEYPAD,
                key.typed === key.shown ? 'text-sm font-semibold' : 'text-lg font-semibold',
              )}
              onClick={() => setText((now) => typedOn(now, key.typed))}
            >
              {key.shown}
            </ToolKey>
          ))}
          {index === 1 ? (
            <ToolKey
              label={t('chord.backspace')}
              className={KEYPAD}
              onClick={() => setText((now) => typedOn(now, 'back'))}
            >
              ⌫
            </ToolKey>
          ) : null}
        </div>
      ))}
    </>
  )
}
