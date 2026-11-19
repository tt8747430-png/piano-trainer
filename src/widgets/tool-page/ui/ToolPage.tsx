import type { useRender } from '@base-ui/react/use-render'
import { Settings, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  BackButton,
  FloatingActions,
  FloatingPieces,
  FloatingPlayPiece,
  RoundLink,
  ScreenHeader,
} from '@/shared/ui'

/** A tool's one floating Start/Stop, where it has one: what it starts named, Stop while it runs. */
export interface ToolPlay {
  readonly label: string
  readonly playing: boolean
  /** Its picture while stopped: Play's triangle, or the Recorder's circle. */
  readonly icon?: LucideIcon
  /** What it says while running; Stop by default. */
  readonly stopLabel?: string
  /** Greyed, where the tool cannot start (no piano to record from). */
  readonly disabled?: boolean
  onToggle(): void
}

/** A tool's column widths on a laptop, as complete classes. */
// The Metronome's laptop column starts 16 under its bar and keeps its parts 24 apart, as its board.
const COLUMNS = {
  720: 'lg:max-w-180',
  760: 'lg:max-w-190 lg:pt-4',
  880: 'lg:max-w-220',
} as const
const SECTION_GAPS: Partial<Record<Column, string>> = { 760: 'lg:gap-5' }
type Column = keyof typeof COLUMNS

/**
 * One tool's page (R29 B11), the same for every tool on Practice's Tools: the bar (Back, the tool's
 * name, its own act and ⚙ to its Settings page where it has several settings, A24); the readout or
 * picture in the middle, filling the height the page has (rule 28); what sets it under it, or beside
 * it from a laptop's width (`side`, R32: the Metronome's settings in place, as Chordify's); and the
 * tool's floating pieces at the foot (canvas 179): its acts (`bar`), then Start, the honey one.
 */
export function ToolPage({
  title,
  settings,
  column,
  actions,
  controls,
  side,
  play,
  dial,
  bar,
  after,
  keys,
  start = false,
  children,
}: {
  title: string
  /** The tool's Settings page, a router `Link`; none where the tool has nothing to set. */
  settings?: useRender.RenderProp
  /**
   * The tool's one centred column on a laptop, as its board draws it (the Tuner's 720, the
   * Metronome's 760, the Chord finder's 880): the readout first and what sets it under it, never
   * beside it (the page has one focus). Without it, `side` stands beside the readout.
   */
  column?: Column
  /** The bar's buttons after the gear, as the canvas's TOP60 orders them (the Chord finder's Piano). */
  actions?: ReactNode
  /** What sets the tool, under the readout. */
  controls?: ReactNode
  /** What sets the tool in place (R32): under the readout on a phone, beside it from a laptop's width. */
  side?: ReactNode
  play?: ToolPlay
  /** The tool's other acts, folded in a `SpeedDial` beside its Start (the Chord finder's). */
  dial?: ReactNode
  /** The floating acts before Start, each a `FloatingPiece` (the Metronome's Tap). */
  bar?: ReactNode
  /** The floating acts after Start, each a `FloatingPiece` (the Chord finder's Chords). */
  after?: ReactNode
  /** The on-screen keys a tool is played on, pinned under the bar (the Chord finder's). */
  keys?: ReactNode
  /** The readout at the page's left, top down, as a page's name and what follows it (the Chord finder's). */
  start?: boolean
  /** The readout or the picture. */
  children: ReactNode
}) {
  const { t } = useTranslation(['practice', 'common'])
  return (
    <div className="flex min-h-screen-free flex-col">
      <ScreenHeader
        title={title}
        back={<BackButton />}
        settings={
          settings || actions ? (
            <>
              {settings ? (
                <RoundLink
                  label={t('practice:settings.open', { page: title })}
                  icon={Settings}
                  render={settings}
                />
              ) : null}
              {actions}
            </>
          ) : undefined
        }
      />
      {keys}
      {side || start ? (
        <div
          className={cn(
            column
              ? cn(
                  'mx-auto flex w-full flex-1 flex-col pt-2 lg:gap-6',
                  // With nothing floating (the Tuner), its rows end 40 above the screen's foot, as its board.
                  play ? 'pb-8' : '-mb-4.5 lg:mb-0 lg:pb-8',
                  // A page that starts at its left edge (the Chord finder) keeps its parts 16 apart, as its board.
                  start ? 'gap-4' : 'gap-5',
                  COLUMNS[column],
                )
              : 'mx-auto grid w-full max-w-6xl flex-1 grid-cols-[minmax(0,1fr)] content-start items-start gap-4 pb-8 lg:mx-0 lg:max-w-none lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10',
            // 16 under the keys, as every Practice board sets the name under its keys.
            keys !== undefined && 'pt-4',
          )}
        >
          <section
            aria-label={title}
            className={
              start
                ? 'flex min-w-0 flex-col gap-4'
                : column
                  ? // A state that fills (the Tuner's No microphone) takes a phone's height, its rows at the foot;
                    // on a laptop it stands in the column over its rows.
                    cn(
                      'flex min-w-0 flex-col items-center gap-4 text-center max-lg:has-data-fill:flex-1',
                      SECTION_GAPS[column],
                    )
                  : 'flex min-h-56 flex-col items-center justify-center gap-4 text-center lg:sticky lg:top-24'
            }
          >
            {children}
          </section>
          <div className="flex w-full flex-col gap-6">{side}</div>
        </div>
      ) : (
        // The picture centred in the board's room: 24 under the bar (8 on a laptop), 120 above the screen's foot
        // (the page's own room ends 126 above it, so the column reaches 6 into the foot's pad).
        <div className="mx-auto -mb-1.5 flex w-full max-w-3xl flex-1 flex-col gap-6 pt-6 lg:pt-2">
          <section
            aria-label={title}
            className="flex min-h-56 flex-1 flex-col items-center justify-center gap-4 text-center"
          >
            {children}
          </section>
          {controls ? <div className="flex w-full flex-col gap-6">{controls}</div> : null}
        </div>
      )}
      {play || dial ? (
        <FloatingActions>
          {dial}
          {play ? (
            <FloatingPieces label={title}>
              {bar}
              <FloatingPlayPiece
                label={play.label}
                stopLabel={play.stopLabel}
                icon={play.icon}
                playing={play.playing}
                disabled={play.disabled === true && !play.playing}
                onClick={play.onToggle}
              />
              {after}
            </FloatingPieces>
          ) : null}
        </FloatingActions>
      ) : null}
    </div>
  )
}
