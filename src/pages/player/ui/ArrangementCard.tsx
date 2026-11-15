import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { type SongVersion } from '@/features/practice'
import { RadioCards, Segmented } from '@/shared/ui'

/** The levels easiest first, as the board's Level reads (Beginner · Intermediate · Advanced). */
const LEVELS: readonly SongVersion[] = ['easy', 'simple', 'original']

/** A group of the song's music: whose it is, and with or without the song's voice. */
export type VersionGroup = 'own' | 'solo' | 'voice'

/** What the card chooses at once: a group's music at a level. */
export interface VersionChoice {
  readonly group: VersionGroup
  readonly version: SongVersion
}

/**
 * What you play, the head of the Player's Settings (owner, 2026-11-07: the Song gear's Arrangement
 * card; the PlayerApp board): the card chosen, its Level in a row under it, easiest first, and,
 * where the song has more than one, its Scoring (your own version, the piano alone, the piano with
 * the voice). Simplified, where it would change no chord, cannot be chosen and says why.
 */
export function ArrangementCard({
  chosen,
  own,
  voice,
  simplifies,
  onChoose,
}: {
  chosen: VersionChoice
  /** Whether the learner has their own version of this song. */
  own: boolean
  /** Whether the song has a tune's staff, sung over the piano. */
  voice: boolean
  /** Whether Simplified changes any chord of the music. */
  simplifies: boolean
  onChoose: (choice: VersionChoice) => void
}) {
  const { t } = useTranslation('player')
  const groups: readonly VersionGroup[] = [
    ...(own ? ['own' as const] : []),
    'solo',
    ...(voice ? ['voice' as const] : []),
  ]
  return (
    <RadioCards
      label={t('version.arrangement')}
      value="arrangement"
      onChange={() => undefined}
      cards={[
        {
          value: 'arrangement',
          label: t('version.arrangement'),
          children: (
            <div className="flex flex-col border-t border-honey-ring/25">
              {groups.length > 1 ? (
                <Row label={t('version.scoring')}>
                  <Segmented
                    label={t('version.scoring')}
                    value={chosen.group}
                    options={groups.map((group) => ({
                      value: group,
                      label: t(`version.group.${group}`),
                    }))}
                    onChange={(group) => onChoose({ group, version: chosen.version })}
                  />
                </Row>
              ) : null}
              <Row label={t('version.levels')}>
                <Segmented
                  label={t('version.levels')}
                  value={chosen.version}
                  options={LEVELS.map((version) => ({
                    value: version,
                    label: t(`version.level.${version}`),
                    reason:
                      version === 'simple' && !simplifies ? t('version.alreadySimple') : undefined,
                  }))}
                  onChange={(version) => onChoose({ group: chosen.group, version })}
                />
              </Row>
            </div>
          ),
        },
      ]}
    />
  )
}

/** A row of the card: its name at the start, its choice taking the rest. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-3 py-1.5 ps-4 pe-1.5 max-sm:flex-wrap">
      <span className="shrink-0 text-[0.9375rem]">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
