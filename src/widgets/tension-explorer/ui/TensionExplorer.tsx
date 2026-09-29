import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import type { ShownKeys } from '@/features/play-example'
import {
  chordRootSpelling,
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  qualityIntervals,
  qualitySuffix,
  TENSION_CHORDS,
  TENSION_GROUPS,
  tensionTones,
  type TensionTone,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Dropdown } from '@/shared/ui'
import { tensionChord, withNoteOnTop } from '../model/tension-keys'
import type { TensionView } from '../model/tension-view'
import { TensionGroupCard } from './TensionGroupCard'

/**
 * A 7th chord on a root, and the twelve notes over it in the owner's table's four groups: weak,
 * strong, tensions and avoid. A note plays the chord with it on top, on the keys pinned above.
 */
export function TensionExplorer({
  view,
  onChange,
}: {
  view: TensionView
  onChange: (change: Partial<TensionView>) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const playback = usePlayback<string>()
  const [played, setPlayed] = useState<{ view: TensionView; shown: ShownKeys } | null>(null)
  const root = noteFromParam(view.root)
  const chord = tensionChord(root, view.chord)
  // A note played over another chord or root no longer stands on these keys.
  const shown =
    played?.view.root === view.root && played.view.chord === view.chord ? played.shown : chord
  const tones = tensionTones(root, view.chord)
  const intervals = qualityIntervals(view.chord)
  // A chip's sound is its chord's and root's: after a change, no chip of the new chord is pressed.
  const idOf = (tone: TensionTone) => `${view.root} ${view.chord} ${tone.pitchClass}`
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard keys={shown.keys} marks={shown.marks} />
      <div className="flex flex-wrap gap-2">
        <Dropdown
          label={t('learn:tensions.chord')}
          value={view.chord}
          options={TENSION_CHORDS.map((quality) => ({
            value: quality,
            label: noteName(root) + qualitySuffix(quality),
            detail: t(`music:quality.${quality}`),
          }))}
          onChange={(next) => onChange({ chord: next })}
        />
        <Dropdown
          label={t('learn:root')}
          value={view.root}
          options={PITCH_CLASSES.map((pc) => {
            const spelled = chordRootSpelling(pc, intervals)
            return { value: noteParam(spelled), label: noteName(spelled) }
          })}
          onChange={(next) => onChange({ root: next })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {TENSION_GROUPS.map((group) => (
          <TensionGroupCard
            key={group}
            group={group}
            tones={tones.filter((tone) => tone.group === group)}
            isPlaying={(tone) => playback.playing === idOf(tone)}
            onPlay={(tone) => {
              const next = withNoteOnTop(chord, tone)
              setPlayed({ view, shown: next })
              playback.toggle(idOf(tone), chordSounds(next.keys, { arpeggio: false }))
            }}
          />
        ))}
      </div>
    </div>
  )
}
