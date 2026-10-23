import { ChevronDown, ChevronUp, Piano } from 'lucide-react'
import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { chosenNotes, isHandLayer } from '@/features/score-editor'
import { useFoldKeys } from '@/features/live-keyboard'
import { cn } from '@/shared/lib'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { gripRelease } from '../model/grip'
import { categoryOpen, PALETTE_CATEGORIES, type PaletteCategory } from '../model/palette-categories'
import { BarKeys } from './BarKeys'
import { ChordBuilt, ChordsInKey, ChordTyped, QuickChords } from './ChordKeys'
import { FingeringPanel } from './FingeringPanel'
import { LineKeys } from './LineKeys'
import { ArticulationKeys, DynamicKeys } from './MarkKeys'
import { NoteKeys, PitchKeys, QuickValues } from './NoteKeys'
import { CategoryIcon } from './palette-icons'
import { PaletteSection } from './palette-keys'
import { ClefKeys, KeySignatureKeys, RepeatKeys, TextKeys, TimeSignatureKeys } from './ScoreKeys'

/** The ways the Chords category writes a chord (ADR 0089): the key's, built from its parts, typed. */
const CHORD_WAYS = ['key', 'build', 'type'] as const
type ChordWay = (typeof CHORD_WAYS)[number]

/** The categories whose tools act on notes chosen: greyed, with their reason, where none is. */
const ON_NOTES: readonly PaletteCategory[] = ['pitch', 'articulations', 'dynamics', 'lines', 'text']

/** Why a category's tools are greyed where the caret writes, or nothing where they work. */
function useReason(category: PaletteCategory): string | undefined {
  const { t } = useTranslation('editor')
  const layer = useEditorState((state) => state.layer)
  const chosen = useEditorState((state) => chosenNotes(state).length > 0)
  if (category === 'chords') return layer === 'chords' ? undefined : t('reason.chordRow')
  if (!categoryOpen(category, layer))
    return layer === 'chords' ? t('reason.staff') : t('reason.hand')
  if (ON_NOTES.includes(category) && !chosen) return t('reason.chooseNote')
  if (category === 'fingering' && isHandLayer(layer) && !chosen) return t('reason.chooseNote')
  return undefined
}

/** One category's section: its name, why it is greyed if it is, its tools. */
function Section({ category, children }: { category: PaletteCategory; children: ReactNode }) {
  const { t } = useTranslation('editor')
  return (
    <PaletteSection
      category={category}
      title={t(`palette.category.${category}`)}
      reason={useReason(category)}
    >
      {children}
    </PaletteSection>
  )
}

/** The Chords category: a chord of the key tapped, built from its parts, or typed on its keypad. */
function ChordWays({ way, setWay }: { way: ChordWay; setWay: (way: ChordWay) => void }) {
  const { t } = useTranslation('editor')
  const { meta } = useScoreEditorContext()
  // Asked for by Enter in the chord row, the field opens with the cursor in it.
  const focus = meta.chordFieldAsked > 0
  return (
    <>
      <Segmented
        label={t('chord.tabs')}
        value={way}
        options={CHORD_WAYS.map((each) => ({ value: each, label: t(`chord.tab.${each}`) }))}
        onChange={setWay}
      />
      {way === 'key' ? (
        <ChordsInKey />
      ) : way === 'build' ? (
        <ChordBuilt />
      ) : (
        <ChordTyped focus={focus} />
      )}
    </>
  )
}

