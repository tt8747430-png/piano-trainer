import { ChevronDown, ChevronUp, Hand } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolPalette, ToolPalettePanel, ToolPaletteTab, ToolPaletteTabs } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import {
  PALETTE_TABS,
  RIBBON_TABS,
  shownTab,
  tabOpen,
  type PaletteTab,
} from '../model/palette-tabs'
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
 * The editor's tools by kind, as tabs (ADR 0064), the ones that work where the caret writes in reach
 * and the rest greyed; a tab's keys under its row, which folds away to leave the sheet its room.
 * `ribbon` is a laptop's, across the top over the sheet, its tabs named (the notes and pitch are its
 * left column's); `dock` a phone's keypad, its tabs pictures, six keys a row. While a take records,
 * the tools wait for Stop.
 */
export function EditorTools({ variant }: { variant: 'ribbon' | 'dock' }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const ribbon = variant === 'ribbon'
  const tabs = ribbon ? RIBBON_TABS : PALETTE_TABS
  const [chosen, choose] = useState<PaletteTab>(ribbon ? 'articulations' : 'notes')
  const [open, setOpen] = useState(true)
  const recording = takes.stage !== 'idle'
  const tab = shownTab(chosen, layer, tabs)
  const Fold = open ? (ribbon ? ChevronUp : ChevronDown) : ribbon ? ChevronDown : ChevronUp
  const fold = (
    <Button
      variant="ghost"
      size="icon"
      aria-label={open ? t('palette.close') : t('palette.open')}
      title={open ? t('palette.close') : t('palette.open')}
      aria-expanded={open}
      className="size-9 shrink-0 rounded-xl"
      onClick={() => setOpen(!open)}
    >
      <Fold aria-hidden />
    </Button>
  )
  return (
    <ToolPalette
      label={t('palette.label')}
      tab={tab}
      onTabChange={(next) => {
        choose(next)
        setOpen(true)
      }}
      className={
        ribbon ? 'gap-1 rounded-3xl p-1.5 shadow-none' : 'gap-1 rounded-3xl p-1.5 shadow-none'
      }
    >
      <fieldset disabled={recording} className="contents">
        <ToolPaletteTabs
          label={t('palette.tabs')}
          end={fold}
          className={open ? 'border-t-0' : 'border-y-0'}
        >
          {tabs.map((each) => (
            <ToolPaletteTab
              key={each}
              value={each}
              label={t(`palette.${each}`)}
              disabled={!tabOpen(each, layer)}
              className={ribbon ? 'min-h-9 flex-none px-3 text-sm font-semibold' : 'min-w-8'}
            >
              {ribbon ? (
                t(`palette.short.${each}`)
              ) : (
                <span aria-hidden className="contents">
                  {TAB_ICONS[each]}
                </span>
              )}
            </ToolPaletteTab>
          ))}
        </ToolPaletteTabs>
        {open ? (
          <ToolPalettePanel
            value={tab}
            className={
              ribbon
                ? 'flex flex-wrap items-center gap-1.5 px-1 pb-1 [&>[data-slot=button]]:w-12'
                : 'max-h-[42dvh] grid-cols-6 overflow-y-auto overscroll-contain landscape-phone:max-h-none'
            }
          >
            {TAB_KEYS[tab]}
          </ToolPalettePanel>
        ) : null}
      </fieldset>
    </ToolPalette>
  )
}
