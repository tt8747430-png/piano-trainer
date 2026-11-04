import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SONG_VERSIONS, type SongVersion } from '@/features/practice'
import { cn } from '@/shared/lib'
import { Sheet, SheetContent } from '@/shared/ui'

/** How hard each version is to play, out of three: the row's dots. */
const DIFFICULTY: Readonly<Record<SongVersion, number>> = { original: 3, simple: 2, easy: 1 }

/** A group of the sheet: whose music, and with or without the song's voice. */
type Group = 'own' | 'solo' | 'voice'

/** What the sheet chooses at once: a group's music at a level. */
export interface VersionChoice {
  readonly group: Group
  readonly version: SongVersion
}

/** The difficulty's three dots, as many filled as it is hard. */
function Dots({ level }: { level: number }) {
  return (
    <span aria-hidden className="flex gap-0.5">
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={cn('size-1.5 rounded-full', dot <= level ? 'bg-primary' : 'bg-muted')}
        />
      ))}
    </span>
  )
}

/**
 * The Version sheet (R29 B8, "Choose your version"): the song's versions in groups that fold, the
 * learner's own version first where they have one, then the app's for the piano alone and, where the
 * song has a tune's staff, the piano with the voice; in each, Original, Simplified (every chord its
 * plain triad, greyed where none would change) and Easy (the tune over each chord's root), each with
 * its difficulty. The one playing is checked; a row chosen plays it and the sheet closes.
 */
export function VersionSheet({
  open,
  onOpenChange,
  chosen,
  own,
  voice,
  simplifies,
  onChoose,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
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
  const groups: readonly Group[] = [
    ...(own ? ['own' as const] : []),
    'solo',
    ...(voice ? ['voice' as const] : []),
  ]
  const [folded, setFolded] = useState<ReadonlySet<Group>>(new Set())
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('version.title')}>
        <div className="flex flex-col gap-4">
          {groups.map((group) => {
            const isOpen = !folded.has(group)
            return (
              <section key={group} className="card flex flex-col px-2 py-2">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    className="flex min-h-11 w-full items-center justify-between rounded-control px-3 text-left font-semibold hover:bg-muted"
                    onClick={() =>
                      setFolded((was) => {
                        const next = new Set(was)
                        if (next.has(group)) next.delete(group)
                        else next.add(group)
                        return next
                      })
                    }
                  >
                    {t(`version.group.${group}`)}
                    <ChevronDown
                      aria-hidden
                      className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
                    />
                  </button>
                </h3>
                {isOpen ? (
                  <ul className="flex flex-col">
                    {SONG_VERSIONS.map((version) => {
                      const current = chosen.group === group && chosen.version === version
                      const greyed = version === 'simple' && !simplifies
                      return (
                        <li key={version}>
                          <button
                            type="button"
                            aria-pressed={current}
                            disabled={greyed}
                            title={greyed ? t('simplify.none') : undefined}
                            className="flex min-h-12 w-full items-center gap-3 rounded-control px-3 py-2 text-left hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
                            onClick={() => {
                              onChoose({ group, version })
                              onOpenChange(false)
                            }}
                          >
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span>{t(`version.level.${version}`)}</span>
                              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Dots level={DIFFICULTY[version]} />
                                {t('version.row', {
                                  n: DIFFICULTY[version],
                                  accompaniment: t(`version.accompaniment.${version}`),
                                })}
                              </span>
                            </span>
                            {current ? <Check aria-hidden className="size-5 text-primary" /> : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </section>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
