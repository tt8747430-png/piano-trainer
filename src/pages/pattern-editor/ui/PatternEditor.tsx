import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_GROUPS,
  LEFT_FIGURES,
  OWN_NAME_MAX,
  RIGHT_FIGURE_GROUPS,
  RIGHT_FIGURES,
  type OwnPatternId,
} from '@/entities/pattern'
import type { OwnPatternDraft } from '@/features/manage-patterns'
import { localText, useLocale } from '@/shared/i18n'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { BackButton, ChoiceChips, Labelled, NameField, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PatternRoll } from '@/widgets/pattern-music'
import { usePatternEditor } from '../model/use-pattern-editor'

/**
 * A pattern of the learner's own made or changed, as its board (`r54_practice_more.py`'s PATED): its
 * name, how it plays as a piano roll, and a figure for each hand chosen from the catalog's chips, by
 * family. Save keeps it and opens its page in the editor's place; Cancel leaves it unsaved. On a
 * laptop the name and the roll are a band across the top, Cancel and Save under the name, the two
 * hands side by side under it.
 */
export function PatternEditor({
  title,
  start,
  id,
}: {
  title: string
  start: OwnPatternDraft
  /** The pattern changed; none for a new one. */
  id?: OwnPatternId
}) {
  const { t } = useTranslation(['practice', 'player'])
  const locale = useLocale()
  const { draft, change, sample, save, cancel, savable } = usePatternEditor(start, id)
  // The laptop board's roll is taller for its width, under its caption (PATED_L).
  const wide = useMediaQuery(LAPTOP)
  const rhName = localText(RIGHT_FIGURES[draft.rh].name, locale)
  const lhName = localText(LEFT_FIGURES[draft.lh].name, locale)
  const acts = (
    <div className="flex w-full gap-2">
      <Button type="button" size="lg" variant="quiet" className="flex-1" onClick={cancel}>
        {t('practice:patterns.editor.cancel')}
      </Button>
      <Button type="submit" size="lg" className="flex-1" disabled={!savable}>
        {t('practice:patterns.editor.save')}
      </Button>
    </div>
  )
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader title={title} back={<BackButton />} />
      <form
        className="-mt-2 flex w-full flex-col gap-4 lg:mt-2 lg:max-w-295"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <div className="flex flex-col gap-4">
            <NameField
              label={t('practice:patterns.editor.name')}
              value={draft.name}
              maxLength={OWN_NAME_MAX}
              onChange={(event) => change({ name: event.target.value })}
            />
            <div className="mt-auto hidden lg:flex">{acts}</div>
          </div>
          <div className="card flex flex-col gap-3 p-4">
            {wide ? (
              <span className="text-footnote leading-[normal] font-semibold text-muted-foreground">
                {t('practice:patterns.editor.howItPlays')}
              </span>
            ) : null}
            <PatternRoll
              sample={sample}
              label={t('practice:patterns.editor.roll', { rh: rhName, lh: lhName })}
              units={wide ? 280 : 340}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
          <Labelled label={t('practice:patterns.rightHand')}>
            <div className="flex flex-col gap-3">
              {RIGHT_FIGURE_GROUPS.map((group) => (
                <FigureGroup
                  key={group.id}
                  label={t(`player:rhGroup.${group.id}`)}
                  value={draft.rh}
                  options={group.figures.map((figure) => ({
                    value: figure,
                    label: localText(RIGHT_FIGURES[figure].name, locale),
                  }))}
                  onChange={(rh) => change({ rh })}
                />
              ))}
            </div>
          </Labelled>
          <Labelled label={t('practice:patterns.leftHand')}>
            <div className="flex flex-col gap-3">
              {LEFT_FIGURE_GROUPS.map((group) => (
                <FigureGroup
                  key={group.id}
                  label={t(`player:lhGroup.${group.id}`)}
                  value={draft.lh}
                  options={group.figures.map((figure) => ({
                    value: figure,
                    label: localText(LEFT_FIGURES[figure].name, locale),
                  }))}
                  onChange={(lh) => change({ lh })}
                />
              ))}
            </div>
          </Labelled>
        </div>
        <div className="lg:hidden">{acts}</div>
      </form>
    </div>
  )
}

/** A family of a hand's figures: its name small over its chips, the chosen one in ink. */
function FigureGroup<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: V
  options: readonly { value: V; label: string }[]
  onChange: (value: V) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        aria-hidden
        className="mx-4 text-footnote leading-[normal] font-semibold text-muted-foreground"
      >
        {label}
      </span>
      <ChoiceChips
        label={label}
        value={options.some((option) => option.value === value) ? value : null}
        options={options}
        onChange={onChange}
      />
    </div>
  )
}
