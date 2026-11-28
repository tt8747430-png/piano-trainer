import { Check } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BAND_PARTS,
  COUNT_INS,
  SHEET_PLAYS,
  SHEET_TEMPO,
  TRANSPOSE_RANGE,
} from '@/entities/chord-sheet'
import { useShelfName, type Style, type StyleBook } from '@/entities/pattern'
import {
  PROGRESSION_NAMES,
  PROGRESSION_VOICINGS,
  selectChordPlayer,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { useMidiSummary } from '@/features/connect-midi'
import { setChordPlayer } from '@/features/set-preference'
import { formatPercent, localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { relayMeter, SHEET_METERS, type SheetMeter } from '@/shared/lib/arrangement'
import { pitchClassOf } from '@/shared/lib/music'
import {
  BackButton,
  GroupRow,
  GroupRows,
  GroupSegmented,
  GroupSwitch,
  RootGrid,
  RowButton,
  sayUndo,
  Segmented,
  SettingsGroup,
  Stepper,
  SwitchRow,
} from '@/shared/ui'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import type { ChordSheetInHand } from '../model/use-chord-sheet'

const PERCENT = { style: 'unit', unit: 'percent' } as const
const STEP = 5

/** A section of a panel or page (the board's `_SECT77`): its head at 15/600 over its control, 8 apart. */
function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <h3 className="font-sans text-[0.9375rem] font-semibold">{title}</h3>
      {children}
    </section>
  )
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
      className="flex flex-col gap-2"
    >
      <div className="flex justify-between gap-3 text-base">
        <SliderLabel>{label}</SliderLabel>
        <span className="text-muted-foreground tabular-nums">{formatPercent(locale, value)}</span>
      </div>
    </Slider>
  )
}

/**
 * Audio (the board's `SOUND77`, the Player's Audio page shape): the card of Piano, Bass and Drums,
 * each a switch (at least one on; a part the style has none of not drawn) and Volume ›, its page the
 * volume and each instrument's level; then Voicing over its segmented control, 24 apart.
 */
export function AudioBody({ hand, style }: { hand: ChordSheetInHand; style: Style }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const prefs = useSettings(selectChordPlayer)
  const settingsStore = useSettingsStoreApi()
  const [volume, setVolume] = useState(false)
  const { settings } = hand.entry
  const drawn = BAND_PARTS.filter(
    (part) => part === 'piano' || (part === 'bass' ? style.hasBass : style.hasDrums),
  )
  const onCount = drawn.filter((part) => settings[part].on).length
  if (volume)
    return (
      <div className="flex flex-col gap-6">
        <div className="-ms-3 -mt-2 flex items-center gap-1">
          <BackButton onClick={() => setVolume(false)} />
          <h3 className="font-sans text-[0.9375rem] font-semibold">
            {t('chordPlayer.settings.volume')}
          </h3>
        </div>
        <Level
          label={t('chordPlayer.settings.volume')}
          value={settings.volume}
          onChange={(next) => hand.setSettings({ volume: next })}
        />
        {drawn
          .filter((part) => settings[part].on)
          .map((part) => (
            <Level
              key={part}
              label={t(`chordPlayer.settings.${part}`)}
              value={settings[part].level}
              onChange={(level) => hand.setSettings({ [part]: { ...settings[part], level } })}
            />
          ))}
      </div>
    )
  return (
    <div className="flex flex-col gap-6">
      <SettingsGroup flush>
        {drawn.map((part) => {
          const last = settings[part].on && onCount === 1
          return (
            <SwitchRow
              key={part}
              label={t(`chordPlayer.settings.${part}`)}
              checked={settings[part].on}
              disabled={last}
              reason={last ? t('chordPlayer.settings.lastOn') : undefined}
              onCheckedChange={(on) => hand.setSettings({ [part]: { ...settings[part], on } })}
            />
          )
        })}
        <RowButton
          title={t('chordPlayer.settings.volume')}
          value={formatPercent(locale, settings.volume)}
          opens
          onClick={() => setVolume(true)}
        />
      </SettingsGroup>
      <PanelSection title={t('chordPlayer.settings.voicing')}>
        <Segmented
          label={t('chordPlayer.settings.voicing')}
          value={prefs.voicing}
          options={PROGRESSION_VOICINGS.map((value) => ({
            value,
            label: t(`chordPlayer.settings.voicings.${value}`),
          }))}
          onChange={(voicing) => setChordPlayer(settingsStore, { voicing })}
        />
      </PanelSection>
    </div>
  )
}

