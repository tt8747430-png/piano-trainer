import { Hash, Layers, Type, WholeWord } from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectPractice,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPracticeToggle, setScoreView } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'
import type { SheetPart } from '../model/score-parts'

/**
 * A switch's own props: why it is greyed, where the music has nothing for it to show (ADR 0108),
 * which its ⓘ says.
 */
interface SwitchProps {
  readonly reason?: string
}

/** The chord symbols over the staff, as a lead sheet prints them. */
function ChordNamesSwitch({ reason }: SwitchProps) {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectScoreView(state).chordNames)
  return (
    <SwitchRow
      icon={<span className="font-display text-base font-semibold">C⁷</span>}
      label={t('sheet.chordNames')}
      info={reason}
      disabled={reason !== undefined}
      checked={on}
      onCheckedChange={(chordNames) => setScoreView(store, { chordNames })}
    />
  )
}

/** The position the right hand plays each chord in, beside its symbol: practice's alone. */
function PositionsSwitch({ reason }: SwitchProps) {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectPractice(state).positions)
  return (
    <SwitchRow
      icon={<Layers />}
      label={t('toggles.positions')}
      info={reason ?? t('view.positionsDetail')}
      disabled={reason !== undefined}
      checked={on}
      onCheckedChange={(positions) => setPracticeToggle(store, 'positions', positions)}
    />
  )
}

/**
 * The words under the staff they are written on (ADR 0093), under Diagrams' strip, or under the
 * Grid's beats (ADR 0108).
 */
function LyricsSwitch({ reason }: SwitchProps) {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectScoreView(state).lyrics)
  return (
    <SwitchRow
      icon={<WholeWord />}
      label={t('view.lyrics')}
      info={reason}
      disabled={reason !== undefined}
      checked={on}
      onCheckedChange={(lyrics) => setScoreView(store, { lyrics })}
    />
  )
}

/** The fingers written over the notes (ADR 0096). */
function FingersSwitch({ reason }: SwitchProps) {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectPractice(state).fingerNumbers)
  return (
    <SwitchRow
      icon={<Hash />}
      label={t('view.fingers')}
      info={reason}
      disabled={reason !== undefined}
      checked={on}
      onCheckedChange={(fingers) => setPracticeToggle(store, 'fingerNumbers', fingers)}
    />
  )
}

/** Each note's name in its head: practice's alone. */
function NoteNamesSwitch({ reason }: SwitchProps) {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectPractice(state).namedNotes)
  return (
    <SwitchRow
      icon={<Type />}
      label={t('toggles.namedNotes')}
      info={reason}
      disabled={reason !== undefined}
      checked={on}
      onCheckedChange={(named) => setPracticeToggle(store, 'namedNotes', named)}
    />
  )
}

const SWITCHES: Readonly<Record<SheetPart, ComponentType<SwitchProps>>> = {
  chordNames: ChordNamesSwitch,
  positions: PositionsSwitch,
  lyrics: LyricsSwitch,
  fingers: FingersSwitch,
  noteNames: NoteNamesSwitch,
}

/**
 * What the music shows, turned on or off in the View (ADR 0094, 0102): one of the sheet music's
 * parts, each saved for every piece; Diagrams and the Grid show the words too. Greyed where the
 * music has nothing for it to show, the `reason` its ⓘ (ADR 0108).
 */
export function ViewSwitch({ part, reason }: { part: SheetPart; reason?: string }) {
  const Switch = SWITCHES[part]
  return <Switch reason={reason} />
}
