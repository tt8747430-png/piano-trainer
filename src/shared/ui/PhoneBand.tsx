import { ArrowLeft, Menu, Repeat, Volume2 } from 'lucide-react'
import { type ComponentProps, type ReactNode, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useUp } from '@/shared/lib'
import { GoToStartGlyph, PlayGlyph } from './Band'

/** A phone header's button (the kit's `_PB`): 44 round, its glyph ink, rust while its act is on. */
const ROUND =
  'relative grid size-11 shrink-0 cursor-pointer place-items-center rounded-pill text-foreground transition-colors duration-150 ease-out disabled:cursor-default disabled:opacity-50 data-on:text-bar-on'

/**
 * A full screen's header on a phone (canvas R77, `PHHDR77`; Flat's phone header): one row 64 high on
 * the card's paper, 8 in, a hairline under it 8 short of each edge: ← up, the transport (`children`
 * first: `PhoneTransport`), then the screen's own buttons, ☰ last. The status bar over it takes the
 * card's paper too (the board's `bar=SHEET`, as Flat's header), while it shows.
 */
export function PhoneBand({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useTranslation('common')
  const up = useUp()
  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.statusBar = 'card'
    return () => {
      delete root.dataset.statusBar
    }
  }, [])
  return (
    <header
      data-band
      aria-label={label}
      className="relative z-20 shrink-0 bg-card bg-[linear-gradient(var(--color-border),var(--color-border))] bg-[length:calc(100%-16px)_1px] bg-[position:8px_100%] bg-no-repeat px-2 text-foreground"
    >
      {/* Spread on a phone, as the board at 402; wider (a phone on its side, a tablet upright) the
          header's own acts keep together at its end and the rest follows Back 24 apart. */}
      <div className="flex h-16 items-center justify-between gap-1 min-[440px]:justify-start min-[440px]:gap-6">
        <button
          type="button"
          aria-label={t('back')}
          title={t('back')}
          onClick={up}
          className={ROUND}
        >
          <ArrowLeft aria-hidden className="size-6" strokeWidth={2} />
        </button>
        {children}
      </div>
    </header>
  )
}

/** A phone header's own button: on (its layer open, its thing shown) in rust. */
export function PhoneBandButton({
  label,
  on,
  className,
  children,
  ...props
}: { label: string; on?: boolean; children: ReactNode } & Omit<
  ComponentProps<'button'>,
  'aria-label' | 'children'
>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-on={on ? '' : undefined}
      {...props}
      className={cn(ROUND, className)}
    >
      {children}
    </button>
  )
}

/** ☰, the phone header's last button: the screen's places and acts. */
export function PhoneMenuButton({
  open,
  ...props
}: { open: boolean } & Omit<ComponentProps<'button'>, 'aria-label' | 'children'>) {
  const { t } = useTranslation('common')
  return (
    <PhoneBandButton
      label={t('menu')}
      on={open}
      aria-haspopup="dialog"
      aria-expanded={open}
      {...props}
    >
      <Menu aria-hidden className="size-6" strokeWidth={2} />
    </PhoneBandButton>
  )
}

/**
 * The phone's transport (the kit's `PHTRANSPORT`, Flat's phone header): a capsule 46 high with a
 * hairline ring, its acts alone: Go to start, Play, Loop, Playback options (the speaker; its page
 * holds what the laptop's ▾ and metronome do).
 */
export function PhoneTransport({
  playing,
  playLabel,
  canPlay = true,
  onStart,
  onPlay,
  loop,
  loopLabel,
  onLoop,
  optionsOpen,
  onOptions,
}: {
  playing: boolean
  playLabel: string
  canPlay?: boolean
  onStart(): void
  onPlay(): void
  loop: boolean
  loopLabel: string
  onLoop(): void
  optionsOpen: boolean
  onOptions(): void
}) {
  const { t } = useTranslation('common')
  return (
    <div
      role="toolbar"
      aria-label={t('transport')}
      className="flex h-11.5 shrink-0 items-center rounded-pill px-px shadow-[inset_0_0_0_1px_var(--color-border)]"
    >
      <PhoneBandButton label={t('goToStart')} onClick={onStart}>
        <GoToStartGlyph className="size-5.5" />
      </PhoneBandButton>
      <PhoneBandButton label={playLabel} disabled={!canPlay} onClick={onPlay}>
        <PlayGlyph playing={playing} className="size-6" />
      </PhoneBandButton>
      <PhoneBandButton label={loopLabel} on={loop} aria-pressed={loop} onClick={onLoop}>
        <Repeat aria-hidden className="size-5.5" strokeWidth={2} />
      </PhoneBandButton>
      <PhoneBandButton
        label={t('playbackOptions')}
        on={optionsOpen}
        aria-haspopup="dialog"
        aria-expanded={optionsOpen}
        onClick={onOptions}
      >
        <Volume2 aria-hidden className="size-5.5" strokeWidth={2} />
      </PhoneBandButton>
    </div>
  )
}
