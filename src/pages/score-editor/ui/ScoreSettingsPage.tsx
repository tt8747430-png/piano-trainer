import { Link } from '@tanstack/react-router'
import { Cable, Columns3, Gauge, Hash, Mic, ListMusic, Music2, Ruler, Volume2 } from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BARS_PER_LINE,
  HEADER_FIELDS,
  HEADER_MAX,
  STAFF_SIZES,
  TITLE_MAX,
  type HeaderField,
  type StaffSize,
} from '@/entities/piece'
import { selectEditing, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { VOICE_IDS, VOICES } from '@/features/edit-piece'
import { barsOf, MOST_BARS } from '@/features/score-editor'
import { setEditing } from '@/features/set-preference'
import { localText, useKeyName, useLocale } from '@/shared/i18n'
import { beatUnit, tempoMark, unitNote } from '@/shared/lib/music'
import {
  BackButton,
  ChoiceRow,
  Dropdown,
  InfoTip,
  RowLink,
  RowTrigger,
  ScreenHeader,
  SettingsGroup,
  Stepper,
  SwitchRow,
  TileMark,
} from '@/shared/ui'
import { InstrumentList, type InstrumentFamily } from '@/widgets/instrument-list'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { instrumentCount, type ScoreInstrument } from '../model/instruments'
import { KeyPopover } from './KeyPopover'
import { TempoPopover } from './TempoPopover'
import { TimePopover } from './TimePopover'

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
 * Score: its title and what prints under it. Instruments: New song's families with − n +. Music: the
 * tempo, key and time signatures in the editor's own pickers, and the bars at the end. Layout: the
 * staff size and the bars a line holds. Editing: notes heard as they are edited, and the ways in (the
 * MIDI keyboard, the computer's keyboard and the recorder's settings). Back returns to the score.
 */
export function ScoreSettingsPage() {
  const { t } = useTranslation(['editor', 'songs', 'music'])
  const { actions, meta } = useScoreEditorContext()
  const locale = useLocale()
  const keyName = useKeyName()
  const settings = useSettingsStoreApi()
  const editing = useSettings(selectEditing)
  const draft = useEditorState((state) => state.draft)
  const bars = barsOf(draft).length
  const unit = draft.tempoUnit ?? beatUnit(draft.meter)
  const mark = Math.round(tempoMark(draft.tempo, unit, draft.meter))
  const meter = draft.timeSymbol
    ? t(draft.meter === '2/2' ? 'songs:setup.cut' : 'songs:setup.common')
    : draft.meter
  const count = (instrument: ScoreInstrument) => {
    const { count, fewer, more } = instrumentCount(draft, instrument)
    return {
      key: instrument,
      count,
      onFewer: fewer ? () => actions.dispatch(fewer) : undefined,
      onMore: more ? () => actions.dispatch(more) : undefined,
    }
  }
  const families: InstrumentFamily[] = [
    {
      key: 'vocals',
      title: t('songs:setup.families.vocals'),
      rows: VOICE_IDS.map((voice) => ({
        ...count(voice),
        name: localText(VOICES[voice].name, locale),
      })),
    },
    {
      key: 'keyboards',
      title: t('songs:setup.families.keyboards'),
      rows: [{ ...count('piano'), name: t('songs:setup.piano') }],
    },
    {
      key: 'other',
      title: t('scoreSettings.families.other'),
      rows: [{ ...count('staff'), name: t('scoreSettings.staff') }],
    },
  ]
  const nameOf = (field: HeaderField) => t(`scoreSettings.names.${field}`)
  return (
    // In the full screen's column, at its own height: it scrolls, never squeezed to the screen's.
    <div className="flex shrink-0 flex-col gap-6 pb-8">
      <ScreenHeader title={t('scoreSettings.title')} back={<BackButton />} />
      <div className="mx-auto w-full max-w-2xl space-y-7">
        <SettingsGroup flush title={t('scoreSettings.score')} info={t('scoreSettings.namesInfo')}>
          <NameRow
            label={t('scoreSettings.names.title')}
            value={meta.title}
            max={TITLE_MAX}
            placeholder={t('scoreSettings.add')}
            onSave={(title) => actions.dispatch({ type: 'title', title })}
          />
          {HEADER_FIELDS.map((field) => (
            <NameRow
              key={field}
              label={nameOf(field)}
              value={draft.header?.[field] ?? ''}
              max={HEADER_MAX}
              placeholder={t('scoreSettings.add')}
              onSave={(text) => actions.dispatch({ type: 'header', field, text })}
            />
          ))}
        </SettingsGroup>
        <SettingsGroup
          bare
          title={t('scoreSettings.instruments')}
          info={t('scoreSettings.instrumentsInfo')}
        >
          <InstrumentList families={families} />
        </SettingsGroup>
        <SettingsGroup flush title={t('scoreSettings.music')}>
          <TempoPopover
            trigger={
              <RowTrigger
                title={t('scoreSettings.tempo')}
                value={`${unitNote(unit)} = ${mark}`}
                icon={Gauge}
                paint="sand"
              />
            }
          />
          <KeyPopover
            bar={0}
            trigger={
              <RowTrigger
                title={t('scoreSettings.key')}
                value={keyName(draft.key)}
                icon={Hash}
                paint="sky"
              />
            }
          />
          <TimePopover
            bar={0}
            trigger={
              <RowTrigger
                title={t('scoreSettings.time')}
                value={meter}
                icon={Music2}
                paint="grass"
              />
            }
          />
          {/* Its stepper beside it, or under it where a narrow phone has no room for both. */}
          <div className="flex min-h-14 flex-col gap-2 py-1 pr-1 pl-2 min-[380px]:flex-row min-[380px]:items-center min-[380px]:gap-3">
            <div className="flex items-center gap-3 min-[380px]:flex-1">
              <TileMark icon={Columns3} paint="lilac" />
              <span className="flex items-center gap-1 text-lg leading-snug font-semibold">
                {t('scoreSettings.bars')}
                <InfoTip name={t('scoreSettings.bars')}>{t('scoreSettings.barsInfo')}</InfoTip>
              </span>
            </div>
            <div className="w-full min-[380px]:w-44">
              <Stepper
                label={t('scoreSettings.bars')}
                typed
                value={bars}
                min={1}
                max={MOST_BARS}
                format={(value) => t('songs:setup.barsValue', { count: value })}
                onChange={(value) => actions.dispatch({ type: 'barCount', count: value })}
                decrease={t('songs:setup.fewerBars')}
                increase={t('songs:setup.moreBars')}
              />
            </div>
          </div>
        </SettingsGroup>
        <SettingsGroup
          flush
          title={t('scoreSettings.layout')}
          info={`${t('scoreSettings.staffSizeInfo')} ${t('scoreSettings.barsPerLineInfo')}`}
        >
          <ChoiceRow title={t('scoreSettings.staffSize')} icon={Ruler} paint="sky">
            <Dropdown
              label={t('scoreSettings.staffSize')}
              bare
              align="end"
              value={String(draft.layout?.staffSize ?? 100)}
              options={STAFF_SIZES.map((size) => ({
                value: String(size),
                label: t(`scoreSettings.staffSizes.${size}`),
              }))}
              onChange={(size) =>
                actions.dispatch({ type: 'layout', staffSize: Number(size) as StaffSize })
              }
            />
          </ChoiceRow>
          <ChoiceRow title={t('scoreSettings.barsPerLine')} icon={ListMusic} paint="grass">
            <Dropdown
              label={t('scoreSettings.barsPerLine')}
              bare
              align="end"
              value={String(draft.layout?.barsPerLine ?? 0)}
              options={[
                { value: '0', label: t('scoreSettings.asWritten') },
                ...Array.from({ length: BARS_PER_LINE.max }, (_, i) => ({
                  value: String(i + 1),
                  label: String(i + 1),
                })),
              ]}
              onChange={(most) =>
                actions.dispatch({
                  type: 'layout',
                  barsPerLine: most === '0' ? null : Number(most),
                })
              }
            />
          </ChoiceRow>
        </SettingsGroup>
        <SettingsGroup flush title={t('scoreSettings.editing')}>
          <SwitchRow
            icon={<TileMark icon={Volume2} paint="sand" />}
            label={t('scoreSettings.hearNotes')}
            info={t('scoreSettings.hearNotesInfo')}
            checked={editing.hearNotes}
            onCheckedChange={(hearNotes) => setEditing(settings, { hearNotes })}
            className="gap-3 border-0 pr-3 pl-2 font-semibold"
          />
          <RowLink
            title={t('scoreSettings.midi')}
            icon={Cable}
            paint="lilac"
            render={<Link to="/settings/connect-piano" />}
          />
          <RowLink
            title={t('scoreSettings.sound')}
            icon={Mic}
            paint="grass"
            render={<Link to="/settings/sound-and-recording" />}
          />
        </SettingsGroup>
      </div>
    </div>
  )
}
