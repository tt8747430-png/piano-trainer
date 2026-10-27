import { Feather } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PlayerTool } from '@/widgets/practice-player'

/**
 * The tools row's Simplify (ADR 0105, Chordify's): a switch, pressed while every chord is played and
 * shown as its plain triad; its tooltip says so. Greyed, saying why, where no chord of the music would
 * change.
 */
export function SimplifyTool({
  on,
  simplifies,
  onChange,
}: {
  on: boolean
  /** Whether it changes any chord of the music as chosen. */
  simplifies: boolean
  onChange: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  return (
    <PlayerTool
      icon={Feather}
      label={t('simplify.label')}
      name={t('simplify.label')}
      tip={t(simplifies ? 'simplify.about' : 'simplify.none')}
      aria-pressed={on && simplifies}
      disabled={!simplifies}
      onClick={() => onChange(!on)}
    />
  )
}
