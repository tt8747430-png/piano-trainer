import { Tabs } from '@base-ui/react/tabs'
import { Bookmark, Hand, Merge, Plus, Trash2, WrapText, type LucideIcon } from 'lucide-react'
import { useMemo, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  barAt,
  barLengths,
  BARLINE_CHOICES,
  clefAt,
  JUMP_CHOICES,
  notesAt,
  isHandLayer,
  type BarEdit,
  type BarMarkChoice,
} from '@/features/score-editor'
import { cn } from '@/shared/lib'
import {
  CLEFS,
  EXPRESSION_TEXT,
  EXPRESSIONS,
  TICKS_PER_BEAT,
  timeSignature,
  timeSignatureText,
  type Pedal,
  type TimeSignature,
} from '@/shared/lib/music'
import { notate, type StaffId, type TimedMusic } from '@/shared/lib/notation'
import { LazyScoreView, Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  ADD_TABS,
  BARLINE_TILES,
  clefBar,
  emptyBar,
  HANDS,
  LINE_TILES,
  lineMusic,
  PEDAL_TILES,
  type AddTab,
} from '../model/add-menu'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { HandKeys } from './HandKeys'

/** Each tab's picture, as the tiles under it draw their kind. */
const TAB_ICONS: Readonly<Record<AddTab, ReactNode>> = {
  // A bar between its barlines, on a staff's lines.
  bars: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6">
      <path d="M2 7 H22 M2 10.5 H22 M2 14 H22 M2 17.5 H22" strokeWidth="1" opacity="0.55" />
      <path d="M5 6 V19 M19 6 V19" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  repeats: <span className="font-music text-3xl leading-none">𝄆</span>,
  lines: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M3 15 C8 6 16 6 21 15" strokeLinecap="round" />
    </svg>
  ),
  text: <span className="font-serif text-xl leading-none italic">dol.</span>,
  fingers: <Hand aria-hidden className="size-5" />,
  clefs: <span className="font-music text-3xl leading-none">𝄞</span>,
}

const PEDAL_LABEL = {
  down: 'marks.pedalDown',
  change: 'marks.pedalChange',
  up: 'marks.pedalUp',
} as const satisfies Readonly<Record<Pedal, string>>

/** The bar edits Insert holds, each with its picture: copy, cut and paste are a selection's. */
const BAR_TILES: readonly (readonly [Exclude<BarEdit, 'copy' | 'cut' | 'paste'>, LucideIcon])[] = [
  ['insert', Plus],
  ['delete', Trash2],
  ['newLine', WrapText],
  ['joinLine', Merge],
  ['newSection', Bookmark],
]

/**
 * One thing to insert: its picture over its name, as Sibelius's tiles are, compact; pressed where it
 * is already so. Its name is `label`, or `caption` under the picture where the picture says the rest
 * (an expression's word over what it asks).
 */
function Tile({
  label,
  caption = label,
  pressed,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  caption?: string
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="flex min-w-0 flex-col items-center gap-0.5 overflow-hidden rounded-xl border border-border bg-card px-1.5 pt-1 pb-1.5 text-card-foreground transition-colors hover:bg-chosen aria-pressed:border-selected aria-pressed:bg-selected/10 disabled:opacity-35"
    >
      <span aria-hidden className="grid h-16 w-full place-items-center overflow-hidden">
        {children}
      </span>
      <span aria-hidden className="w-full truncate text-center text-xs leading-tight">
        {caption}
      </span>
    </button>
  )
}

/**
 * A tile's picture engraved on one staff: the signature or the line as the score will show it; `time`
 * the bar's own signature where it is not the meter's (a bar of another length).
 */
function Engraved({
  music,
  noTime = false,
  time,
  grand = false,
  staff = 'treble',
}: {
  music: TimedMusic
  noTime?: boolean
  time?: TimeSignature
  /** On the grand staff, its foot cut away: a hairpin stands between the hands' staves. */
  grand?: boolean
  /** The one staff drawn, where not the grand staff. */
  staff?: StaffId
}) {
  const score = useMemo(() => {
    const notated = notate(music)
    const [first] = notated.measures
    return time && first ? { ...notated, measures: [{ ...first, time }] } : notated
  }, [music, time])
  return (
    <div className={cn('pointer-events-none', grand && 'self-start pt-1')}>
      <LazyScoreView
        score={score}
        staff={grand ? undefined : staff}
        scale={grand ? 0.42 : 0.56}
        timeBefore={noTime ? score.measures[0]?.time : undefined}
      />
    </div>
  )
}

