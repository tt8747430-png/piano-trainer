import {
  ChevronsLeft,
  LayoutGrid,
  List,
  Piano,
  SquareChevronDown,
  SquareChevronUp,
} from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { chosenNotes, EDIT_MODES } from '@/features/score-editor'
import { useFoldKeys } from '@/features/live-keyboard'
import { cn, useRovingFocus, useScrollMotion } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { gripRelease } from '../model/grip'
import {
  closedBy,
  greyedBy,
  PALETTE_CATEGORIES,
  type PaletteCategory,
} from '../model/palette-categories'
import { BarKeys } from './BarKeys'
import { FieldKey } from './FieldKey'
import { LineKeys } from './LineKeys'
import { SwingKeys, ArticulationKeys, DynamicKeys, OrnamentKeys, PedalKeys } from './MarkKeys'
import { NoteBar, NoteKeys, PitchKeys } from './NoteKeys'
import {
  PaletteDockContext,
  PaletteFormContext,
  PanelSections,
  type PaletteDock,
  type PaletteForm,
} from './palette-form'
import { CategoryIcon } from './palette-icons'
import { GroupName, KeyGrid, PaletteSection } from './palette-keys'
import { PaletteReason } from './palette-reason'
import { ClefKeys, KeySignatureKeys, RepeatKeys, TextKeys, TimeSignatureKeys } from './ScoreKeys'

/** The app's one ease-out (DESIGN.md's Motion). */
const EASE = [0.22, 1, 0.36, 1] as const
/** How long the category's mark takes to slide, in seconds. */
const SLIDE = 0.22

/** Why a category's tools are greyed where the caret writes, or nothing where they work. */
function useReason(category: PaletteCategory): string | undefined {
  const { t } = useTranslation('editor')
  const layer = useEditorState((state) => state.layer)
  const chosen = useEditorState((state) => chosenNotes(state).length > 0)
  const why = greyedBy(category, { layer, chosen })
  return why ? t(`reason.${why}`) : undefined
}

/** The categories whose tools say more than their names: the editing modes. */
const EXPLAINED: readonly PaletteCategory[] = ['notes']

