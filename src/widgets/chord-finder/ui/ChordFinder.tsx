import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useHeldKeys } from '@/features/connect-midi'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { keyListParam, partsParams, readKeyList, toggled } from '@/shared/lib'
import { noteParam, type Midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink, PlayLabel, usePlayKey } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { findChord, findingMarks } from '../model/finding'
import { ChordKeys } from './ChordKeys'
import { FinderName } from './FinderName'
import { useFindingSaid } from './use-finding-said'

/**
 * The Chord finder, Free play's Find (ADR 0052): keys tapped on (or held on a MIDI keyboard) are named
 * as a chord, each key marked by its degree in it; played, or opened in the Chords explorer; and the
 * keys that hold it. Its keys are written `60-64-67`, lowest first.
 */
export function ChordFinder({
  keys: written,
  onChange,
}: {
  keys: string
  onChange: (keys: string) => void
}) {
  const { t } = useTranslation(['music', 'practice'])
  const playback = usePlayback<'chord'>()
  const held = useHeldKeys()
  const chosen = readKeyList(written)
  // A MIDI keyboard's held keys are the chord while any is held.
  const keys = held.size > 0 ? [...held].sort((a, b) => a - b) : chosen
  const finding = findChord(keys)
  const said = useFindingSaid(finding)
  const best = finding.kind === 'chord' ? finding.best : undefined
  const toggle = (key: Midi) => onChange(keyListParam(toggled(chosen, key)))
  const play = () => playback.toggle('chord', () => chordSounds(keys, { arpeggio: false }))
  usePlayKey(play, keys.length > 0)
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard
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
          <PlayLabel playing={playback.playing === 'chord'}>{t('music:play')}</PlayLabel>
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
            {t('practice:chordFinder.open')}
          </ButtonLink>
        ) : null}
      </div>
      {best ? <ChordKeys found={best} /> : null}
    </div>
  )
}
