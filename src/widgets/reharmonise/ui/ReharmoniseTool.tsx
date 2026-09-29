import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMidiKeyDown } from '@/features/connect-midi'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import type { ShownKeys } from '@/features/play-example'
import {
  chordsHolding,
  CIRCLE_OF_FIFTHS,
  HOLDING_GROUPS,
  keyFromParam,
  keyParam,
  midi,
  MIDDLE_C,
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  pitchClass,
  pitchClassOf,
  spellInKey,
  type Key,
  type Midi,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Dropdown } from '@/shared/ui'
import { underMelody } from '../model/holding-keys'
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
  const [played, setPlayed] = useState<{ view: ReharmoniseView; shown: ShownKeys } | null>(null)
  const key = keyFromParam(view.key)
  const melody = noteFromParam(view.note)
  const melodyKey = midi(MIDDLE_C + pitchClassOf(melody))
  const choose = (tapped: Midi) =>
    onChange({ note: noteParam(spellInKey(pitchClass(tapped), key)) })
  useMidiKeyDown(choose)
  const shown =
    played?.view.key === view.key && played.view.note === view.note
      ? played.shown
      : {
          keys: [melodyKey],
          marks: new Map([[melodyKey, { tone: 'scale' as const, label: noteName(melody) }]]),
        }
  const held = chordsHolding(melody, key)
  const idOf = (group: string, index: number) => `${view.key} ${view.note} ${group} ${index}`
  const keyOption = (each: Key) => ({
    value: keyParam(each),
    label: t(each.minor ? 'keys.minor' : 'keys.major', { tonic: noteName(each.tonic) }),
  })
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard keys={shown.keys} marks={shown.marks} onKeyPress={choose} />
      <div className="flex flex-wrap gap-2">
        <Dropdown
          label={t('reharmonise.note')}
          value={view.note}
          options={PITCH_CLASSES.map((pc) => {
            const spelled = spellInKey(pc, key)
            return { value: noteParam(spelled), label: noteName(spelled) }
          })}
          onChange={(note) => onChange({ note })}
        />
        <Dropdown
          label={t('reharmonise.key')}
          value={view.key}
          groups={[
            {
              label: t('reharmonise.majorKeys'),
              options: CIRCLE_OF_FIFTHS.map((place) => keyOption(place.major)),
            },
            {
              label: t('reharmonise.minorKeys'),
              options: CIRCLE_OF_FIFTHS.map((place) => keyOption(place.minor)),
            },
          ]}
          onChange={(next) => onChange({ key: next })}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {HOLDING_GROUPS.map((group) => (
          <HoldingGroupCard
            key={group}
            group={group}
            chords={held[group]}
            isPlaying={(index) => playback.playing === idOf(group, index)}
            onPlay={(holding, index) => {
              const next = underMelody(holding, melody)
              setPlayed({ view, shown: next })
              playback.toggle(idOf(group, index), chordSounds(next.keys, { arpeggio: false }))
            }}
          />
        ))}
      </div>
    </div>
  )
}
