import { Link } from '@tanstack/react-router'
import {
  Gauge,
  Metronome as MetronomeGlyph,
  Minus,
  Play,
  Plus,
  Square,
  type LucideIcon,
} from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BeatSquares, type Metronome } from '@/features/metronome'
import { selectTuner, useSettings } from '@/entities/settings'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { OpensMark, PAGE_TILES, PAINT, type Paint } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Switch } from '@/shared/ui/primitives/switch'
import { TunerReadout } from '@/widgets/tuner'

/** A tool's coloured picture, as Practice draws it. */
function ToolIcon({ icon: Icon, paint }: { icon: LucideIcon; paint: Paint }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-control',
        PAINT[paint].fill,
        PAINT[paint].ink,
      )}
    >
      <Icon className="size-5" />
    </span>
  )
}

/** A tool working in place: its picture, its name over what it is doing, its controls at the end. */
function LiveTool({
  icon,
  paint,
  label,
  detail,
  end,
  children,
}: {
  icon: LucideIcon
  paint: Paint
  label: string
  detail: string
  end: ReactNode
  children?: ReactNode
}) {
  return (
    <div role="group" aria-label={label} className="card flex flex-col gap-2 p-3">
      <div className="flex items-center gap-3">
        <ToolIcon icon={icon} paint={paint} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-semibold">{label}</span>
          <span className="text-sm text-muted-foreground tabular-nums">{detail}</span>
        </span>
        {end}
      </div>
      {children}
    </div>
  )
}

/**
 * The header's Tools (R32), in place over any screen, never a way out to Practice: the Metronome
 * live (Start, its tempo − and +, its beats, then its own page for the rest); the Tuner, a switch
 * whose readout opens under it and listens while it is on; then the Chord finder and the Circle of
 * fifths, which open their own pages. The Metronome runs on with the menu closed, until the page is
 * left.
 */
export function ToolsPanel({ metronome, close }: { metronome: Metronome; close: () => void }) {
  const { t } = useTranslation(['practice', 'player'])
  const [tuner, setTuner] = useState(false)
  const { a4 } = useSettings(selectTuner)
  const id = useId()
  const toggleLabel = metronome.playing ? t('tools.sheet.stop') : t('tools.sheet.start')
  return (
    <div className="flex flex-col gap-3">
      <LiveTool
        icon={MetronomeGlyph}
        paint="grass"
        label={t('tools.sheet.metronome')}
        detail={t('toolValue.metronome', { bpm: metronome.tempoNow, meter: metronome.meter })}
        end={
          <Button
            variant={metronome.playing ? 'secondary' : 'default'}
            size="icon"
            className="rounded-pill"
            aria-label={toggleLabel}
            title={toggleLabel}
            aria-pressed={metronome.playing}
            onClick={metronome.toggle}
          >
            {metronome.playing ? (
              <Square aria-hidden className="fill-current" />
            ) : (
              <Play aria-hidden className="fill-current" />
            )}
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 ps-13">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('tools.sheet.slower')}
              title={t('tools.sheet.slower')}
              onClick={() => metronome.nudge(-1)}
            >
              <Minus aria-hidden />
            </Button>
            <output className="min-w-20 text-center font-semibold tabular-nums">
              {t('tools.sheet.tempo', { bpm: metronome.tempoNow })}
            </output>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('tools.sheet.faster')}
              title={t('tools.sheet.faster')}
              onClick={() => metronome.nudge(1)}
            >
              <Plus aria-hidden />
            </Button>
          </div>
          {/* The bar's beats, lit as they sound, tapped to change their level as on the Metronome. */}
          <BeatSquares
            small
            levels={metronome.beatLevels}
            sounding={metronome.beat}
            muted={metronome.muted}
            onTap={metronome.tapBeat}
          />
        </div>
        <Link
          to="/practice/metronome"
          state={OPEN_PLAINLY}
          onClick={close}
          className="ms-13 inline-flex min-h-11 items-center gap-1 self-start font-semibold text-link"
        >
          {t('tools.sheet.openMetronome')}
          <OpensMark className="text-current" />
        </Link>
      </LiveTool>
      <LiveTool
        icon={Gauge}
        paint="grass"
        label={t('tools.sheet.tuner')}
        detail={
          tuner
            ? t('tools.sheet.listening', { reference: t('toolValue.tuner', { hz: a4 }) })
            : t('tools.sheet.off')
        }
        end={
          <label htmlFor={id} className="grid size-11 place-items-center">
            <Switch
              id={id}
              aria-label={t('tools.sheet.tuner')}
              checked={tuner}
              onCheckedChange={setTuner}
            />
          </label>
        }
      >
        {tuner ? <TunerReadout listening /> : null}
      </LiveTool>
      <ul className="card flex flex-col p-1">
        {(
          [
            ['/practice/chord-finder', PAGE_TILES.chordFinder, 'chordFinder'],
            ['/practice/circle-of-fifths', PAGE_TILES.circleOfFifths, 'circleOfFifths'],
          ] as const
        ).map(([to, tile, page]) => (
          <li key={to}>
            <Link
              to={to}
              state={OPEN_PLAINLY}
              onClick={close}
              className="flex min-h-14 items-center gap-3 rounded-control px-2 py-1.5 transition-colors duration-200 ease-out hover:bg-muted"
            >
              <ToolIcon {...tile} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-semibold">{t(`pages.${page}`)}</span>
                <span className="text-sm text-muted-foreground">{t(`about.${page}`)}</span>
              </span>
              <OpensMark />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
