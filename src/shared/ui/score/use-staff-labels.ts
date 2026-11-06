import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  isSingleStaff,
  staffPlace,
  type PrintedName,
  type StaffId,
  type StaffLabels,
} from '@/shared/lib/notation'

/** No single staff named. */
const NO_NAMES: readonly (PrintedName | undefined)[] = []

/**
 * The names a score's staves are printed with at its first line's head (ADR 0114, 0097): each single
 * staff drawn by its own name (`names`, by place: the learner's, or the editor's placeholder), none
 * where it has none; the piano's in the learner's language where one of its two is drawn beside a
 * single staff, as a printed score names its instruments only where there are more than one (R34);
 * the editor's piano alone too (`pianoAlone`), its name the target that adds a staff. The same
 * object while the names are, so a line is not engraved again for each render.
 */
export function useStaffLabels(
  staves: readonly StaffId[],
  names: readonly (PrintedName | undefined)[] = NO_NAMES,
  pianoAlone = false,
): StaffLabels {
  const { t } = useTranslation('music')
  const single = staves.filter(isSingleStaff)
  const piano = staves.some((staff) => !isSingleStaff(staff)) && (pianoAlone || single.length > 0)
  const named = single.flatMap((staff) => {
    const name = names[staffPlace(staff)]
    return name ? [[staff, name] as const] : []
  })
  const key = JSON.stringify(named)
  return useMemo(
    () => ({
      ...(Object.fromEntries(JSON.parse(key) as typeof named) as StaffLabels),
      ...(piano ? { piano: { text: t('sheet.staves.piano') } } : {}),
    }),
    [t, key, piano],
  )
}
