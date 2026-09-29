import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useHeldKeys } from '@/features/connect-midi'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { keyListParam, readKeyList } from '@/shared/lib'
import { nameChords, noteParam, partsParams, pitchClass, type Midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink, PlayLabel, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { FinderView } from '../model/finder-view'
import { FinderName } from './FinderName'

/**
 * The Chord finder: keys tapped on (or held on a MIDI keyboard) are named as a chord, each key marked
 * by its degree in it; played, cleared, or opened in the Chords reference.
 */
export function ChordFinder({
  view,
  onChange,
}: {
  view: FinderView
  onChange: (change: Partial<FinderView>) => void
}) {
  const { t } = useTranslation('learn')
  const playback = usePlayback<'chord'>()
  const held = useHeldKeys()
  const chosen = readKeyList(view.keys)
  // A MIDI keyboard's held keys are the chord while any is held.
  const keys = held.size > 0 ? [...held].sort((a, b) => a - b) : chosen
  const [best, ...others] = nameChords(keys)
  const marks = new Map<Midi, KeyMark>()
  for (const key of keys) {
    const tone = best?.chord.tones.find((each) => each.pitchClass === pitchClass(key))
    if (tone) marks.set(key, { tone: tone.role, label: tone.degree })
  }
  const toggle = (key: Midi) =>
    onChange({
      keys: keyListParam(
        chosen.includes(key) ? chosen.filter((each) => each !== key) : [...chosen, key],
      ),
    })
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard keys={keys} marks={marks} selected={new Set(chosen)} onKeyPress={toggle} />
      <FinderName keys={keys} best={best} others={others} />
      <div className="flex flex-wrap gap-3">
        <Button
          size="pill"
          disabled={keys.length === 0}
          onClick={() => playback.toggle('chord', chordSounds(keys, { arpeggio: false }))}
        >
          <PlayLabel playing={playback.playing === 'chord'}>{t('play')}</PlayLabel>
        </Button>
        <Button
          size="pill"
          variant="soft"
          disabled={chosen.length === 0}
          onClick={() => onChange({ keys: '' })}
        >
          {t('finder.clear')}
        </Button>
        {best ? (
          <ButtonLink
            size="pill"
            variant="soft"
            render={
              <Link
                to="/learn/chords"
                search={{
                  root: noteParam(best.chord.root),
                  ...partsParams(best.parts),
                  ...(best.inversion ? { inversion: best.inversion } : {}),
                }}
              />
            }
          >
            {t('finder.open')}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  )
}
