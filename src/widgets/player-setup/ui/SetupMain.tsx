import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LEFT_FIGURES, PATTERNS, RIGHT_FIGURES } from '@/entities/pattern'
import { CHORD_SIZES, melodyOf, pieceKey, type Piece } from '@/entities/piece'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import type { PracticeChoice } from '@/features/practice'
import { setPracticeToggle } from '@/features/set-preference'
import { localText, useLocale } from '@/shared/i18n'
import { noteName, noteParam, PITCH_CLASSES, tonicSpelling } from '@/shared/lib/music'
import { Dropdown, Segmented } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'
import type { SetupChange } from '../model/setup-params'

export type SetupPage = 'pattern' | 'rh' | 'lh'

/** The Setup sheet's first page: the piece's own choices but the pattern and figure lists, which open as their own pages. */
export function SetupMain({
  piece,
  choice,
  onChange,
  onOpenPage,
}: {
  piece: Piece
  choice: PracticeChoice
  onChange: (change: SetupChange) => void
  /** Opens one of the sheet's lists as its page. */
  onOpenPage: (page: SetupPage) => void
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  const { minor } = pieceKey(piece)
  const hasMelody = melodyOf(piece) !== undefined
  const patternName =
    choice.pattern === 'chart' ? t('fromChart') : localText(PATTERNS[choice.pattern].name, locale)
  const row = (label: string, value: string, page: SetupPage) => (
    <button
      type="button"
      onClick={() => onOpenPage(page)}
      className="flex min-h-14 w-full items-center gap-3 border-b border-border text-left transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <span className="flex-1 text-lg">{label}</span>
      <span className="truncate text-muted-foreground">{value}</span>
      <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
    </button>
  )
  return (
    <div className="flex flex-col gap-5">
      <Dropdown
        label={t('key')}
        value={noteParam(choice.tonic)}
        options={PITCH_CLASSES.map((pc) => {
          const tonic = tonicSpelling(pc, minor)
          return {
            value: noteParam(tonic),
            label: t(minor ? 'keyOf.minor' : 'keyOf.major', {
              tonic: noteName(tonic),
            }),
          }
        })}
        onChange={(key) => onChange({ key })}
      />
      <div>
        {row(t('pattern'), patternName, 'pattern')}
        {row(
          t('rh'),
          choice.rh ? localText(RIGHT_FIGURES[choice.rh].name, locale) : t('ownFigure'),
          'rh',
        )}
        {row(
          t('lh'),
          choice.lh ? localText(LEFT_FIGURES[choice.lh].name, locale) : t('ownFigure'),
          'lh',
        )}
      </div>
      {piece.kind === 'progression' && piece.chordSize.choosable ? (
        <Segmented
          label={t('chordSize')}
          value={choice.chordSize ?? piece.chordSize.default}
          options={CHORD_SIZES.map((size) => ({
            value: size,
            label: t(`chordSizes.${size}`),
          }))}
          onChange={(chordSize) => onChange({ chordSize })}
        />
      ) : null}
      {hasMelody ? (
        <label className="flex min-h-14 items-center justify-between border-b border-border text-lg">
          {t('toggles.melody')}
          <Switch
            checked={toggles.melody}
            onCheckedChange={(on) => setPracticeToggle(settings, 'melody', on)}
          />
        </label>
      ) : null}
    </div>
  )
}
