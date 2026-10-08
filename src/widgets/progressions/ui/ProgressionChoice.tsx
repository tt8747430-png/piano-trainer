import { useTranslation } from 'react-i18next'
import {
  LIBRARY_BY_STYLE,
  libraryLine,
  progressionById,
  type LibraryProgression,
} from '@/entities/progression-library'
import { localText, useLocale } from '@/shared/i18n'
import { numeralsLine, type Numeral } from '@/shared/lib/music'
import { Dropdown, Labelled } from '@/shared/ui'

/** The pop-up's value for a progression the library does not hold: the learner's own line. */
const TYPED = 'typed'

/**
 * The progression shown, chosen from the library by style behind one pop-up button under its name: it
 * names the library's progression the line is, or the line itself when the learner typed their own.
 */
export function ProgressionChoice({
  named,
  numerals,
  onChoose,
}: {
  /** The library's progression shown; none for a line the learner typed. */
  named: LibraryProgression | undefined
  /** The line shown. */
  numerals: readonly Numeral[]
  onChoose: (progression: LibraryProgression) => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const library = LIBRARY_BY_STYLE.map(({ style, progressions }) => ({
    label: t(`progressions.style.${style}`),
    options: progressions.map((each) => ({
      value: each.id,
      label: localText(each.name, locale),
      detail: libraryLine(each),
    })),
  }))
  return (
    <Labelled label={t('progressions.choose')}>
      <Dropdown
        bare
        label={t('progressions.choose')}
        value={named?.id ?? TYPED}
        groups={
          named
            ? library
            : [
                {
                  label: t('progressions.typed'),
                  options: [{ value: TYPED, label: numeralsLine(numerals) }],
                },
                ...library,
              ]
        }
        onChange={(id) => {
          const chosen = progressionById(id)
          if (chosen) onChoose(chosen)
        }}
        className="w-full"
      />
    </Labelled>
  )
}
