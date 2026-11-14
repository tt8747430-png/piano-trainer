import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useKeyName, useScaleName } from '@/shared/i18n'
import {
  keySignature,
  noteFromParam,
  placeScale,
  printedNote,
  spellScale,
} from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { keyOfScale } from '../model/scale-key'
import type { ScaleView } from '../model/scale-view'
import { ChordsView } from './ChordsView'
import { KeyView } from './KeyView'
import { RunView } from './RunView'
import { ScaleChoice } from './ScaleChoice'

/** How fast a scale chosen sounds as it is chosen: a quick run up its octave. */
const CHOSEN_TEMPO = 360

/**
 * Any scale on any root, in the view its page's tab chose. A scale chosen (its root or its kind)
 * plays up its octave as it is chosen, unless Settings › Keyboard turns that off. Scale: its run from any note, fingered, on
 * the keys and on the staff, and its exercises. Chords: each degree's chord on its key, walked, and
 * the chords that hold a note. Key (a major or minor scale): its key on the circle of fifths, its
 * signature, relative and modes, the chords it borrows, and a melody note harmonised in it.
 */
export function ScaleExplorer({
  scale,
  views,
  onChange,
}: {
  scale: ScaleView
  /** The page's Scale · Chords · Key, under the name. */
  views: ReactNode
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation('practice')
  const scaleName = useScaleName()
  const keyName = useKeyName()
  const play = usePlay()
  const { autoplay } = useSettings(selectKeyboard)
  const root = noteFromParam(scale.root)
  const name = scaleName(root, scale.kind)
  const choose = (change: Partial<ScaleView>) => {
    onChange(change)
    if (!autoplay) return
    const keys = placeScale(noteFromParam(change.root ?? scale.root), change.kind ?? scale.kind, 0)
    play(
      walkSounds(
        keys.map((key) => [key.midi]),
        { arpeggio: false, tempo: CHOSEN_TEMPO },
      ),
    )
  }
  const musicKey = scale.show === 'key' ? keyOfScale(scale.root, scale.kind) : null
  const tones = spellScale(root, scale.kind)
  // Its signature, or its count of notes where it is no key's, then its notes (canvas 174).
  const inKey = keyOfScale(scale.root, scale.kind)
  const sharps = inKey ? keySignature(inKey) : null
  const line =
    sharps === null
      ? t('scales.views.notes', { count: tones.length })
      : sharps === 0
        ? t('scales.views.plain')
        : t(sharps > 0 ? 'scales.views.sharps' : 'scales.views.flats', { count: Math.abs(sharps) })
  const choice = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <ScaleChoice scale={scale} name={musicKey ? keyName(musicKey) : name} onChange={choose} />
        <p className="ms-1 text-[0.9375rem] text-muted-foreground">
          {line} ·{' '}
          <span className="text-foreground">
            {tones.map((tone) => printedNote(tone.note)).join(' ')}
          </span>
        </p>
      </div>
      {views}
    </div>
  )
  // The Key view is the key's: named as the key, whichever of its scales chose it.
  if (musicKey)
    return <KeyView scale={scale} musicKey={musicKey} choice={choice} onChange={onChange} />
  return scale.show === 'chords' ? (
    <ChordsView scale={scale} onChange={onChange} choice={choice} />
  ) : (
    <RunView scale={scale} onChange={onChange} choice={choice} />
  )
}
