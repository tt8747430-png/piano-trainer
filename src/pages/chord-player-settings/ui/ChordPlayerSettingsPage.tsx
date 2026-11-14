import { Link, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BAND_PARTS, COUNT_INS, type CountIn } from '@/entities/chord-sheet'
import { styleBook, usePatternBook } from '@/entities/pattern'
import {
  PROGRESSION_VOICINGS,
  selectChordPlayer,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { useMidiSummary } from '@/features/connect-midi'
import { setChordPlayer } from '@/features/set-preference'
import type { ArrangerStatus } from '@/shared/api/midi'
import { formatPercent, useLocale } from '@/shared/i18n'
import { relayMeter, SHEET_METERS, type SheetMeter } from '@/shared/lib/arrangement'
import { useServices } from '@/shared/lib/services'
import {
  BackButton,
  RowButton,
  RowLink,
  say,
  ScreenHeader,
  Segmented,
  SettingField,
  SettingsGroup,
  Sheet,
  SheetContent,
  SwitchRow,
} from '@/shared/ui'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useChordSheet } from '@/widgets/chord-player'

const PERCENT = { style: 'unit', unit: 'percent' } as const
const STEP = 5

/** A level from 0 to 100 %, its name over it. */
function Level({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange(value: number): void
}) {
  const locale = useLocale()
  return (
    <Slider
      min={0}
      max={100}
      step={STEP}
      value={value}
      onValueChange={onChange}
      format={PERCENT}
      locale={locale}
      className="flex flex-col gap-2"
    >
      <div className="flex justify-between gap-3 text-base">
        <SliderLabel>{label}</SliderLabel>
        <span className="text-muted-foreground tabular-nums">{formatPercent(locale, value)}</span>
      </div>
    </Slider>
  )
}

/** The arranger followed, asked for when Follow a MIDI arranger is on (the browser's MIDI prompt, with SysEx). */
function useArrangerStatus(on: boolean): ArrangerStatus | null {
  const { arranger } = useServices()
  const [status, setStatus] = useState<ArrangerStatus | null>(null)
  useEffect(() => {
    if (!on) return
    const off = arranger.onStatus(setStatus)
    void arranger.connect().then(setStatus)
    return () => {
      off()
      arranger.disconnect()
      setStatus(null)
    }
  }, [on, arranger])
  return on ? status : null
}

type Opened = 'countIn' | 'volume' | 'time'

/**
 * The Chord player's Settings (`/practice/chord-player/settings`), canvas 171's grouped rows: Instruments
 * (each a switch, at least one on, a part the style has none of not drawn), Playing (Count-in › and
 * Volume ›, each opening its sheet: the bars counted in; the volume and each instrument's level),
 * Music (Time signature ›, Written as, Voicing), the on-screen piano's and a connected piano's own
 * pages, then Follow a MIDI arranger. The key heard and the times through are the dock's Key and
 * Repeats. All but Written as, Voicing and Follow belong to the sheet open, saved with it.
 */
