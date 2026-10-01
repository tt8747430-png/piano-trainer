import { Link } from '@tanstack/react-router'
import {
  ChartNoAxesColumnIncreasing,
  Ear,
  Footprints,
  KeyboardMusic,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PROGRESSIONS, STUDIES } from '@/entities/piece'
import { selectAllAnswers, selectPractised, useProgress } from '@/entities/progress'
import { myGaps, type TheoryQuiz } from '@/features/quiz'
import { localText, useLocale } from '@/shared/i18n'
import { RowGroup, RowLink, ScreenHeader, type Paint } from '@/shared/ui'
import { PieceList } from '@/widgets/piece-list'
import { OPEN_PLAINLY } from '@/shared/lib'

/** The Theory quizzes, each as a row with a tile of its kind: chords sand, scales sky, gaps lilac. */
const QUIZ_ROWS = [
  { quiz: 'build-chord', icon: KeyboardMusic, paint: 'sand' },
  { quiz: 'name-chord', icon: Ear, paint: 'sand' },
  { quiz: 'build-scale', icon: ChartNoAxesColumnIncreasing, paint: 'sky' },
  { quiz: 'gaps', icon: Target, paint: 'lilac' },
] as const satisfies readonly { quiz: TheoryQuiz; icon: LucideIcon; paint: Paint }[]

/** Practice: the Theory quizzes and the exercises, then the studies and progressions, each opening its page here. */
export function PracticePage() {
  const { t } = useTranslation(['practice', 'quiz'])
  const locale = useLocale()
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  const gaps = useMemo(() => myGaps(answers, practised).length, [answers, practised])
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('practice:title')} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div className="flex flex-col gap-8">
          <RowGroup title={t('practice:quiz')}>
            {QUIZ_ROWS.map(({ quiz, icon, paint }) => (
              <li key={quiz}>
                <RowLink
                  title={t(`quiz:modes.${quiz}`)}
                  detail={
                    quiz === 'gaps' && gaps > 0 ? t('practice:gaps', { count: gaps }) : undefined
                  }
                  icon={icon}
                  paint={paint}
                  render={<Link to="/practice/quiz/$quiz" params={{ quiz }} />}
                />
              </li>
            ))}
          </RowGroup>
          <RowGroup title={t('practice:exercises')}>
            <li>
              <RowLink
                title={t('practice:chromatic')}
                icon={Footprints}
                paint="lilac"
                render={<Link to="/play/chromatic" state={OPEN_PLAINLY} />}
              />
            </li>
          </RowGroup>
        </div>
        <PieceList
          groups={[STUDIES, PROGRESSIONS].map((collection) => ({
            id: collection.id,
            heading: localText(collection.name, locale),
            entries: collection.entries,
          }))}
        />
      </div>
    </div>
  )
}
