import { ChevronDown, ChevronUp, Minus, Square } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ARRANGER_NUMBERS, MAINS, mainOf, SECTION } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import { PlayGlyph, Toolbar } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { ArrangerPanel } from '../model/use-arranger-play'

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
  /** Start/Stop on a sheet with no chords. */
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
        'h-11 min-w-11 rounded-thumb px-1.5 text-sm font-bold whitespace-nowrap transition-colors duration-150 ease-out disabled:opacity-50',
        on
          ? 'bg-rail-chosen text-foreground shadow-[0_0_0_1.5px_var(--color-foreground)]'
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
      <span aria-hidden className="text-xs font-semibold text-muted-foreground">
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
 * The arranger's style controls (canvas R77), a panel of the page while the Chord player follows
 * an arranger, in one of three sizes changed from its own head at any time, edit or not: **Full**,
 * every control in view (the style playing and Start/Stop on its head, the connection under it as
 * the MIDI keyboard's popover says it, with Try again; Main A–D, pressed again while playing its
 * Fill-in, and Break; Intro I–III and Ending/rit. I–III; two rows on a phone, one row of groups on a
 * laptop's wide strip, `wide`); **Compact**, Start/Stop and Main A–D in one 64 row; **Minimized**, a
 * glass pill ("Genos · Main A") that opens it in full. Each lamp lit as the panel's. `device` names
 * who plays: the Genos, or the style the app's band plays in its place. `flat` draws it without its
 * shadow, in a laptop's side column; `children` is what Edit layout draws over it.
 */
export function ArrangerStrip({
  panel,
  device,
  size,
  wide = false,
  flat = false,
  onSize,
  children,
}: {
  panel: ArrangerPanel
  device: string
  size: GenosSize
  wide?: boolean
  flat?: boolean
  onSize(size: GenosSize): void
  children?: ReactNode
}) {
  const { t } = useTranslation(['practice', 'common'])
  const section = panel.section
  const main = section === null ? null : mainOf(section)
  const status = panel.status
  const title = panel.running
    ? main
      ? t('chordPlayer.arranger.playingMain', { device, main })
      : t('chordPlayer.arranger.playing', { device })
    : t('chordPlayer.arranger.stopped', { device })
  // The connection in a line, as the MIDI keyboard's popover says it; with none the app's band plays.
  const line =
    status === null
      ? t('common:midi.connecting')
      : status.state === 'connected'
        ? t('common:midi.connected', { devices: status.device })
        : t(
            `chordPlayer.arranger.alone.${status.state === 'no-device' ? 'noDevice' : status.state}`,
          )
  const retry =
    status?.state === 'no-device' || status?.state === 'denied' ? (
      <Button variant="soft" onClick={panel.reconnect} className="shrink-0">
        {t('common:midi.retry')}
      </Button>
    ) : null
  const dot = (
    <span
      aria-hidden
      className={cn(
        'size-2 shrink-0 rounded-pill',
        panel.running ? 'bg-learned' : 'bg-muted-foreground',
      )}
    />
  )
  const startStop = (
    <Lamp
      disabled={!panel.playable}
      on={panel.running}
      label={t('chordPlayer.arranger.startStop')}
      className="min-w-22 shrink-0 px-3"
      onClick={panel.toggle}
    />
  )
  const minimize = (
    <HeadButton label={t('chordPlayer.arranger.minimize')} onClick={() => onSize('minimized')}>
      <Minus aria-hidden />
    </HeadButton>
  )
  const mainLamps = MAINS.map((each) => (
    <Lamp
      key={each}
      on={main === each}
      label={each}
      spoken={t('chordPlayer.arranger.main', { main: each })}
      onClick={() =>
        panel.press(main === each && panel.running ? SECTION.fill[each] : SECTION.main[each])
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
        {/* The board's compact strip: the connection's dot, then Start/Stop as its glyph, filled as the
            transport's Play (a phone's 341 holds Main A–D only so); its lamp says it runs. */}
        {dot}
        <Lamp
          disabled={!panel.playable}
          on={panel.running}
          label={
            panel.running ? (
              <Square aria-hidden className="fill-current" strokeWidth={0} />
            ) : (
              <PlayGlyph playing={false} />
            )
          }
          spoken={t('chordPlayer.arranger.startStop')}
          className="grid w-11 shrink-0 place-items-center [&_svg]:size-4.5"
          onClick={panel.toggle}
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
          key={n}
          on={section === SECTION.intro[n]}
          label={ROMAN[n]}
          spoken={t('chordPlayer.arranger.intro', { n: ROMAN[n] })}
          onClick={() => panel.press(SECTION.intro[n])}
        />
      ))}
    </Group>
  )
  const mains = (
    <Group label={t('chordPlayer.arranger.mainLabel')} columns={5} grow={5}>
      {mainLamps}
      <Lamp
        on={section === SECTION.break}
        label={t('chordPlayer.arranger.into.break')}
        onClick={() => panel.press(SECTION.break)}
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
          onClick={() => panel.press(SECTION.ending[n])}
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
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</span>
        {startStop}
        {/* In the rail's Genos panel the strip is in its place: no size to change there. */}
        {flat ? null : (
          <>
            <HeadButton label={t('chordPlayer.arranger.compact')} onClick={() => onSize('compact')}>
              <ChevronDown aria-hidden />
            </HeadButton>
            {minimize}
          </>
        )}
      </div>
      <div className="-mt-1 flex min-h-11 items-center gap-3">
        <p aria-live="polite" className="min-w-0 flex-1 text-sm text-pretty text-muted-foreground">
          {line}
        </p>
        {retry}
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
      className="-my-0.5 grid size-11 shrink-0 place-items-center rounded-pill text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground [&_svg]:size-5"
    >
      {children}
    </button>
  )
}
