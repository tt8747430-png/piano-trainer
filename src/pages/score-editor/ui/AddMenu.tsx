import { Tabs } from '@base-ui/react/tabs'
import { Plus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  barAt,
  barLengths,
  BARLINE_CHOICES,
  clefAt,
  isHandLayer,
  JUMP_CHOICES,
  lineDrawn,
  notesAt,
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
} from '@/shared/lib/music'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  ADD_TABS,
  BARLINE_TILES,
  clefBar,
  emptyBar,
  isJumpSign,
  isJumpWords,
  JUMP_SIGNS,
  JUMP_WORDS,
  LINE_TILES,
  lineMusic,
  PEDAL_TILES,
  type AddTab,
  type LineTile,
} from '../model/add-menu'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { FingeringPanel } from './FingeringPanel'
import { BarIcon, CodaSign, TabIcon, type InsertBarEdit } from './insert-icons'
import { Engraved, IconPicture, TextPicture, Tile, Tiles } from './InsertTiles'

const PEDAL_LABEL = {
  down: 'marks.pedalDown',
  change: 'marks.pedalChange',
  up: 'marks.pedalUp',
} as const satisfies Readonly<Record<Pedal, string>>

/** The bar edits Insert holds, in order: copy, cut and paste are a selection's. */
const BAR_TILES: readonly InsertBarEdit[] = [
  'insert',
  'delete',
  'newLine',
  'joinLine',
  'newSection',
]

/** Its button, the dock's size (`EditorDock`): the bar's buttons are all one finger's reach. */
const PLUS_TRIGGER = <Button variant="ghost" size="icon" className="size-12 rounded-full" />

/** A line's tile: pressed where the line is drawn where it would go, greyed where it has no notes. */
function LineTileButton({ tile, onDone }: { tile: LineTile; onDone: () => void }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const drawn = useEditorState((state) => lineDrawn(state, tile.line))
  return (
    <Tile
      label={t(`add.line.${tile.line}`)}
      caption={t(`add.lineCaption.${tile.line}`)}
      pressed={drawn === true}
      disabled={drawn === null}
      onClick={() => {
        actions.dispatch({ type: 'line', line: tile.line })
        onDone()
      }}
    >
      <Engraved music={lineMusic(tile)} noTime />
    </Tile>
  )
}

/**
 * The clef change of the caret's staff, from its bar on: Treble or Bass, the one it is in pressed.
 * Only the piano's two staves change clef (ADR 0069).
 */
