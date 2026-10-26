import { Minus, Pin, Plus } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, TEXT_SIZES, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { formatPercent, useLocale } from '@/shared/i18n'
import { SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The text size, a step smaller or larger by − and + (ADR 0108, Chordify's font size): its name, then
 * − the size + at the row's end (under its name where the row has no room), each step one of
 * `TEXT_SIZES`, greyed at either end.
 */
function TextSizeRow() {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const store = useSettingsStoreApi()
  const size = useSettings((state) => selectScoreView(state).textSize)
  const at = TEXT_SIZES.indexOf(size)
  const step = (by: number) => {
    const textSize = TEXT_SIZES[at + by]
    if (textSize !== undefined) setScoreView(store, { textSize })
  }
  const id = useId()
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2 text-lg"
    >
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted font-display text-base font-semibold text-muted-foreground"
      >
        Aa
      </span>
      <span id={id} className="flex-1 whitespace-nowrap">
        {t('views.textSize.label')}
      </span>
      <span className="ms-auto flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          aria-label={t('views.textSize.smaller')}
          title={t('views.textSize.smaller')}
          disabled={at <= 0}
          onClick={() => step(-1)}
        >
          <Minus aria-hidden />
        </Button>
        <output aria-live="polite" className="w-14 text-center text-base tabular-nums">
          {formatPercent(locale, size)}
        </output>
        <Button
          variant="outline"
          size="icon"
          aria-label={t('views.textSize.larger')}
          title={t('views.textSize.larger')}
          disabled={at >= TEXT_SIZES.length - 1}
          onClick={() => step(1)}
        >
          <Plus aria-hidden />
        </Button>
      </span>
    </div>
  )
}

/**
 * Chords over lyrics' own part of the View (ADR 0108, Chordify's view settings): the song's chord
 * diagrams pinned under its strip, then its text size.
 */
export function LyricsFields() {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const pinned = useSettings((state) => selectScoreView(state).pinned)
  return (
    <div className="flex flex-col">
      <SwitchRow
        icon={<Pin />}
        label={t('views.pinned.label')}
        info={t('views.pinned.about')}
        checked={pinned}
        onCheckedChange={(on) => setScoreView(store, { pinned: on })}
      />
      <TextSizeRow />
    </div>
  )
}
