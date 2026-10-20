import { Hand, Music2, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/shared/lib'
import {
  Fab,
  ToolPalette,
  ToolPaletteFoot,
  ToolPalettePanel,
  ToolPaletteTab,
  ToolPaletteTabs,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { PALETTE_TABS, shownTab, tabOpen, type PaletteTab } from '../model/palette-tabs'
import { BarKeys } from './BarKeys'
import { ChordKeys } from './ChordKeys'
import { HandKeys } from './HandKeys'
import { ArticulationKeys, DynamicKeys, LineKeys } from './MarkKeys'
import { NoteKeys } from './NoteKeys'
import { PaletteActions } from './PaletteActions'
import { PitchKeys } from './PitchKeys'
import { VoiceChoice } from './VoiceChoice'

/** A laptop's width, where the palette stands open beside the sheet. */
const LAPTOP = '(min-width: 64rem)'

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
  hand: <Hand />,
  chords: <span className="font-display text-lg font-semibold">C⁷</span>,
  bars: <span className="font-music text-3xl">𝄁</span>,
}

/** Each tab's keys. */
const TAB_KEYS: Readonly<Record<PaletteTab, ReactNode>> = {
  notes: <NoteKeys />,
  pitch: <PitchKeys />,
  articulations: <ArticulationKeys />,
  lines: <LineKeys />,
  dynamics: <DynamicKeys />,
  hand: <HandKeys />,
  chords: <ChordKeys />,
  bars: <BarKeys />,
}

/**
 * The editor's tools as a notation app's palette: Delete, Undo, Redo and the caret's steps on top,
 * the kinds of tools as tabs (those of what the keys write; the rest greyed), the chosen tab's keys,
 * and what the keys write at its foot. On a phone it floats over the sheet and closes into one ♪
 * button; on a laptop it stands open beside the sheet. While a take records, it waits for Stop.
 */
export function EditorPalette() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const laptop = useMediaQuery(LAPTOP)
  const [open, setOpen] = useState(true)
  const [chosen, choose] = useState<PaletteTab>('notes')
  const recording = takes.stage !== 'idle'
  if (!open && !laptop)
    return (
      <Fab
        label={t('palette.open')}
        icon={Music2}
        aria-expanded={false}
        onClick={() => setOpen(true)}
      />
    )
  const tab = shownTab(chosen, layer)
  return (
    <ToolPalette label={t('palette.label')} tab={tab} onTabChange={choose}>
      <fieldset disabled={recording} className="contents">
        <PaletteActions />
        <ToolPaletteTabs
          label={t('palette.tabs')}
          end={
            laptop ? null : (
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('palette.close')}
                title={t('palette.close')}
                aria-expanded
                className="rounded-xl"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden />
              </Button>
            )
          }
        >
          {PALETTE_TABS.map((each) => (
            <ToolPaletteTab
              key={each}
              value={each}
              label={t(`palette.${each}`)}
              disabled={!tabOpen(each, layer)}
            >
              <span aria-hidden className="contents">
                {TAB_ICONS[each]}
              </span>
            </ToolPaletteTab>
          ))}
        </ToolPaletteTabs>
        <ToolPalettePanel value={tab}>{TAB_KEYS[tab]}</ToolPalettePanel>
        <ToolPaletteFoot>
          <VoiceChoice disabled={recording} />
        </ToolPaletteFoot>
      </fieldset>
    </ToolPalette>
  )
}
