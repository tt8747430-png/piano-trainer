import { Link } from '@tanstack/react-router'
import { Cable, SlidersHorizontal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { CHORD_LABELS, CHORD_RANGES, type ChordLabels, type ChordRange } from '@/shared/lib'
import { printedKeyName, type Midi } from '@/shared/lib/music'
import { KeyStrip } from './KeyStrip'
import { useTranslation } from 'react-i18next'
import {
  Piano2DPicture,
  Piano3DPicture,
  RadioCards,
  RowLink,
  SettingsGroup,
  Sheet,
  Segmented,
  SheetContent,
  SwitchRow,
} from '@/shared/ui'

/** The canvas's BLOCK: a card, 12 round, 12 16 16 inside, its name over its choice, 8 apart. */
const BLOCK = 'flex flex-col gap-2 rounded-xl bg-card px-4 pt-3 pb-4 ring-1 ring-foreground/7'

/** What stands in the keys' place, shown: the hands at the keys (3D) or the keys (2D). */
export type PianoShown = 'hands' | 'keys'

/**
 * The canvas's Piano sheet, one for every screen with keys (the Player's transport, Chords' bar),
 * opened by the screen's own button (`trigger`): Show the piano, then the 3D piano (the hands at the
 * keys) or the 2D keys as two cards, choosing one shows it; then the rows to the piano's one home,
 * All piano settings (its range, labels, sound), and to Connect a piano.
 */
export function PianoSheet({
  keys,
  hands,
  onKeys,
  onHands,
  trigger,
  labels,
  range,
}: {
  keys: boolean
  hands: boolean
  onKeys: (shown: boolean) => void
  onHands: (shown: boolean) => void
  /** The screen's button that opens it, given how to open it. */
  trigger: (open: () => void) => ReactNode
  /** What the keys carry, where the screen offers a choice (Chords): the canvas's Labels. */
  labels?: { readonly value: ChordLabels; readonly onChange: (labels: ChordLabels) => void }
  /** How many keys it shows and which, where the screen offers a choice (Chords): the canvas's Range. */
  range?: {
    readonly value: ChordRange
    readonly low: Midi
    readonly high: Midi
    readonly onChange: (range: ChordRange) => void
  }
}) {
  const { t } = useTranslation(['player', 'common'])
  const [open, setOpen] = useState(false)
  const shown: PianoShown = hands ? 'hands' : 'keys'
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger(() => setOpen(true))}
      <SheetContent title={t('pianoSheet.title')}>
        <div className="flex flex-col gap-2">
          <SettingsGroup flush>
            <SwitchRow
              label={t('pianoSheet.show')}
              checked={keys}
              onCheckedChange={onKeys}
              className="px-4"
            />
          </SettingsGroup>
          <RadioCards
            label={t('pianoSheet.view')}
            value={shown}
            disabled={!keys}
            cards={[
              { value: 'hands', label: t('pianoSheet.hands'), picture: <Piano3DPicture /> },
              { value: 'keys', label: t('pianoSheet.keys'), picture: <Piano2DPicture /> },
            ]}
            onChange={(next) => onHands(next === 'hands')}
          />
          {range ? (
            <div className={`${BLOCK} ${keys ? '' : 'pointer-events-none opacity-45'}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-base text-foreground">{t('pianoSheet.range')}</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {printedKeyName(range.low)}–{printedKeyName(range.high)}
                </span>
              </div>
              <KeyStrip
                low={range.low}
                high={range.high}
                label={t('pianoSheet.rangeShown', {
                  from: printedKeyName(range.low),
                  to: printedKeyName(range.high),
                })}
              />
              <Segmented
                label={t('pianoSheet.range')}
                value={range.value}
                options={CHORD_RANGES.map((each) => ({
                  value: each,
                  label: t(`pianoSheet.ranges.${each}`),
                }))}
                onChange={range.onChange}
              />
            </div>
          ) : null}
          {labels ? (
            <div className={`${BLOCK} ${keys ? '' : 'pointer-events-none opacity-45'}`}>
              <span className="text-base text-foreground">{t('pianoSheet.labels')}</span>
              <Segmented
                label={t('pianoSheet.labels')}
                value={labels.value}
                options={CHORD_LABELS.map((each) => ({
                  value: each,
                  label: t(`pianoSheet.label.${each}`),
                }))}
                onChange={labels.onChange}
              />
            </div>
          ) : null}
          <SettingsGroup flush>
            <RowLink
              title={t('pianoSheet.all')}
              icon={SlidersHorizontal}
              paint="sand"
              render={<Link to="/settings/on-screen-piano" />}
            />
            <RowLink
              title={t('pianoSheet.connect')}
              icon={Cable}
              paint="sky"
              render={<Link to="/settings/connect-piano" />}
            />
          </SettingsGroup>
        </div>
      </SheetContent>
    </Sheet>
  )
}
