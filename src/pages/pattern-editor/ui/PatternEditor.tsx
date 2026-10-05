import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_IDS,
  LEFT_FIGURES,
  OWN_NAME_MAX,
  RIGHT_FIGURE_IDS,
  RIGHT_FIGURES,
  type OwnPatternId,
} from '@/entities/pattern'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import type { OwnPatternDraft } from '@/features/manage-patterns'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, Dropdown, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { InputGroup, InputGroupInput } from '@/shared/ui/primitives/input-group'
import { PatternPlay, PatternStaff } from '@/widgets/pattern-music'
import { usePatternEditor } from '../model/use-pattern-editor'

/**
 * A pattern of the learner's own made or changed: its name and a figure for each hand from the
 * catalogue, heard and on the staff as they change. Save keeps it and opens its page in the editor's
 * place; Cancel leaves it unsaved.
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
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const nameId = useId()
  const { draft, change, sample, shown, show, save, cancel, savable } = usePatternEditor(start, id)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={title} back={<BackButton fallback={{ to: '/practice/patterns' }} />} />
      <ExplorerKeyboard shown={shown} />
      <form
        className="flex max-w-prose flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <label htmlFor={nameId} className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{t('patterns.editor.name')}</span>
          <InputGroup className="h-12 rounded-2xl bg-card">
            <InputGroupInput
              id={nameId}
              value={draft.name}
              maxLength={OWN_NAME_MAX}
              autoComplete="off"
              onChange={(event) => change({ name: event.target.value })}
              className="text-lg font-semibold md:text-lg"
            />
          </InputGroup>
        </label>
        <div className="flex flex-wrap gap-2">
          <Dropdown
            label={t('patterns.rightHand')}
            value={draft.rh}
            options={RIGHT_FIGURE_IDS.map((figure) => ({
              value: figure,
              label: localText(RIGHT_FIGURES[figure].name, locale),
            }))}
            onChange={(rh) => change({ rh })}
          />
          <Dropdown
            label={t('patterns.leftHand')}
            value={draft.lh}
            options={LEFT_FIGURE_IDS.map((figure) => ({
              value: figure,
              label: localText(LEFT_FIGURES[figure].name, locale),
            }))}
            onChange={(lh) => change({ lh })}
          />
        </div>
        <section className="flex flex-col gap-4 card p-4">
          <PatternStaff sample={sample} />
          <PatternPlay sample={sample} onShow={show} variant="soft" />
        </section>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={!savable}>
            {t('patterns.editor.save')}
          </Button>
          <Button type="button" variant="outline" onClick={cancel}>
            {t('patterns.editor.cancel')}
          </Button>
        </div>
      </form>
    </div>
  )
}
