import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { FloatingBar, FloatingBarButton, FloatingBarPlay } from '@/shared/ui'
import { DOCK_STEP } from './dock-sizes'

/**
 * The transport's pill (ADR 0061, 0108, 0105, 0115), the Player's and the score editor's one shape:
 * the tempo, ‹, Play or Stop (honey), ›, then three controls of the screen's own (`end`: the Player's
 * loop, Sound and hands; the editor's Record, takes and recording settings), each a transport
 * button's size (`DOCK_BUTTON`). The same seven in the same sizes in both modes of one score, so
 * Play stands in the same spot as Practise · Edit switches. They stand in three groups (canvas 116),
 * ‹ ▶ › the tinted one in the middle. Floating along the sheet's foot at every
 * size; on a phone held upright its controls stand shoulder to shoulder, so the seven fit from 320px.
 */
/**
 * One of the transport's three groups (canvas 116): the screen's own before, ‹ ▶ › tinted in the
 * middle, the screen's own after, each a pill of its own; on the narrowest phone they stand bare,
 * shoulder to shoulder, so the seven still fit.
 */
const GROUP =
  'flex items-center gap-0.5 rounded-pill bg-muted/70 p-0.5 max-sm:gap-0 narrow-phone:bg-transparent narrow-phone:p-0'

export function Transport({
  label,
  tempo,
  playing,
  play,
  back,
  next,
  disabled = false,
  onPlay,
  onBack,
  onNext,
  start,
  end,
  docked = false,
}: {
  /** The toolbar's name. */
  label: string
  /** The tempo's button, at the pill's start. */
  tempo: ReactNode
  playing: boolean
  /** Play's name, and the tooltips of Play (saying Stop while it plays), ‹ and ›. */
  play: { readonly label: string; readonly title?: string }
  back: { readonly label: string; readonly title?: string }
  next: { readonly label: string; readonly title?: string }
  /** Play waits on something else first (the editor's while a take records). */
  disabled?: boolean
  onPlay: () => void
  onBack: () => void
  onNext: () => void
  /** The screen's own, before the tempo's (the Player's Loop). */
  start?: ReactNode
  /** The screen's own three, after ›. */
  end: ReactNode
  /** In the screen's own row at its foot (the Player's, R31-P), never floating over the music. */
  docked?: boolean
}) {
  return (
    // Under 390px its controls are 40px, ‹ › narrower and the pill hugs them, so the seven fit a
    // 320px screen; under 360px Play is 48px.
    <FloatingBar
      label={label}
      docked={docked}
      className="gap-1 max-sm:gap-0 narrow-phone:px-0 landscape-phone:gap-0.5"
    >
      <div className={GROUP}>
        {start}
        {tempo}
      </div>
      <div className={cn(GROUP, 'bg-primary/15')}>
        <FloatingBarButton
          label={back.label}
          title={back.title}
          className={DOCK_STEP}
          onClick={onBack}
        >
          <ChevronLeft aria-hidden />
        </FloatingBarButton>
        <FloatingBarPlay
          label={play.label}
          title={play.title}
          playing={playing}
          disabled={disabled}
          className="narrow-phone:size-12"
          onClick={onPlay}
        />
        <FloatingBarButton
          label={next.label}
          title={next.title}
          className={DOCK_STEP}
          onClick={onNext}
        >
          <ChevronRight aria-hidden />
        </FloatingBarButton>
      </div>
      <div className={GROUP}>{end}</div>
    </FloatingBar>
  )
}
