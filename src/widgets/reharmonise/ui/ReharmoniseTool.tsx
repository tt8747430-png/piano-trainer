import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMidiKeyDown } from '@/features/connect-midi'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { useShownKeys } from '@/features/play-example'
import {
  chordsHolding,
  HOLDING_GROUPS,
  keyFromParam,
  MIDDLE_OCTAVES,
  noteFromParam,
  noteParam,
  pitchClass,
  pitchClassOf,
  spellInKey,
  type Midi,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { KeyChoice, NoteChoice } from '@/shared/ui'
import { melodyAlone, underMelody } from '../model/holding-keys'
import type { ReharmoniseView } from '../model/reharmonise-view'
import { HoldingGroupCard } from './HoldingGroupCard'

/**
 * Reharmonise: a melody note in a key, and every chord that holds it (the owner's table, carried past
 * the key), each played under it. A tapped or MIDI key chooses the note.
 */
export function ReharmoniseTool({
  view,
  onChange,
}: {
  view: ReharmoniseView
  onChange: (change: Partial<ReharmoniseView>) => void
}) {
  const { t } = useTranslation('learn')
  const playback = usePlayback<string>()
  const [chosenOn, setChosenOn] = useState<Midi | null>(null)
  const key = keyFromParam(view.key)
  const melody = noteFromParam(view.note)
  const choose = (tapped: Midi) => {
    setChosenOn(tapped)
    onChange({ note: noteParam(spellInKey(pitchClass(tapped), key)) })
  }
  useMidiKeyDown(choose)
  const [shown, show] = useShownKeys(
    `${view.key} ${view.note}`,
    melodyAlone(
      melody,
      chosenOn !== null && pitchClass(chosenOn) === pitchClassOf(melody) ? chosenOn : undefined,
    ),
  )
  const held = chordsHolding(melody, key)
  const idOf = (group: string, index: number) => `${view.key} ${view.note} ${group} ${index}`
  return (
    <div className="flex flex-col gap-6">
      {/* A note is chosen where a hand is: the range stays, so the keys hold still under it. */}
      <ExplorerKeyboard shown={shown} range={MIDDLE_OCTAVES} onKeyPress={choose} />
      <div className="grid-fields gap-x-10 gap-y-6">
        <NoteChoice
          label={t('reharmonise.note')}
          value={view.note}

          onChange={(note) => onChange({ note })}
        />
        <KeyChoice value={view.key} onChange={(next) => onChange({ key: next })} />
      </div>
      <div className="grid-fields gap-6">
        {HOLDING_GROUPS.map((group) => (
          <HoldingGroupCard
            key={group}
            group={group}
            chords={held[group]}
            isPlaying={(index) => playback.playing === idOf(group, index)}
            onPlay={(holding, index) => {
              const next = underMelody(holding, melody)
              show(next)
              playback.toggle(idOf(group, index), () => chordSounds(next.keys, { arpeggio: false }))
            }}
          />
        ))}
      </div>
    </div>
  )
}
