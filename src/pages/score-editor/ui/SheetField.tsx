import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/shared/lib'
import { Input } from '@/shared/ui/primitives/input'
import { Popover, PopoverContent } from '@/shared/ui/primitives/popover'
import type { SheetField as Field } from '@/widgets/score-sheet'

type Kind = Field['kind']

/**
 * Where each field stands at the place the sheet drew for it (ADR 0096): the chord symbol's over the
 * chord row, covering the symbol printed there, its suggestions under it (over it where it is flipped
 * above, the field still on the row).
 */
const PLACES = {
  chord: {
    side: 'bottom',
    align: 'start',
    sideOffset: ({ anchor }: { anchor: { height: number } }) => -anchor.height,
  },
} as const satisfies Readonly<Record<Kind, object>>

/** The face each field types in, as the sheet prints what it writes: a chord symbol's serif. */
const FACES = {
  chord: 'w-36 font-display font-semibold',
} as const satisfies Readonly<Record<Kind, string>>

/** What a phone's own keyboard offers for each field as it opens. */
const INPUT_MODES = {
  chord: 'text',
} as const satisfies Readonly<Record<Kind, 'text' | 'numeric'>>

/** The selection covers the whole text, or is a caret at the end (`end`) or the start. */
function atEdge(input: HTMLInputElement, end: boolean): boolean {
  const from = input.selectionStart ?? 0
  const to = input.selectionEnd ?? 0
  const whole = from === 0 && to === input.value.length
  const edge = end ? input.value.length : 0
  return whole || (from === to && from === edge)
}

/**
 * The one field the score editor types in where the music is printed (ADR 0096, Flat's and Dorico's
 * popovers): a text field floating at the place the sheet drew for it (`anchor`, on the caret's line,
 * so it follows the music as it scrolls, pans and zooms), in the face of what it writes, sized for a
 * phone, whose own keyboard opens. What it holds is chosen as it opens and at each place it goes to,
 * so what is typed writes over it. Enter, or → at the text's end, goes on (`onGo(1)`); ← at its
 * start goes back (`onGo(-1)`); its own keys come first (`onKey`); Escape or a tap elsewhere leaves
 * it (`onClose`). Marked while what was typed cannot be written (`error`). What it offers to tap
 * stands under it (`children`).
 */
export function SheetField({
  kind,
  anchor,
  label,
  text,
  onText,
  at,
  error,
  onGo,
  onClose,
  onKey,
  children,
}: {
  kind: Kind
  /** The place the sheet drew for it; none while the caret's line is drawn again. */
  anchor: HTMLElement | null
  label: string
  text: string
  onText: (text: string) => void
  /** The place it types at: a new one chooses what it holds again. */
  at: string
  error?: string | undefined
  onGo: (direction: -1 | 1) => void
  onClose: () => void
  /** The field's own keys, before going on and back: true where it took the key. */
  onKey?: (event: KeyboardEvent<HTMLInputElement>) => boolean
  children?: ReactNode
}) {
  const id = useId()
  const input = useRef<HTMLInputElement | null>(null)
  // Opened, the cursor in it, what it holds chosen: a phone's own keyboard comes up with it.
  const opened = useCallback((element: HTMLInputElement | null) => {
    input.current = element
    element?.focus()
    element?.select()
  }, [])
  // At each place it goes to, what is written there chosen.
  useLayoutEffect(() => {
    input.current?.select()
  }, [at])
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return
    if (onKey?.(event)) {
      event.preventDefault()
      return
    }
    const field = event.currentTarget
    if (event.key === 'Enter' || (event.key === 'ArrowRight' && atEdge(field, true))) onGo(1)
    else if (event.key === 'ArrowLeft' && atEdge(field, false)) onGo(-1)
    else return
    event.preventDefault()
  }
  const errorId = `${id}-error`
  return (
    <Popover
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <PopoverContent
        anchor={anchor}
        {...PLACES[kind]}
        aria-label={label}
        initialFocus={input}
        finalFocus={false}
        className="w-auto max-w-[min(24rem,calc(100vw-1rem))] gap-1.5 p-1.5 data-[side=top]:flex-col-reverse"
      >
        <Input
          ref={opened}
          aria-label={label}
          aria-invalid={error !== undefined}
          aria-errormessage={error === undefined ? undefined : errorId}
          title={error}
          value={text}
          inputMode={INPUT_MODES[kind]}
          enterKeyHint="next"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => onText(event.target.value)}
          onKeyDown={onKeyDown}
          className={cn('h-11 rounded-xl bg-card px-2 text-xl md:text-xl', FACES[kind])}
        />
        {error === undefined ? null : (
          <span id={errorId} className="sr-only">
            {error}
          </span>
        )}
        {children}
      </PopoverContent>
    </Popover>
  )
}
