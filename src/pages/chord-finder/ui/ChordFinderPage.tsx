import { Link, useSearch } from '@tanstack/react-router'
import { Eraser } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { partsParams, useViewChange } from '@/shared/lib'
import { noteParam } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import {
  BackButton,
  ButtonLink,
  KeyChoice,
  PlayLabel,
  RoundButton,
  ScreenHeader,
  usePlayKey,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ChordKeys, ChordName, ChordTrail, readingAt, readingMarks } from '@/widgets/chord-finder'
import type { ChordFinderView } from '../model/chord-finder-view'
import { useChordFinder } from '../model/use-chord-finder'

/**
 * The Chord finder (ADR 0054), a tool of its own: a chord played on a MIDI keyboard or tapped on the
 * keys is named at once, as large as the page allows, in every reading it has, its keys marked by
 * degree; the chords played are written in turn on a grand staff, spelled in the key chosen; then the
 * keys that hold it. Play hears it; Open in Chords builds it there.
 */
export function ChordFinderPage() {
  const { t } = useTranslation(['practice', 'music'])
  const view = useSearch({ from: '/shell/practice/chord-finder' })
  const change = useViewChange<ChordFinderView>()
  const finder = useChordFinder(view)
  const playback = usePlayback<'chord'>()
  const { keys, finding } = finder
  const reading = finding.kind === 'chord' ? readingAt(finding.readings, finder.reading) : undefined
  const play = () => playback.toggle('chord', () => chordSounds(keys, { arpeggio: false }))
  usePlayKey(play, keys.length > 0)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('practice:pages.chordFinder')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        actions={
          <div className="flex gap-2">
            <MidiButton />
            <RoundButton
              label={t('practice:chordFinder.clear')}
              icon={Eraser}
              disabled={!finder.canClear}
              onClick={finder.clear}
            />
          </div>
        }
      />
      <PinnedKeyboard
        shown={{ keys, marks: reading ? readingMarks(reading, keys) : new Map() }}
        selected={finder.tapped}
        onKeyPress={finder.tap}
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-12">
        <div className="flex min-w-0 flex-col gap-8">
          <section aria-live="polite" className="flex min-h-48 flex-col gap-6">
            <ChordName
              finding={finding}
              keys={keys}
              source={finder.source}
              reading={finder.reading}
              onReading={finder.setReading}
            />
            {keys.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                <Button size="pill" onClick={play}>
                  <PlayLabel playing={playback.playing === 'chord'}>{t('music:play')}</PlayLabel>
                </Button>
                {reading ? (
                  <ButtonLink
                    size="pill"
                    variant="soft"
                    render={
                      <Link
                        to="/practice/chords"
                        search={{
                          root: noteParam(reading.chord.root),
                          ...partsParams(reading.parts),
                          ...(reading.inversion ? { inversion: reading.inversion } : {}),
                        }}
                      />
                    }
                  >
                    {t('practice:chordFinder.open')}
                  </ButtonLink>
                ) : null}
              </div>
            ) : null}
          </section>
          <ChordTrail chords={finder.played} musicKey={finder.musicKey} />
        </div>
        <aside className="flex flex-col gap-8">
          <KeyChoice value={view.key} onChange={(key) => change({ key })} />
          {reading ? <ChordKeys found={reading} /> : null}
        </aside>
      </div>
    </div>
  )
}