/**
 * Chart (the board's `CHART77`): Time signature in the card (its choice laid out again, with Undo),
 * then Written as over its segmented control.
 */
export function ChartBody({ hand }: { hand: ChordSheetInHand }) {
  const { t } = useTranslation('practice')
  const prefs = useSettings(selectChordPlayer)
  const settingsStore = useSettingsStoreApi()
  return (
    <div className="flex flex-col gap-6">
      <PanelSection title={t('chordPlayer.settings.time')}>
        <Segmented
          label={t('chordPlayer.settings.time')}
          value={hand.sheet.meter}
          options={SHEET_METERS.map((meter) => ({ value: meter, label: meter }))}
          onChange={(meter: SheetMeter) => {
            if (meter === hand.sheet.meter) return
            hand.edit((sheet) => relayMeter(sheet, meter))
            sayUndo(t('chordPlayer.settings.relaid', { meter }), hand.undo)
          }}
        />
      </PanelSection>
      <PanelSection title={t('chordPlayer.settings.writtenAs')}>
        <Segmented
          label={t('chordPlayer.settings.writtenAs')}
          value={prefs.names}
          options={PROGRESSION_NAMES.map((value) => ({
            value,
            label: t(`chordPlayer.settings.names.${value}`),
          }))}
          onChange={(names) => setChordPlayer(settingsStore, { names })}
        />
      </PanelSection>
    </div>
  )
}

/**
 * MIDI (the board's `MIDI77`, the Player's MIDI keyboard popover): the keyboard in use and, with none,
 * how to connect one; then Follow a MIDI arranger.
 */
export function MidiBody() {
  const { t } = useTranslation(['practice', 'common'])
  const midi = useMidiSummary()
  const prefs = useSettings(selectChordPlayer)
  const settingsStore = useSettingsStoreApi()
  return (
    <SettingsGroup flush>
      <div className="flex min-h-12 items-center gap-3 px-4">
        <span className="flex-1 text-base">{t('common:midi.label')}</span>
        <span className="truncate text-muted-foreground" aria-live="polite">
          {midi}
        </span>
      </div>
      <SwitchRow
        label={t('chordPlayer.settings.follow')}
        setting="chordPlayer.follow"
        checked={prefs.follow}
        onCheckedChange={(follow) => setChordPlayer(settingsStore, { follow })}
      />
    </SettingsGroup>
  )
}

/** Follow a MIDI arranger alone, its card under the Genos panel (the board's `FOLLOW77`). */
export function FollowRow() {
  const { t } = useTranslation('practice')
  const prefs = useSettings(selectChordPlayer)
  const settingsStore = useSettingsStoreApi()
  return (
    <SettingsGroup flush>
      <SwitchRow
        label={t('chordPlayer.settings.follow')}
        setting="chordPlayer.follow"
        checked={prefs.follow}
        onCheckedChange={(follow) => setChordPlayer(settingsStore, { follow })}
      />
    </SettingsGroup>
  )
}

/**
 * The styles (the board's `STYLEROWS`): one card of rows 48 high, the chosen checked and its name at
 * 600, each style's feel after it, quiet.
 */