function ClefPanel({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const bar = useEditorState((state) => barAt(state.draft, state.caret).index)
  const current = useEditorState((state) =>
    isHandLayer(state.layer)
      ? clefAt(state.draft, barAt(state.draft, state.caret).index, state.layer)
      : null,
  )
  if (!isHandLayer(layer))
    return <p className="text-sm text-muted-foreground">{t('add.clefChange.noHand')}</p>
  return (
    <Tiles
      heading={t('add.clefChange.heading', { hand: t(`layers.${layer}`) })}
      note={t('add.clefChange.note', { bar: bar + 1 })}
    >
      {CLEFS.map((clef) => (
        <Tile
          key={clef}
          label={t(`add.clefName.${clef}`)}
          pressed={current === clef}
          onClick={() => {
            actions.dispatch({ type: 'clef', hand: layer, clef })
            onDone()
          }}
        >
          <Engraved
            music={clefBar(layer, clef)}
            noTime
            staff={layer === 'rh' ? 'treble' : 'bass'}
          />
        </Tile>
      ))}
    </Tiles>
  )
}

/**
 * Insert (ADR 0065, 0080): what goes on the score at the caret, kept apart from the palette's tools
 * for the notes, as Sibelius keeps it. Its kinds as tabs named as MuseScore names its palettes (bars,
 * repeats and jumps, slurs and hairpins, expression and pedal, fingering, a clef change), each a
 * grid of compact tiles drawn as the score will show them, in C so no signature crowds them, as many
 * to a row as the screen holds; a tile chosen does its work and closes the menu (fingering keeps it
 * open, note after note). One height whatever the tab. What is the song's as a whole (its key, time
 * signature, tempo and parts) is the Song sheet's, never here. Its button, a round +, rides first in
 * the dock.
 */
export function AddMenu() {
  const { t } = useTranslation('editor')
  const { actions, takes } = useScoreEditorContext()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<AddTab>('bars')
  const meter = useEditorState((state) => state.draft.meter)
  const hasNotes = useEditorState(
    (state) =>
      state.layer !== 'chords' && notesAt(state.draft, state.layer, state.caret).length > 0,
  )
  const barTicks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  const close = () => setOpen(false)
  const done = (work: () => void) => () => {
    work()
    close()
  }
  // A jump's words or a sign as printed (a gloss under the words); a barline engraved on its bar.
  const barMarkTile = (choice: BarMarkChoice) => (
    <Tile
      key={choice}
      label={t(`add.barline.${choice}`)}
      caption={isJumpWords(choice) ? t(`add.jumpMeaning.${choice}`) : undefined}
      onClick={done(() => actions.dispatch({ type: 'barMarks', choice }))}
    >
      {isJumpWords(choice) ? (
        <TextPicture text={JUMP_WORDS[choice]}>
          {choice === 'toCoda' ? (
            <span className="ms-1 inline-block size-[1.1em] align-[-0.2em]">
              <CodaSign />
            </span>
          ) : null}
        </TextPicture>
      ) : choice === 'coda' ? (
        <IconPicture>
          <CodaSign />
        </IconPicture>
      ) : isJumpSign(choice) ? (
        <TextPicture text={JUMP_SIGNS[choice]} music />
      ) : (
        <Engraved music={emptyBar(meter, 1, BARLINE_TILES[choice])} noTime />
      )}
    </Tile>
  )
  const panels: Readonly<Record<AddTab, ReactNode>> = {
    bars: (
      <div className="flex flex-col gap-4">
        <Tiles>
          {BAR_TILES.map((edit) => (
            <Tile
              key={edit}
              label={t(`bars.${edit}`)}
              onClick={done(() => actions.dispatch({ type: 'bars', edit }))}
            >
              <IconPicture>
                <BarIcon edit={edit} />
              </IconPicture>
            </Tile>
          ))}
        </Tiles>
        {/* The caret's bar alone: shorter for a pickup, or a bar of its own length. */}
        <Tiles heading={t('add.barLength')}>
          {barLengths(meter).map((ticks) => {
            const beats = ticks / TICKS_PER_BEAT
            return (
              <Tile
                key={ticks}
                label={timeSignatureText(timeSignature(beats, meter))}
                pressed={ticks === barTicks}
                onClick={done(() => actions.dispatch({ type: 'barLength', ticks }))}
              >
                <Engraved music={emptyBar(meter, beats)} time={timeSignature(beats, meter)} />
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
      <div className="flex flex-col gap-4">
        <p className="text-sm text-pretty text-muted-foreground">{t('add.linesNote')}</p>
        {(['slurs', 'octaves'] as const).map((group) => (
          <Tiles key={group} heading={t(`add.lineGroup.${group}`)}>
            {LINE_TILES.filter((tile) => tile.group === group).map((tile) => (
              <LineTileButton key={tile.line} tile={tile} onDone={close} />
            ))}
          </Tiles>
        ))}
      </div>
    ),
    expression: (
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
              <TextPicture text={EXPRESSION_TEXT[expression]} />
            </Tile>
          ))}
        </Tiles>
        <Tiles heading={t('add.pedal')}>
          {PEDAL_TILES.map(({ pedal, glyph }) => (
            <Tile
              key={pedal}
              label={t(PEDAL_LABEL[pedal])}
              disabled={!hasNotes}
              onClick={done(() =>
                actions.dispatch({ type: 'mark', mark: { kind: 'pedal', pedal } }),
              )}
            >
              <TextPicture text={glyph} music />
            </Tile>
          ))}
        </Tiles>
      </div>
    ),
    // A hand's own, not every note's: its fingers, once its bar is written out; the menu kept open.
    fingering: <FingeringPanel />,
    clef: <ClefPanel onDone={close} />,
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={PLUS_TRIGGER}
        aria-label={t('add.open')}
        title={t('add.open')}
        disabled={takes.stage !== 'idle'}
      >
        <Plus aria-hidden />
      </SheetTrigger>
      <SheetContent title={t('add.label')}>
        <Tabs.Root
          value={tab}
          onValueChange={(next: AddTab) => setTab(next)}
          className="flex flex-col gap-3"
        >
          {/* Each kind named under its picture: three to a row on a phone, all six on a wider screen. */}
          <Tabs.List
            aria-label={t('add.tabs')}
            className="grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1 sm:grid-cols-6"
          >
            {ADD_TABS.map((each) => (
              <Tabs.Tab
                key={each}
                value={each}
                className={cn(
                  'flex min-h-14 min-w-0 flex-col items-center justify-start gap-1 rounded-xl px-1 py-1.5 text-center text-xs leading-tight font-semibold text-balance text-muted-foreground',
                  'aria-selected:bg-selected aria-selected:text-selected-foreground',
                )}
              >
                <span aria-hidden className="grid size-7 shrink-0 place-items-center">
                  <TabIcon tab={each} />
                </span>
                {t(`add.tab.${each}`)}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel
            value={tab}
            className="h-[min(26rem,50dvh)] overflow-y-auto overscroll-contain outline-none landscape-phone:h-[calc(100dvh-9rem)]"
          >
            {panels[tab]}
          </Tabs.Panel>
        </Tabs.Root>
      </SheetContent>
    </Sheet>
  )
}
