import { useTranslation } from 'react-i18next'
import { ViewPill } from '@/shared/ui'

/**
 * A piece's score played or edited (loop round 61, the one switch between the Player and the
 * editor): Play · Edit as one glass pill in the middle of both bars, the mode shown filled, in the
 * same place in each so nothing moves between them. Choosing the other mode calls `onSwitch`, which
 * takes the learner there in this screen's place in the history. While a take records, Play waits
 * for Stop (`waiting`, the tooltip saying so).
 */
export function ModeSwitch({
  mode,
  onSwitch,
  waiting,
}: {
  mode: 'play' | 'edit'
  onSwitch: () => void
  waiting?: string | undefined
}) {
  const { t } = useTranslation('common')
  return (
    <ViewPill
      label={t('editMode.label')}
      value={mode}
      views={[
        { value: 'play', label: t('editMode.play'), reason: mode === 'edit' ? waiting : undefined },
        { value: 'edit', label: t('editMode.editing') },
      ]}
      onChange={(next) => {
        if (next !== mode) onSwitch()
      }}
    />
  )
}
