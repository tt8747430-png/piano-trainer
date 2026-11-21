import { Link, useSearch } from '@tanstack/react-router'
import { Eraser, Music2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PinnedKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { useKeyName } from '@/shared/i18n'
import { partsParams, useSetSearch } from '@/shared/lib'
import { keyFromParam, keyParam, keysAround, noteParam } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import {
  FloatingPiece,
  FloatingPieceLink,
  GroupLink,
  GroupRows,
  KeyPicker,
  Sheet,
  SheetContent,
  usePlayKey,
} from '@/shared/ui'
import { PianoButton, SettingsGear } from '@/widgets/practice-pages'
import { ToolPage } from '@/widgets/tool-page'
import { scaleOverlay } from '../model/scale-overlay'
import {
  ChordKeys,
  ChordName,
  ChordNotes,
  ChordReadings,
  ChordTrail,
  readingAt,
  readingMarks,
  useChordNumeral,
  useKeysHolding,
} from '@/widgets/chord-finder'
import type { ChordFinderView } from '../model/chord-finder-view'
import { useChordFinder } from '../model/use-chord-finder'
import { ChordFinderSettings } from './ChordFinderSettings'

/** The keys the boards draw: C3 to C5 across a phone, C2 to C6 across a laptop, grown when a chord reaches past them. */
const FINDER_KEYS = keysAround(60, [12, 12], [24, 24])

/** The chords an empty Chord finder offers to try (R32), as its URL writes keys: C, Am7, D7. */
const TRY = [
  ['major', '60-64-67'],
  ['minor7', '57-60-64-67'],
  ['dominant7', '62-66-69-72'],
] as const

/**
 * The Chord finder (ADR 0052; canvas 181), a tool on Practice in the Practice pages' language: the
 * keys edge to edge under the bar, the input, marked by degree; the chord's name large at the left
 * with what it is in words, and Spelled in, the key it is spelled in; its notes as tiles with their
 * degrees; then, under it on a phone and beside it on a laptop, one group: Also read as, Played (where
 * the chords are remembered), In these keys (a sheet of the keys that hold it), Forget the chords
 * played. One floating bar: Clear · Play (the honey one) · Chords (open it there). Empty, the name
 * says what to do and three chords are offered to try. Its settings are a page off its gear.
 */
export function ChordFinderPage() {
  const { t } = useTranslation(['practice', 'music'])
  const view = useSearch({ from: '/shell/practice/chord-finder' })
  const change = useSetSearch<ChordFinderView>()
  const finder = useChordFinder(view)
  const playback = usePlayback<'chord'>()
  const keyName = useKeyName()
  const [keysOpen, setKeysOpen] = useState(false)
  const { keys, finding } = finder
  const reading = finding.kind === 'chord' ? readingAt(finding.readings, finder.reading) : undefined
  const holding = useKeysHolding(finder.inKeys ? reading : undefined)
  // Imaj7 in C major: the chord's numeral leads the key it is spelled in, that key's one home.
  const numeral = useChordNumeral(reading, finder.musicKey)
  // Chords shows a chord over its bass only to its 3rd inversion and in four notes or fewer: a chord it
  // would show over another bass (C9/E as C9) is not offered.
  const opensInChords = reading !== undefined && (!reading.bass || reading.inversion !== undefined)
  const play = () => playback.toggle('chord', () => chordSounds(keys, { arpeggio: false }))
  usePlayKey(play, keys.length > 0)
  const { folded } = useFoldKeys('playing')
  const trail = finder.remember ? (
    <ChordTrail
      chords={finder.staff}
      musicKey={finder.musicKey}
      slash={finder.slash}
      chosen={{ keys, at: finder.reading }}
    />
  ) : null
  const rows = (finding.kind === 'chord' && finding.readings.length > 1) || holding.length > 0
  return (
    <ToolPage
      title={t('practice:pages.chordFinder')}
      start
      column={880}
      actions={<PianoButton screen="playing" />}
      settings={
        <SettingsGear title={t('practice:chordFinder.settings')}>
          <ChordFinderSettings canForget={finder.canForget} onForget={finder.forget} />
        </SettingsGear>
      }
      keys={
        <PinnedKeyboard
          place="top"
          className="mt-2"
          least={FINDER_KEYS}
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
          ? { label: t('music:play'), playing: playback.playing === 'chord', onToggle: play }
          : undefined
      }
      bar={
        keys.length > 0 ? (
          <FloatingPiece
            label={t('practice:chordFinder.clear')}
            caption={t('practice:chordFinder.clearShort')}
            onClick={finder.clear}
          >
            <Eraser aria-hidden />
          </FloatingPiece>
        ) : undefined
      }
      after={
        reading && opensInChords ? (
          <FloatingPieceLink
            label={t('practice:chordFinder.open')}
            caption={t('practice:chordFinder.openShort')}
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
            <Music2 aria-hidden />
          </FloatingPieceLink>
        ) : undefined
      }
      side={
        rows ? (
          <GroupRows surface="sheet">
            {finding.kind === 'chord' ? (
              <ChordReadings
                readings={finding.readings}
                reading={finder.reading}
                slash={finder.slash}
                onReading={finder.setReading}
              />
            ) : null}
            {trail}
            {holding.length > 0 ? (
              <GroupLink
                label={t('practice:chordFinder.inKeys')}
                value={holding.map(({ key }) => keyName(key)).join(', ')}
                onClick={() => setKeysOpen(true)}
              />
            ) : null}
          </GroupRows>
        ) : null
      }
    >
      <div aria-live="polite" className="flex flex-col gap-3">
        <ChordName
          finding={finding}
          keys={keys}
          reading={finder.reading}
          slash={finder.slash}
          keysFolded={folded}
        />
        <KeyPicker
          className="self-start"
          label={
            numeral
              ? t('practice:chordFinder.numeralPicker', { numeral })
              : t('practice:chordFinder.spelledIn')
          }
          value={keyFromParam(view.key)}
          onChange={(key) => change({ key: keyParam(key) })}
        />
      </div>
      {finding.kind === 'empty' ? (
        <ul aria-label={t('practice:chordFinder.tryLabel')} className="flex flex-wrap gap-2">
          {TRY.map(([name, chord]) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => change({ keys: chord })}
                className="h-11 rounded-pill bg-muted px-4 text-subhead font-semibold transition-colors hover:bg-muted-foreground/15"
              >
                {t(`practice:chordFinder.try.${name}`)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {reading ? <ChordNotes found={reading} keys={keys} /> : null}
      {reading ? (
        <Sheet at={{}} open={keysOpen} onOpenChange={setKeysOpen}>
          <SheetContent title={t('practice:chordFinder.inKeys')}>
            <ChordKeys found={reading} />
          </SheetContent>
        </Sheet>
      ) : null}
    </ToolPage>
  )
}
