import { useNavigate } from '@tanstack/react-router'
import { useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_IDS,
  LEFT_FIGURES,
  OWN_NAME_MAX,
  ownName,
  ownPatternId,
  patternBook,
  RIGHT_FIGURE_IDS,
  RIGHT_FIGURES,
  usePatterns,
  usePatternsStoreApi,
  type OwnPatternId,
} from '@/entities/pattern'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { saveOwnPattern, type OwnPatternDraft } from '@/features/manage-patterns'
import { useShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import { BackButton, Dropdown, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { InputGroup, InputGroupInput } from '@/shared/ui/primitives/input-group'
import { PatternPlay, PatternStaff, usePatternSample } from '@/widgets/pattern-music'

/**
 * A pattern of the learner's own made or changed: its name and a figure for each hand from the
 * catalogue, heard and on the staff as they change. Save keeps it and opens its page in the editor's
 * place; Cancel leaves it unsaved. The draft is the screen's own: a half-made pattern is not kept.
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
  const store = usePatternsStoreApi()
  const own = usePatterns((state) => state.own)
  const nextOwn = usePatterns((state) => state.nextOwn)
  const navigate = useNavigate()
  const cancel = useGoBack({ to: '/learn/patterns' })
  const [draft, setDraft] = useState(start)
  const change = (part: Partial<OwnPatternDraft>) => setDraft((was) => ({ ...was, ...part }))

  // The draft heard as it would play once saved: under the id it keeps or will take.
  const draftId = id ?? ownPatternId(nextOwn)
  const book = useMemo(
    () =>
      patternBook([...own.filter((pattern) => pattern.id !== draftId), { ...draft, id: draftId }]),
    [own, draft, draftId],
  )
  const sample = usePatternSample(book.require(draftId), book)
  const [shown, show] = useShownKeys(`${draft.rh} ${draft.lh}`, sample.shown)

  const save = () => {
    const saved = saveOwnPattern(store, draft, id)
    if (saved) {
      void navigate({
        to: '/learn/patterns/$patternRef',
        params: { patternRef: saved },
        replace: true,
      })
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={title} back={<BackButton fallback={{ to: '/learn/patterns' }} />} />
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
          <Button type="submit" disabled={ownName(draft.name) === null}>
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
