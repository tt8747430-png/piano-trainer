import { memo, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, keyboardLayout, useMediaQuery } from '@/shared/lib'
import {
  isBlackKey,
  pitchClass,
  plainSpelling,
  type ChordRole,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { ROLE_BG } from '../role-classes'

export type KeyTone = ChordRole | 'rh' | 'lh' | 'melody'
export interface KeyMark {
  readonly tone: KeyTone
  readonly label?: string
}

const TONE_BG: Readonly<Record<KeyTone, string>> = {
  ...ROLE_BG,
  rh: 'bg-hand-rh',
  lh: 'bg-hand-lh',
  melody: 'bg-hand-melody',
}

interface KeyProps {
  readonly midi: Midi
  readonly black: boolean
  /** Percent of the keyboard, from keyboardLayout. */
  readonly left: number
  readonly width: number
  readonly height: number
  readonly name: string
  readonly mark: KeyMark | undefined
  readonly pressed: boolean
  readonly lit: boolean
  readonly outlined: boolean
  readonly wrong: boolean
  readonly selectable: boolean
  readonly selected: boolean
  readonly onKeyPress: ((midi: Midi) => void) | undefined
}

function faceOf(props: KeyProps): string {
  if (props.wrong) return 'bg-destructive text-on-role'
  if (props.lit) return 'bg-primary text-primary-foreground'
  if (props.mark) return cn(TONE_BG[props.mark.tone], 'text-on-role')
  if (props.selected) return 'bg-primary text-primary-foreground'
  if (props.pressed) return 'bg-key-pressed'
  return props.black ? 'bg-key-black' : 'bg-key-white'
}

const Key = memo(function Key(props: KeyProps) {
  const { onKeyPress } = props
  return (
    <button
      type="button"
      aria-label={props.name}
      aria-pressed={props.selectable ? props.selected : undefined}
      onClick={onKeyPress ? () => onKeyPress(props.midi) : undefined}
      className={cn(
        'absolute top-0 flex items-end justify-center transition-colors duration-80 ease-out outline-none focus-visible:z-20 focus-visible:ring-3 focus-visible:ring-ring',
        props.black
          ? 'z-10 rounded-b-xs pb-1.5'
          : 'rounded-b-sm border border-t-0 border-key-white-edge pb-2.5',
        onKeyPress ? 'hover:brightness-95 active:brightness-90' : null,
        faceOf(props),
        props.outlined ? 'ring-3 ring-primary ring-inset' : null,
      )}
      style={{ left: `${props.left}%`, width: `${props.width}%`, height: `${props.height}%` }}
    >
      {props.mark?.label ? (
        <span aria-hidden className="text-sm font-bold tabular-nums">
          {props.mark.label}
        </span>
      ) : null}
    </button>
  )
})

/** The one keyboard (spec §8): keys are buttons named by note; marks colour and label them. */
export function PianoKeyboard({
  label,
  range,
  marks,
  pressed,
  lit,
  outlined,
  wrong,
  selectable = false,
  selected,
  onKeyPress,
  minWhiteWidth = 0,
  centre = null,
  className,
}: {
  label: string
  range: KeyRange
  marks?: ReadonlyMap<Midi, KeyMark>
  /** Keys held down on the MIDI keyboard. */
  pressed?: ReadonlySet<Midi>
  /** The key sounding now: a scale run's current note, Name chord's chord. */
  lit?: ReadonlySet<Midi>
  outlined?: ReadonlySet<Midi>
  /** Keys shown red: a wrong key in Your turn, the extra keys of a quiz answer. */
  wrong?: ReadonlySet<Midi>
  selectable?: boolean
  selected?: ReadonlySet<Midi>
  onKeyPress?: (midi: Midi) => void
  /** Pixels; past it the keyboard scrolls sideways instead of shrinking the keys. */
  minWhiteWidth?: number
  /** A key to keep in view while the keyboard scrolls. */
  centre?: Midi | null
  className?: string
}) {
  const { t } = useTranslation('common')
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { from, to } = range
  const { keys, whites } = useMemo(() => keyboardLayout({ from, to }), [from, to])
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = scroller.current
    const key = keys.find((k) => k.midi === centre)
    if (!element || !key || element.scrollWidth <= element.clientWidth) return
    const middle = ((key.left + key.width / 2) / 100) * element.scrollWidth
    element.scrollTo({
      left: middle - element.clientWidth / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [centre, keys, reduceMotion])

  const nameOf = (key: Midi) => {
    const spelled = plainSpelling(pitchClass(key), true)
    const octave = Math.floor(key / 12) - 1
    return t(isBlackKey(key) ? 'note.sharp' : 'note.natural', { letter: spelled.letter, octave })
  }

  return (
    <div ref={scroller} className={cn('overflow-x-auto scrollbar-none', className)}>
      <div
        role="group"
        aria-label={label}
        className="relative h-full"
        style={minWhiteWidth ? { minWidth: `${whites * minWhiteWidth}px` } : undefined}
      >
        {keys.map((key) => (
          <Key
            key={key.midi}
            midi={key.midi}
            black={key.black}
            left={key.left}
            width={key.width}
            height={key.height}
            name={nameOf(key.midi)}
            mark={marks?.get(key.midi)}
            pressed={pressed?.has(key.midi) ?? false}
            lit={lit?.has(key.midi) ?? false}
            outlined={outlined?.has(key.midi) ?? false}
            wrong={wrong?.has(key.midi) ?? false}
            selectable={selectable}
            selected={selected?.has(key.midi) ?? false}
            onKeyPress={onKeyPress}
          />
        ))}
      </div>
    </div>
  )
}
