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
import { BackButton, Dropdown, NameField, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
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
  const { draft, change, sample, shown, show, save, cancel, savable } = usePatternEditor(start, id)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={title}
        back={<BackButton fallback={{ to: '/practice/accompaniment' }} />}
      />
      <ExplorerKeyboard shown={shown} />
      <form
        className="flex max-w-prose flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <NameField
          label={t('patterns.editor.name')}
          value={draft.name}
          maxLength={OWN_NAME_MAX}
          onChange={(event) => change({ name: event.target.value })}
        />
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
