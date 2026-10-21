import { Tabs } from '@base-ui/react/tabs'
import {
  ClipboardPaste,
  Copy,
  Heading,
  Merge,
  Minus,
  Plus,
  Scissors,
  WrapText,
  type LucideIcon,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BAR_MARK_CHOICES, barAt, notesAt, type BarEdit } from '@/features/score-editor'
import { useKeyName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  beatsPerBar,
  keyParam,
  TICKS_PER_BEAT,
  timeSignature,
  timeSignatureText,
  type Key,
  type TimeSignature,
} from '@/shared/lib/music'
import { EXTRA_VOICES, notate, type TimedMusic } from '@/shared/lib/notation'
import { LazyScoreView, Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  ADD_TABS,
  BARLINE_TILES,
  emptyBar,
  keyTiles,
  LINE_TILES,
  lineMusic,
  timeTiles,
  type AddTab,
} from '../model/add-menu'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** Each tab's picture, as the tiles under it draw their kind. */
const TAB_ICONS: Readonly<Record<AddTab, ReactNode>> = {
  bars: <span className="font-music text-2xl leading-none">𝄁</span>,
  barlines: <span className="font-music text-2xl leading-none">𝄆</span>,
  lines: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M3 15 C8 6 16 6 21 15" strokeLinecap="round" />
    </svg>
  ),
  key: <span className="font-music text-2xl leading-none">♯</span>,
  time: (
    <span className="font-display text-sm leading-[0.8] font-bold">
      3<br />4
    </span>
  ),
  staves: <span className="font-music text-2xl leading-none">𝄞</span>,
}

/** The bar edits, each with its picture. */
const BAR_TILES: readonly (readonly [BarEdit, LucideIcon])[] = [
  ['insert', Plus],
  ['delete', Minus],
  ['newLine', WrapText],
  ['joinLine', Merge],
  ['newSection', Heading],
  ['copy', Copy],
  ['cut', Scissors],
  ['paste', ClipboardPaste],
]

/** One thing to add: its picture over its name, as Sibelius's tiles are; pressed where it is already so. */
function Tile({
  label,
  pressed,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="flex min-w-0 flex-col items-center gap-1 overflow-hidden rounded-2xl border border-border bg-card p-2 text-card-foreground transition-colors hover:bg-chosen aria-pressed:border-selected aria-pressed:bg-selected/10 disabled:opacity-35"
    >
      <span aria-hidden className="grid h-28 w-full place-items-center overflow-hidden">
        {children}
      </span>
      <span className="line-clamp-2 w-full text-center text-sm leading-tight">{label}</span>
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
}: {
  music: TimedMusic
  noTime?: boolean
  time?: TimeSignature
  /** On the grand staff, its foot cut away: a hairpin stands between the hands' staves. */
  grand?: boolean
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
        staff={grand ? undefined : 'treble'}
        scale={grand ? 0.5 : 0.72}
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
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">{children}</div>
    </section>
  )
}

/**
 * The + menu (ADR 0065): what is added to the score, kept apart from the palette's tools for the
 * notes, as Sibelius keeps it. Its kinds as tabs (bars and sections, lines, the key signature, the
 * time signature, the staves), each a grid of tiles drawn as the score will show them and named under
 * them; a tile chosen does its work and closes the menu. One height whatever the tab.
 */
