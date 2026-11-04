import { useSearch } from '@tanstack/react-router'
import {
  Columns3,
  Gauge,
  Hash,
  Mic,
  Music2,
  Plus,
  Ruler,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  fullLayout,
  HEADER_FIELDS,
  HEADER_MAX,
  TITLE_MAX,
  USUAL_HEADER_FIELDS,
  type HeaderField,
} from '@/entities/piece'
import { barsOf } from '@/features/score-editor'
import { useKeyName } from '@/shared/i18n'
import { useSetSearch } from '@/shared/lib'
import { beatUnit, tempoMark, unitNote } from '@/shared/lib/music'
import {
  ActionMenu,
  BackButton,
  RowButton,
  ScreenHeader,
  SettingsGroup,
  type Paint,
} from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { SCORE_PAGES, type ScorePage } from '../model/score-pages'
import { ScorePageBody } from './ScoreSettingsPages'

/** A name typed in its row (Flat's credits): its label, the field at its end, saved as it is left. */
function NameRow({
  label,
  value,
  max,
  placeholder,
  onSave,
}: {
  label: string
  value: string
  max: number
  placeholder: string
  onSave: (text: string) => void
}) {
  const id = useId()
  // What the field holds while it is typed in; null while it shows the score's.
  const [typed, setTyped] = useState<string | null>(null)
  const save = () => {
    if (typed !== null && typed.trim() !== value) onSave(typed)
    setTyped(null)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.currentTarget.blur()
    if (event.key === 'Escape') {
      event.preventDefault()
      setTyped(null)
      event.currentTarget.blur()
    }
  }
  return (
    <div className="flex min-h-14 items-center gap-3 rounded-control pr-3 pl-3 focus-within:bg-muted/60">
      <label htmlFor={id} className="shrink-0 text-lg leading-snug font-semibold">
        {label}
      </label>
      <input
        id={id}
        value={typed ?? value}
        maxLength={max}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        onFocus={() => setTyped(value)}
        onChange={(event) => setTyped(event.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
        className="h-11 min-w-0 flex-1 bg-transparent text-end text-lg text-muted-foreground outline-none placeholder:text-muted-foreground/60 focus:text-foreground"
      />
    </div>
  )
}

/**
 * The score's Settings (round 28, Flat's score settings and credits, MuseScore's score properties):
 * one page of grouped rows in the editor's place, on its draft, so each change is one Undo step there.
 * Score: its title and what prints under it. Instruments: the editor's own (A40). Music: the
 * tempo, key and time signatures in the editor's own pickers, and the bars at the end. Layout: the
 * staff size and the bars a line holds. Editing: notes heard as they are edited, and the ways in (the
 * MIDI keyboard, the computer's keyboard and the recorder's settings). Back returns to the score.
 */
export function ScoreSettingsPage() {
  const { t } = useTranslation(['editor', 'songs', 'music'])
  const { actions, meta } = useScoreEditorContext()
  const keyName = useKeyName()
  const draft = useEditorState((state) => state.draft)
  const bars = barsOf(draft).length
  const unit = draft.tempoUnit ?? beatUnit(draft.meter)
  const mark = Math.round(tempoMark(draft.tempo, unit, draft.meter))
  const meter = draft.timeSymbol
    ? t(draft.meter === '2/2' ? 'music:timeField.cut' : 'music:timeField.common')
    : draft.meter
  const nameOf = (field: HeaderField) => t(`scoreSettings.names.${field}`)
  // The usual credits always, the others once written or added by their role (Add credit).
  const [added, setAdded] = useState<readonly HeaderField[]>([])
  const shown = HEADER_FIELDS.filter(
    (field) =>
      USUAL_HEADER_FIELDS.includes(field) ||
      draft.header?.[field] !== undefined ||
      added.includes(field),
  )
  const addable = HEADER_FIELDS.filter((field) => !shown.includes(field))
  const { page: asked } = useSearch({ strict: false }) as { page?: string }
  const page = SCORE_PAGES.find((each) => each === asked) ?? null
  const setSearch = useSetSearch<{ page: string | undefined }>()
  const open = (next: ScorePage | null) => setSearch({ page: next ?? undefined })
  const laid = fullLayout(draft.layout)
  // Each instrument once: every single staff, and the piano where it is in sight.
  const staffCount = draft.staves.length + (draft.leadSheet ? 0 : 1)
  const row = (id: ScorePage, icon: LucideIcon, paint: Paint, value?: string) => (
    <RowButton
      key={id}
      title={t(`scoreSettings.pages.${id}`)}
      icon={icon}
      paint={paint}
      value={value}
      onClick={() => open(id)}
    />
  )
  const inner = page ? (
    <ScorePageBody
      page={page}
      bars={bars}
      onBars={(count) => actions.dispatch({ type: 'barCount', count })}
      onDone={() => open(null)}
    />
  ) : null
  return (
    // In the full screen's column, at its own height: it scrolls, never squeezed to the screen's.
    <div className="flex shrink-0 flex-col gap-6 pb-8">
      <ScreenHeader
        title={page ? t(`scoreSettings.pages.${page}`) : t('scoreSettings.title')}
        back={page ? <BackButton onClick={() => open(null)} /> : <BackButton />}
      />
      <div className="mx-auto w-full max-w-2xl space-y-7">
        {inner ?? (
          <>
            <SettingsGroup
              flush
              title={t('scoreSettings.credits')}
              info={t('scoreSettings.namesInfo')}
            >
              <NameRow
                label={t('scoreSettings.names.title')}
                value={meta.title}
                max={TITLE_MAX}
                placeholder={t('scoreSettings.add')}
                onSave={(title) => actions.dispatch({ type: 'title', title })}
              />
              {shown.map((field) => (
                <NameRow
                  key={field}
                  label={nameOf(field)}
                  value={draft.header?.[field] ?? ''}
                  max={HEADER_MAX}
                  placeholder={t('scoreSettings.add')}
                  onSave={(text) => actions.dispatch({ type: 'header', field, text })}
                />
              ))}
              {addable.length > 0 ? (
                <div className="px-1 py-2">
                  <ActionMenu
                    label={t('scoreSettings.addCredit')}
                    trigger={
                      <>
                        <Plus aria-hidden />
                        {t('scoreSettings.addCredit')}
                      </>
                    }
                    actions={addable.map((field) => ({
                      key: field,
                      label: nameOf(field),
                      onSelect: () => setAdded((was) => [...was, field]),
                    }))}
                  />
                </div>
              ) : null}
            </SettingsGroup>
            <SettingsGroup flush title={t('scoreSettings.music')}>
              {row('staves', Music2, 'lilac', String(staffCount))}
              {row('key', Hash, 'sky', keyName(draft.key))}
              {row('time', Music2, 'sky', meter)}
              {row('tempo', Gauge, 'sky', `${unitNote(unit)} = ${mark}`)}
              {row('bars', Columns3, 'sky', String(bars))}
            </SettingsGroup>
            <SettingsGroup flush title={t('scoreSettings.howItWorks')}>
              {row(
                'layout',
                Ruler,
                'grass',
                t('layout.summary', {
                  page: t(`layout.pageSizes.${laid.pageSize}`),
                  size: t('layout.mm', { value: laid.staffSize }),
                }),
              )}
              {row('input', Volume2, 'yellow')}
              {row('recording', Mic, 'sand')}
            </SettingsGroup>
          </>
        )}
      </div>
    </div>
  )
}
