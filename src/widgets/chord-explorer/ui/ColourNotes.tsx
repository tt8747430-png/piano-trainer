import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { cn } from '@/shared/lib'
import {
  COLOUR_GROUPS,
  printedNote,
  printedSymbol,
  type ColourGroup,
  type ColourNote,
} from '@/shared/lib/music'
import { FoldSection, ROLE_BG } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'

/** An avoid note's degree on the card's own sand: its role's colour would call it a chord tone. */
const AVOID_DEGREE = 'bg-muted text-foreground'

/**
 * The chord's colour notes (A33): one panel of three groups, its own tones, the tensions it takes and
 * the notes to avoid. A note the chord can take is a toggle that adds it to the chord (its keys, its
 * symbol, its sound) or takes it off, pressed while the chord has it; a chord tone, or a note no
 * chord holds, plays the chord with it on top. In a key, the groups follow the chord's degree, said
 * in the heading's line (`context`).
 */
export function ColourNotes({
  notes,
  context,
  onToggle,
  onPlay,
}: {
  notes: readonly ColourNote[]
  /** The chord's place in the key it was opened in: "as ii in C major". */
  context?: string | undefined
  onToggle: (note: ColourNote) => void
  onPlay: (note: ColourNote) => void
}) {
  const { t } = useTranslation('practice')
  const fold = useFold('chords.colour')
  return (
    <FoldSection
      title={t('chords.colour.title')}
      fold={fold}
      info={t('chords.colour.info')}
      detail={context ? <p className="text-muted-foreground">{context}</p> : undefined}
    >
      <div className="grid-cards gap-4">
        {COLOUR_GROUPS.map((group) => (
          <ColourGroupCard
            key={group}
            group={group}
            notes={notes.filter((each) => each.group === group)}
            onToggle={onToggle}
            onPlay={onPlay}
          />
        ))}
      </div>
    </FoldSection>
  )
}

function ColourGroupCard({
  group,
  notes,
  onToggle,
  onPlay,
}: {
  group: ColourGroup
  notes: readonly ColourNote[]
  onToggle: (note: ColourNote) => void
  onPlay: (note: ColourNote) => void
}) {
  const { t } = useTranslation('practice')
  const id = useId()
  if (notes.length === 0) return null
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 card p-4">
      <h3 id={id} className="text-xl">
        {t(`chords.colour.group.${group}`)}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {notes.map((each) => {
          const face = (
            <>
              <span
                className={cn(
                  'grid h-9 min-w-9 place-items-center rounded-control px-1.5 text-sm font-bold',
                  group === 'avoid' ? AVOID_DEGREE : cn(ROLE_BG[each.role], 'text-on-role'),
                )}
              >
                {printedSymbol(each.label)}
              </span>
              <span>{printedNote(each.note)}</span>
            </>
          )
          const name = `${printedSymbol(each.label)} ${printedNote(each.note)}`
          return (
            <li key={each.label}>
              {each.toggled ? (
                <Toggle
                  aria-label={name}
                  pressed={each.added}
                  onPressedChange={() => onToggle(each)}
                  className="min-h-11 gap-2 pr-4 pl-1"
                >
                  {face}
                </Toggle>
              ) : (
                <button
                  type="button"
                  aria-label={name}
                  onClick={() => onPlay(each)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-control border border-input bg-card pr-4 pl-1 font-semibold hover:bg-muted"
                >
                  {face}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
