import { Ear, Info, KeyboardMusic, Layers, ListChecks, type LucideIcon } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectTrainer, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setAutoNext } from '@/features/set-preference'
import {
  CARD_SIDES,
  CUSTOM,
  CUSTOM_CHOICES,
  CUSTOM_OWN,
  drillOf,
  listParam,
  NOTE_RANGE,
  orOwn,
  readList,
  ROOT_GROUPS,
  ROUNDS,
  TIME_LIMITS,
  type Drill,
  type Trainer,
  type TrainerView,
} from '@/features/trainer'
import {
  CHORD_FAMILIES,
  CHORD_QUALITIES,
  chordFamily,
  INTERVAL_GROUPS,
  LETTERS,
  midiOf,
  note,
  PIANO,
  printedSymbol,
  SCALE_FAMILIES,
  scaleKindsIn,
  type Midi,
} from '@/shared/lib/music'
import { Dropdown, Segmented, SettingField, SettingRows, SwitchRow, ToggleChips } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ListSheetRow } from './ListSheetRow'

type ListField = keyof typeof CUSTOM_CHOICES

/** Each drill as its picture: a card, a choice, the keys, an ear. */
const DRILL_ICON: Readonly<Record<Drill, LucideIcon>> = {
  flashcards: Layers,
  quiz: ListChecks,
  entry: KeyboardMusic,
  ear: Ear,
}

/** The piano's white keys, an octave a group: Reading notes' range. */
const WHITE_KEYS = Array.from({ length: 9 }, (_, octave) => ({
  octave,
  keys: LETTERS.map((letter) => ({
    text: `${letter}${octave}`,
    key: midiOf(note(letter), octave),
  })).filter(({ key }) => key >= PIANO.from && key <= PIANO.to),
})).filter((group) => group.keys.length > 0)

/** A white key as its choice reads (`C4`): the range's own ends, shown while the URL names none. */
const whiteKeyText = (key: Midi): string =>
  WHITE_KEYS.flatMap((group) => group.keys).find((white) => white.key === key)?.text ?? ''

/** A titled group of a setup's rows on a card. */
function SetupGroup({ title, children }: { title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="px-1 text-xl">
        {title}
      </h2>
      <div className="card px-4 py-3">
        <SettingRows>{children}</SettingRows>
      </div>
    </section>
  )
}

/**
 * Every trainer's setup, one template (ADR 0025): the drill (Flashcards, Quiz, Play, By ear) where it
 * has them and what a card shows; its Options (the level, Custom's lists each in a sheet, its
 * switches, the rounds); its Timing (a time limit, going on by itself); a card saying the drill in a
 * sentence; and one Start. Each choice is written to the URL, its own left out; what each does is
 * in an ⓘ beside its name.
 */
