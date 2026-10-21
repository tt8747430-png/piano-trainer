import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  Keyboard,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectPaletteSide, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPaletteSide } from '@/features/set-preference'
import { ToolPalette, ToolPalettePanel, ToolPaletteTab, ToolPaletteTabs } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import {
  CHORD_TABS,
  PALETTE_TABS,
  shownTab,
  tabOpen,
  type ChordTab,
  type PaletteTab,
} from '../model/palette-tabs'
import { ChordBuilt, ChordMoves, ChordsInKey, ChordTyped } from './ChordKeys'
import { HandKeys } from './HandKeys'
import { ArticulationKeys, DynamicKeys } from './MarkKeys'
import { NoteKeys, PitchKeys } from './NoteKeys'

/** Each tab's picture: the music font's where a symbol says it. */
const TAB_ICONS: Readonly<Record<PaletteTab, ReactNode>> = {
  notes: <span className="font-music text-2xl">𝅘𝅥𝅮</span>,
  pitch: <span className="font-music text-3xl">♯</span>,
  articulations: <span className="text-2xl font-bold">&gt;</span>,
  dynamics: <span className="font-serif text-lg font-bold italic">mf</span>,
  hand: <span className="font-display text-base font-bold tracking-tight">1·5</span>,
}

/** Each way of writing a chord, drawn: the key's numerals, a chord's parts, the keypad. */
const CHORD_TAB_ICONS: Readonly<Record<ChordTab, ReactNode>> = {
  key: <span className="font-display text-base font-bold tracking-tight">I·V</span>,
  build: <span className="font-display text-base font-bold tracking-tight">C/E</span>,
  type: <Keyboard />,
}

/** Each tab's keys. */
const TAB_KEYS: Readonly<Record<PaletteTab, ReactNode>> = {
  notes: <NoteKeys />,
  pitch: <PitchKeys />,
  articulations: <ArticulationKeys />,
  dynamics: <DynamicKeys />,
  hand: <HandKeys />,
}

/**
 * The editor's palette (ADR 0064, 0065): its tools by kind as tabs of pictures, the ones that work
 * where the caret writes in reach and the rest greyed, the chosen tab's keys under them. It keeps
 * its size whatever the tab, so the sheet never jumps: at the foot (`side` off) three rows of keys,
 * more scrolling inside; beside the sheet (`side`), the column's height. It folds into a handle over
 * the sheet's corner (`onFold`). While a take records, the tools wait for Stop.
 */
export function EditorTools({ side, onFold }: { side: boolean; onFold: () => void }) {
  const { t } = useTranslation('editor')
  const { takes, meta } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const [chosen, choose] = useState<PaletteTab>('notes')
  // A chord tapped from the key's first; Enter in the chord row opens the field to type one.
  const [chordTab, chooseChordTab] = useState<ChordTab>('key')
  // Enter in the chord row with the field shut opens it, the cursor in it.
  const [asked, setAsked] = useState(meta.chordFieldAsked)
  const [focusField, setFocusField] = useState(false)
  if (meta.chordFieldAsked !== asked) {
    setAsked(meta.chordFieldAsked)
    chooseChordTab('type')
    setFocusField(true)
  }
  const recording = takes.stage !== 'idle'
  const settings = useSettingsStoreApi()
  const paletteSide = useSettings(selectPaletteSide)
  const tab = shownTab(chosen, layer)
  const left = paletteSide === 'left'
  const other = left ? 'right' : 'left'
  const fold = (
    <>
      {side ? (
        // Beside the sheet, the palette stands on the side the learner likes (ADR 0071).
        <Button
          variant="ghost"
          size="icon"
          aria-label={t(`palette.move.${other}`)}
          title={t(`palette.move.${other}`)}
          className="size-9 shrink-0 rounded-xl"
          onClick={() => setPaletteSide(settings, other)}
        >
          {left ? <ArrowRightToLine aria-hidden /> : <ArrowLeftToLine aria-hidden />}
        </Button>
      ) : null}
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('palette.close')}
        title={t('palette.close')}
        className="size-9 shrink-0 rounded-xl"
        onClick={onFold}
      >
        {!side ? (
          <ChevronDown aria-hidden />
        ) : left ? (
          <PanelLeftClose aria-hidden />
        ) : (
          <PanelRightClose aria-hidden />
        )}
      </Button>
    </>
  )
  const keys = cn(
    'content-start overflow-y-auto overscroll-contain',
    side ? 'min-h-0 flex-1' : 'h-39',
  )
  const card = cn('gap-1 rounded-3xl p-1.5 shadow-none', side && 'h-full min-h-0')
  // In the chord names' row the palette is theirs, in place of the notes' tabs.
  if (layer === 'chords')
    return (
      <ToolPalette
        label={t('palette.label')}
        tab={chordTab}
        onTabChange={chooseChordTab}
        className={card}
      >
        <fieldset disabled={recording} className="contents">
          <ToolPaletteTabs
            label={t('chord.tabs')}
            end={
              <div className="flex items-center gap-1">
                <ChordMoves />
                {fold}
              </div>
            }
            className="border-t-0"
          >
            {CHORD_TABS.map((each) => (
              <ToolPaletteTab
                key={each}
                value={each}
                label={t(`chord.tab.${each}`)}
                className="min-w-7 shrink"
              >
                <span aria-hidden className="contents">
                  {CHORD_TAB_ICONS[each]}
                </span>
              </ToolPaletteTab>
            ))}
          </ToolPaletteTabs>
          <ToolPalettePanel value={chordTab} className={cn('grid-cols-6 gap-1.5', keys)}>
            {chordTab === 'key' ? (
              <ChordsInKey />
            ) : chordTab === 'build' ? (
              <ChordBuilt />
            ) : (
              <ChordTyped focus={focusField} />
            )}
          </ToolPalettePanel>
        </fieldset>
      </ToolPalette>
    )
  return (
    <ToolPalette label={t('palette.label')} tab={tab} onTabChange={choose} className={card}>
      <fieldset disabled={recording} className="contents">
        <ToolPaletteTabs label={t('palette.tabs')} end={fold} className="border-t-0">
          {PALETTE_TABS.map((each) => (
            <ToolPaletteTab
              key={each}
              value={each}
              label={t(`palette.${each}`)}
              disabled={!tabOpen(each, layer)}
              className="min-w-7 shrink"
            >
              <span aria-hidden className="contents">
                {TAB_ICONS[each]}
              </span>
            </ToolPaletteTab>
          ))}
        </ToolPaletteTabs>
        <ToolPalettePanel value={tab} className={cn('grid-cols-6', keys)}>
          {TAB_KEYS[tab]}
        </ToolPalettePanel>
      </fieldset>
    </ToolPalette>
  )
}
