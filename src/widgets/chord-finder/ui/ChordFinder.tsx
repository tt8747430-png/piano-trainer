import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useHeldKeys } from '@/features/connect-midi'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { keyListParam, partsParams, readKeyList, toggled } from '@/shared/lib'
import { noteParam, type Midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink, PlayLabel, usePlayKey } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { FinderView } from '../model/finder-view'
import { findChord, findingMarks } from '../model/finding'
import { FinderName } from './FinderName'
import { useFindingSaid } from './use-finding-said'

/**
 * The Chord finder: keys tapped on (or held on a MIDI keyboard) are named as a chord, each key marked
 * by its degree in it; played, cleared, or opened in the Chords explorer.
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
  const finding = findChord(keys)
  const said = useFindingSaid(finding)
  const best = finding.kind === 'chord' ? finding.best : undefined
  const toggle = (key: Midi) => onChange({ keys: keyListParam(toggled(chosen, key)) })
  const play = () => playback.toggle('chord', () => chordSounds(keys, { arpeggio: false }))
  usePlayKey(play, keys.length > 0)
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard
        shown={{ keys, marks: findingMarks(finding, keys) }}
        selected={new Set(chosen)}
        onKeyPress={toggle}
      />
      <FinderName keys={keys} finding={finding} />
      {/* The name changes while the focus stays on the keys: said here, once each time. */}
      <p role="status" className="sr-only">
        {said}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button size="pill" disabled={keys.length === 0} onClick={play}>
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
                to="/practice/chords"
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
