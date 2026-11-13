import { useParams, useSearch } from '@tanstack/react-router'
import { PencilLine } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useCan } from '@/entities/library'
import { journeyById, type Journey } from '@/entities/lesson'
import { localText, useLocale } from '@/shared/i18n'
import { useSetSearch } from '@/shared/lib'
import { BackButton, MoreMenu, ScreenHeader } from '@/shared/ui'
import { ContinueAction } from '@/widgets/continue-action'
import { LevelEditor, LevelLessons, LevelNav, type LearnEdit } from '@/widgets/curriculum'

/**
 * A level's page (canvas 163), opened from Learn's Levels: its book's name in the bar with Back to
 * Learn; how much of it is learned, its goal, then its chapters as the line of lessons. A laptop's
 * side holds Continue and the other levels. An editor's Edit is in its More and puts the level in
 * Edit mode in place (R29 B4).
 */
export function LevelPage() {
  const { levelId } = useParams({ from: '/shell/levels/$levelId' })
  const journey = journeyById(levelId)
  // The route finds no level that is not there.
  return journey ? <Level key={journey.id} journey={journey} /> : null
}

function Level({ journey }: { journey: Journey }) {
  const { t } = useTranslation('common')
  const locale = useLocale()
  const { edit } = useSearch({ from: '/shell/levels/$levelId' })
  const show = useSetSearch<LearnEdit>()
  const editable = useCan('reorder', { curriculum: 'level' })
  const editing = edit && editable
  const bar = (actions: ReactNode) => (
    <ScreenHeader
      title={localText(journey.title, locale)}
      large
      back={editing ? undefined : <BackButton />}
      tools={actions}
      edit={
        editing
          ? { editing, onEdit: () => show({ edit: true }), onDone: () => show({ edit: false }) }
          : undefined
      }
      more={
        editing ? undefined : (
          <MoreMenu
            actions={[
              {
                key: 'edit',
                label: t('editMode.edit'),
                icon: PencilLine,
                hidden: !editable,
                onSelect: () => show({ edit: true }),
              },
            ]}
          />
        )
      }
    />
  )
  if (editing)
    return (
      <div className="flex flex-col pb-8">
        <LevelEditor journey={journey} bar={bar} />
      </div>
    )
  return (
    <div className="flex flex-col pb-8">
      {bar(null)}
      <div className="mt-2 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem]">
        <LevelLessons journey={journey} />
        <aside className="hidden lg:sticky lg:top-4 lg:flex lg:flex-col lg:gap-6">
          <ContinueAction />
          <LevelNav current={journey.id} />
        </aside>
      </div>
    </div>
  )
}
