import { ChevronDown, ChevronUp, Piano } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
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
import { ArticulationKeys, DynamicKeys } from './MarkKeys'
import { NoteKeys, PitchKeys } from './NoteKeys'
import { PaletteFormContext, type PaletteForm } from './palette-form'
import { CategoryIcon } from './palette-icons'
import { CaptionGrid, PaletteSection } from './palette-keys'
import { PaletteReason } from './palette-reason'
import { ClefKeys, KeySignatureKeys, RepeatKeys, TextKeys, TimeSignatureKeys } from './ScoreKeys'

/** The app's one ease-out (DESIGN.md's Motion). */
const EASE = [0.22, 1, 0.36, 1] as const
/** How long the palette takes to open or fold, and the category's mark to slide, in seconds. */
const OPENING = 0.28
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
 * One category's tools: in a section, its name, with what its tools do and why they are greyed,
 * where they are, in the ⓘ beside it (ADR 0096); in the row, a group of keys. Each greyed key says
 * why in its tooltip.
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

/** Every category's tools, in the bar's order, laid out as `form` says (ADR 0114). */
function Tools({ form }: { form: PaletteForm }) {
  return (
    <PaletteFormContext value={form}>
      <Section category="notes">
        <NoteKeys />
      </Section>
      <Section category="pitch">
        <PitchKeys />
      </Section>
      <Section category="articulations">
        <ArticulationKeys />
        {/* The notes' fingers, typed over them (ADR 0096): no tap on the sheet opens them. */}
        <CaptionGrid>
          <FieldKey field="fingering" />
        </CaptionGrid>
      </Section>
      <Section category="dynamics">
        <DynamicKeys />
        <LineKeys lines={['cresc', 'dim']} />
      </Section>
      <Section category="lines">
        <LineKeys lines={['slur', '8va', '8vb']} />
      </Section>
      <Section category="bar">
        <BarKeys />
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
    </PaletteFormContext>
  )
}

/**
 * The palette's grab handle along its top edge (Flat's sheet): dragged away from the edge the palette
 * stands on, it opens; dragged back, it folds; a tap toggles. For a pointer only: a keyboard and a
 * screen reader have the fold's button in the bar.
 */
function PaletteGrip({
  folded,
  opens,
  onFold,
}: {
  folded: boolean
  opens: 'up' | 'down'
  onFold: (folded: boolean) => void
}) {
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
        const next = gripRelease(event.clientY - from, folded, opens)
        if (next !== null) onFold(next)
      }}
      onPointerCancel={() => {
        start.current = null
        setDragging(false)
      }}
      className="group -mt-1.5 -mb-1 flex h-5 shrink-0 cursor-grab touch-none items-center justify-center select-none data-dragging:cursor-grabbing"
    >
      <span className="h-1 w-10 rounded-full bg-muted-foreground/35 transition-colors duration-200 group-hover:bg-muted-foreground/60 group-data-dragging:bg-muted-foreground/70" />
    </div>
  )
}

/** A category's place in a scroller: a section's top, or a group's left edge, from the scroller's own. */
const placeOf = (box: HTMLElement, category: PaletteCategory, axis: 'top' | 'left') => {
  const element = box.querySelector<HTMLElement>(`[data-category="${category}"]`)
  if (!element) return null
  return axis === 'top' ? element.offsetTop : element.offsetLeft - box.offsetLeft
}

/** The first category whose place has come into a scroller, at its start, the last one passed. */
function categoryAt(box: HTMLElement, axis: 'top' | 'left'): PaletteCategory | undefined {
  const at = axis === 'top' ? box.scrollTop : box.scrollLeft
  return PALETTE_CATEGORIES.filter((category) => {
    const place = placeOf(box, category, axis)
    return place !== null && place <= at + 8
  }).at(-1)
}

/**
 * The folded palette (ADR 0114): every tool in one row, grouped by category in the order the opened
 * palette lists them, a hairline between groups; it scrolls sideways under a finger, a trackpad or
 * the mouse wheel (turned sideways), snapping to keys, fading at an edge with more beyond, and brings
 * a key pressed into sight. One stop of the Tab key, ← → along it.
 */
