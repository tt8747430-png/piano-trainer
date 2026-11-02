import { Link, useSearch } from '@tanstack/react-router'
import {
  Eraser,
  History,
  KeyRound,
  Piano,
  ListX,
  Music2,
  Play,
  SlidersHorizontal,
  Square,
} from 'lucide-react'
import { REMEMBERED_CHORDS } from '@/entities/settings'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { PinnedKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { partsParams, useViewChange } from '@/shared/lib'
import { keySymbol, noteParam, printedSymbol } from '@/shared/lib/music'
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
  ToggleGrid,
  ToggleTile,
  usePlayKey,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { scaleOverlay } from '../model/scale-overlay'
import { ChordKeys, ChordName, ChordTrail, readingAt, readingMarks } from '@/widgets/chord-finder'
import type { ChordFinderView } from '../model/chord-finder-view'
import { useChordFinder } from '../model/use-chord-finder'

/**
 * The Chord finder's settings, in a sheet off its bar: the key it spells in, then its on-or-offs as
 * tiles: whether it remembers the chords played, names an inversion over its bass, shows the keys a
 * chord is in, and paints the key's scale on the keys.
 */
function FinderSettings({
  finder,
  view,
  onKey,
  onScale,
}: {
  finder: ReturnType<typeof useChordFinder>
  view: ChordFinderView
  onKey: (key: ChordFinderView['key']) => void
  onScale: (shown: boolean) => void
}) {
  const { t } = useTranslation('practice')
  return (
    <Sheet>
      {/* The key it spells in, in sight on the button that opens its settings, printed as a chord
          is. */}
      <SheetTrigger
        render={
          <Button
            variant="bar"
            aria-label={t('chordFinder.settings')}
            title={t('chordFinder.settings')}
            className="rounded-full px-3"
          />
        }
      >
        <SlidersHorizontal aria-hidden />
        <span aria-hidden className="font-display font-semibold">
          {printedSymbol(keySymbol(finder.musicKey))}
        </span>
      </SheetTrigger>
      <SheetContent title={t('chordFinder.settings')}>
        <div className="flex flex-col gap-5 pt-2">
          <KeyChoice value={view.key} onChange={onKey} />
          <ToggleGrid label={t('chordFinder.settings')}>
            <ToggleTile
              icon={History}
              label={t('chordFinder.remember')}
              tip={t('chordFinder.rememberDetail', { count: REMEMBERED_CHORDS })}
              pressed={finder.remember}
              onPressedChange={finder.setRemember}
            />
            <ToggleTile
              glyph="C/E"
              label={t('chordFinder.slash')}
              pressed={finder.slash}
              onPressedChange={finder.setSlash}
            />
            <ToggleTile
              icon={KeyRound}
              label={t('chordFinder.inKeysShown')}
              pressed={finder.inKeys}
              onPressedChange={finder.setInKeys}
            />
            <ToggleTile
              icon={Piano}
              label={t('chordFinder.scaleShown')}
              tip={t('chordFinder.scaleShownDetail')}
              pressed={view.scale === true}
              onPressedChange={onScale}
            />
          </ToggleGrid>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/**
 * The Chord finder (ADR 0052), a tool of its own: a chord played on a MIDI keyboard or tapped on the
 * keys is named at once, as large as the page allows, in every reading it has, its keys marked by
 * degree, in the middle of one stage over the grand staff that writes it, spelled in the key chosen,
 * and where the chords are remembered those played before it; then the keys that hold it. What the learner turns off is
 * gone. Play, floating in the thumb's reach, hears it; the dial beside it opens it in Chords or
 * clears the keys. Its settings are a sheet off its bar.
 */
export function ChordFinderPage() {
  const { t } = useTranslation(['practice', 'music', 'common'])
  const view = useSearch({ from: '/shell/practice/chord-finder' })
  const change = useViewChange<ChordFinderView>()
  const finder = useChordFinder(view)
  const playback = usePlayback<'chord'>()
  const { keys, finding } = finder
  const reading = finding.kind === 'chord' ? readingAt(finding.readings, finder.reading) : undefined
  // Chords shows a chord over its bass only to its 3rd inversion and in four notes or fewer: a chord it
  // would show over another bass (C9/E as C9) is not offered.
  const opensInChords = reading !== undefined && (!reading.bass || reading.inversion !== undefined)
  const play = () => playback.toggle('chord', () => chordSounds(keys, { arpeggio: false }))
  usePlayKey(play, keys.length > 0)
  const { folded } = useFoldKeys('playing')
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('practice:pages.chordFinder')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        actions={
          <div className="flex gap-2">
            <MidiButton />
            <FinderSettings
              finder={finder}
              view={view}
              onKey={(key) => change({ key })}
              onScale={(shown) => change({ scale: shown ? true : undefined })}
            />
          </div>
        }
      />
      <PinnedKeyboard
        screen="playing"
        shown={{
          keys,
          marks: new Map([
            ...(view.scale ? scaleOverlay(finder.musicKey) : []),
            ...(reading ? readingMarks(reading, keys) : []),
          ]),
        }}
        selected={finder.tapped}
        onKeyPress={finder.tap}
      />
      {/* One stage, in the middle: the chord's name over the grand staff that writes it. */}
      <section
        aria-live="polite"
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 card px-4 pt-6 pb-4 text-center sm:px-8"
      >
        <ChordName
          finding={finding}
          keys={keys}
          source={finder.source}
          reading={finder.reading}
          onReading={finder.setReading}
          slash={finder.slash}
          keysFolded={folded}
        />
        <ChordTrail
          chords={finder.staff}
          musicKey={finder.musicKey}
          remember={finder.remember}
          slash={finder.slash}
          chosen={{ keys, at: finder.reading }}
        />
      </section>
      {finder.inKeys && reading ? (
        <div className="mx-auto w-full max-w-3xl">
          <ChordKeys found={reading} />
        </div>
      ) : null}
      <FloatingActions>
        {reading || finder.canClear || finder.canForget ? (
          <SpeedDial>
            {reading && opensInChords ? (
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
            {finder.canClear ? (
              <SpeedDialAction
                label={t('practice:chordFinder.clear')}
                icon={Eraser}
                onClick={finder.clear}
              />
            ) : null}
            {finder.canForget ? (
              <SpeedDialAction
                label={t('practice:chordFinder.forget')}
                icon={ListX}
                onClick={finder.forget}
              />
            ) : null}
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