/** What a key played does in each editing mode (ADR 0114), where their names alone do not say. */
function About() {
  const { t } = useTranslation('editor')
  return (
    <dl className="flex flex-col gap-2">
      {EDIT_MODES.map((mode) => (
        <div key={mode}>
          <dt className="font-semibold">{t(`mode.${mode}`)}</dt>
          <dd className="text-muted-foreground">{t(`mode.${mode}Detail`)}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * One category's tools under its name, with what its tools do and why they are greyed, where they
 * are, in the ⓘ beside it (ADR 0096). Each greyed key says why in its tooltip.
 */
function Section({ category, children }: { category: PaletteCategory; children: ReactNode }) {
  const { t } = useTranslation('editor')
  const reason = useReason(category)
  const explained = EXPLAINED.includes(category)
  return (
    <PaletteSection
      category={category}
      title={t(`palette.category.${category}`)}
      info={
        reason || explained ? (
          <>
            {reason ? <p>{reason}</p> : null}
            {explained ? <About /> : null}
          </>
        ) : undefined
      }
    >
      <PaletteReason value={reason}>{children}</PaletteReason>
    </PaletteSection>
  )
}

/**
 * Every category's tools in Flat's order (ADR 0114), the panel's and the sheet's alike: one tree,
 * laid out as the dock and the form say.
 */
function Tools() {
  const { t } = useTranslation('editor')
  return (
    <>
      <Section category="notes">
        <NoteKeys />
      </Section>
      <Section category="pitch">
        <PitchKeys />
      </Section>
      <Section category="articulations">
        <KeyGrid>
          <ArticulationKeys />
          <LineKeys lines={['slur']} />
          {/* The notes' fingers, typed over them (ADR 0096): no tap on the sheet opens them. */}
          <FieldKey field="fingering" />
        </KeyGrid>
      </Section>
      <Section category="ornaments">
        <KeyGrid>
          <OrnamentKeys />
        </KeyGrid>
      </Section>
      <Section category="dynamics">
        <KeyGrid>
          <DynamicKeys />
          <LineKeys lines={['cresc', 'dim']} />
        </KeyGrid>
        <GroupName name={t('pedal')} />
        <KeyGrid label={t('pedal')}>
          <PedalKeys />
        </KeyGrid>
      </Section>
      <Section category="bar">
        <BarKeys />
        {/* Flat's Measure: a tempo mark at the note, and swing from it (ADR 0097). */}
        <GroupName name={t('words.tempoGroup')} />
        <KeyGrid label={t('words.tempoGroup')}>
          <FieldKey field="tempo" />
          <SwingKeys />
        </KeyGrid>
      </Section>
      <Section category="clef">
        <ClefKeys />
      </Section>
      <Section category="key">
        <KeySignatureKeys />
      </Section>
      <Section category="time">
        <TimeSignatureKeys />
      </Section>
      <Section category="repeats">
        <RepeatKeys />
      </Section>
      <Section category="text">
        <TextKeys />
      </Section>
    </>
  )
}

/** The palette's tools laid out where it docks and in its form. */
function Laid({
  dock,
  form,
  children,
}: {
  dock: PaletteDock
  form: PaletteForm
  children: ReactNode
}) {
  return (
    <PaletteDockContext value={dock}>
      <PaletteFormContext value={form}>{children}</PaletteFormContext>
    </PaletteDockContext>
  )
}

/** Flat's default: the notes and their pitch open, the rest folded until opened. */
const FIRST_OPEN: readonly PaletteCategory[] = ['notes', 'pitch']

/**
 * The palette docked at the sheet's left (ADR 0114, Flat's notation panel): its head, then every
 * category an accordion row, several open at once, scrolling on its own; « hides it whole, the
 * sheet taking its room, the note-entry toolbar bringing it back. Never over the music.
 */
export function PalettePanel({ onHide }: { onHide: () => void }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const [open, setOpen] = useState<ReadonlySet<PaletteCategory>>(() => new Set(FIRST_OPEN))
  const toggle = (category: PaletteCategory) =>
    setOpen((now) => {
      const next = new Set(now)
      if (!next.delete(category)) next.add(category)
      return next
    })
  return (
    <section aria-label={t('palette.label')} className="flex min-h-0 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-hairline px-4">
        <h2 className="flex-1 text-sm font-semibold text-muted-foreground">{t('palette.label')}</h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('palette.hide')}
          title={t('palette.hide')}
          className="size-9 text-muted-foreground hover:text-foreground"
          onClick={onHide}
        >
          <ChevronsLeft aria-hidden />
        </Button>
      </div>
      <fieldset
        disabled={takes.stage !== 'idle'}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4"
      >
        <PanelSections value={{ open, toggle }}>
          <Laid dock="panel" form="grid">
            <Tools />
          </Laid>
        </PanelSections>
      </fieldset>
    </section>
  )
}

/**
 * The note-entry toolbar (ADR 0114, Flat's quick toolbar), the everyday tools in one row: over the
 * sheet on a laptop, the sheet's quick row on a phone. It scrolls sideways where the room is short.
 */
export function NoteToolbar({
  start,
  end,
  pill = false,
}: {
  start?: ReactNode
  end?: ReactNode
  /** In a sand pill, as Flat's toolbar groups them over the sheet. */
  pill?: boolean
}) {
  const { t } = useTranslation('editor')
  const row = useRef<HTMLDivElement>(null)
  const roving = useRovingFocus(row)
  return (
    <div className="flex min-w-0 items-center gap-1">
      {start}
      <div
        ref={row}
        role="toolbar"
        aria-label={t('palette.toolbar')}
        {...roving}
        className={cn(
          'fade-scroll-x flex min-w-0 items-center gap-0.5 overflow-x-auto overscroll-x-contain scrollbar-none',
          pill ? 'rounded-xl bg-muted px-1' : 'flex-1',
        )}
      >
        <Laid dock="sheet" form="bar">
          <NoteBar />
        </Laid>
      </div>
      {pill ? <span className="flex-1" /> : null}
      {end}
    </div>
  )
}

/** The Keys' toggle (Flat's piano-keyboard key): the keys docked under the sheet shown or hidden. */
export function KeysToggle({ className }: { className?: string }) {
  const { t } = useTranslation('editor')
  const keys = useFoldKeys()
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('palette.keys')}
      title={t('palette.keys')}
      aria-pressed={!keys.folded}
      className={cn(
        'size-10 shrink-0 rounded-lg text-muted-foreground hover:text-foreground aria-pressed:bg-[color-mix(in_oklab,var(--color-link)_14%,var(--color-card))] aria-pressed:text-link',
        className,
      )}
      onClick={() => keys.fold(!keys.folded)}
    >
      <Piano aria-hidden />
    </Button>
  )
}

/** A category's place in the sheet's scroller: its section's top. */
const placeOf = (box: HTMLElement, category: PaletteCategory) =>
  box.querySelector<HTMLElement>(`[data-category="${category}"]`)?.offsetTop ?? null

/** The last category whose section has come to the scroller's top. */
function categoryAt(box: HTMLElement): PaletteCategory | undefined {
  return PALETTE_CATEGORIES.filter((category) => {
    const place = placeOf(box, category)
    return place !== null && place <= box.scrollTop + 8
  }).at(-1)
}

/**
 * The bar of categories (Flat's tab bar): a picture each in a sand pill, scrolling sideways where the
 * screen is narrow, the category in sight on a card-paper thumb that slides to the one tapped or
 * scrolled to.
 */
function CategoryBar({
  current,
  onChoose,
}: {
  current: PaletteCategory | null
  onChoose: (category: PaletteCategory) => void
}) {
  const { t } = useTranslation('editor')
  const layer = useEditorState((state) => state.layer)
  const bar = useRef<HTMLDivElement>(null)
  const roving = useRovingFocus(bar)
  const motionOf = useScrollMotion()
  // The category chosen kept in sight in its bar, centred, clear of the faded edges.
  useEffect(() => {
    const box = bar.current
    const button = current ? box?.querySelector<HTMLElement>(`[data-for="${current}"]`) : null
    if (!box || !button) return
    const left = button.offsetLeft - box.offsetLeft - (box.clientWidth - button.offsetWidth) / 2
    box.scrollTo?.({ left, behavior: motionOf })
  }, [current, motionOf])
  return (
    <motion.div
      ref={bar}
      layoutScroll
      role="toolbar"
      aria-label={t('palette.categories')}
      {...roving}
      className="fade-scroll-x flex min-w-0 flex-1 gap-0.5 overflow-x-auto rounded-xl bg-muted p-0.5 scrollbar-none"
    >
      {PALETTE_CATEGORIES.map((category) => {
        const name = t(`palette.category.${category}`)
        // Greyed where the caret writes, its tooltip says why under its name (ADR 0096).
        const closed = closedBy(category, layer)
        const chosen = current === category
        return (
          <button
            key={category}
            data-for={category}
            type="button"
            aria-label={name}
            title={closed ? `${name}\n${t(`reason.${closed}`)}` : name}
            aria-current={chosen ? 'true' : undefined}
            data-off={closed ? true : undefined}
            onClick={() => onChoose(category)}
            className="relative grid h-10 w-11 shrink-0 place-items-center rounded-[0.625rem] text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground aria-[current=true]:text-foreground data-off:opacity-40 [&_svg]:relative [&_svg]:size-6"
          >
            {chosen ? (
              <motion.span
                layoutId="palette-category-mark"
                transition={{ duration: SLIDE, ease: EASE }}
                className="absolute inset-0 rounded-[0.625rem] bg-card shadow-sm"
              />
            ) : null}
            <CategoryIcon category={category} />
          </button>
        )
      })}
    </motion.div>
  )
}

/** The expanded sheet's sections, stacked and scrolling, room after the last so it too can stand at the top. */
function Sections({
  scroller,
  list,
  onScroll,
  onHand,
}: {
  scroller: RefObject<HTMLDivElement | null>
  list: boolean
  onScroll: () => void
  onHand: () => void
}) {
  const sections = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  // As much room after the last section as the scroller shows over it.
  useLayoutEffect(() => {
    const box = scroller.current
    const all = sections.current
    if (!box || !all || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      const last = all.lastElementChild as HTMLElement | null
      setRoom(last ? Math.max(0, box.clientHeight - last.offsetHeight - 8) : 0)
    }
    const watch = new ResizeObserver(measure)
    watch.observe(box)
    watch.observe(all)
    return () => watch.disconnect()
  }, [scroller])
  return (
    <div
      ref={scroller}
      onScroll={onScroll}
      onPointerDown={onHand}
      onWheel={onHand}
      onTouchStart={onHand}
      onScrollEnd={onHand}
      className="relative h-[min(38dvh,22rem)] min-h-0 overflow-y-auto overscroll-contain px-0.5"
    >
      <div ref={sections}>
        <Laid dock="sheet" form={list ? 'list' : 'grid'}>
          <Tools />
        </Laid>
      </div>
      <div aria-hidden style={{ height: room }} />
    </div>
  )
}

/** The sheet's grab handle (Flat's): dragged up it expands, down it goes compact; a tap toggles. */
function Grip({ folded, onFold }: { folded: boolean; onFold: (folded: boolean) => void }) {
  const start = useRef<number | null>(null)
  const [dragging, setDragging] = useState(false)
  return (
    <div
      aria-hidden
      data-slot="palette-grip"
      data-dragging={dragging || undefined}
      onPointerDown={(event) => {
        start.current = event.clientY
        setDragging(true)
        event.currentTarget.setPointerCapture?.(event.pointerId)
      }}
      onPointerUp={(event) => {
        const from = start.current
        start.current = null
        setDragging(false)
        if (from === null) return
        const next = gripRelease(event.clientY - from, folded)
        if (next !== null) onFold(next)
      }}
      onPointerCancel={() => {
        start.current = null
        setDragging(false)
      }}
      className="group flex h-4 shrink-0 cursor-grab touch-none items-center justify-center select-none data-dragging:cursor-grabbing"
    >
      <span className="h-1 w-10 rounded-full bg-muted-foreground/30 transition-colors duration-200 group-hover:bg-muted-foreground/55 group-data-dragging:bg-muted-foreground/70" />
    </div>
  )
}

/**
 * The palette docked at the sheet's foot on a phone (ADR 0114, Flat's bottom sheet), shrinking the
 * sheet rather than covering it. Compact (`folded`, as it opens): the quick row of everyday tools over
 * the bar of categories. Expanded: every category's section stacked and scrolling over the bar, a
 * category tapped scrolling to its own and the bar following the sections; its keys a table, or a list
 * naming each (list mode). With the keys shown it stays compact, the keys standing where its sections
 * would: expanded again, it folds the keys away. A category tapped while compact expands it there.
 */
export function PaletteSheet({
  folded,
  onFold,
}: {
  folded: boolean
  onFold: (folded: boolean) => void
}) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const keys = useFoldKeys()
  const motionOf = useScrollMotion()
  const scroller = useRef<HTMLDivElement>(null)
  const [list, setList] = useState(false)
  // Opened at what the caret's row writes: the chord row's first open category is Bar.
  const [current, setCurrent] = useState<PaletteCategory>(layer === 'chords' ? 'bar' : 'notes')
  // A category to open at, scrolled to at once once the sections are in.
  const pending = useRef<PaletteCategory | null>(null)
  // While the sections scroll to a category tapped, the bar keeps it; a hand on them lets it follow.
  const following = useRef(true)
  // The keys stand where the sections would: shown, the sheet is compact.
  const expanded = !folded && keys.folded

  const scrollTo = (category: PaletteCategory, behavior: ScrollBehavior) => {
    const box = scroller.current
    const top = box ? placeOf(box, category) : null
    if (box && top !== null) box.scrollTo?.({ top, behavior })
  }
  useLayoutEffect(() => {
    if (!expanded || !pending.current) return
    scrollTo(pending.current, 'instant')
    pending.current = null
  })
  const expand = (open: boolean, at?: PaletteCategory) => {
    if (open) {
      pending.current = at ?? current
      if (!keys.folded) keys.fold(true)
    }
    onFold(!open)
  }
  const choose = (category: PaletteCategory) => {
    setCurrent(category)
    if (!expanded) {
      expand(true, category)
      return
    }
    following.current = false
    scrollTo(category, motionOf)
  }
  const followScroll = () => {
    const box = scroller.current
    if (!box || !following.current) return
    const shown = categoryAt(box)
    if (shown && shown !== current) setCurrent(shown)
  }

  const barButton = 'size-10 shrink-0 rounded-lg text-muted-foreground hover:text-foreground'
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-label={t('palette.label')}
        className="pointer-events-auto flex min-h-0 flex-col gap-1.5 rounded-t-3xl border border-b-0 border-border bg-card px-3 pb-1 shadow-[0_-6px_20px_-8px] shadow-foreground/15"
      >
        <fieldset disabled={takes.stage !== 'idle'} className="contents">
          <Grip folded={!expanded} onFold={(next) => expand(!next)} />
          {expanded ? (
            <Sections
              scroller={scroller}
              list={list}
              onScroll={followScroll}
              onHand={() => (following.current = true)}
            />
          ) : (
            <NoteToolbar />
          )}
          <div className="flex shrink-0 items-center gap-1">
            <CategoryBar current={expanded ? current : null} onChoose={choose} />
            {expanded ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label={t(list ? 'palette.grid' : 'palette.list')}
                title={t(list ? 'palette.grid' : 'palette.list')}
                className={barButton}
                onClick={() => setList(!list)}
              >
                {list ? <LayoutGrid aria-hidden /> : <List aria-hidden />}
              </Button>
            ) : (
              <KeysToggle />
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label={t(expanded ? 'palette.close' : 'palette.open')}
              title={t(expanded ? 'palette.close' : 'palette.open')}
              aria-expanded={expanded}
              className={barButton}
              onClick={() => expand(!expanded)}
            >
              {expanded ? <SquareChevronDown aria-hidden /> : <SquareChevronUp aria-hidden />}
            </Button>
          </div>
        </fieldset>
      </section>
    </MotionConfig>
  )
}
