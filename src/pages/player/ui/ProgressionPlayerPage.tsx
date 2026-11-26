import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { useUp, useSetSearch } from '@/shared/lib'
import { numeralText, walkKeys } from '@/shared/lib/music'
import type { ProgressionSearch } from '../model/progression-search'
import { useProgressionPlayer } from '../model/use-progression-player'
import { ProgressionSettings, ProgressionSetup } from './ProgressionSetup'
import { RunLayout } from './RunLayout'

/** A progression in the run view: numerals in any key, a chord a bar, with a song's patterns. */
export function ProgressionPlayerPage() {
  const { t } = useTranslation('player')
  const search = useSearch({ from: '/shell/play/progression' })
  const setSearch = useSetSearch<ProgressionSearch>()
  const { choice, performance, player, fit, changeSetup } = useProgressionPlayer(search, setSearch)
  const close = useUp()
  const keyName = useKeyName()
  const named = { numerals: choice.numerals.map(numeralText).join(' – '), key: keyName(choice.key) }
  return (
    <RunLayout
      title={t('progression.title', named)}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      keys={choice.walk ? walkKeys(choice.key, choice.walk).length : 1}
      setup={<ProgressionSetup choice={choice} onChange={changeSetup} />}
      settings={
        <ProgressionSettings
          choice={choice}
          fit={fit}
          swing={search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
