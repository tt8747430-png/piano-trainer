import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { Hand } from '@/shared/lib/music'
import type { Hands } from '@/shared/lib/schedule'
import { NamedSegmented } from './NamedSegmented'
import { Segmented } from './Segmented'

/** The hands left to right, as they sit at the keys. */
const ORDER: readonly Hands[] = ['lh', 'both', 'rh']

/**
 * A hand's colour as the keys wear it (DESIGN.md, the Player's hands; R35): the right hand a brick
 * dot, the left a lilac one outlined, so they differ by fill as well as hue.
 */
export function HandSwatch({ hand, className }: { hand: Hand; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-2.5 shrink-0 rounded-key-black',
        hand === 'rh' ? 'bg-hand-rh' : 'border-2 border-hand-lh bg-hand-lh-wash',
        className,
      )}
    />
  )
}

/** Hands as a picture: a hand's swatch, or both side by side (the Player's foot, where its icon would be). */
export function HandsPicture({ hands }: { hands: Hands }) {
  const shown: readonly Hand[] = hands === 'both' ? ['lh', 'rh'] : [hands]
  return (
    <span aria-hidden className="flex items-center gap-1">
      {shown.map((hand) => (
        <HandSwatch key={hand} hand={hand} className="size-3.5" />
      ))}
    </span>
  )
}

/**
 * The one choice of hands (R35, after Ivory's parts): Left · Both · Right in the keys' order, each
 * with its swatch where the keys are painted by hand (the Player, an exercise), none in the
 * explorers, whose keys wear a chord's tones.
 */
export function HandsSegmented<V extends Hands>({
  label,
  value,
  onChange,
  hands = ORDER as readonly V[],
  painted = false,
  named = false,
}: {
  label: string
  value: V
  onChange: (hands: V) => void
  /** The hands offered, put in the keys' order: every one by default. */
  hands?: readonly V[]
  /** Each hand's swatch beside its name, where the keys wear the hands' colours. */
  painted?: boolean
  /** Its name on screen beside it (NamedSegmented). */
  named?: boolean
}) {
  const { t } = useTranslation('common')
  const options = ORDER.filter((each): each is V => hands.includes(each as V)).map((each) => ({
    value: each,
    label: t(`handsShort.${each}`),
    icon: painted ? (
      <span className="flex gap-0.5">
        {each === 'both' ? (
          <>
            <HandSwatch hand="lh" />
            <HandSwatch hand="rh" />
          </>
        ) : (
          <HandSwatch hand={each} />
        )}
      </span>
    ) : undefined,
  }))
  const Control = named ? NamedSegmented<V> : Segmented<V>
  return <Control label={label} value={value} options={options} onChange={onChange} />
}