export function AddMenu() {
  const { t } = useTranslation('editor')
  const { actions, takes, view } = useScoreEditorContext()
  const keyName = useKeyName()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<AddTab>('bars')
  const draft = useEditorState((state) => state.draft)
  const layer = useEditorState((state) => state.layer)
  const hasNotes = useEditorState(
    (state) =>
      state.layer !== 'chords' && notesAt(state.draft, state.layer, state.caret).length > 0,
  )
  const barTicks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  const hasClip = useEditorState((state) => state.clip !== null)
  const done = (work: () => void) => () => {
    work()
    setOpen(false)
  }
  const keyTile = (key: Key) => (
    <Tile
      key={keyParam(key)}
      label={keyName(key)}
      pressed={keyParam(key) === keyParam(draft.key)}
      onClick={done(() => actions.dispatch({ type: 'settings', key }))}
    >
      <Engraved music={emptyBar(key, draft.meter, 1)} noTime />
    </Tile>
  )
  const { meters, lengths } = timeTiles(draft.meter)
  const panels: Readonly<Record<AddTab, ReactNode>> = {
    bars: (
      <Tiles>
        {BAR_TILES.map(([edit, Icon]) => (
          <Tile
            key={edit}
            label={t(`bars.${edit}`)}
            disabled={edit === 'paste' && !hasClip}
            onClick={done(() => actions.dispatch({ type: 'bars', edit }))}
          >
            <Icon className="size-7" />
          </Tile>
        ))}
      </Tiles>
    ),
    barlines: (
      <Tiles>
        {BAR_MARK_CHOICES.map((choice) => (
          <Tile
            key={choice}
            label={t(`add.barline.${choice}`)}
            onClick={done(() => actions.dispatch({ type: 'barMarks', choice }))}
          >
            <Engraved music={emptyBar(draft.key, draft.meter, 1, BARLINE_TILES[choice])} noTime />
          </Tile>
        ))}
      </Tiles>
    ),
    lines: (
      <>
        {hasNotes ? null : <p className="text-sm text-muted-foreground">{t('add.noNotes')}</p>}
        <Tiles>
          {LINE_TILES.map((tile) => (
            <Tile
              key={tile.word}
              label={t(`marks.${tile.word}`)}
              disabled={!hasNotes}
              onClick={done(() => actions.dispatch({ type: 'mark', mark: tile.mark }))}
            >
              <Engraved music={lineMusic(tile)} noTime grand={tile.mark.kind === 'hairpin'} />
            </Tile>
          ))}
        </Tiles>
      </>
    ),
    key: (
      <div className="flex flex-col gap-4">
        <Tiles heading={t('add.major')}>{keyTiles(false).map(keyTile)}</Tiles>
        <Tiles heading={t('add.minor')}>{keyTiles(true).map(keyTile)}</Tiles>
      </div>
    ),
    time: (
      <div className="flex flex-col gap-4">
        <Tiles heading={t('add.song')}>
          {meters.map((meter) => (
            <Tile
              key={meter}
              label={meter}
              pressed={meter === draft.meter}
              onClick={done(() => actions.dispatch({ type: 'settings', meter }))}
            >
              <Engraved music={emptyBar(draft.key, meter, beatsPerBar(meter))} />
            </Tile>
          ))}
        </Tiles>
        <Tiles heading={t('add.thisBar')}>
          {lengths.map((ticks) => {
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
    staves: (
      <Tiles>
        <Tile
          label={t('viewMenu.melody')}
          pressed={draft.melodyStaff}
          onClick={done(() => actions.dispatch({ type: 'melodyStaff', on: !draft.melodyStaff }))}
        >
          <span className="font-music text-4xl leading-none">𝄞</span>
        </Tile>
        <Tile
          label={t('add.voice')}
          disabled={draft.voices.length >= EXTRA_VOICES.length}
          onClick={done(() => {
            const voice = EXTRA_VOICES[draft.voices.length]
            if (voice) actions.dispatch({ type: 'voiceStaff', voice, on: true })
          })}
        >
          <span className="flex items-center gap-1">
            <span className="font-music text-4xl leading-none">𝄞</span>
            <Plus className="size-5" />
          </span>
        </Tile>
        <Tile
          label={t('chordNames')}
          pressed={layer === 'chords'}
          onClick={done(() => {
            view.showChordNames(true)
            actions.dispatch({ type: 'layer', layer: 'chords' })
          })}
        >
          <span className="font-display text-2xl font-semibold">C⁷</span>
        </Tile>
      </Tiles>
    ),
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={t('add.open')}
            title={t('add.open')}
            disabled={takes.stage !== 'idle'}
          />
        }
      >
        <Plus aria-hidden />
      </SheetTrigger>
      <SheetContent title={t('add.label')}>
        <Tabs.Root
          value={tab}
          onValueChange={(next: AddTab) => setTab(next)}
          className="flex flex-col gap-3"
        >
          <Tabs.List aria-label={t('add.tabs')} className="flex gap-1 rounded-2xl bg-muted p-1">
            {ADD_TABS.map((each) => (
              <Tabs.Tab
                key={each}
                value={each}
                className={cn(
                  'flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-xs font-semibold text-muted-foreground sm:flex-row sm:gap-1.5 sm:text-sm',
                  'aria-selected:bg-selected aria-selected:text-selected-foreground',
                )}
              >
                <span aria-hidden className="grid size-6 place-items-center">
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
