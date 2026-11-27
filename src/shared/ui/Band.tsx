import { ChevronDown, Repeat, X } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useUp } from '@/shared/lib'
import { MetronomeIcon } from './icons/MetronomeIcon'

/** A band's round button (the canvas's `_HB`): 40, its glyph centred. */
const ROUND =
  'relative grid size-10 shrink-0 cursor-pointer place-items-center rounded-pill transition-colors duration-150 ease-out disabled:cursor-default disabled:opacity-50'

/**
 * A full screen's band on a laptop (canvas R77, `BAND77`; Flat's dark band): 64 high, ink, 12 in at its
 * start and 16 at its end, its parts 12 apart: ✕, the thing's name and its menu, the transport, the
 * thing's own pills, then its end (Undo, the keys). Under 1280 the name gives way first (`@container`).
 */
export function Band({ label, children }: { label: string; children: ReactNode }) {
  return (
    <header
      data-band
      aria-label={label}
      className="@container/band relative z-20 flex h-16 shrink-0 items-center gap-3 bg-band pr-4 pl-3 text-on-band"
    >
      {children}
    </header>
  )
}

/** The band's ✕: up to where the learner came from (`useUp`), Esc's place. */
export function BandClose() {
  const { t } = useTranslation('common')
  const up = useUp()
  return (
    <button type="button" aria-label={t('close')} title={t('close')} onClick={up} className={ROUND}>
      <X aria-hidden className="size-5" strokeWidth={2} />
    </button>
  )
}

/**
 * A round button on the band, its glyph paper-white: open (its layer showing) on a 14% wash, as the
 * board's `hdKeysBg`, `hdMidiBg`.
 */
export function BandButton({
  label,
  open,
  className,
  children,
  ...props
}: { label: string; open?: boolean; children: ReactNode } & Omit<
  ComponentProps<'button'>,
  'aria-label' | 'children'
>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={cn(ROUND, open ? 'bg-on-band/14' : 'hover:bg-on-band/10', className)}
    >
      {children}
    </button>
  )
}

/**
 * A value of the thing in the band (the board's `BPILL`: Key, Tempo, Style): a paper-white pill, 40
 * high, its value in ink at 14/600, a chevron after it; it opens its popover under it.
 */
export function BandPill({
  label,
  value,
  className,
  ...props
}: { label: string; value: ReactNode } & Omit<ComponentProps<'button'>, 'children'>) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      title={label}
      {...props}
      className={cn(
        'flex h-10 shrink-0 cursor-pointer items-center gap-1 rounded-pill bg-on-band pr-3 pl-4 text-sm font-semibold whitespace-nowrap text-band',
        className,
      )}
    >
      {value}
      <ChevronDown aria-hidden className="size-4" strokeWidth={2} />
    </button>
  )
}

/** Go to start's glyph, filled (the board's): a bar and a triangle back to it. */
export function GoToStartGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <rect x="5" y="5" width="2.5" height="14" rx="1" />
      <path d="M19 6.3v11.4a1 1 0 0 1-1.5.86L9.4 13.3a1.5 1.5 0 0 1 0-2.6l8.1-5.26A1 1 0 0 1 19 6.3z" />
    </svg>
  )
}

/** Play and Pause's glyphs, filled (the board's `hdPlayD`). */
export function PlayGlyph({ playing, className }: { playing: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path
        d={
          playing
            ? 'M7 4.5h3.2a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Zm6.8 0H17a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-3.2a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z'
            : 'M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z'
        }
      />
    </svg>
  )
}

/** The metronome's three modes, one press to the next (Flat's "Change metronome mode"). */
export type MetronomeMode = 'count-in' | 'on' | 'off'

/**
 * The band's transport (the kit's `HDRTRANSPORT`, Flat's band): round buttons 8 apart, each one act:
 * Go to start, Play (the one honey circle) with its options under ▾ (`options`, a popover's trigger
 * drawn here), the metronome (one press to its next mode, crossed while off), Loop (its glyph rust
 * while it loops); then the thing's own pills and buttons (`children`).
 */
export function BandTransport({
  playing,
  playLabel,
  canPlay = true,
  onStart,
  onPlay,
  options,
  metronome,
  metronomeLabel,
  onMetronome,
  loop,
  loopLabel,
  onLoop,
  children,
}: {
  playing: boolean
  playLabel: string
  canPlay?: boolean
  onStart(): void
  onPlay(): void
  /** Playback options' ▾, drawn by `BandOptions` inside its popover's trigger. */
  options: ReactNode
  metronome: MetronomeMode
  metronomeLabel: string
  onMetronome(): void
  loop: boolean
  loopLabel: string
  onLoop(): void
  children?: ReactNode
}) {
  const { t } = useTranslation('common')
  return (
    <div role="toolbar" aria-label={t('transport')} className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        aria-label={t('goToStart')}
        title={t('goToStart')}
        onClick={onStart}
        className={cn(ROUND, 'bg-on-band text-band')}
      >
        <GoToStartGlyph className="size-4.5" />
      </button>
      <div role="group" aria-label={playLabel} className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          aria-label={playLabel}
          title={playLabel}
          disabled={!canPlay}
          onClick={onPlay}
          className={cn(ROUND, 'bg-primary text-band')}
        >
          <PlayGlyph playing={playing} className="size-5" />
        </button>
        {options}
      </div>
      <button
        type="button"
        aria-label={metronomeLabel}
        title={metronomeLabel}
        onClick={onMetronome}
        className={cn(ROUND, 'bg-on-band text-band')}
      >
        <MetronomeIcon aria-hidden className="size-4.5" />
        {metronome === 'off' ? (
          <span
            aria-hidden
            className="absolute h-[1.5px] w-5.5 -rotate-45 rounded-[1px] bg-current"
          />
        ) : null}
      </button>
      <button
        type="button"
        aria-label={loopLabel}
        title={loopLabel}
        aria-pressed={loop}
        onClick={onLoop}
        className={cn(ROUND, 'bg-on-band', loop ? 'text-bar-on' : 'text-band')}
      >
        <Repeat aria-hidden className="size-4.5" strokeWidth={2} />
      </button>
      {children}
    </div>
  )
}

/** Playback options' ▾ beside Play: 24 by 40, 12 round, a wash while its popover shows. */
export function BandOptions({
  open,
  ...props
}: { open?: boolean } & Omit<ComponentProps<'button'>, 'children'>) {
  const { t } = useTranslation('common')
  return (
    <button
      type="button"
      aria-label={t('playbackOptions')}
      title={t('playbackOptions')}
      aria-haspopup="dialog"
      {...props}
      className={cn(
        'grid h-10 w-6 shrink-0 cursor-pointer place-items-center rounded-xl text-on-band',
        open ? 'bg-on-band/14' : 'hover:bg-on-band/10',
      )}
    >
      <ChevronDown aria-hidden className="size-4" strokeWidth={2} />
    </button>
  )
}
