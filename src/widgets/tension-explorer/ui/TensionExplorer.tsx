import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { noteOnTop, useShownKeys } from '@/features/play-example'
import {
  chordRootSpelling,
  chordSymbol,
  noteFromParam,
  pitchClassOf,
  qualityIntervals,
  qualityRootSpelling,
  TENSION_CHORDS,
  TENSION_GROUPS,
  type TensionTone,
  tensionTones,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Dropdown, NoteDropdown } from '@/shared/ui'
import { tensionChord, tensionMark } from '../model/tension-keys'
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
  const root = noteFromParam(view.root)
  const chord = tensionChord(root, view.chord)
  const [shown, show] = useShownKeys(`${view.root} ${view.chord}`, chord)
  const tones = tensionTones(root, view.chord)
  const intervals = qualityIntervals(view.chord)
  // A chip's sound is its chord's and root's: after a change, no chip of the new chord is pressed.
  const idOf = (tone: TensionTone) => `${view.root} ${view.chord} ${tone.pitchClass}`
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard shown={shown} />
      <div className="flex flex-wrap gap-2">
        <Dropdown
          label={t('learn:tensions.chord')}
          value={view.chord}
          options={TENSION_CHORDS.map((quality) => ({
            value: quality,
            // Each chord's root as choosing it spells it: over C♯, Maj7 is D♭Maj7.
            label: chordSymbol({ root: qualityRootSpelling(pitchClassOf(root), quality), quality }),
            detail: t(`music:quality.${quality}`),
          }))}
          onChange={(next) => onChange({ chord: next })}
        />
        <NoteDropdown
          label={t('learn:root')}
          value={view.root}
          spell={(pc) => chordRootSpelling(pc, intervals)}
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
              const next = noteOnTop(chord, tone.pitchClass, tensionMark(tone))
              show(next)
              playback.toggle(idOf(tone), () => chordSounds(next.keys, { arpeggio: false }))
            }}
          />
        ))}
      </div>
    </div>
  )
}
