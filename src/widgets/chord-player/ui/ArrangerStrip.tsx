import { ChevronDown, ChevronUp, Minus, Play, Square } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ARRANGER_NUMBERS, MAINS, mainOf, SECTION } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import type { ArrangerFollow } from '../model/use-arranger-follow'
import { Toolbar } from '@/shared/ui'

const ROMAN = { 1: 'I', 2: 'II', 3: 'III' } as const

/** The Genos panel's three sizes (R76): every control, Start/Stop and Main A–D in a row, or a pill. */
export type GenosSize = 'full' | 'compact' | 'minimized'

/** The card the panel is drawn on, 14 round: floating over the page, or flat in a laptop's column. */
const CARD = 'rounded-card bg-card layer-shadow'
const FLAT_CARD = 'card'

/** A panel button and its lamp, as the Genos lights it: on (chosen), or off. */
function Lamp({
  on,
  label,
  spoken,
  className,
  disabled = false,
  onClick,
}: {
  on: boolean
  label: ReactNode
  spoken?: string
  className?: string
  /** No arranger connected: nothing to press. */
  disabled?: boolean
  onClick(): void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={on}
      aria-label={spoken}
      title={spoken}
      onClick={onClick}
      className={cn(
        'h-11 min-w-11 rounded-[9px] px-1.5 text-sm font-bold whitespace-nowrap transition-colors duration-150 ease-out disabled:opacity-45',
        on
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-card text-foreground shadow-[0_0_0_1px_var(--color-border)] enabled:hover:bg-muted',
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
        className="text-xs font-semibold tracking-[.04em] text-muted-foreground uppercase"
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
 * The arranger's style controls (canvas R76), a panel of the page while the Chord player follows
 * it, in one of three sizes changed from its own head at any time, edit or not: **Full**, every
 * control in view (its state and Start/Stop on its head; Main A–D, pressed again while playing its
 * Fill-in, and Break; Intro I–III and Ending/rit. I–III; two rows on a phone, one row of groups on a
 * laptop's wide strip, `wide`); **Compact**, Start/Stop and Main A–D in one 64 row; **Minimized**, a
 * glass pill ("Genos · Main A") that opens it in full. Each lamp lit as the panel's. Only what the
 * Genos takes over MIDI is here (Yamaha's Rhythm Start and Stop, Section Control). `flat` draws it
 * without its shadow, in a laptop's side column; `children` is what Edit layout draws over it.
 */
export function ArrangerStrip({
  follow,
  device,
  size,
  wide = false,
  flat = false,
  onSize,
  children,
}: {
  follow: ArrangerFollow
  device: string
  size: GenosSize
  wide?: boolean
  flat?: boolean
  onSize(size: GenosSize): void
  children?: ReactNode
}) {
  const { t } = useTranslation('practice')
  const section = follow.section
  const main = section === null ? null : mainOf(section)
  const state = follow.status?.state
  // With none connected the sheet plays itself: the head says why, and the panel's buttons rest.
  const off = state === 'no-device' || state === 'denied' || state === 'unsupported'
  const title = off
    ? t('chordPlayer.arranger.notLeading', {
        device,
        state: t(
          `chordPlayer.settings.arrangerState.${state === 'no-device' ? 'noDevice' : state}`,
        ),
      })
    : follow.running
      ? main
        ? t('chordPlayer.arranger.playingMain', { device, main })
        : t('chordPlayer.arranger.playing', { device })
      : t('chordPlayer.arranger.waiting', { device })
  const dot = (
    <span
      aria-hidden
      className={cn(
        'size-2 shrink-0 rounded-full',
        follow.running ? 'bg-learned' : 'bg-muted-foreground',
      )}
    />
  )
  const startStop = (
    <Lamp
      disabled={off}
      on={follow.running}
      label={t('chordPlayer.arranger.startStop')}
      className="min-w-22 shrink-0 px-3"
      onClick={follow.toggle}
    />
  )
  const minimize = (
    <HeadButton label={t('chordPlayer.arranger.minimize')} onClick={() => onSize('minimized')}>
      <Minus aria-hidden />
    </HeadButton>
  )
  const mainLamps = MAINS.map((each) => (
    <Lamp
      disabled={off}
      key={each}
      on={main === each}
      label={each}
      spoken={t('chordPlayer.arranger.main', { main: each })}
      onClick={() =>
        follow.press(main === each && follow.running ? SECTION.fill[each] : SECTION.main[each])
      }
    />
  ))
  if (size === 'minimized') {
    // With no section chosen yet the pill names the arranger alone.
    const named = main
      ? t('chordPlayer.arranger.pill', { device, main: t('chordPlayer.arranger.main', { main }) })
      : device
    return (
      <div className="relative w-fit">
        <button
          type="button"
          aria-label={t('chordPlayer.arranger.pillLabel', { name: named })}
          onClick={() => onSize('full')}
          className="flex h-11 items-center gap-2 rounded-pill glass pr-3 pl-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ease-out hover:bg-muted [&_svg]:size-[18px]"
        >
          {dot}
          {named}
          <ChevronUp aria-hidden />
        </button>
        {children}
      </div>
    )
  }
  if (size === 'compact')
    return (
      <Toolbar
        label={t('chordPlayer.arranger.strip', { device })}
        className={cn(
          'relative flex h-16 w-full min-w-0 items-center gap-2 pr-2 pl-3',
          flat ? FLAT_CARD : CARD,
        )}
      >
        {/* A phone's 341 holds Main A–D at 44 only with Start/Stop as its glyph; its lamp says it runs. */}
        <Lamp
          disabled={off}
          on={follow.running}
          label={follow.running ? <Square aria-hidden /> : <Play aria-hidden />}
          spoken={t('chordPlayer.arranger.startStop')}
          className="grid w-11 shrink-0 place-items-center [&_svg]:size-5"
          onClick={follow.toggle}
        />
        <div
          role="group"
          aria-label={t('chordPlayer.arranger.mainLabel')}
          className="grid min-w-0 flex-1 grid-cols-4 gap-1 sm:max-w-80"
        >
          {mainLamps}
        </div>
        <div className="ml-auto flex shrink-0">
          <HeadButton label={t('chordPlayer.arranger.full')} onClick={() => onSize('full')}>
            <ChevronUp aria-hidden />
          </HeadButton>
          {minimize}
        </div>
        {children}
      </Toolbar>
    )
  const intro = (
    <Group label={t('chordPlayer.arranger.introLabel')} columns={3} grow={3}>
      {ARRANGER_NUMBERS.map((n) => (
        <Lamp
          disabled={off}
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
      {mainLamps}
      <Lamp
        disabled={off}
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
          disabled={off}
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
    <Toolbar
      label={t('chordPlayer.arranger.strip', { device })}
      className={cn(
        'relative flex w-full min-w-0 flex-col gap-2 px-3 pt-2 pb-3',
        flat ? FLAT_CARD : CARD,
      )}
    >
      <div className="flex min-h-10 items-center gap-2">
        {dot}
        <span
          className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold text-pretty"
          aria-live="polite"
        >
          {title}
        </span>
        {off ? null : startStop}
        <HeadButton label={t('chordPlayer.arranger.compact')} onClick={() => onSize('compact')}>
          <ChevronDown aria-hidden />
        </HeadButton>
        {minimize}
      </div>
      {wide ? (
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
      {children}
    </Toolbar>
  )
}

/** One of the panel's head buttons: an icon, 44 square, named. */
function HeadButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick(): void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="-my-0.5 grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground [&_svg]:size-5"
    >
      {children}
    </button>
  )
}
