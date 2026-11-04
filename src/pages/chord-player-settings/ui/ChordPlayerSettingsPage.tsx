import { Link, useSearch } from '@tanstack/react-router'
import { Cable, Drum, Guitar, KeyboardMusic, Minus, Piano, Plus } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BAND_PARTS, TRANSPOSE_RANGE, type BandPart } from '@/entities/chord-sheet'
import { styleBook, usePatternBook } from '@/entities/pattern'
import {
  PROGRESSION_NAMES,
  PROGRESSION_VOICINGS,
  selectChordPlayer,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setChordPlayer } from '@/features/set-preference'
import { formatPercent, useKeyName, useLocale } from '@/shared/i18n'
import { relayMeter, SHEET_METERS, type SheetMeter } from '@/shared/lib/arrangement'
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
import { Button } from '@/shared/ui/primitives/button'
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

/**
 * The Chord player's Settings (`/practice/chord-player/settings`, R29 CP6), a lesson's page's shape:
 * Instruments (each on or off and its level, at least one on, a part the style has none of not
 * drawn), Playing (Count-in, Repeat the sheet, Volume), Music (Time signature, Transpose, Written as,
 * Voicing), then the on-screen piano's and a connected piano's own pages. All but Written as and
 * Voicing belong to the sheet open, saved with it.
 */
export function ChordPlayerSettingsPage() {
  const { t } = useTranslation('practice')
  const keyName = useKeyName()
  const { sheet: sheetId } = useSearch({ from: '/shell/practice/chord-player/settings' })
  const hand = useChordSheet(sheetId)
  const patterns = usePatternBook()
  const book = useMemo(() => styleBook(patterns), [patterns])
  const prefs = useSettings(selectChordPlayer)
  const settingsStore = useSettingsStoreApi()
  if (!hand) return null
  const { settings } = hand.entry
  const style = book.get(hand.entry.style)
  const drawn = BAND_PARTS.filter(
    (part) => part === 'piano' || (part === 'bass' ? style.hasBass : style.hasDrums),
  )
  const onCount = drawn.filter((part) => settings[part].on).length
  const from = keyName(hand.sheet.key)
  const to = keyName(hand.shown.key)
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
              label={t('chordPlayer.settings.countIn')}
              info={t('chordPlayer.settings.countInInfo')}
              checked={settings.countIn}
              onCheckedChange={(countIn) => hand.setSettings({ countIn })}
            />
            <SwitchRow
              label={t('chordPlayer.settings.repeat')}
              info={t('chordPlayer.settings.repeatInfo')}
              checked={settings.repeat}
              onCheckedChange={(repeat) => hand.setSettings({ repeat })}
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
              <Labelled label={t('chordPlayer.settings.transpose')}>
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    role="group"
                    aria-label={t('chordPlayer.settings.transpose')}
                    className="flex items-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-11"
                      aria-label={t('chordPlayer.settings.down')}
                      disabled={settings.transpose <= TRANSPOSE_RANGE.min}
                      onClick={() => hand.setSettings({ transpose: settings.transpose - 1 })}
                    >
                      <Minus aria-hidden />
                    </Button>
                    <span className="min-w-10 text-center text-lg font-semibold tabular-nums">
                      {settings.transpose > 0
                        ? `+${settings.transpose}`
                        : settings.transpose < 0
                          ? `−${-settings.transpose}`
                          : '0'}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-11"
                      aria-label={t('chordPlayer.settings.up')}
                      disabled={settings.transpose >= TRANSPOSE_RANGE.max}
                      onClick={() => hand.setSettings({ transpose: settings.transpose + 1 })}
                    >
                      <Plus aria-hidden />
                    </Button>
                  </div>
                  <span className="text-muted-foreground" aria-live="polite">
                    {t('chordPlayer.settings.transposeTo', { from, to })}
                  </span>
                </div>
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
              icon={KeyboardMusic}
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
        </div>
      </div>
    </div>
  )
}
