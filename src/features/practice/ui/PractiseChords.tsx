import { Link } from '@tanstack/react-router'
import { Footprints, ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { COMMON_PROGRESSIONS } from '@/entities/piece'
import {
  noteName,
  noteParam,
  scaleHasChords,
  sizeOfNotes,
  type ChordNotes,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import { WALK } from '../walk'

/** The kinds that are a key's scale, and so have its common progressions: major, and the three minors. */
const KEY_OF: Readonly<Partial<Record<ScaleKind, 'major' | 'minor'>>> = {
  major: 'major',
  natural: 'minor',
  harmonic: 'minor',
  melodic: 'minor',
}

/**
 * A scale's chords to practise in the Player, each row opening it there in this key: walked up and
 * down, and for a major or minor key its common progressions, with a song's patterns.
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
  const { t } = useTranslation(['practice', 'music'])
  if (!scaleHasChords(kind)) return null
  const chordSize = sizeOfNotes(notes)
  const key = KEY_OF[kind]
  return (
    <RowGroup title={t('practice:inPlayer')}>
      <li>
        <RowLink
          title={t('practice:walk')}
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
      {key
        ? COMMON_PROGRESSIONS[key].map((piece) => (
            <li key={piece.id}>
              <RowLink
                title={piece.title}
                detail={t(`music:key.${key}`, { tonic: noteName(root) })}
                icon={ListMusic}
                paint="lilac"
                render={
                  <Link
                    to="/play/$pieceId"
                    params={{ pieceId: piece.id }}
                    search={{
                      key: noteParam(root),
                      ...(piece.kind === 'progression' && piece.chordSize.choosable
                        ? { chordSize }
                        : {}),
                    }}
                  />
                }
              />
            </li>
          ))
        : null}
    </RowGroup>
  )
}