/** Every category's section, in the bar's order. */
function Sections(chord: { way: ChordWay; setWay: (way: ChordWay) => void }) {
  return (
    <>
      <Section category="notes">
        <NoteKeys />
      </Section>
      <Section category="pitch">
        <PitchKeys />
      </Section>
      <Section category="articulations">
        <ArticulationKeys />
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
      <Section category="fingering">
        <FingeringPanel />
      </Section>
      <Section category="chords">
        <ChordWays {...chord} />
      </Section>
    </>
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

/** A section's place in the scroller: where its top is, from the scroller's own. */
const sectionTop = (scroller: HTMLElement, category: PaletteCategory): number | null => {
  const section = scroller.querySelector<HTMLElement>(`[data-category="${category}"]`)
  return section ? section.offsetTop : null
}

/**
 * The editor's one palette (spec 2026-10-23, after Flat): every tool, each acting on what is chosen
 * (a note, a chord, a range or bars), else setting what the next note will be. A card floating over
 * the sheet (ADR 0079, 0081), at the foot (`side` off) or beside it (`side`): the quick row of note
 * values (the key's chords in the chord names' row), always in sight, over the category bar, a
 * picture each, scrolling sideways where the screen is narrow, ending in the palette's fold and a
 * Keys toggle that never comes and goes. Opened (`folded` off), every category's section stands over
 * them, stacked and scrolling, a category tapped scrolling to its own; folded, the quick row and the
 * bar alone, a category tapped opening it there. While a take records, the tools wait for Stop.
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
  const { takes, meta } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const keys = useFoldKeys()
  const recording = takes.stage !== 'idle'
  const scroller = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState<PaletteCategory>(layer === 'chords' ? 'chords' : 'notes')
  // A category tapped while folded: scrolled to once the sections are in.
  const pending = useRef<PaletteCategory | null>(null)
  // Enter in the chord row asks for the chord field: the palette opens on the Chords.
  const [chordWay, setChordWay] = useState<ChordWay>('key')
  const [asked, setAsked] = useState(meta.chordFieldAsked)
  if (meta.chordFieldAsked !== asked) {
    setAsked(meta.chordFieldAsked)
    setCurrent('chords')
    setChordWay('type')
  }
  const openForChord = useEffectEvent(() => {
    pending.current = 'chords'
    if (folded) onFold(false)
  })
  useEffect(() => {
    if (meta.chordFieldAsked > 0) openForChord()
  }, [meta.chordFieldAsked])

  const scrollTo = (category: PaletteCategory) => {
    const box = scroller.current
    const top = box ? sectionTop(box, category) : null
    if (box && top !== null) box.scrollTo?.({ top, behavior: 'smooth' })
  }
  useEffect(() => {
    if (folded || !pending.current) return
    scrollTo(pending.current)
    pending.current = null
  })

  // While the sections scroll to a category tapped, the bar keeps that one chosen (the last ones
  // can never reach the top); a hand on the sections again lets the bar follow them.
  const following = useRef(true)
  const show = (category: PaletteCategory) => {
    following.current = false
    setCurrent(category)
    if (folded) {
      pending.current = category
      onFold(false)
    } else scrollTo(category)
  }
  // The category chosen kept in sight in its bar, which scrolls sideways on a narrow screen.
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const row = bar.current
    const button = row?.querySelector<HTMLElement>(`[data-for="${current}"]`)
    if (!row || !button) return
    // Centred, clear of the row's faded edges.
    const left = button.offsetLeft - row.offsetLeft
    row.scrollLeft = left - (row.clientWidth - button.offsetWidth) / 2
  }, [current])

  // The category in sight as the sections scroll: the last whose top has passed.
  const followScroll = () => {
    const box = scroller.current
    if (!box || !following.current) return
    const passed = PALETTE_CATEGORIES.filter((category) => {
      const top = sectionTop(box, category)
      return top !== null && top <= box.scrollTop + 8
    })
    const last = passed.at(-1)
    if (last && last !== current) setCurrent(last)
  }

  const barButton =
    'size-11 shrink-0 rounded-xl text-muted-foreground hover:text-foreground landscape-phone:h-10'
  return (
    <section
      aria-label={t('palette.label')}
      className={cn(
        'flex max-h-full min-h-0 flex-col gap-1.5 rounded-3xl border border-border bg-muted p-1.5 shadow-xl shadow-foreground/15',
      )}
    >
      <fieldset disabled={recording} className="contents">
        <PaletteGrip folded={folded} opens={side ? 'down' : 'up'} onFold={onFold} />
        {folded ? null : (
          <div
            ref={scroller}
            onScroll={followScroll}
            onPointerDown={() => (following.current = true)}
            onWheel={() => (following.current = true)}
            className={cn(
              'relative min-h-0 overflow-y-auto overscroll-contain rounded-2xl bg-background px-2.5 pb-2',
              side ? 'flex-1' : 'max-h-[min(30dvh,18rem)]',
            )}
          >
            <Sections way={chordWay} setWay={setChordWay} />
          </div>
        )}
        <div className="shrink-0">{layer === 'chords' ? <QuickChords /> : <QuickValues />}</div>
        <div className="flex shrink-0 items-center gap-0.5 border-t border-hairline pt-1.5 landscape-phone:pt-1">
          <div
            ref={bar}
            role="toolbar"
            aria-label={t('palette.categories')}
            className="fade-scroll-x flex min-w-0 flex-1 gap-0.5 overflow-x-auto [scrollbar-width:none]"
          >
            {PALETTE_CATEGORIES.map((category) => {
              const name = t(`palette.category.${category}`)
              return (
                <button
                  key={category}
                  data-for={category}
                  type="button"
                  aria-label={name}
                  title={name}
                  aria-current={!folded && current === category ? 'true' : undefined}
                  data-off={categoryOpen(category, layer) ? undefined : true}
                  onClick={() => show(category)}
                  className="grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground aria-[current=true]:bg-selected aria-[current=true]:text-selected-foreground data-off:opacity-40 landscape-phone:h-10 [&_svg]:size-6"
                >
                  <CategoryIcon category={category} />
                </button>
              )
            })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t(folded ? 'palette.open' : 'palette.close')}
            title={t(folded ? 'palette.open' : 'palette.close')}
            aria-expanded={!folded}
            className={barButton}
            onClick={() => onFold(!folded)}
          >
            {folded ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
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
  )
}
