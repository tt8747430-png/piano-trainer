import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import type { StaffName } from '../model/types'

/** No single staff. */
const NO_STAVES: readonly { readonly name?: StaffName }[] = []

/**
 * Each single staff's own name in the learner's language, by place (ADR 0097): what the sheet
 * prints at its first line's head; none where it has none. The same array while the names are.
 */
/** Each staff's own name in `locale`, top down; none where a staff has none. */
export const staffNamesOf = (
  staves: readonly { readonly name?: StaffName }[],
  locale: Locale,
): (string | undefined)[] =>
  staves.map(({ name }) =>
    name === undefined ? undefined : typeof name === 'string' ? name : localText(name, locale),
  )

export function useStaffNames(
  staves: readonly { readonly name?: StaffName }[] = NO_STAVES,
): readonly (string | undefined)[] {
  const locale = useLocale()
  const names = staffNamesOf(staves, locale)
  const key = JSON.stringify(names)
  // A staff of no name is null in the key, none again in the names.
  return useMemo(
    () => (JSON.parse(key) as (string | null)[]).map((name) => name ?? undefined),
    [key],
  )
}

/**
 * A single staff named for a reader (ADR 0097): its own name, else its place's, "Staff 2": the
 * View's switch, the editor's placeholder at the head of a staff with no name of its own.
 */
export function useStaffTitle(): (name: string | undefined, place: number) => string {
  const { t } = useTranslation('music')
  return useCallback((name, place) => name ?? t('sheet.staff', { n: place + 1 }), [t])
}
