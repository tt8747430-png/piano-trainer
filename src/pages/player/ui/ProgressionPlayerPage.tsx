import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { noteName, numeralText } from '@/shared/lib/music'
import type { ProgressionSearch } from '../model/progression-search'
import { useProgressionPlayer } from '../model/use-progression-player'
import { PlayerLayout } from './PlayerLayout'
import { ProgressionSetup } from './ProgressionSetup'

/** A progression in the Player: numerals in any key, a chord a bar, with a song's patterns. */
export function ProgressionPlayerPage() {
  const { t } = useTranslation(['player', 'music'])
  const search = useSearch({ from: '/full-screen/play/progression' })
  const navigate = useNavigate({ from: '/play/progression' })
  const [setupOpen, setSetupOpen] = useState(false)
  const setSearch = (patch: Partial<ProgressionSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const { choice, performance, player, changeSetup } = useProgressionPlayer(search, setSearch)
  const close = useGoBack({
    to: '/learn/progressions',
    search: { p: search.p, key: search.key, size: choice.chordSize },
  })
  const key = t(choice.key.minor ? 'music:key.minor' : 'music:key.major', {
    tonic: noteName(choice.key.tonic),
  })
  return (
    <>
      <PlayerLayout
        title={t('player:progression.title', {
          numerals: choice.numerals.map(numeralText).join('–'),
          key,
        })}
        onClose={close}
        view={search}
        player={player}
        performance={performance}
        onSetup={() => setSetupOpen(true)}
      />
      <ProgressionSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        choice={choice}
        swing={search.swing}
        onKey={(next) => setSearch({ key: next })}
        onChange={changeSetup}
        onSwing={player.setSwing}
      />
    </>
  )
}