export function StyleRows({
  book,
  value,
  onChoose,
}: {
  book: StyleBook
  value: string
  onChoose(style: Style): void
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const shelfName = useShelfName()
  return (
    <div
      role="radiogroup"
      aria-label={t('chordPlayer.style')}
      className="flex flex-col overflow-hidden card"
    >
      {book.families
        .flatMap(({ styles }) => styles)
        .map((style, at) => {
          const chosen = style.id === value
          return (
            <button
              key={style.id}
              type="button"
              role="radio"
              aria-checked={chosen}
              onClick={() => onChoose(style)}
              className={cn(
                'flex min-h-12 cursor-pointer items-center gap-3 px-3 text-left text-[0.9375rem] hover:bg-muted/60 focus-visible:-outline-offset-3',
                at > 0 && 'border-t border-border',
              )}
            >
              <Check
                aria-hidden
                className={cn('size-5 shrink-0', chosen ? 'opacity-100' : 'opacity-0')}
              />
              <span className={cn('min-w-0 flex-1 truncate', chosen && 'font-semibold')}>
                {localText(style.name, locale)}
              </span>
              {style.shelf ? (
                <span className="shrink-0 text-footnote text-muted-foreground">
                  {shelfName({ shelf: style.shelf })}
                </span>
              ) : null}
            </button>
          )
        })}
    </div>
  )
}

/** Playback options (the board's `_OPTS`): Repeats and Count-in. */
export function PlaybackBody({
  hand,
  metronome = false,
}: {
  hand: ChordSheetInHand
  /** The metronome's row (a phone's, Flat's Playback options): a laptop has it in the band. */
  metronome?: boolean
}) {
  const { t } = useTranslation(['practice', 'common'])
  const { settings } = hand.entry
  // One card of rows, the board's `_OPTS`: Repeats with its stepper at the row's end, Count-in under its
  // name, the metronome's switch on a phone.
  return (
    <GroupRows surface="sheet" label={t('common:playbackOptions')}>
      <GroupRow label={t('chordPlayer.dock.plays')}>
        <Stepper
          label={t('chordPlayer.dock.plays')}
          value={settings.plays}
          min={0}
          max={SHEET_PLAYS}
          format={(count) =>
            count === 0 ? t('chordPlayer.dock.untilStop') : t('chordPlayer.times', { count })
          }
          decrease={t('chordPlayer.fewer')}
          increase={t('chordPlayer.moreTimes')}
          onChange={(plays) => hand.setSettings({ plays })}
        />
      </GroupRow>
      <GroupSegmented
        label={t('chordPlayer.settings.countIn')}
        value={settings.countIn}
        options={COUNT_INS.map((bars) => ({
          value: bars,
          label: t(`chordPlayer.settings.countIns.${bars}`),
        }))}
        onChange={(countIn) => hand.setSettings({ countIn })}
      />
      {metronome ? (
        <GroupSwitch
          label={t('chordPlayer.metronome.label')}
          checked={settings.click}
          onCheckedChange={(click) => hand.setSettings({ click })}
        />
      ) : null}
    </GroupRows>
  )
}

/**
 * The key the sheet is heard in (the board's Key, a wheel of keys): the twelve in sight (the kit's
 * `RootGrid`), in the sheet's own mode; a key taken moves the sheet there the short way (−5 to +6).
 */
export function KeyBody({ hand }: { hand: ChordSheetInHand }) {
  const { t } = useTranslation('practice')
  return (
    <RootGrid
      label={t('chordPlayer.dock.key')}
      value={hand.shown.key.tonic}
      onChange={(root) => {
        const up = (pitchClassOf(root) - pitchClassOf(hand.sheet.key.tonic) + 12) % 12
        hand.setSettings({ transpose: up > TRANSPOSE_RANGE.max ? up - 12 : up })
      }}
    />
  )
}

/** The tempo, typed or stepped. */
export function TempoBody({ hand }: { hand: ChordSheetInHand }) {
  const { t } = useTranslation('practice')
  return (
    <div className="flex justify-center [&_input]:w-20 [&_input]:text-center">
      <Stepper
        label={t('chordPlayer.tempo')}
        value={hand.entry.tempo}
        min={SHEET_TEMPO.min}
        max={SHEET_TEMPO.max}
        typed
        format={(count) => t('chordPlayer.bpm', { count })}
        decrease={t('chordPlayer.slower')}
        increase={t('chordPlayer.faster')}
        onChange={(tempo) => hand.setEntry({ tempo })}
      />
    </div>
  )
}
