import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SONG_VERSIONS, type SongVersion } from '@/features/practice'
import { cn } from '@/shared/lib'
import { Labelled, Segmented, Sheet, SheetContent } from '@/shared/ui'

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
          className={cn('size-1.5 rounded-pill', dot <= level ? 'bg-primary' : 'bg-muted')}
        />
      ))}
    </span>
  )
}

/**
 * The Version sheet (R29 B8, R31-P): at its head the arrangement, where the song has more than one
 * (the learner's own version first, the piano alone, the piano with the voice where the song has a
 * tune's staff), changed at once; then the three levels, each with its difficulty and one plain line:
 * Original, Simplified (every chord its plain triad; where none would change, its line says so and
 * it cannot be chosen) and Easy. The one playing is checked; a level chosen plays it and the sheet
 * closes.
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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('version.title')}>
        <div className="flex flex-col gap-5">
          {groups.length > 1 ? (
            <Labelled label={t('version.arrangement')}>
              <Segmented
                label={t('version.arrangement')}
                value={chosen.group}
                options={groups.map((group) => ({ value: group, label: t(`version.group.${group}`) }))}
                onChange={(group) => onChoose({ group, version: chosen.version })}
              />
            </Labelled>
          ) : null}
          <ul className="card flex flex-col divide-y divide-hairline overflow-hidden">
            {SONG_VERSIONS.map((version) => {
              const current = chosen.version === version
              const same = version === 'simple' && !simplifies
              return (
                <li key={version}>
                  <button
                    type="button"
                    aria-pressed={current}
                    disabled={same}
                    className="flex min-h-16 w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted disabled:hover:bg-transparent"
                    onClick={() => {
                      onChoose({ group: chosen.group, version })
                      onOpenChange(false)
                    }}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex items-center gap-2.5 text-base font-semibold">
                        {t(`version.level.${version}`)}
                        <Dots level={DIFFICULTY[version]} />
                        <span className="sr-only">
                          {t('version.difficulty', { n: DIFFICULTY[version] })}
                        </span>
                      </span>
                      <span className="text-sm text-pretty text-muted-foreground">
                        {same ? t('version.alreadySimple') : t(`version.about.${version}`)}
                      </span>
                    </span>
                    {current ? <Check aria-hidden className="size-5 text-primary" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
