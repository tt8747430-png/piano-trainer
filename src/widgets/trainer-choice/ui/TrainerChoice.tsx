import { useTranslation } from 'react-i18next'
import {
  CUSTOM_CHOICES,
  CUSTOM_OWN,
  listParam,
  orOwn,
  readList,
  type Trainer,
  type TrainerView,
} from '@/features/trainer'
import {
  INTERVAL_GROUPS,
  LETTERS,
  midiOf,
  note,
  PIANO,
  SCALE_FAMILIES,
  scaleKindsIn,
} from '@/shared/lib/music'
import { Dropdown, Labelled, MultiDropdown, SwitchRow, ToggleChips } from '@/shared/ui'

type ListField = keyof typeof CUSTOM_CHOICES

/** The piano's white keys, an octave a group: Reading notes' range. */
const WHITE_KEYS = Array.from({ length: 9 }, (_, octave) => ({
  octave,
  keys: LETTERS.map((letter) => ({
    text: `${letter}${octave}`,
    key: midiOf(note(letter), octave),
  })).filter(({ key }) => key >= PIANO.from && key <= PIANO.to),
})).filter((group) => group.keys.length > 0)

/**
 * Custom's fields for a trainer: the lists it asks from (each checks several and never empties; a
 * short one as chips in sight, a long one behind a pop-up) and its switches, each written to the
 * URL, its own left out.
 */
export function TrainerChoice({
  trainer,
  view,
  onChange,
}: {
  trainer: Trainer
  view: TrainerView
  onChange: (patch: Partial<TrainerView>) => void
}) {
  const { t } = useTranslation(['quiz', 'music'])
  const write = (field: ListField, chosen: readonly string[]) => {
    // Unchecking the last one leaves it checked: a run always asks something.
    if (chosen.length === 0) return
    const own = listParam(CUSTOM_OWN[field])
    const param = listParam(CUSTOM_CHOICES[field].filter((value) => chosen.includes(value)))
    onChange({ [field]: param === own ? undefined : param })
  }
  const fields = new Set(trainer.custom)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        {fields.has('families') ? (
          <Labelled label={t('quiz:choice.families')}>
            <ToggleChips
              label={t('quiz:choice.families')}
              value={orOwn(readList(view.families, CUSTOM_CHOICES.families), CUSTOM_OWN.families)}
              options={CUSTOM_CHOICES.families.map((family) => ({
                value: family,
                label: t(`music:family.${family}`),
              }))}
              onChange={(chosen) => write('families', chosen)}
            />
          </Labelled>
        ) : null}
        {fields.has('scales') ? (
          <MultiDropdown
            label={t('quiz:choice.scales')}
            value={orOwn(readList(view.scales, CUSTOM_CHOICES.scales), CUSTOM_OWN.scales)}
            groups={SCALE_FAMILIES.map((family) => ({
              label: t(`music:scaleFamily.${family}`),
              options: scaleKindsIn(family).map((kind) => ({
                value: kind,
                label: t(`music:scaleKind.${kind}`),
              })),
            }))}
            onChange={(chosen) => write('scales', chosen)}
          />
        ) : null}
        {fields.has('intervals') ? (
          <MultiDropdown
            label={t('quiz:choice.intervals')}
            value={orOwn(readList(view.intervals, CUSTOM_CHOICES.intervals), CUSTOM_OWN.intervals)}
            groups={(['simple', 'compound'] as const).map((group) => ({
              label: t(`quiz:intervalGroups.${group}`),
              options: INTERVAL_GROUPS[group]
                .filter((interval) => interval !== 'r')
                .map((interval) => ({
                  value: interval,
                  label: t(`music:interval.${interval}.name`),
                  detail: t(`music:interval.${interval}.short`),
                  short: t(`music:interval.${interval}.short`),
                })),
            }))}
            onChange={(chosen) => write('intervals', chosen)}
          />
        ) : null}
        {fields.has('ways') ? (
          <Labelled label={t('quiz:choice.ways')}>
            <ToggleChips
              label={t('quiz:choice.ways')}
              value={orOwn(readList(view.ways, CUSTOM_CHOICES.ways), CUSTOM_OWN.ways)}
              options={CUSTOM_CHOICES.ways.map((way) => ({
                value: way,
                label: t(`quiz:ways.${way}`),
              }))}
              onChange={(chosen) => write('ways', chosen)}
            />
          </Labelled>
        ) : null}
        {fields.has('qualities') ? (
          <MultiDropdown
            label={t('quiz:choice.qualities')}
            value={orOwn(readList(view.qualities, CUSTOM_CHOICES.qualities), CUSTOM_OWN.qualities)}
            options={CUSTOM_CHOICES.qualities.map((quality) => ({
              value: quality,
              label: t(`music:quality.${quality}`),
            }))}
            onChange={(chosen) => write('qualities', chosen)}
          />
        ) : null}
        {fields.has('kinds') ? (
          <MultiDropdown
            label={t('quiz:choice.kinds')}
            value={orOwn(readList(view.kinds, CUSTOM_CHOICES.kinds), CUSTOM_OWN.kinds)}
            options={CUSTOM_CHOICES.kinds.map((kind) => ({
              value: kind,
              label: t(`music:scaleKind.${kind}`),
            }))}
            onChange={(chosen) => write('kinds', chosen)}
          />
        ) : null}
        {fields.has('range')
          ? (['from', 'to'] as const).map((end) => (
              <Dropdown
                key={end}
                label={t(`quiz:choice.${end}`)}
                value={view[end] ?? (end === 'from' ? 'C4' : 'C5')}
                groups={WHITE_KEYS.map(({ octave, keys }) => ({
                  label: String(octave),
                  options: keys.map(({ text }) => ({ value: text, label: text })),
                }))}
                onChange={(value) => onChange({ [end]: value })}
              />
            ))
          : null}
      </div>
      {fields.has('arpeggio') ? (
        <SwitchRow
          label={t('quiz:choice.arpeggio')}
          checked={view.arpeggio === true}
          onCheckedChange={(on) => onChange({ arpeggio: on || undefined })}
        />
      ) : null}
      {fields.has('descending') ? (
        <SwitchRow
          label={t('quiz:choice.descending')}
          checked={view.descending === true}
          onCheckedChange={(on) => onChange({ descending: on || undefined })}
        />
      ) : null}
      {fields.has('accidentals') ? (
        <SwitchRow
          label={t('quiz:choice.accidentals')}
          checked={view.accidentals === true}
          onCheckedChange={(on) => onChange({ accidentals: on || undefined })}
        />
      ) : null}
    </div>
  )
}
