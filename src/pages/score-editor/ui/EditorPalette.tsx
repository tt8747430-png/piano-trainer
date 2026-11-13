import { MotionConfig, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { selectPaletteCategory, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { chosenNotes } from '@/features/score-editor'
import { useFoldKeys } from '@/features/live-keyboard'
import { setPaletteCategory } from '@/features/set-preference'
import { cn, useRovingFocus, useScrollMotion } from '@/shared/lib'
import { PickerLayoutContext } from '@/shared/ui/pickers/picker-layout'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { gripRelease } from '../model/grip'
import {
  isPaletteCategory,
  needsNote,
  openCategories,
  type PaletteCategory,
} from '../model/palette-categories'
import { BarKeys } from './BarKeys'
import { FieldKey } from './FieldKey'
import { KeyPicker } from './KeyPicker'
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
import { GroupName, KeyGrid, PaletteHint, PaletteSection } from './palette-keys'
import { ClefKeys, RepeatKeys, TempoKeys, TextKeys } from './ScoreKeys'
import { SelectionStrip } from './SelectionStrip'
import { TimePicker } from './TimePicker'

/** The app's one ease-out (DESIGN.md's Motion). */
const EASE = [0.22, 1, 0.36, 1] as const
/** How long the category's mark takes to slide, in seconds. */
const SLIDE = 0.22

/**
 * The palette's category (R31-E, R32-C): the tab lit in the strip and the section the palette keeps
 * in sight, as the learner left it, else Notes, Flat's first; where it does not act (the chord row's
 * notes), the first that does.
 */
function useCategory(): readonly [PaletteCategory, (category: PaletteCategory) => void] {
  const settings = useSettingsStoreApi()
  const saved = useSettings(selectPaletteCategory)
  const open = openCategories(useEditorState((state) => state.layer))
  const wanted = isPaletteCategory(saved) ? saved : 'notes'
  const category = open.includes(wanted) ? wanted : (open[0] ?? 'measures')
  return [category, (next) => setPaletteCategory(settings, next)] as const
}

/**
 * A category's section (its canvas, Flat's): its title, then its tools as tiles; in the folded row,
 * its keys alone. Only the tools that act on what is chosen are drawn (R32-B); a category whose
 * every tool changes notes asks for one while none is chosen.
 */
function Category({ category }: { category: PaletteCategory }) {
  const { t } = useTranslation('editor')
  const waits = useEditorState((state) => needsNote(category, chosenNotes(state).length > 0))
  const title = t(`palette.category.${category}`)
  return (
    <PaletteSection category={category} title={title}>
      {/* Notes titles its own sections: its input modes, then Notation. */}
      {category === 'notes' ? null : <GroupName name={title} />}
      {waits ? <PaletteHint>{t('palette.chooseNote')}</PaletteHint> : <Tools category={category} />}
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
          {/* Flat's Measure: Tempo and the tempo words, then swing from the note (ADR 0097). */}
          <TempoKeys />
          <GroupName name={t('words.swing')} />
          <KeyGrid label={t('words.swing')}>
            <SwingKeys />
          </KeyGrid>
        </>
      )
    case 'clef':
      return <ClefKeys />
    case 'key':
      return <KeyPicker />
    case 'time':
      return <TimePicker />
    case 'repeats':
      return <RepeatKeys />
    case 'text':
      return <TextKeys />
  }
}

/** The palette's keys laid out in a form: the row's pickers their signs alone, else Flat's tables. */
function Laid({ form, children }: { form: PaletteForm; children: ReactNode }) {
  return (
    <PaletteFormContext value={form}>
      <PickerLayoutContext value={form === 'bar' ? 'row' : 'palette'}>
        {children}
      </PickerLayoutContext>
    </PaletteFormContext>
  )
}

/**
 * Every category that acts where the caret writes, one section after another (R32-C, Flat's): the
 * phone's palette unfolded and the laptop's panel scroll through them all.
 */
function Sections() {
  const categories = openCategories(useEditorState((state) => state.layer))
  return categories.map((category) => <Category key={category} category={category} />)
}

/** A section's place in its scroller: its top, measured from the scroller's own. */
const sectionTop = (box: HTMLElement, category: PaletteCategory): number | null => {
  const section = box.querySelector<HTMLElement>(`[data-category="${category}"]`)
  return section ? section.offsetTop - box.offsetTop : null
}

/**
 * Keeps the category chosen in sight in a scroller of every section (R32-C, Flat's): a tab tapped or
 * a sign tapped on the score scrolls to its section; scrolled by hand, the section at the top becomes
 * the category (the strip's lit tab), without scrolling again.
 */
function useSectionInSight(
  box: RefObject<HTMLElement | null>,
  category: PaletteCategory,
  choose: (category: PaletteCategory) => void,
) {
  const motionOf = useScrollMotion()
  const spied = useRef<PaletteCategory | null>(null)
  const categories = openCategories(useEditorState((state) => state.layer))
  useEffect(() => {
    const element = box.current
    if (!element || spied.current === category) return
    const top = sectionTop(element, category)
    if (top !== null) element.scrollTo?.({ top, behavior: motionOf })
  }, [box, category, motionOf])
  const onScroll = () => {
    const element = box.current
    if (!element) return
    const atTop = categories.findLast((each) => {
      const top = sectionTop(element, each)
      return top !== null && top <= element.scrollTop + 8
    })
    if (atTop && atTop !== category) {
      spied.current = atTop
      choose(atTop)
    }
  }
  return onScroll
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
 * The strip of categories (R31-E, R32-C, Flat's tab bar; canvas 123): each by its short name in a sand pill, the one in
 * sight on a card-paper thumb that slides to the one tapped; only those that act where the caret
 * writes (R32-B). It scrolls sideways in its own box, the lit one kept in view, fading only at an
 * edge with more past it.
 */
function CategoryStrip({
  current,
  onChoose,
}: {
  current: PaletteCategory
  onChoose: (category: PaletteCategory) => void
}) {
  const { t } = useTranslation('editor')
  const categories = openCategories(useEditorState((state) => state.layer))
  const strip = useRef<HTMLDivElement>(null)
  const roving = useRovingFocus(strip)
  const motionOf = useScrollMotion()
  const edges = useScrollEdges(strip)
  // The category lit kept in sight in its strip, in the middle.
  useEffect(() => {
    const box = strip.current
    const button = box?.querySelector<HTMLElement>(`[data-for="${current}"]`)
    if (!box || !button) return
    const left = button.offsetLeft - box.offsetLeft - (box.clientWidth - button.offsetWidth) / 2
    box.scrollTo?.({ left, behavior: motionOf })
  }, [current, motionOf])
  return (
    <motion.div
      ref={strip}
      layoutScroll
      role="toolbar"
      aria-label={t('palette.categories')}
      {...roving}
      className={cn(
        'flex min-w-0 overflow-x-auto rounded-card bg-muted p-0.5 scrollbar-none',
        fadeOf(edges),
      )}
    >
      {categories.map((category) => {
        const name = t(`palette.category.${category}`)
        const tab = t(`palette.tab.${category}`)
        const chosen = current === category
        return (
          <button
            key={category}
            data-for={category}
            type="button"
            title={tab === name ? undefined : name}
            aria-current={chosen ? 'true' : undefined}
            onClick={() => onChoose(category)}
            className="relative grid h-11 shrink-0 place-items-center rounded-control px-3.5 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground focus-visible:-outline-offset-3 aria-[current=true]:text-foreground"
          >
            {chosen ? (
              <motion.span
                layoutId="palette-category-mark"
                transition={{ duration: SLIDE, ease: EASE }}
                className="absolute inset-0 rounded-control bg-card shadow-sm"
              />
            ) : null}
            <span className="relative">{tab}</span>
          </button>
        )
      })}
    </motion.div>
  )
}

/**
 * The editor's panel at the sheet's side from 48rem (its canvas, Flat's web panel), its left or
 * right as Note input says: the selection strip at its head, then every section stacked in one
 * scroll; a sign tapped on the score scrolls to its section. Never over the music.
 */
export function EditorPanel() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const [category, choose] = useCategory()
  const box = useRef<HTMLFieldSetElement>(null)
  const onScroll = useSectionInSight(box, category, choose)
  return (
    <MotionConfig reducedMotion="user">
      <section aria-label={t('panel.label')} className="flex min-h-0 flex-col">
        <SelectionStrip className="border-b border-hairline py-2 ps-4 pe-2" />
        <fieldset
          ref={box}
          disabled={takes.stage !== 'idle'}
          onScroll={onScroll}
          className="relative flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 pt-4 pb-6"
        >
          <Laid form="grid">
            <Sections />
          </Laid>
        </fieldset>
      </section>
    </MotionConfig>
  )
}

/**
 * The sheet's grab handle (its canvas, Flat's): a 44px target; dragged up it unfolds, down it folds;
 * a tap toggles.
 */
function Grip({
  folded,
  label,
  onFold,
}: {
  folded: boolean
  label: string
  onFold: (folded: boolean) => void
}) {
  const start = useRef<number | null>(null)
  const moved = useRef(false)
  const [dragging, setDragging] = useState(false)
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-expanded={!folded}
      data-slot="palette-grip"
      data-dragging={dragging || undefined}
      onPointerDown={(event) => {
        start.current = event.clientY
        moved.current = false
        setDragging(true)
        event.currentTarget.setPointerCapture?.(event.pointerId)
      }}
      onPointerUp={(event) => {
        const from = start.current
        start.current = null
        setDragging(false)
        if (from === null) return
        const next = gripRelease(event.clientY - from, folded)
        if (next !== null) {
          moved.current = true
          onFold(next)
        }
      }}
      onPointerCancel={() => {
        start.current = null
        setDragging(false)
      }}
      onClick={() => {
        if (!moved.current) onFold(!folded)
      }}
      className={cn(
        'group relative -mt-1 flex h-9 w-22 shrink-0 cursor-grab touch-none items-center justify-center self-center select-none data-dragging:cursor-grabbing',
        'before:absolute before:inset-x-0 before:-inset-y-1 before:content-[""]',
      )}
    >
      <span className="h-1.5 w-9 rounded-pill bg-muted-foreground/30 transition-colors duration-200 group-hover:bg-muted-foreground/55 group-data-dragging:bg-muted-foreground/70" />
    </button>
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
        'flex min-w-0 items-center gap-2 overflow-x-auto overscroll-x-contain scrollbar-none',
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
 * The palette docked under the sheet on a phone (its canvas, Flat's), over the keys: its grip, the
 * selection strip, the categories by name, then, folded (as it first opens), the chosen category's
 * tools in one row; unfolded, every section in one scroll, up to half the screen, the categories
 * lighting the section in sight and scrolling to the one tapped. With the keys shown it unfolds
 * over them only once they fold away.
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
  const keys = useFoldKeys()
  const [category, choose] = useCategory()
  const box = useRef<HTMLDivElement>(null)
  const onScroll = useSectionInSight(box, category, choose)
  // The keys stand where the sections would: shown, the sheet stays folded.
  const unfolded = !folded && keys.folded
  const unfold = (open: boolean) => {
    if (open && !keys.folded) keys.fold(true)
    onFold(!open)
  }
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-label={t('panel.label')}
        className="mr-[calc(-1*max(var(--gutter),env(safe-area-inset-right)))] ml-[calc(-1*max(var(--gutter),env(safe-area-inset-left)))] flex max-h-[50dvh] min-h-0 shrink-0 flex-col rounded-t-sheet border-t border-hairline bg-card px-[max(var(--gutter),env(safe-area-inset-left))] pb-3 elevation-2"
      >
        <fieldset disabled={takes.stage !== 'idle'} className="contents">
          <Grip
            folded={!unfolded}
            label={t(unfolded ? 'palette.close' : 'palette.open')}
            onFold={(next) => unfold(!next)}
          />
          <SelectionStrip className="-me-2 pb-2" />
          <div className="shrink-0 pb-2">
            <CategoryStrip current={category} onChoose={choose} />
          </div>
          {unfolded ? (
            <div
              ref={box}
              onScroll={onScroll}
              className="relative flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain pt-1"
            >
              <Laid form="grid">
                <Sections />
              </Laid>
            </div>
          ) : (
            <ToolRow category={category} />
          )}
        </fieldset>
      </section>
    </MotionConfig>
  )
}
