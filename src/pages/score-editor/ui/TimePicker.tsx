import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { barLengths, barsOf, metersFor, sectionMeter } from '@/features/score-editor'
import {
  beatsPerBar,
  METERS,
  TICKS_PER_BEAT,
  timeSignature,
  timeSignatureText,
  type Meter,
  type Tick,
} from '@/shared/lib/music'
import { InfoTip, SwitchRow, ToolKey, Wheel } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useSignatureFrom } from '../model/use-signature-from'
import { TimeFigures } from './sign-pictures'

/** A meter's two figures. */
const figuresOf = (meter: Meter) => {
  const [count = 4, unit = 4] = meter.split('/').map(Number)
  return { count, unit }
}
const meterOf = (count: number, unit: number): Meter | undefined =>
  METERS.find((meter) => meter === `${count}/${unit}`)
/** A whole bar of a meter, in ticks: a first bar of it is no pickup. */
const fullBar = (meter: Meter): Tick => beatsPerBar(meter) * TICKS_PER_BEAT

/** A wheel's name over it, with what it holds behind its ⓘ where it says more. */
function WheelName({ name, info }: { name: string; info?: string }) {
  return (
    <div className="flex h-5 items-center justify-center gap-1 text-sm font-semibold text-muted-foreground">
      <span>{name}</span>
      {info ? <InfoTip name={name}>{info}</InfoTip> : null}
    </div>
  )
}

/**
 * The time signature's picker (ADR 0114, after notation apps' wheels): Beat and Beat type slid up
 * and down (or typed, or stepped with ↑ ↓), the meters of the song's own beat to choose (a quarter, or
 * a dotted quarter: across them every note would change), the common meters as quick keys under them;
 * at the song's head its pickup, the first bar's length; for 4/4, Show as C. Nothing changes until
 * Apply, one step Undo takes back; Cancel leaves it. From a bar's section on (`bar`, a sign's on the
 * sheet, else the first bar chosen's), the whole song's in its first section.
 */
export function TimePicker({ bar, onDone }: { bar?: number | undefined; onDone: () => void }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const { from, section, song, said } = useSignatureFrom(bar)
  const kind = useEditorState((state) => state.draft.meter)
  const was = {
    meter: useEditorState((state) => sectionMeter(state.draft, section)),
    commonTime: useEditorState((state) => state.draft.commonTime ?? false),
    pickup: useEditorState((state) => barsOf(state.draft)[0]?.bar.ticks ?? 0),
  }
  const [meter, setMeter] = useState(was.meter)
  const [commonTime, setCommonTime] = useState(was.commonTime)
  const [pickup, setPickup] = useState<Tick>(Math.min(was.pickup, fullBar(was.meter)))
  const { count, unit } = figuresOf(meter)
  const allowed = metersFor(kind)

  // A meter chosen keeps the pickup where the new bar holds it; else the first bar is whole.
  const choose = (next: Meter) => {
    setMeter(next)
    if (!barLengths(next).includes(pickup) || pickup >= fullBar(meter)) setPickup(fullBar(next))
  }
  const otherKind = t('time.otherKind')
  const beats = METERS.filter((each) => figuresOf(each).unit === unit).map((each) => {
    const value = figuresOf(each).count
    return { value, label: String(value) }
  })
  const units = [...new Set(METERS.map((each) => figuresOf(each).unit))].map((value) => ({
    value,
    label: String(value),
    disabled: !METERS.some((each) => figuresOf(each).unit === value && allowed.includes(each)),
  }))
  // None first, a whole bar; then the pickups, shortest first.
  const pickups = [
    fullBar(meter),
    ...barLengths(meter).filter((ticks) => ticks < fullBar(meter)),
  ].map((ticks) => ({
    value: ticks,
    label:
      ticks === fullBar(meter)
        ? t('time.none')
        : timeSignatureText(timeSignature(ticks / TICKS_PER_BEAT, meter)),
  }))
  const changed =
    meter !== was.meter ||
    (meter === '4/4' && commonTime !== was.commonTime) ||
    (song && pickup !== Math.min(was.pickup, fullBar(was.meter)))
  const apply = () => {
    actions.dispatch({
      type: 'time',
      bar: from,
      time: {
        meter,
        ...(meter === '4/4' ? { commonTime } : {}),
        ...(song ? { pickup } : {}),
      },
    })
    onDone()
  }

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm text-muted-foreground">{said}</h4>
      <div className="flex items-start justify-center gap-6">
        <div role="group" aria-label={t('time.current')} className="flex flex-col items-center">
          <WheelName name={t('time.current')} />
          <div className="mt-1 flex items-center gap-2">
            <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
              <span className="flex h-20 items-center">{t('time.beat')}</span>
              <span className="flex h-20 items-center gap-1">
                {t('time.beatType')}
                <InfoTip name={t('time.beatType')}>{t('time.beatTypeInfo')}</InfoTip>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <Wheel
                label={t('time.beat')}
                options={beats}
                value={count}
                onChange={(next) => {
                  const each = meterOf(next, unit)
                  if (each) choose(each)
                }}
              />
              <Wheel
                label={t('time.beatType')}
                options={units}
                value={unit}
                onChange={() => undefined}
              />
            </div>
          </div>
        </div>
        {song ? (
          <div role="group" aria-label={t('time.pickup')} className="flex flex-col items-center">
            <WheelName name={t('time.pickup')} info={t('time.pickupInfo')} />
            {/* Level with the Current's two wheels, between them. */}
            <div className="mt-1 flex h-41 items-center">
              <Wheel
                label={t('time.pickup')}
                options={pickups}
                value={pickup}
                onChange={setPickup}
                className="w-20 [&_[data-value]]:text-lg"
              />
            </div>
          </div>
        ) : null}
      </div>
      <div role="group" aria-label={t('time.common')} className="grid grid-cols-5 gap-1.5">
        {METERS.map((each) => (
          <ToolKey
            key={each}
            label={each}
            reason={otherKind}
            pressed={each === meter}
            disabled={!allowed.includes(each)}
            onClick={() => choose(each)}
            className="h-12"
          >
            <TimeFigures meter={each} common={each === '4/4' && commonTime} />
          </ToolKey>
        ))}
      </div>
      {meter === '4/4' ? (
        <SwitchRow
          label={t('time.commonTime')}
          info={t('time.commonTimeInfo')}
          checked={commonTime}
          onCheckedChange={setCommonTime}
          className="min-h-12 border-b-0 py-0 text-base"
        />
      ) : null}
      <div className="flex justify-end gap-2">
        <Button variant="soft" onClick={onDone}>
          {t('time.cancel')}
        </Button>
        <Button disabled={!changed} onClick={apply}>
          {t('time.apply')}
        </Button>
      </div>
    </div>
  )
}
