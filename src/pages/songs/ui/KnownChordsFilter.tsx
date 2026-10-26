import { KeyboardMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { printedSymbol } from '@/shared/lib/music'
import { MenuSection, ToggleChips } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/**
 * Chords I know (ADR 0103, Chordify's search by the chords you know): a button that says how many
 * are ticked, opening a popover of the chords the songs use, the most used first, each a chip
 * printed as the sheets print chord symbols; ticked, only the songs that use no other stay, at once.
 * What it does is the ⓘ beside its name; Clear lets every song back.
 */
export function KnownChordsFilter({
  choices,
  known,
  onChange,
}: {
  choices: readonly string[]
  /** The chords ticked, among `choices`. */
  known: readonly string[]
  onChange: (known: string[]) => void
}) {
  const { t } = useTranslation('songs')
  const count = known.length
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-label={count > 0 ? t('known.count', { count }) : t('known.label')}
            data-chosen={count > 0 ? '' : undefined}
            className="flex-auto data-chosen:border-foreground data-chosen:bg-muted sm:flex-none"
          />
        }
      >
        <KeyboardMusic data-icon="inline-start" aria-hidden />
        {t('known.label')}
        {count > 0 ? (
          <span
            aria-hidden
            className="grid h-6 min-w-6 place-items-center rounded-full bg-card px-1.5 text-sm tabular-nums"
          >
            {count}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('known.label')}
        align="start"
        className="max-h-(--available-height) w-[min(28rem,calc(100vw-2rem))] gap-3 p-3"
      >
        <MenuSection title={t('known.label')} info={t('known.info')}>
          {/* The chips scroll in the room the screen leaves under the heading and Clear, with
              room round them inside the scroller, so a chip's focus ring is not cut. */}
          <div className="-m-1 max-h-[min(24rem,calc(var(--available-height)-7.5rem))] overflow-y-auto overscroll-contain p-1">
            <ToggleChips
              label={t('known.label')}
              value={known}
              options={choices.map((chord) => ({ value: chord, label: printedSymbol(chord) }))}
              onChange={onChange}
              className="*:font-display *:text-lg"
            />
          </div>
        </MenuSection>
        {count > 0 ? (
          <Button variant="ghost" className="self-start" onClick={() => onChange([])}>
            {t('known.clear')}
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
