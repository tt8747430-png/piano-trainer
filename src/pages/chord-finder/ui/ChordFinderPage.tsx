import { Link, useSearch } from '@tanstack/react-router'
import { Eraser, SlidersHorizontal } from 'lucide-react'
import { REMEMBERED_CHORDS } from '@/entities/settings'
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
  Sheet,
  SheetContent,
  SheetTrigger,
  SwitchRow,
  usePlayKey,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ChordKeys, ChordName, ChordTrail, readingAt, readingMarks } from '@/widgets/chord-finder'
import type { ChordFinderView } from '../model/chord-finder-view'
import { useChordFinder } from '../model/use-chord-finder'

/**
 * The Chord finder's settings, in a sheet off its bar: the key it spells in, whether it remembers the
 * chords played, and whether it shows the keys a chord is in.
 */
function FinderSettings({
  finder,
  view,
  onKey,
}: {
  finder: ReturnType<typeof useChordFinder>
  view: ChordFinderView
  onKey: (key: ChordFinderView['key']) => void
}) {
  const { t } = useTranslation('practice')
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="surface" size="icon" aria-label={t('chordFinder.settings')} />}
      >
        <SlidersHorizontal aria-hidden />
      </SheetTrigger>
      <SheetContent title={t('chordFinder.settings')}>
        <div className="flex flex-col gap-4 pt-2">
          <KeyChoice value={view.key} onChange={onKey} />
          <div>
            <SwitchRow
              label={t('chordFinder.remember')}
              detail={t('chordFinder.rememberDetail', { count: REMEMBERED_CHORDS })}
              checked={finder.remember}
              onCheckedChange={finder.setRemember}
            />
            <SwitchRow
              label={t('chordFinder.inKeysShown')}
              checked={finder.inKeys}
              onCheckedChange={finder.setInKeys}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/**
 * The Chord finder (ADR 0054), a tool of its own: a chord played on a MIDI keyboard or tapped on the
 * keys is named at once, as large as the page allows, in every reading it has, its keys marked by
 * degree; the staff writes it, spelled in the key chosen, and where the chords are remembered those
 * played before it; then the keys that hold it. Play hears it; Open in Chords builds it there. Its
 * settings are a sheet off its bar.
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
            <FinderSettings finder={finder} view={view} onKey={(key) => change({ key })} />
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
      <div
        className={
          finder.inKeys && reading
            ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-12'
            : 'flex flex-col gap-10'
        }
      >
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
          <ChordTrail chords={finder.staff} musicKey={finder.musicKey} remember={finder.remember} />
        </div>
        {finder.inKeys && reading ? (
          <aside className="flex flex-col gap-8">
            <ChordKeys found={reading} />
          </aside>
        ) : null}
      </div>
    </div>
  )
}
