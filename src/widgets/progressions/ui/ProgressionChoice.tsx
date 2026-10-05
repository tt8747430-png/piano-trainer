import { useTranslation } from 'react-i18next'
import {
  libraryParam,
  libraryProgression,
  PROGRESSION_LIBRARY,
  PROGRESSION_STYLES,
} from '@/entities/progression-library'
import { localText, useLocale } from '@/shared/i18n'
import {
  circleKey,
  keyParam,
  numeralText,
  parseNumerals,
  pitchClassOf,
  type Key,
} from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import type { ProgressionsView } from '../model/progressions-view'

/** The pop-up's value for a progression the library does not hold: the learner's own line. */
const TYPED = 'typed'

const dashed = (numerals: string): string =>
  (parseNumerals(numerals) ?? []).map(numeralText).join('–')

/**
 * The progression shown, chosen from the library by style behind one pop-up button: it names the
 * library's progression the numerals are, or the line itself when the learner typed their own.
 * Choosing one keeps the tonic and takes the progression's mode, and its chord size where it has one.
 */
export function ProgressionChoice({
  view,
  musicKey,
  onChange,
}: {
  view: ProgressionsView
  musicKey: Key
  onChange: (change: Partial<ProgressionsView>) => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const named = libraryProgression(view.p, musicKey.minor)
  const library = PROGRESSION_STYLES.map((style) => ({
    label: t(`progressions.style.${style}`),
    options: PROGRESSION_LIBRARY.filter((each) => each.style === style).map((each) => ({
      value: each.id,
      label: localText(each.name, locale),
      detail: dashed(each.numerals),
    })),
  }))
  return (
    <Dropdown
      label={t('progressions.choose')}
      value={named?.id ?? TYPED}
      groups={
        named
          ? library
          : [
              {
                label: t('progressions.typed'),
                options: [{ value: TYPED, label: dashed(view.p) }],
              },
              ...library,
            ]
      }
      onChange={(id) => {
        const chosen = PROGRESSION_LIBRARY.find((each) => each.id === id)
        if (!chosen) return
        onChange({
          p: libraryParam(chosen),
          key: keyParam(circleKey(pitchClassOf(musicKey.tonic), chosen.minor)),
          ...(chosen.size ? { size: chosen.size } : {}),
        })
      }}
      className="w-full"
    />
  )
}
