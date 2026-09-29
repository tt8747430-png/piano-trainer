import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LEARN_TILES, RowGroup, RowLink, ScreenHeader } from '@/shared/ui'
import type { LearnFilter } from '../model/learn-filter'
import { LessonsColumn } from './LessonsColumn'

/** Learn: the lessons by module, filtered by level and category; beside them the references and tools. */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const filter = useSearch({ from: '/shell/learn' })
  const navigate = useNavigate({ from: '/learn' })
  const onChange = (change: Partial<LearnFilter>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('learn:title')} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <LessonsColumn filter={filter} onChange={onChange} />
        <div className="flex flex-col gap-8">
          <RowGroup title={t('learn:references')}>
            <li>
              <RowLink
                title={t('learn:chords')}
                {...LEARN_TILES.chords}
                render={<Link to="/learn/chords" />}
              />
            </li>
            <li>
              <RowLink
                title={t('learn:scales')}
                {...LEARN_TILES.scales}
                render={<Link to="/learn/scales" />}
              />
            </li>
            <li>
              <RowLink
                title={t('learn:keys.title')}
                {...LEARN_TILES.keys}
                render={<Link to="/learn/keys" />}
              />
            </li>
            <li>
              <RowLink
                title={t('learn:intervals.title')}
                {...LEARN_TILES.intervals}
                render={<Link to="/learn/intervals" />}
              />
            </li>
            <li>
              <RowLink
                title={t('learn:tensions.title')}
                {...LEARN_TILES.tensions}
                render={<Link to="/learn/tensions" />}
              />
            </li>
          </RowGroup>
          <RowGroup title={t('learn:tools')}>
            <li>
              <RowLink
                title={t('learn:finder.title')}
                {...LEARN_TILES.chordFinder}
                render={<Link to="/learn/chord-finder" />}
              />
            </li>
            <li>
              <RowLink
                title={t('learn:reharmonise.title')}
                {...LEARN_TILES.reharmonise}
                render={<Link to="/learn/reharmonise" />}
              />
            </li>
            <li>
              <RowLink
                title={t('learn:passing.title')}
                {...LEARN_TILES.passingChords}
                render={<Link to="/learn/passing-chords" />}
              />
            </li>
            <li>
              <RowLink
                title={t('learn:progressions.title')}
                {...LEARN_TILES.progressions}
                render={<Link to="/learn/progressions" />}
              />
            </li>
          </RowGroup>
        </div>
      </div>
    </div>
  )
}
