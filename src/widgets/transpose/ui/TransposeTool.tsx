import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { ChordRow, RowChords, RowPlay, RowStaff, useShownKeys } from '@/features/play-example'
import { useKeyName } from '@/shared/i18n'
import {
  keyParam,
  noteParam,
  numeralsParam,
  numeralText,
  readChordLine,
  writtenKeyAccidentals,
  type Numeral,
} from '@/shared/lib/music'
import {
  Labelled,
  NO_KEYS,
  NoteChoice,
  PAGE_TILES,
  RowGroup,
  RowLink,
  Segmented,
} from '@/shared/ui'
import type { TransposeView } from '../model/transpose-view'
import { transposition } from '../model/transposition'
import { ChordsField } from './ChordsField'

/**
 * Transpose (ADR 0045), read top to bottom: a song's chords typed; the keys they may be in, the one
 * they are read in; the chords as a row in the key played, each under its numeral and said where it
 * is out of the key, played on the keys pinned above; the tonic they are played on; and their degrees
 * opened on Progressions.
 */
export function TransposeTool({
  view,
  onChange,
}: {
  view: TransposeView
  onChange: (change: Partial<TransposeView>) => void
}) {
  const { t } = useTranslation('practice')
  const keyName = useKeyName()
  const [shown, setShown] = useShownKeys(`${view.chords} ${view.key} ${view.to}`, NO_KEYS)
  const { chords } = readChordLine(view.chords)
  const shownChords = transposition(chords, view)
  const numerals = shownChords?.chords.map(({ numeral }) => numeral)
  const degrees = numerals?.every((numeral): numeral is Numeral => numeral !== null)
    ? numerals
    : null
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={shown} />
      <ChordsField chords={view.chords} onChange={(next) => onChange({ chords: next })} />
      {shownChords ? (
        <>
          <div className="grid-fields gap-x-10 gap-y-5">
            <Labelled label={t('transpose.readIn')}>
              <div className="flex flex-col gap-2">
                <Segmented
                  label={t('transpose.readIn')}
                  value={keyParam(shownChords.read.key)}
                  options={shownChords.keys.map(({ key }) => ({
                    value: keyParam(key),
                    label: keyName(key),
                  }))}
                  onChange={(key) => onChange({ key })}
                />
                <p className="text-sm text-muted-foreground">
                  {t('transpose.held', { held: shownChords.read.held, count: chords.length })}
                </p>
              </div>
            </Labelled>
          </div>
          <ChordRow
            chords={shownChords.chords.map(({ chord, numeral, inKey }) => ({
              chord,
              ...(numeral ? { caption: numeralText(numeral) } : {}),
              ...(inKey ? {} : { detail: t('transpose.outside') }),
            }))}
            onShow={setShown}
          >
            <RowChords />
            <RowStaff />
            <RowPlay variant="default" />
          </ChordRow>
          <div className="grid-fields gap-x-10 gap-y-5">
            <NoteChoice
              label={t('transpose.playIn')}
              value={noteParam(shownChords.to.tonic)}
              accidentals={(letter) => writtenKeyAccidentals(letter, shownChords.read.key.minor)}
              name={(tonic) => keyName({ tonic, minor: shownChords.read.key.minor })}
              onChange={(to) =>
                onChange({ to: to === noteParam(shownChords.read.key.tonic) ? undefined : to })
              }
            />
          </div>
          {degrees ? (
            <RowGroup title={t('pages.progressions')}>
              <li>
                <RowLink
                  title={t('transpose.inProgressions')}
                  detail={degrees.map(numeralText).join(' ')}
                  {...PAGE_TILES.progressions}
                  render={
                    <Link
                      to="/practice/progressions"
                      search={{ key: keyParam(shownChords.to), p: numeralsParam(degrees) }}
                    />
                  }
                />
              </li>
            </RowGroup>
          ) : null}
        </>
      ) : (
        <p className="text-muted-foreground">{t('transpose.none')}</p>
      )}
    </div>
  )
}
