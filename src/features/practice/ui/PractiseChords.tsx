import { Link } from '@tanstack/react-router'
import { Footprints } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { COMMON_PROGRESSIONS, libraryParam } from '@/entities/progression-library'
import { localText, useLocale } from '@/shared/i18n'
import {
  circleKey,
  keyMode,
  keyParam,
  noteParam,
  numeralText,
  parseNumerals,
  pitchClassOf,
  scaleHasChords,
  sizeOfNotes,
  type ChordNotes,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { PAGE_TILES, RowGroup, RowLink } from '@/shared/ui'
import { WALK } from '../walk'

/**
 * What a scale's chords are practised in: walked up and down in the Player, and for a major or minor
 * key its common progressions, each opening Progressions in this key at the chord size shown.
 */
export function PractiseChords({
  root,
  kind,
  notes,
}: {
  root: SpelledNote
  kind: ScaleKind
  notes: ChordNotes
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  if (!scaleHasChords(kind)) return null
  const chordSize = sizeOfNotes(notes)
  // A key's scale has its key's common progressions; a mode has none.
  const mode = keyMode(kind)
  return (
    <>
      <RowGroup title={t('inPlayer')}>
        <li>
          <RowLink
            title={t('walk')}
            icon={Footprints}
            paint="lilac"
            render={
              <Link
                to="/play/walk"
                search={{
                  root: noteParam(root),
                  kind,
                  ...(chordSize === WALK.chordSize ? {} : { chordSize }),
                }}
              />
            }
          />
        </li>
      </RowGroup>
      {mode ? (
        <RowGroup title={t('keyProgressions')}>
          {COMMON_PROGRESSIONS[mode].map((progression) => (
            <li key={progression.id}>
              <RowLink
                title={localText(progression.name, locale)}
                detail={(parseNumerals(progression.numerals) ?? []).map(numeralText).join('–')}
                {...PAGE_TILES.progressions}
                render={
                  <Link
                    to="/practice/progressions"
                    search={{
                      key: keyParam(circleKey(pitchClassOf(root), progression.minor)),
                      p: libraryParam(progression),
                      size: chordSize === 'triads' ? (progression.size ?? chordSize) : chordSize,
                    }}
                  />
                }
              />
            </li>
          ))}
        </RowGroup>
      ) : null}
    </>
  )
}
