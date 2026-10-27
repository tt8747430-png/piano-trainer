import { Hash, Layers, Type, WholeWord } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectPractice,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPracticeToggle, setScoreView } from '@/features/set-preference'
import type { SheetPart } from '../model/score-parts'
import { PartChip } from './PartChip'

/** Each part's picture: the chord symbol as printed, the positions' stack, the words, a finger, a name. */
const ICONS: Readonly<Record<SheetPart, ReactNode>> = {
  chordNames: <span className="font-display text-sm font-semibold">C⁷</span>,
  positions: <Layers />,
  lyrics: <WholeWord />,
  fingers: <Hash />,
  noteNames: <Type />,
}

/** Whether a part is shown, and how it is turned on or off: each saved for every piece. */
function usePart(part: SheetPart): readonly [boolean, (on: boolean) => void] {
  const store = useSettingsStoreApi()
  const view = useSettings(selectScoreView)
  const practice = useSettings(selectPractice)
  switch (part) {
    case 'chordNames':
      return [view.chordNames, (chordNames) => setScoreView(store, { chordNames })]
    case 'lyrics':
      return [view.lyrics, (lyrics) => setScoreView(store, { lyrics })]
    case 'positions':
      return [practice.positions, (on) => setPracticeToggle(store, 'positions', on)]
    case 'fingers':
      return [practice.fingerNumbers, (on) => setPracticeToggle(store, 'fingerNumbers', on)]
    case 'noteNames':
      return [practice.namedNotes, (on) => setPracticeToggle(store, 'namedNotes', on)]
  }
}

/**
 * What the music shows, turned on or off in the View (ADR 0114, 0108, 0115): one of the sheet
 * music's parts as a chip, saved for every piece; Diagrams and the Grid show the words too. Greyed
 * where the music has nothing for it to show, the `reason` its tooltip (ADR 0108).
 */
export function ViewChip({ part, reason }: { part: SheetPart; reason?: string | undefined }) {
  const { t } = useTranslation('music')
  const [on, turn] = usePart(part)
  return (
    <PartChip
      icon={ICONS[part]}
      label={t(`view.parts.${part}`)}
      pressed={on}
      reason={reason}
      onPressedChange={turn}
    />
  )
}
