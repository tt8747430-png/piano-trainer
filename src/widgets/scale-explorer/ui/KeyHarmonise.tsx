import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import {
  chordsHolding,
  HOLDING_GROUPS,
  noteFromParam,
  noteParam,
  pitchClassOf,
  spellInKey,
  type Key,
  type NoteParam,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { NoteChoice, type ShownKeys } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { underMelody } from '../model/holding-keys'
import { HoldingGroupCard } from './HoldingGroupCard'

/**
 * A melody note harmonised in the key (ADR 0052, Reharmonise as it was): every chord that holds it,
 * by the owner's table and past the key (with In the key only, the key's alone), each played under
 * the note on the keys pinned above.
 */
export function KeyHarmonise({
  musicKey,
  melody,
  onlyInKey,
  onChange,
  onShow,
}: {
  musicKey: Key
  melody: NoteParam
  onlyInKey: boolean
  onChange: (change: { melody?: NoteParam; onlyInKey?: boolean }) => void
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('practice')
  const id = useId()
  const playback = usePlayback<string>()
  const note = spellInKey(pitchClassOf(noteFromParam(melody)), musicKey)
  const held = chordsHolding(note, musicKey)
  const idOf = (group: string, index: number) => `${melody} ${group} ${index}`
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 id={id} className="text-2xl">
          {t('scales.key.harmonise')}
        </h3>
        <p className="max-w-prose text-muted-foreground">{t('scales.key.harmoniseAbout')}</p>
      </div>
      <div className="grid-fields gap-x-10 gap-y-5">
        <NoteChoice
          label={t('reharmonise.note')}
          value={noteParam(note)}
          onChange={(next) => onChange({ melody: next })}
        />
        <Toggle
          className="self-end justify-self-start"
          pressed={onlyInKey}
          onPressedChange={(next) => onChange({ onlyInKey: next || undefined })}
        >
          {t('reharmonise.onlyInKey')}
        </Toggle>
      </div>
      <div className="grid-fields gap-6">
        {HOLDING_GROUPS.map((group) => {
          const chords = onlyInKey ? held[group].filter((holding) => holding.inKey) : held[group]
          return chords.length === 0 ? null : (
            <HoldingGroupCard
              key={group}
              group={group}
              chords={chords}
              isPlaying={(index) => playback.playing === idOf(group, index)}
              onPlay={(holding, index) => {
                const shown = underMelody(holding, note)
                onShow(shown)
                playback.toggle(idOf(group, index), () =>
                  chordSounds(shown.keys, { arpeggio: false }),
                )
              }}
            />
          )
        })}
      </div>
    </section>
  )
}