export function TrainerSetup({
  trainer,
  view,
  level,
  levels,
  onChange,
  onStart,
  footer,
}: {
  trainer: Trainer
  view: TrainerView
  level: string
  levels: readonly { value: string; label: string }[]
  onChange: (patch: Partial<TrainerView>) => void
  onStart: () => void
  /** What follows the setup's cards: the level's record. */
  footer?: ReactNode
}) {
  const { t } = useTranslation(['quiz', 'music'])
  const settings = useSettingsStoreApi()
  const { autoNext } = useSettings(selectTrainer)
  const drill = drillOf(trainer, view)
  const fields = new Set(level === CUSTOM ? trainer.custom : [])
  const write = (field: ListField, chosen: readonly string[]) => {
    const kept: readonly string[] = (CUSTOM_CHOICES[field] as readonly string[]).filter((value) =>
      chosen.includes(value),
    )
    // Its own in any order is its own: the URL leaves it out.
    const own: readonly string[] = CUSTOM_OWN[field]
    const isOwn = kept.length === own.length && own.every((value) => kept.includes(value))
    onChange({ [field]: isOwn ? undefined : listParam(kept) })
  }
  const listOf = (field: ListField) =>
    orOwn(
      readList(view[field], CUSTOM_CHOICES[field] as readonly string[]),
      CUSTOM_OWN[field] as readonly string[],
    )
  const { id } = trainer
  const how =
    id === 'chords' || id === 'intervals'
      ? t(`quiz:how.${id}.${drill ?? 'flashcards'}`)
      : t(`quiz:how.${id}`)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      {drill ? (
        <Segmented
          label={t('quiz:drill.label')}
          value={drill}
          options={trainer.drills.map((each) => {
            const Icon = DRILL_ICON[each]
            return {
              value: each,
              label: t(`quiz:drill.${each}`),
              icon: <Icon aria-hidden className="size-5" />,
            }
          })}
          onChange={(next) => onChange({ drill: next === trainer.drills[0] ? undefined : next })}
        />
      ) : null}

      <SetupGroup title={t('quiz:setup.options')}>
        {drill === 'flashcards' ? (
          <SettingField label={t('quiz:show.label')}>
            <Segmented
              label={t('quiz:show.label')}
              value={view.show ?? 'name'}
              options={CARD_SIDES.map((side) => ({ value: side, label: t(`quiz:show.${side}`) }))}
              onChange={(show) => onChange({ show: show === 'name' ? undefined : show })}
            />
          </SettingField>
        ) : null}
        {levels.length > 0 ? (
          <SettingField label={t('quiz:level')} layout="beside">
            <Dropdown
              label={t('quiz:level')}
              bare
              className="min-w-0 max-w-full sm:max-w-80"
              value={level}
              options={levels}
              onChange={(next) =>
                onChange({ level: next === trainer.levels[0] ? undefined : next })
              }
            />
          </SettingField>
        ) : null}
        {fields.has('chords') ? (
          <ListSheetRow
            label={t('quiz:choice.chords')}
            value={listOf('chords')}
            groups={CHORD_FAMILIES.map((family) => ({
              label: t(`music:family.${family}`),
              options: CHORD_QUALITIES.filter((quality) => chordFamily(quality) === family).map(
                (quality) => ({ value: quality, label: t(`music:quality.${quality}`) }),
              ),
            }))}
            onChange={(chosen) => write('chords', chosen)}
          />
        ) : null}
        {fields.has('intervals') ? (
          <ListSheetRow
            label={t('quiz:choice.intervals')}
            value={listOf('intervals')}
            groups={(['simple', 'compound'] as const).map((group) => ({
              label: t(`quiz:intervalGroups.${group}`),
              options: INTERVAL_GROUPS[group]
                .filter((interval) => interval !== 'r')
                .map((interval) => ({
                  value: interval,
                  label: `${t(`music:interval.${interval}.name`)} · ${t(`music:interval.${interval}.short`)}`,
                })),
            }))}
            onChange={(chosen) => write('intervals', chosen)}
          />
        ) : null}
        {fields.has('roots') ? (
          <ListSheetRow
            label={t(`quiz:choice.roots.${trainer.id === 'intervals' ? 'intervals' : 'chords'}`)}
            value={listOf('roots')}
            groups={(['natural', 'sharp', 'flat'] as const).map((group) => ({
              label: t(`quiz:choice.rootGroups.${group}`),
              options: ROOT_GROUPS[group].map((root) => ({
                value: root,
                label: printedSymbol(root),
              })),
            }))}
            onChange={(chosen) => write('roots', chosen)}
          />
        ) : null}
        {fields.has('inversions') ? (
          <SwitchRow
            label={t('quiz:choice.inversions')}
            info={t('quiz:choice.inversionsInfo')}
            checked={view.inversions === true}
            onCheckedChange={(on) => onChange({ inversions: on || undefined })}
          />
        ) : null}
        {fields.has('ways') && drill === 'ear' ? (
          <SettingField label={t('quiz:choice.ways')} layout="beside">
            <ToggleChips
              label={t('quiz:choice.ways')}
              value={listOf('ways')}
              options={CUSTOM_CHOICES.ways.map((way) => ({
                value: way,
                label: t(`quiz:ways.${way}`),
              }))}
              onChange={(chosen) => write('ways', chosen)}
            />
          </SettingField>
        ) : null}
        {fields.has('scales') ? (
          <ListSheetRow
            label={t('quiz:choice.scales')}
            value={listOf('scales')}
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
        {fields.has('kinds') ? (
          <ListSheetRow
            label={t('quiz:choice.kinds')}
            value={listOf('kinds')}
            groups={[
              {
                options: CUSTOM_CHOICES.kinds.map((kind) => ({
                  value: kind,
                  label: t(`music:scaleKind.${kind}`),
                })),
              },
            ]}
            onChange={(chosen) => write('kinds', chosen)}
          />
        ) : null}
        {fields.has('range')
          ? (['from', 'to'] as const).map((end) => (
              <SettingField key={end} label={t(`quiz:choice.${end}`)} layout="beside">
                <Dropdown
                  label={t(`quiz:choice.${end}`)}
                  bare
                  value={view[end] ?? whiteKeyText(NOTE_RANGE[end])}
                  groups={WHITE_KEYS.map(({ octave, keys }) => ({
                    label: String(octave),
                    options: keys.map(({ text }) => ({ value: text, label: text })),
                  }))}
                  onChange={(value) => onChange({ [end]: value })}
                />
              </SettingField>
            ))
          : null}
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
        {trainer.id === 'chords' && drill === 'ear' ? (
          <SwitchRow
            label={t('quiz:choice.arpeggio')}
            checked={view.arpeggio === true}
            onCheckedChange={(on) => onChange({ arpeggio: on || undefined })}
          />
        ) : null}
        <SettingField label={t('quiz:rounds.label')} layout="beside">
          <div className="w-44">
            <Segmented
              label={t('quiz:rounds.label')}
              value={view.rounds}
              options={ROUNDS.map((rounds) =>
                rounds === 0
                  ? { value: rounds, label: '∞', title: t('quiz:rounds.untilStopped') }
                  : { value: rounds, label: String(rounds) },
              )}
              onChange={(rounds) => onChange({ rounds })}
            />
          </div>
        </SettingField>
      </SetupGroup>

      <SetupGroup title={t('quiz:setup.timing')}>
        <SettingField
          label={t('quiz:timing.limit')}
          info={t('quiz:timing.limitInfo')}
          layout="beside"
        >
          <Dropdown
            label={t('quiz:timing.limit')}
            bare
            value={view.limit ?? 0}
            options={[
              { value: 0, label: t('quiz:timing.off') },
              ...TIME_LIMITS.map((limit) => ({
                value: limit,
                label: t('quiz:summary.seconds', { seconds: limit }),
              })),
            ]}
            onChange={(limit) => onChange({ limit: limit === 0 ? undefined : limit })}
          />
        </SettingField>
        <SwitchRow
          label={t('quiz:autoNext')}
          info={t('quiz:timing.autoNextInfo')}
          checked={autoNext}
          onCheckedChange={(on) => setAutoNext(settings, on)}
        />
      </SetupGroup>

      <aside
        aria-label={t('quiz:setup.how')}
        className="flex items-start gap-3 rounded-3xl bg-muted px-4 py-3 text-pretty text-muted-foreground"
      >
        <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
        <p>{how}</p>
      </aside>

      {footer}

      <Button size="pill" className="w-full sm:w-auto sm:min-w-56 sm:self-start" onClick={onStart}>
        {t('quiz:setup.start')}
      </Button>
    </div>
  )
}
