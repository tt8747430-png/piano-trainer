import { Link, useSearch } from '@tanstack/react-router'
import { PencilLine, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { libraryProgression } from '@/entities/progression-library'
import { useViewChange } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { keyFromParam } from '@/shared/lib/music'
import { BackButton, RoundLink, ScreenHeader } from '@/shared/ui'
import { ProgressionExplorer, type ProgressionsView } from '@/widgets/progression-explorer'

/**
 * Progressions: one from the library or typed, in any key, played and sent to the Player; an
 * editor's bar edits the library's progression in sight and makes a new one.
 */
export function ProgressionsPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/progressions' })
  const onChange = useViewChange<ProgressionsView>()
  const { account } = useAccount()
  // The library's progression in sight, an editor's to edit.
  const shown = libraryProgression(view.p, keyFromParam(view.key).minor)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.progressions')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        actions={
          editsContent(account) ? (
            <>
              {shown ? (
                <RoundLink
                  label={t('progressions.edit.open')}
                  icon={PencilLine}
                  render={
                    <Link
                      to="/practice/progressions/$progressionId/edit"
                      params={{ progressionId: shown.id }}
                    />
                  }
                />
              ) : null}
              <RoundLink
                label={t('progressions.edit.new')}
                icon={Plus}
                render={<Link to="/practice/progressions/new" />}
              />
            </>
          ) : undefined
        }
      />
      <ProgressionExplorer view={view} onChange={onChange} />
    </div>
  )
}
