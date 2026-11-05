import { SquareChevronDown, SquareChevronUp } from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode, type Ref, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { selectPaletteCategory, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { chosenNotes } from '@/features/score-editor'
import { useFoldKeys } from '@/features/live-keyboard'
import { setPaletteCategory } from '@/features/set-preference'
import { cn, useRovingFocus, useScrollMotion } from '@/shared/lib'
import { PickerLayoutContext } from '@/shared/ui/pickers/picker-layout'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { gripRelease } from '../model/grip'
import {
  closedBy,
  greyedBy,
  isPaletteCategory,
  PALETTE_CATEGORIES,
  type PaletteCategory,
} from '../model/palette-categories'
import { BarKeys } from './BarKeys'
import { FieldKey } from './FieldKey'
import { LineKeys } from './LineKeys'
import {
  SwingKeys,
  ArticulationKeys,
  DynamicKeys,
  OrnamentKeys,
  PedalKeys,
  TwoNoteTremoloKeys,
} from './MarkKeys'
import { NoteKeys, PitchKeys } from './NoteKeys'
import { PaletteFormContext, type PaletteForm } from './palette-form'
import { CategoryIcon } from './palette-icons'
import { GroupName, KeyGrid, PaletteSection } from './palette-keys'
import { PaletteReason } from './palette-reason'
import { ClefKeys, KeySignatureKeys, RepeatKeys, TextKeys, TimeSignatureKeys } from './ScoreKeys'

/** The app's one ease-out (DESIGN.md's Motion). */
const EASE = [0.22, 1, 0.36, 1] as const
/** How long the category's mark takes to slide, in seconds. */
const SLIDE = 0.22

/**
 * The palette's category (R31-E), the panel's and the floating sheet's one: as the learner left it,
 * else Notes, Flat's first.
 */
function useCategory(): readonly [PaletteCategory, (category: PaletteCategory) => void] {
  const settings = useSettingsStoreApi()
  const saved = useSettings(selectPaletteCategory)
  const category = isPaletteCategory(saved) ? saved : 'notes'
  return [category, (next) => setPaletteCategory(settings, next)] as const
}

/** Why a category's tools are greyed where the caret writes, or nothing where they work. */
function useReason(category: PaletteCategory): string | undefined {
  const { t } = useTranslation('editor')
  const layer = useEditorState((state) => state.layer)
  const chosen = useEditorState((state) => chosenNotes(state).length > 0)
  const why = greyedBy(category, { layer, chosen })
  return why ? t(`reason.${why}`) : undefined
}

/**
 * One category's tools (ADR 0114, R31-E): titled grids, the first under the category's own name
 * with why its tools are greyed, where they are, in the ⓘ beside it (ADR 0096); in the row, its keys
 * alone. Each greyed key says why in its tooltip.
 */
function Category({ category }: { category: PaletteCategory }) {
  const { t } = useTranslation('editor')
  const reason = useReason(category)
  const title = t(`palette.category.${category}`)
  return (
    <PaletteSection category={category} title={title}>
      {/* Notes titles its own sections: its input modes, then Notation. */}
      {category === 'notes' ? null : <GroupName name={title} info={reason} />}
      <PaletteReason value={reason}>
        <Tools category={category} />
      </PaletteReason>
    </PaletteSection>
  )
}

/** A category's tools in Flat's order, laid out as the form says. */
function Tools({ category }: { category: PaletteCategory }) {
  const { t } = useTranslation('editor')
  switch (category) {
    case 'notes':
      return <NoteKeys />
    case 'pitch':
      return <PitchKeys />
    case 'articulations':
      return (
        <KeyGrid>
          <ArticulationKeys />
          <LineKeys lines={['slur']} />
          {/* The notes' fingers, typed over them (ADR 0096): no tap on the sheet opens them. */}
          <FieldKey field="fingering" />
        </KeyGrid>
      )
    case 'ornaments':
      return (
        <>
          <KeyGrid>
            <OrnamentKeys />
          </KeyGrid>
          <GroupName name={t('marks.twoNoteTremolo')} info={t('marks.twoNoteTremoloInfo')} />
          <KeyGrid label={t('marks.twoNoteTremolo')}>
            <TwoNoteTremoloKeys />
          </KeyGrid>
        </>
      )
    case 'dynamics':
      return (
        <>
          <KeyGrid>
            <DynamicKeys />
            <LineKeys lines={['cresc', 'dim']} />
          </KeyGrid>
          <GroupName name={t('pedal')} />
          <KeyGrid label={t('pedal')}>
            <PedalKeys />
          </KeyGrid>
        </>
      )
    case 'measures':
      return (
        <>
          <BarKeys />
          {/* Flat's Measure: swing from the note (ADR 0097). */}
          <GroupName name={t('words.swing')} />
          <KeyGrid label={t('words.swing')}>
            <SwingKeys />
          </KeyGrid>
        </>
      )
    case 'clef':
      return <ClefKeys />
    case 'key':
      return <KeySignatureKeys />
    case 'time':
      return <TimeSignatureKeys />
    case 'repeats':
      return <RepeatKeys />
    case 'text':
      return <TextKeys />
  }
}

/** The palette's keys laid out in a form: the row's pickers their signs alone. */
function Laid({ form, children }: { form: PaletteForm; children: ReactNode }) {
  return (
    <PaletteFormContext value={form}>
      <PickerLayoutContext value={form === 'bar' ? 'row' : 'grid'}>{children}</PickerLayoutContext>
    </PaletteFormContext>
  )
}

/** Whether a sideways scroller has more past its start and past its end: where it fades. */
function useScrollEdges(box: RefObject<HTMLDivElement | null>) {
  const [edges, setEdges] = useState({ before: false, after: false })
  useEffect(() => {
    const element = box.current
    if (!element) return
    const measure = () => {
      const before = element.scrollLeft > 1
      const after = element.scrollLeft + element.clientWidth < element.scrollWidth - 1
      setEdges((was) => (was.before === before && was.after === after ? was : { before, after }))
    }
    measure()
    element.addEventListener('scroll', measure, { passive: true })
    const watch = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    watch?.observe(element)
    return () => {
      element.removeEventListener('scroll', measure)
      watch?.disconnect()
    }
  }, [box])
  return edges
}

/** The fade at a scroller's edge with more past it (R31-E, the mockup's strip). */
const FADES = {
  none: '',
  before: 'mask-l-from-85%',
  after: 'mask-r-from-85%',
  both: 'mask-x-from-85%',
} as const

const fadeOf = ({ before, after }: { before: boolean; after: boolean }) =>
  FADES[before && after ? 'both' : before ? 'before' : after ? 'after' : 'none']

/**
 * The strip of categories (R31-E, Flat's tab bar): a picture each in a sand pill, the chosen one on
 * a card-paper thumb that slides to the one tapped. On a phone it scrolls sideways in its own box,
 * the chosen one scrolled into view, fading only at an edge with more past it; in the panel
 * (`wrap`), every category in rows.
 */
function CategoryStrip({
  current,
  onChoose,
  wrap = false,
}: {
  current: PaletteCategory
  onChoose: (category: PaletteCategory) => void
  wrap?: boolean
}) {
  const { t } = useTranslation('editor')
  const layer = useEditorState((state) => state.layer)
  const strip = useRef<HTMLDivElement>(null)
  const roving = useRovingFocus(strip)
  const motionOf = useScrollMotion()
  const edges = useScrollEdges(strip)
  // The category chosen kept in sight in its strip, in the middle.
  useEffect(() => {
    const box = strip.current
    const button = box?.querySelector<HTMLElement>(`[data-for="${current}"]`)
    if (wrap || !box || !button) return
    const left = button.offsetLeft - box.offsetLeft - (box.clientWidth - button.offsetWidth) / 2
    box.scrollTo?.({ left, behavior: motionOf })
  }, [current, motionOf, wrap])
  return (
    <motion.div
      ref={strip}
      layoutScroll
      role="toolbar"
      aria-label={t('palette.categories')}
      {...roving}
      className={cn(
        'flex min-w-0 rounded-card bg-muted p-0.5',
        wrap ? 'flex-wrap' : cn('overflow-x-auto scrollbar-none', fadeOf(edges)),
      )}
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
            className="relative grid size-11 shrink-0 place-items-center rounded-control text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground focus-visible:-outline-offset-3 aria-[current=true]:text-foreground data-off:opacity-40 [&_svg]:relative [&_svg]:size-6"
          >
            {chosen ? (
              <motion.span
                layoutId="palette-category-mark"
                transition={{ duration: SLIDE, ease: EASE }}
                className="absolute inset-0 rounded-control bg-card shadow-sm"
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
 * The editor's panel at the sheet's side from 48rem (ADR 0114, R31-E, Flat's desktop), its left or
 * right as Note input says: every category in rows, then the chosen one's tools as titled grids,
 * scrolling on their own. Never over the music.
 */
export function EditorPanel() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const [category, choose] = useCategory()
  return (
    <MotionConfig reducedMotion="user">
      <section aria-label={t('panel.label')} className="flex min-h-0 flex-col">
        <div className="shrink-0 border-b border-hairline p-3">
          <CategoryStrip current={category} onChoose={choose} wrap />
        </div>
        <fieldset
          disabled={takes.stage !== 'idle'}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2"
        >
          <Laid form="grid">
            <Category category={category} />
          </Laid>
        </fieldset>
      </section>
    </MotionConfig>
  )
}

/** The sheet's grab handle (Flat's): dragged up it unfolds, down it folds; a tap toggles. */
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
      <span className="h-1 w-10 rounded-pill bg-muted-foreground/30 transition-colors duration-200 group-hover:bg-muted-foreground/55 group-data-dragging:bg-muted-foreground/70" />
    </div>
  )
}

/** The folded palette's row of its category's tools, scrolling sideways in its own box. */
function ToolRow({ category }: { category: PaletteCategory }) {
  const { t } = useTranslation('editor')
  const row = useRef<HTMLDivElement>(null)
  const roving = useRovingFocus(row)
  const edges = useScrollEdges(row)
  return (
    <div
      ref={row}
      role="toolbar"
      aria-label={t('palette.toolbar')}
      {...roving}
      className={cn(
        'flex min-w-0 items-center overflow-x-auto overscroll-x-contain scrollbar-none',
        fadeOf(edges),
      )}
    >
      <Laid form="bar">
        <Category category={category} />
      </Laid>
    </div>
  )
}

/**
 * The palette floating at the screen's foot on a phone (R31-E, Flat's): a rounded card above the
 * foot, never a docked band. Folded (as it first opens), the chosen category's tools in one row over
 * the strip of categories, Show every tool its own last cell; unfolded, the category's tools as
 * titled grids of equal cells, as tall as they need up to half the screen, scrolling. With the keys
 * shown it unfolds over them only once they fold away; a category chosen in the strip is shown in
 * the form it is in.
 */
export function PaletteSheet({
  folded,
  onFold,
  ref,
}: {
  folded: boolean
  onFold: (folded: boolean) => void
  ref?: Ref<HTMLElement>
}) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const keys = useFoldKeys()
  const [category, choose] = useCategory()
  // The keys stand where the grids would: shown, the sheet stays folded.
  const unfolded = !folded && keys.folded
  const unfold = (open: boolean) => {
    if (open && !keys.folded) keys.fold(true)
    onFold(!open)
  }
  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={ref}
        aria-label={t('panel.label')}
        className="pointer-events-auto flex max-h-[50dvh] min-h-0 flex-col gap-1.5 rounded-sheet border border-border bg-card px-2.5 pb-2.5 shadow-lg"
      >
        <fieldset disabled={takes.stage !== 'idle'} className="contents">
          <Grip folded={!unfolded} onFold={(next) => unfold(!next)} />
          {unfolded ? (
            <div className="min-h-0 overflow-y-auto overscroll-contain">
              <Laid form="grid">
                <Category category={category} />
              </Laid>
            </div>
          ) : (
            <ToolRow category={category} />
          )}
          <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5">
            <CategoryStrip current={category} onChoose={choose} />
            <Button
              variant="ghost"
              size="icon"
              aria-label={t(unfolded ? 'palette.close' : 'palette.open')}
              title={t(unfolded ? 'palette.close' : 'palette.open')}
              aria-expanded={unfolded}
              className="rounded-control text-muted-foreground hover:text-foreground"
              onClick={() => unfold(!unfolded)}
            >
              {unfolded ? <SquareChevronDown aria-hidden /> : <SquareChevronUp aria-hidden />}
            </Button>
          </div>
        </fieldset>
      </section>
    </MotionConfig>
  )
}
