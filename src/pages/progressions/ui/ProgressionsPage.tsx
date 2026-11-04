import { Link, useSearch } from '@tanstack/react-router'
import { PencilLine, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { libraryProgression } from '@/entities/progression-library'
import { useSetSearch } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { keyFromParam } from '@/shared/lib/music'
import {
  BackButton,
  ButtonLink,
  RoundButton,
  RoundLink,
  ScreenHeader,
  Segmented,
} from '@/shared/ui'
import { NewProgressionSheet } from '@/widgets/content-editor'
import { SettingsGear } from '@/widgets/practice-pages'
import {
  PROGRESSIONS_TABS,
  ProgressionExplorer,
  type ProgressionsView,
} from '@/widgets/progression-explorer'

/**
 * Progressions: one from the library or typed, in any key, played and sent to the Player; an
 * editor's bar edits the library's progression in sight and makes a new one.
 */
export function ProgressionsPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/progressions' })
  const onChange = useSetSearch<ProgressionsView>()
  const { account } = useAccount()
  const [newOne, setNewOne] = useState(false)
  // The library's progression in sight, an editor's to edit.
  const shown = libraryProgression(view.p, keyFromParam(view.key).minor)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.progressions')}
        back={<BackButton />}
        tools={
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
              <RoundButton
                label={t('progressions.edit.new')}
                icon={Plus}
                onClick={() => setNewOne(true)}
              />
            </>
          ) : null
        }
        settings={<SettingsGear page="progressions" />}
      />
      {/* What is shown of the one progression: in the page, never a second bar row (R29-P1). */}
      <Segmented
        label={t('pages.progressions')}
        value={view.tab ?? 'progression'}
        options={PROGRESSIONS_TABS.map((tab) => ({
          value: tab,
          label: t(`progressions.tabs.${tab}`),
        }))}
        onChange={(tab) => onChange({ tab: tab === 'progression' ? undefined : tab })}
      />
      <ProgressionExplorer view={view} onChange={onChange} />
      {/* The Chord player plays the same chords in a style (R29 CP1): each page opens the other. */}
      {view.tab === undefined ? (
        <ButtonLink
          variant="outline"
          size="lg"
          className="self-start"
          render={<Link to="/practice/chord-player" search={{ p: view.p, key: view.key }} />}
        >
          {t('progressions.inChordPlayer')}
        </ButtonLink>
      ) : null}
      {editsContent(account) ? (
        <NewProgressionSheet open={newOne} onOpenChange={setNewOne} />
      ) : null}
    </div>
  )
}
