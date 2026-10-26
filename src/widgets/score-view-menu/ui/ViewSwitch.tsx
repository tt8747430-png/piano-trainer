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

/** The chord symbols over the staff, as a lead sheet prints them. */
function ChordNamesSwitch() {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectScoreView(state).chordNames)
  return (
    <SwitchRow
      icon={<span className="font-display text-base font-semibold">C⁷</span>}
      label={t('sheet.chordNames')}
      checked={on}
      onCheckedChange={(chordNames) => setScoreView(store, { chordNames })}
    />
  )
}

/** The position the right hand plays each chord in, beside its symbol: practice's alone. */
function PositionsSwitch() {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectPractice(state).positions)
  return (
    <SwitchRow
      icon={<Layers />}
      label={t('toggles.positions')}
      info={t('view.positionsDetail')}
      checked={on}
      onCheckedChange={(positions) => setPracticeToggle(store, 'positions', positions)}
    />
  )
}

/** The words under the staff they are written on (ADR 0093), or under Diagrams' strip. */
function LyricsSwitch() {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectScoreView(state).lyrics)
  return (
    <SwitchRow
      icon={<WholeWord />}
      label={t('view.lyrics')}
      checked={on}
      onCheckedChange={(lyrics) => setScoreView(store, { lyrics })}
    />
  )
}

/** The fingers written over the notes (ADR 0096). */
function FingersSwitch() {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectPractice(state).fingerNumbers)
  return (
    <SwitchRow
      icon={<Hash />}
      label={t('view.fingers')}
      checked={on}
      onCheckedChange={(fingers) => setPracticeToggle(store, 'fingerNumbers', fingers)}
    />
  )
}

/** Each note's name in its head: practice's alone. */
function NoteNamesSwitch() {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectPractice(state).namedNotes)
  return (
    <SwitchRow
      icon={<Type />}
      label={t('toggles.namedNotes')}
      checked={on}
      onCheckedChange={(named) => setPracticeToggle(store, 'namedNotes', named)}
    />
  )
}

const SWITCHES: Readonly<Record<SheetPart, ComponentType>> = {
  chordNames: ChordNamesSwitch,
  positions: PositionsSwitch,
  lyrics: LyricsSwitch,
  fingers: FingersSwitch,
  noteNames: NoteNamesSwitch,
}

/**
 * What the music shows, turned on or off in the View (ADR 0094, 0102): one of the sheet music's
 * parts, each saved for every piece; Diagrams shows the words too.
 */
export function ViewSwitch({ part }: { part: SheetPart }) {
  const Switch = SWITCHES[part]
  return <Switch />
}
