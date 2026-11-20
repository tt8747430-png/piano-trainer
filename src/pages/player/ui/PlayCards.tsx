import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { usePatternBook, type PatternChoice } from '@/entities/pattern'
import { type SongVersion } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { RadioCards, Segmented } from '@/shared/ui'
import { useSetup } from '@/widgets/player-setup'

/** The levels easiest first, as the board's Level reads (Beginner · Intermediate · Advanced). */
const LEVELS: readonly SongVersion[] = ['easy', 'simple', 'original']

/** A group of the song's music: whose it is, and with or without the song's voice. */
type VersionGroup = 'own' | 'solo' | 'voice'

/** What the Arrangement card chooses at once: a group's music at a level. */
export interface VersionChoice {
  readonly group: VersionGroup
  readonly version: SongVersion
}

/** The Arrangement card's facts: what it is set to, and what the song offers. */
export interface ArrangementChoice {
  readonly chosen: VersionChoice
  /** Whether the learner has their own version of this song. */
  readonly own: boolean
  /** Whether the song has a tune's staff, sung over the piano. */
  readonly voice: boolean
  /** Whether Simplified changes any chord of the music. */
  readonly simplifies: boolean
  readonly onChoose: (choice: VersionChoice) => void
}

/**
 * What you play, the head of the Player's Settings (owner, 2026-11-07: the Song gear; the PlayerApp
 * board): two radio cards, each holding its own choice. Arrangement, the song as it is arranged (its
 * own pattern), with its Level, easiest first, and, where the song has more than one, its Scoring (your
 * own version, the piano alone, the piano with the voice); Accompaniment, the song played from its
 * chords by a pattern you choose, its Pattern › opening the page of patterns and their hands. Choosing
 * Arrangement brings the song's own pattern back; choosing Accompaniment opens its page to pick one.
 */
export function PlayCards({
  arrangement,
  own,
  page,
}: {
  arrangement: ArrangementChoice | null
  /** The song's own pattern, as its Arrangement plays it. */
  own: PatternChoice
  /** The id of the Accompaniment page its Pattern opens; null where the music takes no pattern. */
  page: string | null
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const book = usePatternBook()
  const { figures, openPage, onFigures } = useSetup()
  const accompanied =
    page !== null && (figures.pattern !== own || figures.rh !== null || figures.lh !== null)
  const name =
    figures.pattern === 'chart'
      ? t('fromChart')
      : localText(book.require(figures.pattern).name, locale)
  type Card = 'arrangement' | 'accompaniment'
  return (
    <RadioCards<Card>
      label={t('version.whatYouPlay')}
      value={accompanied ? 'accompaniment' : 'arrangement'}
      onChange={(card) =>
        card === 'arrangement'
          ? onFigures({ pattern: own, rh: undefined, lh: undefined })
          : page !== null && openPage(page)
      }
      cards={[
        ...(arrangement
          ? [
              {
                value: 'arrangement' as const,
                label: t('version.arrangement'),
                open: true,
                // A level chosen is the Arrangement's, as the board picks it.
                children: (
                  <ArrangementRows
                    {...arrangement}
                    onChoose={(choice) => {
                      if (accompanied) onFigures({ pattern: own, rh: undefined, lh: undefined })
                      arrangement.onChoose(choice)
                    }}
                  />
                ),
              },
            ]
          : []),
        ...(page !== null
          ? [
              {
                value: 'accompaniment' as const,
                label: t('settingsPage.accompaniment'),
                open: true,
                children: (
                  <button
                    type="button"
                    data-setup-page={page}
                    onClick={() => openPage(page)}
                    className="flex min-h-12 w-full items-center justify-between gap-3 border-t border-border/70 px-4 py-2 text-left text-base transition-colors duration-200 ease-out hover:bg-foreground/4 focus-visible:-outline-offset-2"
                  >
                    <span>{t('pattern')}</span>
                    <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <span className="truncate">{name}</span>
                      <ChevronRight aria-hidden className="size-4.5 shrink-0" />
                    </span>
                  </button>
                ),
              },
            ]
          : []),
      ]}
    />
  )
}

/** The Arrangement's rows: its Scoring where the song has more than one, then its Level. */
function ArrangementRows({ chosen, own, voice, simplifies, onChoose }: ArrangementChoice) {
  const { t } = useTranslation('player')
  const groups: readonly VersionGroup[] = [
    ...(own ? ['own' as const] : []),
    'solo',
    ...(voice ? ['voice' as const] : []),
  ]
  return (
    <div className="flex flex-col">
      {groups.length > 1 ? (
        <Row label={t('version.scoring')}>
          <Segmented
            label={t('version.scoring')}
            value={chosen.group}
            options={groups.map((group) => ({ value: group, label: t(`version.group.${group}`) }))}
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
            reason: version === 'simple' && !simplifies ? t('version.alreadySimple') : undefined,
          }))}
          onChange={(version) => onChoose({ group: chosen.group, version })}
        />
      </Row>
    </div>
  )
}

/** A row of a card, as the board's: its name at the start, its choice taking the rest, 48 tall. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center gap-3 border-t border-border/70 py-2 ps-4 pe-2 max-sm:flex-wrap">
      <span className="shrink-0 text-base">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
