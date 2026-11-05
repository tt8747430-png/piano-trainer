import { Circle, Gauge, Minus, Play, Plus, Square, Timer, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { RecorderStage } from '@/features/record-take'
import { BeatSquares, type Metronome } from '@/features/metronome'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** What the quick Recorder records: a take of the song on screen. */
export interface QuickRecorder {
  readonly stage: RecorderStage
  /** Why it cannot record, said while it cannot (no piano connected). */
  readonly unavailable?: string | undefined
  record(): void
  stop(): void
}

/** A quick tool's row: its coloured picture, its name and what it says, its controls at the end. */
function QuickRow({
  icon: Icon,
  paint,
  label,
  detail,
  children,
}: {
  icon: LucideIcon
  paint: Paint
  label: string
  detail?: string | undefined
  children: ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5"
    >
      <span
        aria-hidden
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-control',
          PAINT[paint].fill,
          PAINT[paint].ink,
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-32 flex-1 flex-col text-left">
        <span>{label}</span>
        {detail ? <span className="text-sm text-muted-foreground">{detail}</span> : null}
      </span>
      <div className="ml-auto flex shrink-0 items-center gap-1">{children}</div>
    </div>
  )
}

/**
 * The quick tools at the top of the Tools sheet (R29 B11), live without leaving the page: the
 * Metronome (Start/Stop, its tempo − and +, its time; a song's tempo and time where one is on screen,
 * else the Metronome's own), the Recorder where a song is on screen (Record/Stop: a take of it) and
 * the Tuner (its sheet, listening).
 */
export function QuickTools({
  metronome,
  recorder,
  onTuner,
}: {
  metronome: Metronome
  recorder?: QuickRecorder
  onTuner: () => void
}) {
  const { t } = useTranslation('practice')
  const recording = recorder !== undefined && recorder.stage !== 'idle'
  return (
    <>
      <QuickRow
        icon={Timer}
        paint="sand"
        label={t('tools.sheet.metronome')}
        detail={`${metronome.following ? `${t('tools.sheet.followsSong')} · ` : ''}${metronome.meter}`}
      >
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('tools.sheet.slower')}
          title={t('tools.sheet.slower')}
          onClick={() => metronome.nudge(-1)}
        >
          <Minus aria-hidden />
        </Button>
        <output className="min-w-16 text-center tabular-nums">
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
        <Button
          variant={metronome.playing ? 'secondary' : 'default'}
          size="icon"
          className="rounded-pill"
          aria-label={metronome.playing ? t('tools.sheet.stop') : t('tools.sheet.start')}
          title={metronome.playing ? t('tools.sheet.stop') : t('tools.sheet.start')}
          aria-pressed={metronome.playing}
          onClick={metronome.toggle}
        >
          {metronome.playing ? (
            <Square aria-hidden className="fill-current" />
          ) : (
            <Play aria-hidden className="fill-current" />
          )}
        </Button>
      </QuickRow>
      {/* The bar's beats, lit as they sound (B11), tapped to change their level as on the Metronome. */}
      <div className="px-3 pb-2">
        <BeatSquares
          small
          levels={metronome.beatLevels}
          sounding={metronome.beat}
          muted={metronome.muted}
          onTap={metronome.tapBeat}
        />
      </div>
      {recorder ? (
        <QuickRow
          icon={Circle}
          paint="lilac"
          label={t('tools.sheet.recorder')}
          detail={recording ? undefined : recorder.unavailable}
        >
          <Button
            variant={recording ? 'secondary' : 'default'}
            disabled={!recording && recorder.unavailable !== undefined}
            onClick={recording ? recorder.stop : recorder.record}
          >
            {recording ? <Square data-icon="inline-start" /> : <Circle data-icon="inline-start" />}
            {recording ? t('tools.sheet.stopRecording') : t('tools.sheet.record')}
          </Button>
        </QuickRow>
      ) : null}
      <button
        type="button"
        onClick={onTuner}
        className="flex min-h-14 w-full items-center gap-3 rounded-control px-3 py-1.5 hover:bg-muted"
      >
        <span
          aria-hidden
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-control',
            PAINT.grass.fill,
            PAINT.grass.ink,
          )}
        >
          <Gauge className="size-5" />
        </span>
        <span className="min-w-0 flex-1 text-left break-words">{t('tools.sheet.tuner')}</span>
      </button>
    </>
  )
}
