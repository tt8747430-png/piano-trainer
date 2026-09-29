import { Square } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { noteName, type TensionGroup, type TensionTone } from '@/shared/lib/music'
import { ROLE_BG } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** An avoid note's degree stands on the card's own sand: its role's colour would call it a chord tone. */
const AVOID_DEGREE = 'bg-muted text-foreground'

/**
 * One of the table's four groups: its name, what its notes do, and each note as a chip that plays the
 * chord with it on top, pressed while it sounds.
 */
export function TensionGroupCard({
  group,
  tones,
  isPlaying,
  onPlay,
}: {
  group: TensionGroup
  tones: readonly TensionTone[]
  /** Whether this chord's sound with `tone` on top still plays. */
  isPlaying: (tone: TensionTone) => boolean
  onPlay: (tone: TensionTone) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4"
    >
      <hgroup>
        <h2 id={id} className="text-xl">
          {t(`tensions.group.${group}.title`)}
        </h2>
        <p className="text-sm text-muted-foreground">{t(`tensions.group.${group}.says`)}</p>
      </hgroup>
      <ul className="flex flex-wrap gap-2">
        {tones.map((tone) => {
          const pressed = isPlaying(tone)
          return (
            <li key={tone.pitchClass}>
              <Button
                variant="outline"
                aria-pressed={pressed}
                className="relative gap-2 pr-3 pl-1 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
                onClick={() => onPlay(tone)}
              >
                {pressed ? (
                  <Square aria-hidden className="absolute top-1 right-1 size-2.5" />
                ) : null}
                <span
                  className={cn(
                    'grid size-9 place-items-center rounded-lg text-sm font-bold',
                    group === 'avoid' ? AVOID_DEGREE : cn(ROLE_BG[tone.role], 'text-on-role'),
                  )}
                >
                  {tone.degree}
                </span>{' '}
                <span>{noteName(tone.note)}</span>
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