function ToolRow({ row }: { row: RefObject<HTMLDivElement | null> }) {
  const { t } = useTranslation('editor')
  const roving = useRovingFocus(row)
  const motionOf = useScrollMotion()
  // The mouse wheel turned sideways: a row has no height to scroll.
  useEffect(() => {
    const box = row.current
    if (!box) return
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      if (box.scrollWidth <= box.clientWidth) return
      event.preventDefault()
      box.scrollLeft += event.deltaY
    }
    box.addEventListener('wheel', onWheel, { passive: false })
    return () => box.removeEventListener('wheel', onWheel)
  }, [row])
  // A key pressed, or reached by the arrows, in sight, clear of the faded edges.
  const reveal = (target: EventTarget) => {
    const box = row.current
    const key = target instanceof Element ? target.closest<HTMLElement>('button') : null
    if (!box || !key) return
    const left = key.offsetLeft - box.offsetLeft
    const room = 24
    const to =
      left < box.scrollLeft + room
        ? left - room
        : left + key.offsetWidth > box.scrollLeft + box.clientWidth - room
          ? left + key.offsetWidth - box.clientWidth + room
          : null
    if (to !== null) box.scrollTo?.({ left: to, behavior: motionOf })
  }
  return (
    <div
      ref={row}
      role="toolbar"
      aria-label={t('palette.row')}
      onKeyDown={roving.onKeyDown}
      onFocus={(event) => {
        roving.onFocus(event)
        reveal(event.target)
      }}
      onClickCapture={(event) => reveal(event.target)}
      className="fade-scroll-x flex min-w-0 snap-x snap-proximity scroll-px-6 items-center gap-1 overflow-x-auto overscroll-x-contain p-0.5 scrollbar-none"
    >
      <Tools form="row" />
    </div>
  )
}

/**
 * The bar of categories over the opened palette's sections (ADR 0114), a picture each, scrolling
 * sideways where the screen is narrow: the category in sight marked, the mark sliding to the one
 * tapped or scrolled to.
 */
function CategoryBar({
  current,
  onChoose,
}: {
  current: PaletteCategory
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
    const button = box?.querySelector<HTMLElement>(`[data-for="${current}"]`)
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
      className="fade-scroll-x flex min-w-0 gap-0.5 overflow-x-auto p-0.5 scrollbar-none"
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
            className="relative grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground aria-[current=true]:text-selected-foreground data-off:opacity-40 landscape-phone:h-10 [&_svg]:relative [&_svg]:size-6"
          >
            {chosen ? (
              <motion.span
                layoutId="palette-category-mark"
                transition={{ duration: SLIDE, ease: EASE }}
                className="absolute inset-0 rounded-xl bg-selected"
              />
            ) : null}
            <CategoryIcon category={category} />
          </button>
        )
      })}
    </motion.div>
  )
}

/**
 * The opened palette's sections, stacked and scrolling, room after the last so it too can stand at the
 * top (ADR 0114): it opens and folds as one motion of its height.
 */
function Sections({
  scroller,
  side,
  onScroll,
  onHand,
  onScrolled,
}: {
  scroller: RefObject<HTMLDivElement | null>
  side: boolean
  onScroll: () => void
  onHand: () => void
  onScrolled: () => void
}) {
  const still = useReducedMotion() === true
  const sections = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  // As much room after the last section as the scroller shows over it, while the sections are taller.
  useLayoutEffect(() => {
    const box = scroller.current
    const all = sections.current
    if (!box || !all || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      const last = all.lastElementChild as HTMLElement | null
      const capped = all.offsetHeight > box.clientHeight
      setRoom(capped && last ? Math.max(0, box.clientHeight - last.offsetHeight - 8) : 0)
    }
    const watch = new ResizeObserver(measure)
    watch.observe(box)
    watch.observe(all)
    return () => watch.disconnect()
  }, [scroller])
  return (
    <motion.div
      key="sections"
      ref={scroller}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: still ? 0 : OPENING, ease: EASE }}
      onScroll={onScroll}
      onPointerDown={onHand}
      onWheel={onHand}
      onTouchStart={onHand}
      // A smooth scroll to a category ended: the bar follows the sections again.
      onScrollEnd={onScrolled}
      className={cn(
        'relative min-h-0 shrink overflow-y-auto overscroll-contain rounded-2xl bg-background px-2.5',
        side ? null : 'max-h-[min(30dvh,18rem)]',
      )}
    >
      <div ref={sections} className="pb-2">
        <Tools form="sections" />
      </div>
      <div aria-hidden style={{ height: room }} />
    </motion.div>
  )
}

