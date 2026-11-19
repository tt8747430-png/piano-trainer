import { Gauge, SlidersHorizontal, SlidersVertical, X } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { midi, type KeyRange } from '@/shared/lib/music'
import {
  FloatingPiece,
  FloatingPlayPiece,
  nameMark,
  RoundButton,
  ScreenHeader,
  Sheet,
  SheetContent,
  type KeyMark,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Progress } from '@/shared/ui/primitives/progress'
import {
  usePlayerShortcuts,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { PlayerPlayback } from '@/widgets/player-settings'
import { SettingsExtrasContext, type SettingsExtras } from '@/widgets/player-setup'
import { runChords, runPlace } from '../model/run-music'
import { RunStaff } from './RunStaff'
import { SongHead } from './SongHead'

/** The run boards' keys: F3 to G5 on a phone (`calmKeys(53, 79)`), C2 to C7 on a laptop (`calmKeys(36, 96)`). */
const PHONE_KEYS: KeyRange = { from: midi(53), to: midi(79) }
const LAPTOP_KEYS: KeyRange = { from: midi(36), to: midi(96) }
/** The run boards' keys stand 112 tall on a phone, 170 on a laptop (`RS_KEYS`). */
const PHONE_KEYS_PX = 112
const LAPTOP_KEYS_PX = 170
/** The music shown at once: two lines of four bars on a phone, one of eight on a laptop (`PV_LINE`). */
const SHOWN = 8

/**
 * A run's own view (walk the chords, a chromatic walk, a progression through the keys), as the run
 * boards draw it (`r56_results.py`'s `PV_RUN`), never the song Player's chrome: the bar (Close, the
 * run's name, the gear), its chords on the paper as whole notes on the treble staff, where it stands
 * ("Chord 1 of 8", "Key 1 of 12"), the keys edge to edge at the foot with the chord sounding in its
 * tones' paints, and the floating Setup · Play · Tempo 12 over them. Setup opens with the run, its
 * Start beginning it; Tempo opens it too.
 */
export function RunLayout({
  title,
  onClose,
  view,
  player,
  performance,
  keys,
  setup,
  settings,
}: {
  title: string
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** How many keys it walks: one counts its chords, more its keys. */
  keys: number
  /** The run's own choices (its root, chord size, keys), in the Setup over it. */
  setup: ReactNode
  /** The gear's sheet: how the run is played (its pattern, its feel). */
  settings: ReactNode
}) {
  const { t } = useTranslation(['player', 'music', 'common'])
  const laptop = useMediaQuery(LAPTOP)
  const { practice } = player
  const playing = practice.state.playing
  usePlayerShortcuts(player, view, onClose)
  const [setupOpen, setSetupOpen] = useState(true)
  const chords = useMemo(() => runChords(performance), [performance])
  const current = performance.beatGroups[practice.state.beatGroup]?.chord ?? 0
  const place = runPlace(current, chords.length, keys)
  const where =
    place.unit === 'key'
      ? t('player:run.key', { at: place.at, of: place.of })
      : t('player:run.chord', { at: place.at, of: place.of })
  // The eight bars round the chord sounding: the page it falls on.
  const first = Math.floor(current / SHOWN) * SHOWN
  const shown = chords.slice(first, first + SHOWN)
  const chord = chords[current]
  const marks = useMemo(
    () =>
      new Map<ReturnType<typeof midi>, KeyMark>(
        chord?.keys.map((key) => [key.midi, nameMark(key)]) ?? [],
      ),
    [chord],
  )
  const extras: SettingsExtras = {
    head: <SongHead title={title} detail={t('music:bpm', { tempo: player.tempo })} acts={[]} />,
    pages: [
      {
        id: 'playback',
        label: t('player:settingsPage.playback'),
        icon: SlidersHorizontal,
        content: <PlayerPlayback />,
      },
    ],
    acts: [],
  }
  const start = () => {
    setSetupOpen(false)
    practice.play()
  }
  return (
    <div className="flex min-h-screen-free flex-col">
      <ScreenHeader
        title={title}
        back={<RoundButton label={t('common:close')} icon={X} onClick={onClose} />}
        settings={
          <div className="flex items-center rounded-pill glass">
            <SettingsExtrasContext value={extras}>{settings}</SettingsExtrasContext>
          </div>
        }
      />
      {/* The music on the paper, 4 under the bar on a phone (main's 4 16 34, a column 16 apart);
          centred in the band over the keys on a laptop (8 under the bar, 16 over the keys), eight bars at
          1.35 in a 1177 column. */}
      <div className="flex flex-1 flex-col gap-4 pt-1 lg:-mb-8 lg:items-center lg:justify-center lg:pt-2">
        <div className="flex w-full flex-col gap-4 lg:max-w-[73.5625rem] lg:gap-2">
          {laptop ? (
            <div className="[zoom:1.35]">
              <RunStaff chords={shown} cell={104} end />
            </div>
          ) : (
            <>
              <RunStaff chords={shown.slice(0, 4)} cell={76} end={false} />
              {shown.length > 4 ? <RunStaff chords={shown.slice(4)} cell={76} end /> : null}
            </>
          )}
          <div className="flex items-center gap-3">
            <Progress
              value={place.at}
              max={place.of}
              aria-label={where}
              getAriaValueText={() => where}
              className="flex-1 [&_[data-slot=progress-indicator]]:bg-learned [&_[data-slot=progress-track]]:h-2"
            />
            <span
              aria-hidden
              className="shrink-0 text-sm/[normal] text-muted-foreground tabular-nums"
            >
              {where}
            </span>
          </div>
        </div>
      </div>
      <PinnedKeyboard
        shown={{ keys: chord?.keys.map((key) => key.midi) ?? [], marks }}
        range={laptop ? LAPTOP_KEYS : PHONE_KEYS}
        sized={laptop ? LAPTOP_KEYS_PX : PHONE_KEYS_PX}
        screen="playing"
        className="lg:shadow-[0_-1px_0_var(--color-hairline)]"
      />
      {/* The floating Setup · Play · Tempo (`RUNBAR`), hugging its acts on the column's centre, 12 over
          the keys on a phone and 16 on a laptop, reserving no space. */}
      <div
        role="toolbar"
        aria-label={t('player:run.transport')}
        className="pointer-events-none fixed inset-x-3 bottom-[calc(var(--nav-bar)+var(--docked,0px)+0.75rem)] z-20 flex items-center justify-center gap-3 *:pointer-events-auto print:hidden lg:right-0 lg:left-sidebar lg:bottom-[calc(var(--nav-bar)+var(--docked,0px)+1rem)] lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed lg:group-data-[sidebar=focus]/main:left-0"
      >
        <FloatingPiece
          label={t('player:setup')}
          caption={t('player:setup')}
          onClick={() => setSetupOpen(true)}
        >
          <SlidersVertical aria-hidden />
        </FloatingPiece>
        <FloatingPlayPiece
          label={t('player:run.play')}
          playing={playing}
          onClick={() => {
            setSetupOpen(false)
            if (playing) practice.stop()
            else practice.play()
          }}
        />
        <FloatingPiece
          label={t('player:run.tempo')}
          caption={t('music:bpm', { tempo: player.tempo })}
          onClick={() => setSetupOpen(true)}
        >
          <Gauge aria-hidden />
        </FloatingPiece>
      </div>
      <Sheet
        swipeDirection={laptop ? 'right' : 'down'}
        modal={!laptop}
        open={setupOpen}
        onOpenChange={setSetupOpen}
      >
        <SheetContent title={t('player:setup')} rising dismiss="close">
          <div className="flex flex-col gap-6">
            {setup}
            {laptop ? null : (
              <Button size="lg" className="-mt-2 h-13 w-full text-[1.0625rem] font-bold" onClick={start}>
                {t('player:run.start')}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
