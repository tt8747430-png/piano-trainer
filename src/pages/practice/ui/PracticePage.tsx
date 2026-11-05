import { useTranslation } from 'react-i18next'
import { EXERCISES } from '@/entities/exercise'
import { selectExercised, useProgress } from '@/entities/progress'
import { useSettings } from '@/entities/settings'
import { ScreenHeader, SettingsGroup } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import {
  isPracticePageId,
  PageRow,
  PRACTICE_GROUPS,
  type PracticePageId,
} from '@/widgets/practice-pages'
import { GapsBadge, useGapsCount } from '@/widgets/trainer-list'
import { upNext } from '../model/up-next'
import { ToolTiles } from './ToolTiles'
import { UpNext } from './UpNext'

/** The groups listed as rows, in two columns from a laptop's width: Theory, then Playing and Training. */
const COLUMNS = [['theory'], ['playing', 'training']] as const
const TOOLS = PRACTICE_GROUPS.find((group) => group.id === 'tools')?.pages ?? []
/** The exercise a new learner starts with: the first of the finger technique book. */
const FIRST_EXERCISE = EXERCISES.find((exercise) => exercise.group === 'technique')?.id

/**
 * Practice (ADR 0052, R32), ordered by relevance as a practice home is: its purpose in one line; Up
 * next, what the learner's own record says is next (skills due, the exercise to resume, the page last
 * opened), or Start here; then Theory, Playing and Training, each one card of rows (its tile, name and
 * one line), two columns on a laptop; the Tools last, as tiles showing what each is set to.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const gaps = useGapsCount()
  const exercised = useProgress(selectExercised)
  const recent = useSettings((state) => state.practiceRecent).filter(isPracticePageId)
  const cards = upNext({ gaps, exercised, recent, firstExercise: FIRST_EXERCISE })
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <ScreenHeader title={t('title')} large tools={<PlaceActions />} />
        <p className="px-1 text-pretty text-muted-foreground">{t('purpose')}</p>
      </div>
      <UpNext cards={cards} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {COLUMNS.map((column) => (
          <div key={column.join()} className="flex flex-col gap-6">
            {column.map((id) => {
              const group = PRACTICE_GROUPS.find((each) => each.id === id)
              return group ? (
                <SettingsGroup key={group.id} title={t(`groups.${group.id}`)} flush>
                  <ul className="flex flex-col">
                    {group.pages.map((page: PracticePageId) => (
                      <li key={page}>
                        {/* The Quiz row says how many skills wait to be checked, behind the gap's dot. */}
                        <PageRow
                          page={page}
                          trailing={
                            page === 'quiz' && gaps > 0 ? <GapsBadge count={gaps} /> : undefined
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </SettingsGroup>
              ) : null
            })}
          </div>
        ))}
      </div>
      <ToolTiles pages={TOOLS} />
    </div>
  )
}