/**
 * The editor's one palette (after Flat; ADR 0114): every tool, each acting on what is
 * chosen (a note, a chord, a range or bars), else setting what the next note will be. A card floating
 * over the sheet (ADR 0115), at the foot (`side` off) or beside it (`side`). Folded, one row of
 * every tool, scrolling sideways; opened (`folded` off), every category's section stacked and
 * scrolling over the bar of categories, a category tapped scrolling smoothly to its own, the bar's
 * mark following the sections as they scroll. The palette's fold and a Keys toggle stand at the row's
 * end in both, never moving. Opening and folding is one motion of its height (at once under reduced
 * motion), opened at the category the row showed. While a take records, the tools wait for Stop.
 */
export function EditorTools({
  side,
  folded,
  onFold,
}: {
  side: boolean
  folded: boolean
  onFold: (folded: boolean) => void
}) {
  const { t } = useTranslation(['editor', 'common'])
  const { takes } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const keys = useFoldKeys()
  const still = useReducedMotion() === true
  const motionOf = useScrollMotion()
  const recording = takes.stage !== 'idle'
  const scroller = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLDivElement>(null)
  // Opened at what the caret's row writes: the chord row's first open category is Bar.
  const [current, setCurrent] = useState<PaletteCategory>(layer === 'chords' ? 'bar' : 'notes')
  // A category to open at, scrolled to at once once the sections are in.
  const pending = useRef<PaletteCategory | null>(null)
  // While the sections scroll to a category tapped, the bar keeps it; a hand on them, or the
  // scroll's end, lets the bar follow them again.
  const following = useRef(true)

  const scrollTo = (category: PaletteCategory, behavior: ScrollBehavior) => {
    const box = scroller.current
    const top = box ? placeOf(box, category, 'top') : null
    if (box && top !== null) box.scrollTo?.({ top, behavior })
  }
  useLayoutEffect(() => {
    if (folded || !pending.current) return
    scrollTo(pending.current, 'instant')
    pending.current = null
  })

  const fold = (next: boolean) => {
    if (!next) {
      // Opened at the category the row showed at its start.
      const box = row.current
      const shown = box ? categoryAt(box, 'left') : undefined
      if (shown) setCurrent(shown)
      pending.current = shown ?? current
    }
    onFold(next)
  }
  const choose = (category: PaletteCategory) => {
    following.current = false
    setCurrent(category)
    scrollTo(category, motionOf)
  }
  const followScroll = () => {
    const box = scroller.current
    if (!box || !following.current) return
    const shown = categoryAt(box, 'top')
    if (shown && shown !== current) setCurrent(shown)
  }

  const barButton =
    'size-11 shrink-0 rounded-xl text-muted-foreground hover:text-foreground landscape-phone:h-10'
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-label={t('palette.label')}
        className="flex max-h-full min-h-0 flex-col gap-1.5 rounded-3xl border border-border bg-muted p-1.5 shadow-xl shadow-foreground/15"
      >
        <fieldset disabled={recording} className="contents">
          <PaletteGrip folded={folded} opens={side ? 'down' : 'up'} onFold={fold} />
          <AnimatePresence initial={false}>
            {folded ? null : (
              <Sections
                scroller={scroller}
                side={side}
                onScroll={followScroll}
                onHand={() => (following.current = true)}
                onScrolled={() => (following.current = true)}
              />
            )}
          </AnimatePresence>
          <div className="flex shrink-0 items-center gap-0.5">
            {/* The row and the bar take each other's place, the one fading in over the other. */}
            <div className="relative grid min-w-0 flex-1">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={folded ? 'row' : 'bar'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: still ? 0 : 0.16, ease: EASE }}
                  className="grid min-w-0"
                >
                  {folded ? (
                    <ToolRow row={row} />
                  ) : (
                    <CategoryBar current={current} onChoose={choose} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t(folded ? 'palette.open' : 'palette.close')}
              title={t(folded ? 'palette.open' : 'palette.close')}
              aria-expanded={!folded}
              className={barButton}
              onClick={() => fold(!folded)}
            >
              {/* Its arrow the way it opens: up at the foot, down beside the sheet. */}
              {folded === side ? <ChevronDown aria-hidden /> : <ChevronUp aria-hidden />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('palette.keys')}
              title={t('palette.keys')}
              aria-pressed={!keys.folded}
              className={cn(
                barButton,
                'aria-pressed:bg-selected aria-pressed:text-selected-foreground',
              )}
              onClick={() => keys.fold(!keys.folded)}
            >
              <Piano aria-hidden />
            </Button>
          </div>
        </fieldset>
      </section>
    </MotionConfig>
  )
}
