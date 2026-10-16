import { Link, useSearch } from '@tanstack/react-router'
import { Eraser, Music2, Play, SlidersHorizontal, Square } from 'lucide-react'
import { REMEMBERED_CHORDS } from '@/entities/settings'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { PinnedKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { partsParams, useViewChange } from '@/shared/lib'
import { noteParam } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import {
  BackButton,
  Fab,
  FloatingActions,
  KeyChoice,
  ScreenHeader,
  Sheet,
  SheetContent,
  SheetTrigger,
  SpeedDial,
  SpeedDialAction,
  SwitchRow,
  usePlayKey,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ChordKeys, ChordName, ChordTrail, readingAt, readingMarks } from '@/widgets/chord-finder'
import type { ChordFinderView } from '../model/chord-finder-view'
import { useChordFinder } from '../model/use-chord-finder'
import { HiddenParts, type HiddenPart } from './HiddenParts'

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
              label={t('chordFinder.slash')}
              detail={t('chordFinder.slashDetail')}
              checked={finder.slash}
              onCheckedChange={finder.setSlash}
            />
            <SwitchRow
              label={t('chordFinder.staffShown')}
              checked={finder.staffShown}
              onCheckedChange={finder.setStaffShown}
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
 * played before it; then the keys that hold it. Play, floating in the thumb's reach, hears it; the
 * dial beside it opens it in Chords or clears the keys. Its settings are a sheet off its bar.
 */
export function ChordFinderPage() {
  const { t } = useTranslation(['practice', 'music', 'common'])
  const view = useSearch({ from: '/shell/practice/chord-finder' })
  const change = useViewChange<ChordFinderView>()
  const finder = useChordFinder(view)
  const playback = usePlayback<'chord'>()
  const { keys, finding } = finder
  const reading = finding.kind === 'chord' ? readingAt(finding.readings, finder.reading) : undefined
  const play = () => playback.toggle('chord', () => chordSounds(keys, { arpeggio: false }))
  usePlayKey(play, keys.length > 0)
  const { folded, fold } = useFoldKeys()
  // What the learner hid says so where it was, each a way to bring it back.
  const hidden: HiddenPart[] = [
    ...(folded
      ? [{ id: 'keys', label: t('practice:chordFinder.showKeys'), onShow: () => fold(false) }]
      : []),
    ...(finder.staffShown
      ? []
      : [
          {
            id: 'staff',
            label: t('practice:chordFinder.showStaff'),
            onShow: () => finder.setStaffShown(true),
          },
        ]),
    ...(finder.inKeys
      ? []
      : [
          {
            id: 'inKeys',
            label: t('practice:chordFinder.showInKeys'),
            onShow: () => finder.setInKeys(true),
          },
        ]),
  ]
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('practice:pages.chordFinder')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        actions={
          <div className="flex gap-2">
            <MidiButton />
            <FinderSettings finder={finder} view={view} onKey={(key) => change({ key })} />
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
          <section aria-live="polite" className="flex min-h-36 flex-col gap-6">
            <ChordName
              finding={finding}
              keys={keys}
              source={finder.source}
              reading={finder.reading}
              onReading={finder.setReading}
              slash={finder.slash}
              keysFolded={folded}
            />
          </section>
          {finder.staffShown ? (
            <ChordTrail
              chords={finder.staff}
              musicKey={finder.musicKey}
              remember={finder.remember}
              slash={finder.slash}
            />
          ) : null}
          <HiddenParts parts={hidden} />
        </div>
        {finder.inKeys && reading ? (
          <aside className="flex flex-col gap-8">
            <ChordKeys found={reading} />
          </aside>
        ) : null}
      </div>
      <FloatingActions>
        {finder.canClear ? (
          <SpeedDial>
            {reading ? (
              <SpeedDialAction
                label={t('practice:chordFinder.open')}
                icon={Music2}
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
              />
            ) : null}
            <SpeedDialAction
              label={t('practice:chordFinder.clear')}
              icon={Eraser}
              onClick={finder.clear}
            />
          </SpeedDial>
        ) : null}
        {keys.length > 0 ? (
          <Fab
            label={playback.playing === 'chord' ? t('common:stop') : t('music:play')}
            icon={playback.playing === 'chord' ? Square : Play}
            onClick={play}
          />
        ) : null}
      </FloatingActions>
    </div>
  )
}
