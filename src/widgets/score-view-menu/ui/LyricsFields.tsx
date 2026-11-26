import { Minus, Plus } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, TEXT_SIZES, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { formatPercent, useLocale } from '@/shared/i18n'
import { GroupRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PartRow, PartRows } from './PartRows'

/**
 * The text size, a step smaller or larger by − and + (ADR 0108, Chordify's font size): its name, then
 * − the size + at the row's end, each step one of `TEXT_SIZES`, greyed at either end.
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
    <GroupRow label={<span id={id}>{t('views.textSize.label')}</span>}>
      <span role="group" aria-labelledby={id} className="flex shrink-0 items-center gap-1">
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
    </GroupRow>
  )
}

/**
 * Chords over lyrics' own part of the View (ADR 0108, Chordify's view settings), one card of rows
 * as its board draws it: its text size, then the song's chord diagrams pinned under its strip, a
 * switch row as the View's other parts are, what it does its ⓘ.
 */
export function LyricsFields() {
  const { t } = useTranslation(['player', 'music'])
  const store = useSettingsStoreApi()
  const pinned = useSettings((state) => selectScoreView(state).pinned)
  return (
    <PartRows>
      <TextSizeRow />
      <PartRow
        label={t('views.pinned.label')}
        info={t('views.pinned.about')}
        on={pinned}
        onChange={(on) => setScoreView(store, { pinned: on })}
      />
    </PartRows>
  )
}
