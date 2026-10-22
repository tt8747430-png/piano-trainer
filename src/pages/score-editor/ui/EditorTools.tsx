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
  tabOpen,
  type ChordTab,
  type PaletteTab,
} from '../model/palette-tabs'
import { ChordBuilt, ChordsInKey, ChordTyped } from './ChordKeys'
import { ArticulationKeys, DynamicKeys } from './MarkKeys'
import { NoteKeys, PitchKeys } from './NoteKeys'

/** A tab's picture: drawn in one 24-unit box, so every tab's sits level whatever it shows. */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor">
      {children}
    </svg>
  )
}

/** A word drawn as a picture, in the box's middle: a dynamic, a numeral. */
function Word({ text, italic = false }: { text: string; italic?: boolean }) {
  return (
    <text
      x="12"
      y="12.5"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={text.length > 2 ? 9 : 13}
      fontWeight="700"
      fontStyle={italic ? 'italic' : 'normal'}
      fontFamily="var(--font-display)"
    >
      {text}
    </text>
  )
}

/** Each tab's picture: a note, a sharp, an accent, a dynamic. */
const TAB_ICONS: Readonly<Record<PaletteTab, ReactNode>> = {
  notes: (
    <Glyph>
      <ellipse cx="9" cy="17.5" rx="4.2" ry="3" transform="rotate(-20 9 17.5)" />
      <rect x="12.1" y="3" width="1.6" height="14.5" />
      <path d="M13.7 3c0 3 5 4 4.5 9-.5-2.5-2.5-3.6-4.5-3.8z" />
    </Glyph>
  ),
  pitch: (
    <Glyph>
      <rect x="8.5" y="3" width="1.4" height="18" />
      <rect x="14.1" y="2" width="1.4" height="18" />
      <path d="M5 9.6 19 6.6v2.8L5 12.4zM5 15.6l14-3v2.8L5 18.4z" />
    </Glyph>
  ),
  articulations: (
    <Glyph>
      <path d="M4 7.2 20 12 4 16.8v-2.4L14.6 12 4 9.6z" />
    </Glyph>
  ),
  dynamics: (
    <Glyph>
      <Word text="mf" italic />
    </Glyph>
  ),
}

/** Each way of writing a chord, drawn: the key's numerals, a chord's parts, the keypad. */
const CHORD_TAB_ICONS: Readonly<Record<ChordTab, ReactNode>> = {
  key: (
    <Glyph>
      <Word text="I·V" />
    </Glyph>
  ),
  build: (
    <Glyph>
      <Word text="C/E" />
    </Glyph>
  ),
  type: <Keyboard aria-hidden />,
}

/** Each tab's keys. */
const TAB_KEYS: Readonly<Record<PaletteTab, ReactNode>> = {
  notes: <NoteKeys />,
  pitch: <PitchKeys />,
  articulations: <ArticulationKeys />,
  dynamics: <DynamicKeys />,
}

/**
 * The editor's palette (ADR 0064, 0065): its tools by kind as tabs of pictures, the ones that work
 * where the caret writes in reach and the rest greyed, the chosen tab's keys under them. A card
 * floating over the sheet (ADR 0079), as tall as its keys, scrolling them inside past a share of the
 * screen: at the foot (`side` off) or beside the sheet (`side`). It folds into a button over the
 * sheet's corner (`onFold`). While a take records, the tools wait for Stop.
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
  const tab = chosen
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
    side ? 'min-h-0 flex-1' : 'max-h-[34dvh]',
  )
  const card = cn('gap-1 rounded-3xl p-1.5', side && 'max-h-full min-h-0')
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
            end={<div className="flex items-center gap-1">{fold}</div>}
            className="border-t-0"
          >
            {CHORD_TABS.map((each) => (
              <ToolPaletteTab
                key={each}
                value={each}
                label={t(`chord.tab.${each}`)}
                className="min-w-9 shrink"
              >
                {CHORD_TAB_ICONS[each]}
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
        <ToolPaletteTabs
          label={t('palette.tabs')}
          end={<div className="flex items-center gap-1">{fold}</div>}
          className="border-t-0"
        >
          {PALETTE_TABS.map((each) => (
            <ToolPaletteTab
              key={each}
              value={each}
              label={t(`palette.${each}`)}
              disabled={!tabOpen(layer)}
              className="min-w-9 shrink"
            >
              {TAB_ICONS[each]}
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