export function ChordPlayerSettingsPage() {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const { sheet: sheetId } = useSearch({ from: '/shell/practice/chord-player/settings' })
  const hand = useChordSheet(sheetId)
  const patterns = usePatternBook()
  const book = useMemo(() => styleBook(patterns), [patterns])
  const prefs = useSettings(selectChordPlayer)
  const settingsStore = useSettingsStoreApi()
  const arranger = useArrangerStatus(prefs.follow)
  const midi = useMidiSummary()
  const [opened, setOpened] = useState<Opened | null>(null)
  if (!hand) return null
  const { settings } = hand.entry
  const style = book.get(hand.entry.style)
  const drawn = BAND_PARTS.filter(
    (part) => part === 'piano' || (part === 'bass' ? style.hasBass : style.hasDrums),
  )
  const onCount = drawn.filter((part) => settings[part].on).length
  const countIn = (bars: CountIn) => t(`chordPlayer.settings.countIns.${bars}`)
  const arrangerValue = !prefs.follow
    ? t('chordPlayer.settings.arrangerState.off')
    : arranger?.state === 'connected'
      ? t('chordPlayer.settings.arrangerState.connected', { device: arranger.device })
      : arranger?.state === 'denied'
        ? t('chordPlayer.settings.arrangerState.denied')
        : arranger?.state === 'unsupported'
          ? t('chordPlayer.settings.arrangerState.unsupported')
          : t('chordPlayer.settings.arrangerState.noDevice')
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('chordPlayer.settings.title')} back={<BackButton />} />
      <div className="mx-auto grid w-full max-w-5xl gap-7 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-7">
          <SettingsGroup flush title={t('chordPlayer.settings.instruments')}>
            {drawn.map((part) => {
              const last = settings[part].on && onCount === 1
              return (
                <SwitchRow
                  key={part}
                  className="px-4"
                  label={t(`chordPlayer.settings.${part}`)}
                  checked={settings[part].on}
                  disabled={last}
                  reason={last ? t('chordPlayer.settings.lastOn') : undefined}
                  info={last ? t('chordPlayer.settings.lastOn') : undefined}
                  onCheckedChange={(on) => hand.setSettings({ [part]: { ...settings[part], on } })}
                />
              )
            })}
          </SettingsGroup>
          <SettingsGroup flush title={t('chordPlayer.settings.playing')}>
            <RowButton
              title={t('chordPlayer.settings.countIn')}
              value={countIn(settings.countIn)}
              opens
              onClick={() => setOpened('countIn')}
            />
            <RowButton
              title={t('chordPlayer.settings.volume')}
              value={formatPercent(locale, settings.volume)}
              opens
              onClick={() => setOpened('volume')}
            />
          </SettingsGroup>
          <SettingsGroup flush title={t('chordPlayer.settings.music')}>
            <RowButton
              title={t('chordPlayer.settings.time')}
              value={hand.sheet.meter}
              opens
              onClick={() => setOpened('time')}
            />
            <div className="border-t border-hairline px-4 py-3">
              <SettingField label={t('chordPlayer.settings.writtenAs')} setting="chordPlayer.names">
                <Segmented
                  label={t('chordPlayer.settings.writtenAs')}
                  value={prefs.names}
                  options={(['chords', 'numerals', 'nashville'] as const).map((value) => ({
                    value,
                    label: t(`chordPlayer.settings.names.${value}`),
                  }))}
                  onChange={(names) => setChordPlayer(settingsStore, { names })}
                />
              </SettingField>
            </div>
            <div className="border-t border-hairline px-4 py-3">
              <SettingField
                label={t('chordPlayer.settings.voicing')}
                info={t('chordPlayer.settings.voicingInfo')}
                setting="chordPlayer.voicing"
              >
                <Segmented
                  label={t('chordPlayer.settings.voicing')}
                  value={prefs.voicing}
                  options={PROGRESSION_VOICINGS.map((value) => ({
                    value,
                    label: t(`chordPlayer.settings.voicings.${value}`),
                  }))}
                  onChange={(voicing) => setChordPlayer(settingsStore, { voicing })}
                />
              </SettingField>
            </div>
          </SettingsGroup>
        </div>
        <div className="flex flex-col gap-7 lg:pt-7">
          <SettingsGroup flush>
            <RowLink
              title={t('chordPlayer.settings.onScreenPiano')}
              render={<Link to="/settings/on-screen-piano" />}
            />
            <RowLink
              title={t('chordPlayer.settings.connectPiano')}
              value={midi}
              render={<Link to="/settings/connect-piano" />}
            />
          </SettingsGroup>
          <SettingsGroup flush>
            <SwitchRow
              className="px-4"
              label={t('chordPlayer.settings.follow')}
              info={t('chordPlayer.settings.followInfo')}
              setting="chordPlayer.follow"
              checked={prefs.follow}
              onCheckedChange={(follow) => setChordPlayer(settingsStore, { follow })}
            />
            <div className="flex min-h-13 items-center justify-between gap-3 py-2 pr-4 pl-4 text-base">
              <span>{t('chordPlayer.settings.arranger')}</span>
              <span className="truncate text-muted-foreground" aria-live="polite">
                {arrangerValue}
              </span>
            </div>
          </SettingsGroup>
        </div>
      </div>

      <Sheet open={opened !== null} onOpenChange={(open) => (open ? null : setOpened(null))}>
        {opened === 'countIn' ? (
          <SheetContent
            title={t('chordPlayer.settings.countIn')}
            info={t('chordPlayer.settings.countInInfo')}
          >
            <Segmented
              label={t('chordPlayer.settings.countIn')}
              value={settings.countIn}
              options={COUNT_INS.map((bars) => ({ value: bars, label: countIn(bars) }))}
              onChange={(next) => hand.setSettings({ countIn: next })}
            />
          </SheetContent>
        ) : opened === 'volume' ? (
          <SheetContent title={t('chordPlayer.settings.volume')}>
            <div className="flex flex-col gap-6 pb-2">
              <Level
                label={t('chordPlayer.settings.volume')}
                value={settings.volume}
                onChange={(volume) => hand.setSettings({ volume })}
              />
              <section className="flex flex-col gap-4">
                <h3 className="font-sans text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                  {t('chordPlayer.settings.levels')}
                </h3>
                {drawn
                  .filter((part) => settings[part].on)
                  .map((part) => (
                    <Level
                      key={part}
                      label={t(`chordPlayer.settings.${part}`)}
                      value={settings[part].level}
                      onChange={(level) =>
                        hand.setSettings({ [part]: { ...settings[part], level } })
                      }
                    />
                  ))}
              </section>
            </div>
          </SheetContent>
        ) : opened === 'time' ? (
          <SheetContent
            title={t('chordPlayer.settings.time')}
            info={t('chordPlayer.settings.timeInfo')}
          >
            <Segmented
              label={t('chordPlayer.settings.time')}
              value={hand.sheet.meter}
              options={SHEET_METERS.map((meter) => ({ value: meter, label: meter }))}
              onChange={(meter: SheetMeter) => {
                if (meter === hand.sheet.meter) return
                hand.edit((sheet) => relayMeter(sheet, meter))
                say(t('chordPlayer.settings.relaid', { meter }), {
                  label: t('chordPlayer.undo'),
                  onClick: hand.undo,
                })
              }}
            />
          </SheetContent>
        ) : null}
      </Sheet>
    </div>
  )
}
