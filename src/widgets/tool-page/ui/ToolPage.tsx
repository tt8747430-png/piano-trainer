import type { useRender } from '@base-ui/react/use-render'
import { Settings, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BackButton,
  FloatingActions,
  FloatingBar,
  FloatingBarPlay,
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

/**
 * One tool's page (R29 B11), the same for every tool on Practice's Tools: the bar (Back, the tool's
 * name, its own act and ⚙ to its Settings page where it has several settings, A24); the readout or
 * picture in the middle, filling the height the page has (rule 28); what sets it under it, or beside
 * it from a laptop's width (`side`, R32: the Metronome's settings in place, as Chordify's); and the
 * tool's floating bar at the foot: its acts (`bar`), then Start, the wide honey pill (its board).
 */
export function ToolPage({
  title,
  settings,
  actions,
  controls,
  side,
  play,
  dial,
  bar,
  keys,
  children,
}: {
  title: string
  /** The tool's Settings page, a router `Link`; none where the tool has nothing to set. */
  settings?: useRender.RenderProp
  /** The bar's act before the gear (a MIDI button, an ⓘ). */
  actions?: ReactNode
  /** What sets the tool, under the readout. */
  controls?: ReactNode
  /** What sets the tool in place (R32): under the readout on a phone, beside it from a laptop's width. */
  side?: ReactNode
  play?: ToolPlay
  /** The tool's other acts, folded in a `SpeedDial` beside its Start (the Chord finder's). */
  dial?: ReactNode
  /** The bar's acts before Start, each a `FloatingBarButton` (the Metronome's Tap tempo). */
  bar?: ReactNode
  /** The on-screen keys a tool is played on, pinned under the bar (the Chord finder's). */
  keys?: ReactNode
  /** The readout or the picture. */
  children: ReactNode
}) {
  const { t } = useTranslation(['practice', 'common'])
  return (
    <div className="flex min-h-screen-free flex-col">
      <ScreenHeader
        title={title}
        back={<BackButton />}
        tools={actions}
        settings={
          settings ? (
            <RoundLink
              label={t('practice:settings.open', { page: title })}
              icon={Settings}
              render={settings}
            />
          ) : undefined
        }
      />
      {keys}
      {side ? (
        <div className="mx-auto grid w-full max-w-6xl flex-1 items-start gap-6 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-10">
          <section
            aria-label={title}
            className="flex min-h-56 flex-col items-center justify-center gap-4 text-center lg:sticky lg:top-24"
          >
            {children}
          </section>
          <div className="flex w-full flex-col gap-6">{side}</div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 pb-8">
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
            <FloatingBar label={title}>
              {bar}
              <FloatingBarPlay
                named
                label={play.label}
                stopLabel={play.stopLabel}
                icon={play.icon}
                playing={play.playing}
                disabled={play.disabled === true && !play.playing}
                onClick={play.onToggle}
              />
            </FloatingBar>
          ) : null}
        </FloatingActions>
      ) : null}
    </div>
  )
}
