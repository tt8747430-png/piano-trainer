import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LEFT_FIGURES, PATTERNS, RIGHT_FIGURES } from '@/entities/pattern'
import { melodyOf, pieceKey, VOICINGS, type Piece } from '@/entities/piece'
import {
  PRACTICE_TOGGLES,
  selectPractice,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import type { PracticeChoice } from '@/features/practice'
import { setPracticeToggle } from '@/features/set-preference'
import { localText, useLocale } from '@/shared/i18n'
import { noteName, noteParam, pitchClass, tonicSpelling } from '@/shared/lib/music'
import type { Hands } from '@/shared/lib/schedule'
import { ChipRow, Segmented } from '@/shared/ui'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { Switch } from '@/shared/ui/primitives/switch'
import type { SetupChange } from '../model/setup-params'

const PITCH_CLASSES = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))
const HANDS = ['both', 'rh', 'lh'] as const

export type SetupPage = 'pattern' | 'rh' | 'lh'

/** The Setup sheet's first page: everything but the pattern and figure lists, which open as their own pages. */
export function SetupMain({
  piece,
  choice,
  tempo,
  hands,
  onChange,
  open,
}: {
  piece: Piece
  choice: PracticeChoice
  tempo: number
  hands: Hands
  onChange: (change: SetupChange) => void
  open: (page: SetupPage) => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const locale = useLocale()
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  const { mode } = pieceKey(piece)
  const hasMelody = melodyOf(piece) !== undefined
  const patternName =
    choice.pattern === 'chart'
      ? t('player:fromChart')
      : localText(PATTERNS[choice.pattern].name, locale)
  const row = (label: string, value: string, page: SetupPage) => (
    <button
      type="button"
      onClick={() => open(page)}
      className="flex min-h-14 w-full items-center gap-3 border-b border-border text-left transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <span className="flex-1 text-lg">{label}</span>
      <span className="truncate text-muted-foreground">{value}</span>
      <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
    </button>
  )
  return (
    <div className="flex flex-col gap-5">
      <ChipRow
        label={t('player:key')}
        value={noteParam(choice.tonic)}
        options={PITCH_CLASSES.map((pc) => {
          const tonic = tonicSpelling(pc, mode)
          return { value: noteParam(tonic), label: noteName(tonic) }
        })}
        onChange={(key) => onChange({ key })}
      />
      <Slider
        min={40}
        max={160}
        step={1}
        value={tempo}
        onValueChange={(next) => onChange({ tempo: next })}
        className="flex flex-col gap-3"
      >
        <div className="flex justify-between text-lg">
          <SliderLabel>{t('player:tempo')}</SliderLabel>
          <span className="font-semibold tabular-nums">{t('player:bpm', { tempo })}</span>
        </div>
      </Slider>
      <Segmented
        label={t('player:hands')}
        value={hands}
        options={HANDS.map((h) => ({ value: h, label: t(`common:hands.${h}`) }))}
        onChange={(next) => onChange({ hands: next })}
      />
      <div>
        {row(t('player:pattern'), patternName, 'pattern')}
        {row(
          t('player:rh'),
          choice.rh ? localText(RIGHT_FIGURES[choice.rh].name, locale) : t('player:ownFigure'),
          'rh',
        )}
        {row(
          t('player:lh'),
          choice.lh ? localText(LEFT_FIGURES[choice.lh].name, locale) : t('player:ownFigure'),
          'lh',
        )}
      </div>
      {piece.kind === 'progression' && piece.voicing.choosable ? (
        <Segmented
          label={t('player:voicing')}
          value={choice.voicing ?? piece.voicing.default}
          options={VOICINGS.map((v) => ({ value: v, label: t(`player:voicings.${v}`) }))}
          onChange={(voicing) => onChange({ voicing })}
        />
      ) : null}
      <div>
        {PRACTICE_TOGGLES.filter((toggle) => toggle !== 'melody' || hasMelody).map((toggle) => (
          <label
            key={toggle}
            className="flex min-h-14 items-center justify-between border-b border-border text-lg"
          >
            {t(`player:toggles.${toggle}`)}
            <Switch
              checked={toggles[toggle]}
              onCheckedChange={(on) => setPracticeToggle(settings, toggle, on)}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