/** The grid of a tab's tiles, under an optional heading. */
function Tiles({ heading, children }: { heading?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2" aria-label={heading}>
      {heading ? <h3 className="text-sm font-semibold text-muted-foreground">{heading}</h3> : null}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-1.5">{children}</div>
    </section>
  )
}

/** Insert's button as the bar shows it: a round ghost icon. */
const PLUS_TRIGGER = <Button variant="ghost" size="icon" className="rounded-full" />

/**
 * Insert (ADR 0065, 0080): what goes on the score at the caret, kept apart from the palette's tools
 * for the notes, as Sibelius keeps it. Its kinds as tabs (bars, repeats, lines, text, a hand's fingers,
 * a hand's clef), each named under its picture; each a grid of compact tiles drawn as the score will
 * show them, as many to a row as the screen holds; a tile chosen does its work and closes the menu (a
 * hand's fingers keep it open, note after note). One height whatever the tab. What is the song's as a
 * whole (its key, time signature, tempo and parts) is the Song sheet's, never here.
 *
 * Its button is a round + by default, or `trigger` in its place (a base-ui render element), named and
 * drawn by its caller.
 */
export function AddMenu({ trigger }: { trigger?: ReactElement } = {}) {
  const { t } = useTranslation('editor')
  const { actions, takes } = useScoreEditorContext()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<AddTab>('bars')
  const draft = useEditorState((state) => state.draft)
  const layer = useEditorState((state) => state.layer)
  const hasNotes = useEditorState(
    (state) =>
      state.layer !== 'chords' && notesAt(state.draft, state.layer, state.caret).length > 0,
  )
  const barTicks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  const clefsHere = {
    rh: useEditorState((state) => clefAt(state.draft, barAt(state.draft, state.caret).index, 'rh')),
    lh: useEditorState((state) => clefAt(state.draft, barAt(state.draft, state.caret).index, 'lh')),
  }
  const done = (work: () => void) => () => {
    work()
    setOpen(false)
  }
  const barMarkTile = (choice: BarMarkChoice) => (
    <Tile
      key={choice}
      label={t(`add.barline.${choice}`)}
      onClick={done(() => actions.dispatch({ type: 'barMarks', choice }))}
    >
      <Engraved music={emptyBar(draft.key, draft.meter, 1, BARLINE_TILES[choice])} noTime />
    </Tile>
  )
  const panels: Readonly<Record<AddTab, ReactNode>> = {
    bars: (
      <div className="flex flex-col gap-4">
        <Tiles>
          {BAR_TILES.map(([edit, Icon]) => (
            <Tile
              key={edit}
              label={t(`bars.${edit}`)}
              onClick={done(() => actions.dispatch({ type: 'bars', edit }))}
            >
              <Icon className="size-6" />
            </Tile>
          ))}
        </Tiles>
        {/* The caret's bar alone: shorter for a pickup, or a bar of its own length. */}
        <Tiles heading={t('add.barLength')}>
          {barLengths(draft.meter).map((ticks) => {
            const beats = ticks / TICKS_PER_BEAT
            return (
              <Tile
                key={ticks}
                label={timeSignatureText(timeSignature(beats, draft.meter))}
                pressed={ticks === barTicks}
                onClick={done(() => actions.dispatch({ type: 'barLength', ticks }))}
              >
                <Engraved
                  music={emptyBar(draft.key, draft.meter, beats)}
                  time={timeSignature(beats, draft.meter)}
                />
              </Tile>
            )
          })}
        </Tiles>
      </div>
    ),
    repeats: (
      <div className="flex flex-col gap-4">
        <Tiles heading={t('add.barlines')}>{BARLINE_CHOICES.map(barMarkTile)}</Tiles>
        <Tiles heading={t('add.jumps')}>{JUMP_CHOICES.map(barMarkTile)}</Tiles>
      </div>
    ),
    lines: (
      <>
        {hasNotes ? null : <p className="text-sm text-muted-foreground">{t('add.noNotes')}</p>}
        <Tiles>
          {LINE_TILES.map((tile) => (
            <Tile
              key={tile.word}
              label={t(`marks.${tile.word}`)}
              caption={t(`add.line.${tile.word}`)}
              disabled={!hasNotes}
              onClick={done(() => actions.dispatch({ type: 'mark', mark: tile.mark }))}
            >
              <Engraved music={lineMusic(tile)} noTime grand={tile.mark.kind === 'hairpin'} />
            </Tile>
          ))}
        </Tiles>
      </>
    ),
    text: (
      <div className="flex flex-col gap-4">
        {hasNotes ? null : <p className="text-sm text-muted-foreground">{t('add.noNotesText')}</p>}
        <Tiles heading={t('add.expressions')}>
          {EXPRESSIONS.map((expression) => (
            <Tile
              key={expression}
              label={t(`marks.${expression}`)}
              caption={t(`add.meaning.${expression}`)}
              disabled={!hasNotes}
              onClick={done(() =>
                actions.dispatch({ type: 'mark', mark: { kind: 'expression', expression } }),
              )}
            >
              <span className="font-serif text-xl italic">{EXPRESSION_TEXT[expression]}</span>
            </Tile>
          ))}
        </Tiles>
        <Tiles heading={t('add.pedal')}>
          {PEDAL_TILES.map(({ pedal, glyph }) => (
            <Tile
              key={pedal}
              label={t(PEDAL_LABEL[pedal])}
              caption={t(`add.pedalCaption.${pedal}`)}
              disabled={!hasNotes}
              onClick={done(() =>
                actions.dispatch({ type: 'mark', mark: { kind: 'pedal', pedal } }),
              )}
            >
              <span className="font-music text-4xl leading-none">{glyph}</span>
            </Tile>
          ))}
        </Tiles>
      </div>
    ),
    // A hand's own, not every note's: its fingers and its bar written out, the menu kept open.
    fingers: isHandLayer(layer) ? (
      <div className="grid grid-cols-6 gap-1.5">
        <HandKeys />
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">{t('add.noHand')}</p>
    ),
    clefs: (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{t('add.clefs')}</p>
        {HANDS.map((hand) => (
          <Tiles key={hand} heading={t(`layers.${hand}`)}>
            {CLEFS.map((clef) => (
              <Tile
                key={clef}
                label={t(`add.clef.${hand}.${clef}`)}
                caption={t(`add.clefName.${clef}`)}
                pressed={clefsHere[hand] === clef}
                onClick={done(() => actions.dispatch({ type: 'clef', hand, clef }))}
              >
                <Engraved
                  music={clefBar(draft.key, hand, clef)}
                  noTime
                  staff={hand === 'rh' ? 'treble' : 'bass'}
                />
              </Tile>
            ))}
          </Tiles>
        ))}
      </div>
    ),
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <SheetTrigger render={trigger} disabled={takes.stage !== 'idle'} />
      ) : (
        <SheetTrigger
          render={PLUS_TRIGGER}
          aria-label={t('add.open')}
          title={t('add.open')}
          disabled={takes.stage !== 'idle'}
        >
          <Plus aria-hidden />
        </SheetTrigger>
      )}
      <SheetContent title={t('add.label')}>
        <Tabs.Root
          value={tab}
          onValueChange={(next: AddTab) => setTab(next)}
          className="flex flex-col gap-3"
        >
          {/* Each kind named under its picture, all six in a phone's width; else the row scrolls. */}
          <Tabs.List
            aria-label={t('add.tabs')}
            className="flex gap-0.5 overflow-x-auto rounded-2xl bg-muted p-1 [scrollbar-width:none] fade-scroll-x"
          >
            {ADD_TABS.map((each) => (
              <Tabs.Tab
                key={each}
                value={each}
                className={cn(
                  'flex min-h-14 min-w-11 flex-1 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-xs font-semibold whitespace-nowrap text-muted-foreground',
                  'aria-selected:bg-selected aria-selected:text-selected-foreground',
                )}
              >
                <span aria-hidden className="grid size-7 place-items-center overflow-hidden">
                  {TAB_ICONS[each]}
                </span>
                {t(`add.tab.${each}`)}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel
            value={tab}
            className="h-[min(26rem,55dvh)] overflow-y-auto overscroll-contain outline-none landscape-phone:h-[calc(100dvh-9rem)]"
          >
            {panels[tab]}
          </Tabs.Panel>
        </Tabs.Root>
      </SheetContent>
    </Sheet>
  )
}
