import { ChevronDown, Hand, PanelRightClose } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolPalette, ToolPalettePanel, ToolPaletteTab, ToolPaletteTabs } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { PALETTE_TABS, shownTab, tabOpen, type PaletteTab } from '../model/palette-tabs'
import { BarKeys } from './BarKeys'
import { ChordKeys } from './ChordKeys'
import { HandKeys } from './HandKeys'
import { ArticulationKeys, DynamicKeys, LineKeys } from './MarkKeys'
import { NoteKeys, PitchKeys } from './NoteKeys'

/** Each tab's picture: the music font's where a symbol says it. */
const TAB_ICONS: Readonly<Record<PaletteTab, ReactNode>> = {
  notes: <span className="font-music text-2xl">𝅘𝅥𝅮</span>,
  pitch: <span className="font-music text-3xl">♯</span>,
  articulations: <span className="text-2xl font-bold">&gt;</span>,
  lines: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M3 15 C8 6 16 6 21 15" strokeLinecap="round" />
    </svg>
  ),
  dynamics: <span className="font-serif text-lg font-bold italic">mf</span>,
  chords: <span className="font-display text-lg font-semibold">C⁷</span>,
  bars: <span className="font-music text-3xl">𝄁</span>,
  hand: <Hand />,
}

/** Each tab's keys. */
const TAB_KEYS: Readonly<Record<PaletteTab, ReactNode>> = {
  notes: <NoteKeys />,
  pitch: <PitchKeys />,
  articulations: <ArticulationKeys />,
  lines: <LineKeys />,
  dynamics: <DynamicKeys />,
  chords: <ChordKeys />,
  bars: <BarKeys />,
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
  const { takes } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const [chosen, choose] = useState<PaletteTab>('notes')
  // Into the chord row, the chord names' tools come up; out of it, those of the staff.
  const [lastLayer, setLastLayer] = useState(layer)
  if (layer !== lastLayer) {
    setLastLayer(layer)
    if (layer === 'chords') choose('chords')
    else if (lastLayer === 'chords' && chosen === 'chords') choose('notes')
  }
  const recording = takes.stage !== 'idle'
  const tab = shownTab(chosen, layer)
  const fold = (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('palette.close')}
      title={t('palette.close')}
      className="size-9 shrink-0 rounded-xl"
      onClick={onFold}
    >
      {side ? <PanelRightClose aria-hidden /> : <ChevronDown aria-hidden />}
    </Button>
  )
  return (
    <ToolPalette
      label={t('palette.label')}
      tab={tab}
      onTabChange={choose}
      className={cn('gap-1 rounded-3xl p-1.5 shadow-none', side && 'h-full min-h-0')}
    >
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
        <ToolPalettePanel
          value={tab}
          className={cn(
            'grid-cols-6 content-start overflow-y-auto overscroll-contain',
            side ? 'min-h-0 flex-1' : 'h-39',
          )}
        >
          {TAB_KEYS[tab]}
        </ToolPalettePanel>
      </fieldset>
    </ToolPalette>
  )
}
