import { Link, useSearch } from '@tanstack/react-router'
import { Cable, Drum, Guitar, Piano } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BAND_PARTS, type BandPart } from '@/entities/chord-sheet'
import { styleBook, usePatternBook } from '@/entities/pattern'
import {
  PROGRESSION_NAMES,
  PROGRESSION_VOICINGS,
  selectChordPlayer,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setChordPlayer } from '@/features/set-preference'
import type { ArrangerStatus } from '@/shared/api/midi'
import { formatPercent, useLocale } from '@/shared/i18n'
import { relayMeter, SHEET_METERS, type SheetMeter } from '@/shared/lib/arrangement'
import { useServices } from '@/shared/lib/services'
import {
  BackButton,
  ChoiceCard,
  Labelled,
  MenuPicker,
  RowLink,
  say,
  ScreenHeader,
  SettingsGroup,
  SwitchRow,
} from '@/shared/ui'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useChordSheet } from '@/widgets/chord-player'

const PERCENT = { style: 'unit', unit: 'percent' } as const
const STEP = 5
const ICONS: Readonly<Record<BandPart, ReactNode>> = {
  piano: <Piano aria-hidden className="size-5" />,
  bass: <Guitar aria-hidden className="size-5" />,
  drums: <Drum aria-hidden className="size-5" />,
}

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
      className="flex flex-col gap-2 px-4 pb-3"
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

/**
 * The Chord player's Settings (`/practice/chord-player/settings`, R29 CP6), a lesson's page's shape:
 * Instruments (each on or off and its level, at least one on, a part the style has none of not
 * drawn), Playing (Count-in, Volume), Music (Time signature, Written as, Voicing; the key heard and
 * the times through are the bar's Key and Repeats), then the on-screen piano's and a connected piano's own pages. All but Written as and
 * Voicing belong to the sheet open, saved with it.
 */
export function ChordPlayerSettingsPage() {
  const { t } = useTranslation('practice')
  const { sheet: sheetId } = useSearch({ from: '/shell/practice/chord-player/settings' })
  const hand = useChordSheet(sheetId)
  const patterns = usePatternBook()
  const book = useMemo(() => styleBook(patterns), [patterns])
  const prefs = useSettings(selectChordPlayer)
  const settingsStore = useSettingsStoreApi()
  const arranger = useArrangerStatus(prefs.follow)
  if (!hand) return null
  const { settings } = hand.entry
  const style = book.get(hand.entry.style)
  const drawn = BAND_PARTS.filter(
    (part) => part === 'piano' || (part === 'bass' ? style.hasBass : style.hasDrums),
  )
  const onCount = drawn.filter((part) => settings[part].on).length
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('chordPlayer.settings.title')} back={<BackButton />} />
      <div className="mx-auto grid w-full max-w-5xl gap-7 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-7">
          <SettingsGroup flush title={t('chordPlayer.settings.instruments')}>
            {drawn.map((part) => {
              const name = t(`chordPlayer.settings.${part}`)
              const last = settings[part].on && onCount === 1
              return (
                <div key={part} className="flex flex-col">
                  <SwitchRow
                    className="px-4"
                    icon={ICONS[part]}
                    label={name}
                    checked={settings[part].on}
                    disabled={last}
                    reason={last ? t('chordPlayer.settings.lastOn') : undefined}
                    info={last ? t('chordPlayer.settings.lastOn') : undefined}
                    onCheckedChange={(on) =>
                      hand.setSettings({ [part]: { ...settings[part], on } })
                    }
                  />
                  {settings[part].on ? (
                    <Level
                      label={t('chordPlayer.settings.level', { part: name })}
                      value={settings[part].level}
                      onChange={(level) =>
                        hand.setSettings({ [part]: { ...settings[part], level } })
                      }
                    />
                  ) : null}
                </div>
              )
            })}
          </SettingsGroup>
          <SettingsGroup flush title={t('chordPlayer.settings.playing')}>
            <SwitchRow
              className="px-4"
              label={t('chordPlayer.settings.countIn')}
              info={t('chordPlayer.settings.countInInfo')}
              checked={settings.countIn}
              onCheckedChange={(countIn) => hand.setSettings({ countIn })}
            />
            <div className="pt-3">
              <Level
                label={t('chordPlayer.settings.volume')}
                value={settings.volume}
                onChange={(volume) => hand.setSettings({ volume })}
              />
            </div>
          </SettingsGroup>
        </div>
        <div className="flex flex-col gap-7">
          <SettingsGroup title={t('chordPlayer.settings.music')}>
            <div className="flex flex-col gap-5 p-4">
              <Labelled
                label={t('chordPlayer.settings.time')}
                info={t('chordPlayer.settings.timeInfo')}
              >
                <MenuPicker
                  label={t('chordPlayer.settings.time')}
                  value={hand.sheet.meter}
                  options={SHEET_METERS.map((meter) => ({ value: meter, label: meter }))}
                  onChange={(meter: SheetMeter) => {
                    hand.edit((sheet) => relayMeter(sheet, meter))
                    say(t('chordPlayer.settings.relaid', { meter }), {
                      label: t('chordPlayer.undo'),
                      onClick: hand.undo,
                    })
                  }}
                />
              </Labelled>
            </div>
          </SettingsGroup>
          <ChoiceCard
            title={t('chordPlayer.settings.writtenAs')}
            setting="chordPlayer.names"
            value={prefs.names}
            options={PROGRESSION_NAMES.map((value) => ({
              value,
              label: t(`chordPlayer.settings.names.${value}`),
            }))}
            onChange={(names) => setChordPlayer(settingsStore, { names })}
          />
          <ChoiceCard
            title={t('chordPlayer.settings.voicing')}
            setting="chordPlayer.voicing"
            info={t('chordPlayer.settings.voicingInfo')}
            value={prefs.voicing}
            options={PROGRESSION_VOICINGS.map((value) => ({
              value,
              label: t(`chordPlayer.settings.voicings.${value}`),
            }))}
            onChange={(voicing) => setChordPlayer(settingsStore, { voicing })}
          />
          <SettingsGroup flush>
            <RowLink
              title={t('chordPlayer.settings.onScreenPiano')}
              icon={Piano}
              paint="sand"
              render={<Link to="/settings/on-screen-piano" />}
            />
            <RowLink
              title={t('chordPlayer.settings.connectPiano')}
              icon={Cable}
              paint="sky"
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
            <div className="flex min-h-12 items-center justify-between gap-3 px-4 text-base">
              <span>{t('chordPlayer.settings.arranger')}</span>
              <span className="truncate text-muted-foreground" aria-live="polite">
                {!prefs.follow
                  ? t('chordPlayer.settings.arrangerState.off')
                  : arranger?.state === 'connected'
                    ? t('chordPlayer.settings.arrangerState.connected', { device: arranger.device })
                    : arranger?.state === 'denied'
                      ? t('chordPlayer.settings.arrangerState.denied')
                      : arranger?.state === 'unsupported'
                        ? t('chordPlayer.settings.arrangerState.unsupported')
                        : t('chordPlayer.settings.arrangerState.noDevice')}
              </span>
            </div>
          </SettingsGroup>
        </div>
      </div>
    </div>
  )
}
