import { Link, useSearch } from '@tanstack/react-router'
import { Eraser, ListX, Music2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { PinnedKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { partsParams, useSetSearch } from '@/shared/lib'
import { keyFromParam, keyParam, noteParam } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { KeyPicker, SpeedDial, SpeedDialAction, usePlayKey } from '@/shared/ui'
import { ToolPage } from '@/widgets/tool-page'
import { scaleOverlay } from '../model/scale-overlay'
import { ChordKeys, ChordName, ChordTrail, readingAt, readingMarks } from '@/widgets/chord-finder'
import type { ChordFinderView } from '../model/chord-finder-view'
import { useChordFinder } from '../model/use-chord-finder'

/**
 * The Chord finder (ADR 0052), a tool on Practice's Tools on their one layout (R29 B11): a chord played on a MIDI keyboard or tapped on the
 * keys is named at once, as large as the page allows, in every reading it has, its keys marked by
 * degree, in the middle of one stage over the grand staff that writes it, spelled in the key chosen,
 * and where the chords are remembered those played before it; then the keys that hold it. What the learner turns off is
 * gone. Play, floating in the thumb's reach, hears it; the dial beside it opens it in Chords or
 * clears the keys. The key it spells in is over the stage; its settings are a page off its gear (A24).
 */
export function ChordFinderPage() {
  const { t } = useTranslation(['practice', 'music'])
  const view = useSearch({ from: '/shell/practice/chord-finder' })
  const change = useSetSearch<ChordFinderView>()
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
    <ToolPage
      title={t('practice:pages.chordFinder')}
      actions={<MidiButton />}
      settings={<Link to="/settings/chord-finder" search={{ from: 'chord-finder' }} />}
      keys={
        <PinnedKeyboard
          screen="playing"
          shown={{
            keys,
            marks: new Map([
              ...(finder.scale ? scaleOverlay(finder.musicKey) : []),
              ...(reading ? readingMarks(reading, keys) : []),
            ]),
          }}
          selected={finder.tapped}
          onKeyPress={finder.tap}
        />
      }
      play={
        keys.length > 0
          ? {
              label: t('music:play'),
              playing: playback.playing === 'chord',
              onToggle: play,
            }
          : undefined
      }
      dial={
        reading || finder.canClear || finder.canForget ? (
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
        ) : undefined
      }
      controls={
        finder.inKeys && reading ? (
          <div className="mx-auto w-full max-w-3xl">
            <ChordKeys found={reading} />
          </div>
        ) : undefined
      }
    >
      {/* The key it spells in: what the page shows, so here, over the stage. */}
      <KeyPicker
        value={keyFromParam(view.key)}
        onChange={(key) => change({ key: keyParam(key) })}
        className="mx-auto"
      />
      {/* One stage, in the middle: the chord's name over the grand staff that writes it. */}
      <div
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
      </div>
    </ToolPage>
  )
}
