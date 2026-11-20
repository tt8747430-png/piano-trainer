import { Hourglass, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectPlayback, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { useTapTempo } from '@/features/metronome'
import { useBeat, type BarRange, type Practice, type PracticeMode } from '@/features/practice'
import { setPlayback } from '@/features/set-preference'
import {
  FloatingBarButton,
  GroupField,
  GroupRows,
  GroupRow,
  RadioCards,
  Segmented,
  SettingsGroup,
  Sheet,
  SheetContent,
  SwitchRow,
} from '@/shared/ui'
import { cn, LAPTOP, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { beatsPerBar, tempoWord } from '@/shared/lib/music'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { BETWEENS, type Between } from '../model/practice-view'
import { PlayAlongIcon } from './PlayAlongIcon'
import { DOCK_CAPTIONED } from './dock-sizes'

/** The two ways to practise (its canvas, R37): the music waits for your notes, or plays at its tempo. */
type Way = 'wait' | 'play'
const WAYS: readonly Way[] = ['wait', 'play']
const WAY_ICON: Readonly<Record<Way, LucideIcon>> = { wait: Hourglass, play: PlayAlongIcon }
const wayOf = (mode: PracticeMode): Way => (mode === 'listen' ? 'play' : 'wait')

/** The metronome with the music (Flat's three): silent, one bar counted in, or counting in and clicking on. */
type Click = 'off' | 'countIn' | 'on'
const CLICKS: readonly Click[] = ['off', 'countIn', 'on']

/** A loop's repeats (its board's Repeats): endless, then a few. */
const REPEATS: readonly (number | null)[] = [null, 3, 5, 10]
const BETWEEN_WORD: Readonly<Record<Between, string>> = {
  none: 'betweenNone',
  countIn: 'betweenCountIn',
  rest: 'betweenRest',
}

/** What a loop plays as, once bars are looped: its bars as printed, from 1, and its three rows. */
export interface LoopRows {
  readonly bars: BarRange
  readonly repeats: number | null
  readonly between: Between
  readonly speedUp: boolean
  onRepeats: (times: number | null) => void
  onBetween: (between: Between) => void
  onSpeedUp: (on: boolean) => void
}

/** A filled pill of the tempo's, its colour alone changing on a press (`DESIGN.md`). */
const PILL =
  'flex-none rounded-full font-semibold text-foreground transition-colors hover:bg-muted-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
/** The tempo's − and +: 44 round, the sign 20. */
const STEP = cn(PILL, 'size-11 bg-muted text-xl font-normal')

/**
 * The bar's beats as PlayerApp's Practice sheet draws them: the meter, then a dot a beat, the first
 * 16 and the rest 12, the one sounding lit in honey while the music plays.
 */
function BeatLights({
  performance,
  practice,
}: {
  performance: Performance
  practice: Pick<Practice, 'state' | 'clock'>
}) {
  const now = useBeat(performance, practice)
  const lit = practice.state.playing ? now.beat : null
  const beats = beatsPerBar(performance.meter)
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="min-w-8 text-[0.8125rem]/[normal] font-bold text-muted-foreground tabular-nums">
        {performance.meter}
      </span>
      {Array.from({ length: beats }, (_, beat) => (
        <span
          key={beat}
          aria-hidden
          className={cn(
            'rounded-full',
            beat === 0 ? 'size-4' : 'size-3',
            beat === lit ? 'bg-honey-ring' : beat === 0 ? 'bg-muted-foreground/40' : 'bg-border',
          )}
        />
      ))}
      <span aria-hidden className="min-w-8" />
    </div>
  )
}

/**
 * The transport's Practice (its canvas's Practice sheet, R37): its button wears the way chosen, its
 * picture over its name. The sheet holds Wait and Play as two cards, then the tempo as PlayerApp
 * draws it (the meter and its beats; − the BPM and its mark +, then Tap; the score's tempo to go back
 * to where it differs) and the metronome, Off · Count-in · On. Each works in both ways; nothing
 * disables another.
 */
export function PracticeSheet({
  performance,
  practice,
  mode,
  tempo,
  ownTempo,
  piano,
  handsAtKeys = false,
  click,
  onWait,
  onPlay,
  onTempo,
  onClick,
  loop,
}: {
  /** The loop's rows, while bars are looped; none without. */
  loop: LoopRows | null
  performance: Performance
  /** Where the music is, for the beat sounding. */
  practice: Pick<Practice, 'state' | 'clock'>
  mode: PracticeMode
  tempo: number
  ownTempo: number
  /** Whether a piano is there to play: a MIDI keyboard connected, or the keys on screen. */
  piano: boolean
  /** The hands stand in the keys' place: the keys on screen are theirs, not to be played. */
  handsAtKeys?: boolean
  /** The metronome clicking with the music. */
  click: boolean
  onWait: () => void
  onPlay: (tempo: number) => void
  onTempo: (tempo: number) => void
  onClick: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const taps = useTapTempo()
  const { t: tMusic } = useTranslation('music')
  const { t: tPractice } = useTranslation('practice')
  const settings = useSettingsStoreApi()
  const { countdown } = useSettings(selectPlayback)
  const [open, setOpen] = useState(false)
  const laptop = useMediaQuery(LAPTOP)
  const way = wayOf(mode)
  const Icon = WAY_ICON[way]
  const name = t(`practiceSheet.${way}`)
  const metronome: Click = click ? 'on' : countdown === 'none' ? 'off' : 'countIn'
  const setMetronome = (next: Click) => {
    setPlayback(settings, { countdown: next === 'off' ? 'none' : 'audible' })
    onClick(next === 'on')
  }
  const button = (
    <FloatingBarButton
      label={t('practiceSheet.of', { mode: name })}
      caption={name}
      aria-haspopup="dialog"
      className={DOCK_CAPTIONED}
      // The popover's trigger opens and closes it itself.
      {...(laptop ? {} : { onClick: () => setOpen(true) })}
    >
      <Icon aria-hidden />
    </FloatingBarButton>
  )
  const body = (
    <div className="flex flex-col gap-5">
      <RadioCards
        label={t('practiceSheet.title')}
        value={way}
        cards={WAYS.map((each) => ({
          value: each,
          label: t(`practiceSheet.${each}`),
          picture: (() => {
            const Icon = WAY_ICON[each]
            return <Icon className="size-6" />
          })(),
        }))}
        onChange={(next) => (next === 'play' ? onPlay(tempo) : onWait())}
      />
      {way === 'wait' && !piano ? (
        <p className="-mt-2 text-sm text-pretty text-muted-foreground">
          {t(handsAtKeys ? 'pace.needsKeysNotHands' : 'pace.needsPiano')}
        </p>
      ) : null}
      <SettingsGroup bare title={t('practiceSheet.tempo')}>
        <GroupRows surface="sheet" label={t('practiceSheet.tempo')}>
          <GroupField className="flex-col items-stretch gap-3 p-4">
            <BeatLights performance={performance} practice={practice} />
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label={tPractice('metronome.slower', { step: 1 })}
                title={tPractice('metronome.slower', { step: 1 })}
                onClick={() => onTempo(tempo - 1)}
                className={STEP}
              >
                −
              </button>
              <p className="flex min-w-25 flex-col items-center">
                <span className="sr-only">{tPractice('metronome.tempo', { bpm: tempo })}</span>
                <span aria-hidden className="text-[2.5rem]/none font-bold tabular-nums">
                  {tempo}
                </span>
                <span
                  aria-hidden
                  className="mt-1 text-xs/[normal] font-semibold text-muted-foreground"
                >
                  {`${tPractice('metronome.bpm')} · ${tMusic(`tempoWord.${tempoWord(tempo)}.name`)}`}
                </span>
              </p>
              <button
                type="button"
                aria-label={tPractice('metronome.faster', { step: 1 })}
                title={tPractice('metronome.faster', { step: 1 })}
                onClick={() => onTempo(tempo + 1)}
                className={STEP}
              >
                +
              </button>
              <button
                type="button"
                aria-label={tPractice('metronome.tap')}
                onClick={() => {
                  const bpm = taps.tap()
                  if (bpm !== null) onTempo(bpm)
                }}
                className={cn(PILL, 'h-11 bg-hairline px-4 text-sm')}
              >
                {t('practiceSheet.tap')}
              </button>
            </div>
            {tempo === ownTempo ? null : (
              <button
                type="button"
                onClick={() => onTempo(ownTempo)}
                className={cn(PILL, 'h-7.5 self-center bg-muted px-4 text-[0.8125rem]')}
              >
                {t('practiceSheet.scoreTempo', { tempo: ownTempo })}
              </button>
            )}
          </GroupField>
          <GroupRow label={t('practiceSheet.metronome')} setting="playback.countdown">
            <span className="w-59 shrink-0">
              <Segmented
                label={t('practiceSheet.metronome')}
                value={metronome}
                options={CLICKS.map((each) => ({
                  value: each,
                  label: t(
                    `practiceSheet.metronome${each === 'off' ? 'Off' : each === 'on' ? 'On' : 'CountIn'}`,
                  ),
                }))}
                onChange={setMetronome}
              />
            </span>
          </GroupRow>
        </GroupRows>
      </SettingsGroup>
      {loop ? (
        <SettingsGroup
          bare
          title={
            loop.bars.first === loop.bars.last
              ? t('practiceSheet.loopBar', { first: loop.bars.first })
              : t('practiceSheet.loopBars', loop.bars)
          }
        >
          <GroupRows surface="sheet" label={t('loop')}>
            <GroupRow label={t('practiceSheet.repeats')}>
              <span className="w-47 shrink-0">
                <Segmented
                  label={t('practiceSheet.repeats')}
                  value={loop.repeats ?? 0}
                  options={REPEATS.map((times) =>
                    times === null
                      ? { value: 0, label: '∞', title: t('practiceSheet.endless') }
                      : { value: times, label: String(times) },
                  )}
                  onChange={(times) => loop.onRepeats(times === 0 ? null : times)}
                />
              </span>
            </GroupRow>
            <GroupRow label={t('practiceSheet.between')}>
              <span className="w-44 shrink-0">
                <Segmented
                  label={t('practiceSheet.between')}
                  value={loop.between}
                  options={BETWEENS.map((each) => ({
                    value: each,
                    label: t(`practiceSheet.${BETWEEN_WORD[each]}`),
                  }))}
                  onChange={loop.onBetween}
                />
              </span>
            </GroupRow>
            <SwitchRow
              label={t('practiceSheet.speedUp')}
              checked={loop.speedUp}
              onCheckedChange={loop.onSpeedUp}
              className="min-h-12 border-b-0 ps-4 pe-3"
            />
          </GroupRows>
        </SettingsGroup>
      ) : null}
    </div>
  )
  // On a laptop a popover over its button, as PlayerDesk draws it: 420 wide, 16 round, 12 in, its
  // title at its left and no Done; on a phone the sheet.
  if (laptop)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={button} />
        <PopoverContent
          side="top"
          sideOffset={12}
          aria-label={t('practiceSheet.title')}
          className="max-h-(--available-height) w-105 gap-3 overflow-y-auto rounded-2xl p-3"
        >
          <h2 className="px-1 font-sans text-[1.0625rem]/[normal] font-semibold">
            {t('practiceSheet.title')}
          </h2>
          {body}
        </PopoverContent>
      </Popover>
    )
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {button}
      <SheetContent title={t('practiceSheet.title')}>{body}</SheetContent>
    </Sheet>
  )
}
