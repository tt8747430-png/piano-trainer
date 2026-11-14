import { ChevronDown, ChevronUp, PanelBottom, PanelRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ARRANGER_NUMBERS, MAINS, mainOf, SECTION } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import type { ArrangerPlace } from '@/entities/settings'
import type { ArrangerFollow } from '../model/use-arranger-follow'

const ROMAN = { 1: 'I', 2: 'II', 3: 'III' } as const

/** A panel button and its lamp, as the Genos lights it: on (chosen), or off. */
function Lamp({
  on,
  label,
  spoken,
  className,
  onClick,
}: {
  on: boolean
  label: string
  spoken?: string
  className?: string
  onClick(): void
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={spoken}
      title={spoken}
      onClick={onClick}
      className={cn(
        'h-11 min-w-11 rounded-[9px] px-1.5 text-sm font-bold whitespace-nowrap transition-colors duration-150 ease-out',
        on
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-card text-foreground shadow-[0_0_0_1px_var(--color-border)] hover:bg-muted',
        className,
      )}
    >
      {label}
    </button>
  )
}

/** A group of the panel's buttons, its name over them as the Genos prints it, the buttons sharing its width. */
function Group({
  label,
  columns,
  grow,
  children,
}: {
  label: string
  columns: number
  grow: number
  children: ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex min-w-0 flex-col gap-1"
      style={{ flex: `${grow} 1 0` }}
    >
      <span
        aria-hidden
        className="text-[11px] font-semibold tracking-[.04em] text-muted-foreground uppercase"
      >
        {label}
      </span>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * The arranger's style controls (canvas 173), a card over the dock while the Chord player follows
 * it, every control in view, none scrolled away: its state and Start/Stop on its head; Main A–D
 * (pressed again while playing, its Fill-in) and Break; Intro I–III and Ending/rit. I–III. Two rows
 * on a phone, one row of groups on a laptop (`wide`). Each lamp lit as the panel's. Only what the
 * Genos takes over MIDI is here (Yamaha's Rhythm Start and Stop, Section Control). Its head folds it
 * to that one line, or (on a laptop) moves it to the side column and back (`place`, saved).
 */
export function ArrangerStrip({
  follow,
  device,
  wide = false,
  place,
  canSide = false,
  onPlace,
}: {
  follow: ArrangerFollow
  device: string
  wide?: boolean
  place: ArrangerPlace
  /** A side column to move into: a laptop's. */
  canSide?: boolean
  onPlace(place: ArrangerPlace): void
}) {
  const { t } = useTranslation('practice')
  const section = follow.section
  const main = section === null ? null : mainOf(section)
  const title = follow.running
    ? main
      ? t('chordPlayer.arranger.playingMain', { device, main })
      : t('chordPlayer.arranger.playing', { device })
    : t('chordPlayer.arranger.waiting', { device })
  const intro = (
    <Group label={t('chordPlayer.arranger.introLabel')} columns={3} grow={3}>
      {ARRANGER_NUMBERS.map((n) => (
        <Lamp
          key={n}
          on={section === SECTION.intro[n]}
          label={ROMAN[n]}
          spoken={t('chordPlayer.arranger.intro', { n: ROMAN[n] })}
          onClick={() => follow.press(SECTION.intro[n])}
        />
      ))}
    </Group>
  )
  const mains = (
    <Group label={t('chordPlayer.arranger.mainLabel')} columns={5} grow={5}>
      {MAINS.map((each) => (
        <Lamp
          key={each}
          on={main === each}
          label={each}
          spoken={t('chordPlayer.arranger.main', { main: each })}
          onClick={() =>
            follow.press(main === each && follow.running ? SECTION.fill[each] : SECTION.main[each])
          }
        />
      ))}
      <Lamp
        on={section === SECTION.break}
        label={t('chordPlayer.arranger.into.break')}
        onClick={() => follow.press(SECTION.break)}
      />
    </Group>
  )
  const endings = (
    <Group label={t('chordPlayer.arranger.endingRit')} columns={3} grow={3}>
      {ARRANGER_NUMBERS.map((n) => (
        <Lamp
          key={n}
          on={section === SECTION.ending[n]}
          label={ROMAN[n]}
          spoken={t('chordPlayer.arranger.ending', { n: ROMAN[n] })}
          onClick={() => follow.press(SECTION.ending[n])}
        />
      ))}
    </Group>
  )
  return (
    <div
      role="toolbar"
      aria-label={t('chordPlayer.arranger.strip', { device })}
      className="flex w-full min-w-0 flex-col gap-2 rounded-[16px] bg-card px-3 pt-2 pb-3 shadow-[0_0_0_1px_var(--color-border),0_1px_3px_rgb(51_41_33/0.12),0_6px_14px_-4px_rgb(51_41_33/0.14),0_14px_28px_-8px_rgb(51_41_33/0.14)]"
    >
      <div className="flex min-h-10 items-center gap-2">
        <span
          aria-hidden
          className={cn(
            'size-2 shrink-0 rounded-full',
            follow.running ? 'bg-learned' : 'bg-muted-foreground',
          )}
        />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold" aria-live="polite">
          {title}
        </span>
        <Lamp
          on={follow.running}
          label={t('chordPlayer.arranger.startStop')}
          className="min-w-24 shrink-0 px-3"
          onClick={follow.toggle}
        />
        {canSide || place === 'side' ? (
          <HeadButton
            label={t(
              place === 'side' ? 'chordPlayer.arranger.toDock' : 'chordPlayer.arranger.toSide',
            )}
            onClick={() => onPlace(place === 'side' ? 'card' : 'side')}
          >
            {place === 'side' ? <PanelBottom aria-hidden /> : <PanelRight aria-hidden />}
          </HeadButton>
        ) : null}
        {place !== 'side' ? (
          <HeadButton
            label={t(
              place === 'folded' ? 'chordPlayer.arranger.show' : 'chordPlayer.arranger.hide',
            )}
            expanded={place !== 'folded'}
            onClick={() => onPlace(place === 'folded' ? 'card' : 'folded')}
          >
            {place === 'folded' ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
          </HeadButton>
        ) : null}
      </div>
      {place === 'folded' ? null : wide ? (
        <div className="flex gap-4">
          {intro}
          {mains}
          {endings}
        </div>
      ) : (
        <>
          {mains}
          <div className="flex gap-3">
            {intro}
            {endings}
          </div>
        </>
      )}
    </div>
  )
}

/** One of the strip's head buttons: an icon, 44 square, named. */
function HeadButton({
  label,
  expanded,
  onClick,
  children,
}: {
  label: string
  expanded?: boolean
  onClick(): void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-expanded={expanded}
      onClick={onClick}
      className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground [&_svg]:size-5"
    >
      {children}
    </button>
  )
}
