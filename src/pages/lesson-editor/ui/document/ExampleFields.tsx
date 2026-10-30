import { Plus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { lessonById, lessonIds, type LessonBlock, type LessonLink } from '@/entities/lesson'
import { BUILT_IN_PATTERNS, PATTERN_IDS, type PatternId } from '@/entities/pattern'
import { entryTitles, piecesPlaying } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import {
  C_MAJOR,
  keyFromParam,
  keyParam,
  noteFromParam,
  noteParam,
  SCALE_KINDS,
} from '@/shared/lib/music'
import { Dropdown, InfoTip, KeyChoice, NoteChoice, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'

type Voicings = Extract<LessonBlock, { kind: 'voicings' }>
type PatternBlock = Extract<LessonBlock, { kind: 'pattern' }>
type LinkBlock = Extract<LessonBlock, { kind: 'link' }>

/**
 * Voicings as a sheet writes them: the key their signature writes, S A T B named or not, then each
 * voicing a row of its chord symbol and its keys (`D3 A♭3 | C4 F4`), removed by its ✕; Add a voicing
 * at their end. Keys that do not read leave the example undrawn until they do.
 */
export function VoicingsFields({
  block,
  onChange,
}: {
  block: Voicings
  onChange: (block: LessonBlock) => void
}) {
  const { t } = useTranslation('learn')
  const set = (i: number, part: { symbol?: string; hands?: string }) =>
    onChange({
      ...block,
      voicings: block.voicings.map((voicing, j) => (j === i ? { ...voicing, ...part } : voicing)),
    })
  const { satb: _satb, ...unnamed } = block
  return (
    <>
      <KeyChoice
        value={keyParam(block.key ?? C_MAJOR)}
        onChange={(key) => onChange({ ...block, key: keyFromParam(key) })}
      />
      <SwitchRow
        label={t('edit.doc.satb')}
        checked={block.satb === true}
        onCheckedChange={(on) => onChange(on ? { ...block, satb: true } : unnamed)}
      />
      <div className="flex items-center gap-1 text-sm font-medium">
        {t('edit.doc.hands')}
        <InfoTip name={t('edit.doc.hands')}>{t('edit.doc.handsInfo')}</InfoTip>
      </div>
      <ol className="flex flex-col gap-2">
        {block.voicings.map((voicing, i) => (
          <li key={i} className="flex items-center gap-2">
            <Input
              aria-label={`${t('edit.doc.voicing', { n: i + 1 })}: ${t('edit.doc.symbol')}`}
              value={voicing.symbol}
              spellCheck={false}
              autoCapitalize="off"
              className="w-24 shrink-0 font-display"
              onChange={(event) => set(i, { symbol: event.target.value })}
            />
            <Input
              aria-label={`${t('edit.doc.voicing', { n: i + 1 })}: ${t('edit.doc.hands')}`}
              value={voicing.hands}
              spellCheck={false}
              autoCapitalize="off"
              className="min-w-0 flex-1 font-mono"
              onChange={(event) => set(i, { hands: event.target.value })}
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('edit.doc.removeVoicing', { n: i + 1 })}
              title={t('edit.doc.removeVoicing', { n: i + 1 })}
              disabled={block.voicings.length === 1}
              onClick={() =>
                onChange({ ...block, voicings: block.voicings.filter((_, j) => j !== i) })
              }
            >
              <X aria-hidden />
            </Button>
          </li>
        ))}
      </ol>
      <Button
        variant="outline"
        className="self-start"
        onClick={() =>
          onChange({
            ...block,
            voicings: [
              ...block.voicings,
              block.voicings.at(-1) ?? { symbol: 'C', hands: 'C3 | E4 G4' },
            ],
          })
        }
      >
        <Plus data-icon="inline-start" aria-hidden />
        {t('edit.doc.addVoicing')}
      </Button>
    </>
  )
}

/**
 * A pattern heard over a piece: the pattern chosen from the built-in ones, then the piece it is heard
 * over from those that play it (the first of them once the pattern changes).
 */
export function PatternFields({
  block,
  onChange,
}: {
  block: PatternBlock
  onChange: (block: LessonBlock) => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const pieces = piecesPlaying(block.pattern)
  const patternName = (id: PatternId) => {
    const pattern = BUILT_IN_PATTERNS.get(id)
    return pattern ? localText(pattern.name, locale) : id
  }
  return (
    <>
      <Dropdown
        label={t('edit.doc.pattern')}
        value={block.pattern}
        options={PATTERN_IDS.map((id) => ({ value: id, label: patternName(id) }))}
        onChange={(pattern) =>
          onChange({ ...block, pattern, piece: piecesPlaying(pattern)[0]?.id ?? block.piece })
        }
      />
      {pieces.length > 0 ? (
        <Dropdown
          label={t('edit.doc.piece')}
          value={block.piece}
          options={pieces.map((piece) => ({
            value: piece.id,
            label: entryTitles(piece, locale).primary,
          }))}
          onChange={(piece) => onChange({ ...block, piece })}
        />
      ) : null}
    </>
  )
}

/** What a link of each kind opens on its own, before anything is chosen for it. */
type Fresh = 'lesson' | 'chords' | 'scales' | 'key' | 'intervals' | 'progressions'
const FRESH: Readonly<Record<Fresh, LessonLink>> = {
  lesson: { opens: 'lesson', lesson: lessonIds()[0] ?? '' },
  chords: { opens: 'chords', chord: 'C' },
  scales: { opens: 'scales', root: C_MAJOR.tonic, scale: 'major' },
  key: { opens: 'key', key: C_MAJOR },
  intervals: { opens: 'intervals' },
  progressions: { opens: 'progressions', numerals: 'I IV V I', key: C_MAJOR },
}

/**
 * Where a link goes: what it opens (a lesson, a chord, a scale, a key, intervals, a progression),
 * then that one's own choice. A link of another kind (a song, the Player, a quiz …) keeps its target
 * as written, offered as such.
 */
export function LinkFields({
  block,
  onChange,
}: {
  block: LinkBlock
  onChange: (block: LessonBlock) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const locale = useLocale()
  const target = block.target
  const go = (next: LessonLink) => onChange({ ...block, target: next })
  const kinds = Object.keys(FRESH) as Fresh[]
  const fresh = (kind: string): kind is Fresh => kind in FRESH
  const asWritten = !fresh(target.opens)
  return (
    <>
      <Dropdown
        label={t('learn:edit.doc.opens')}
        value={asWritten ? 'other' : target.opens}
        options={[...kinds, ...(asWritten ? (['other'] as const) : [])].map((kind) => ({
          value: kind,
          label: t(`learn:edit.doc.opensKind.${kind}`),
        }))}
        onChange={(kind) => (kind === 'other' ? undefined : go(FRESH[kind]))}
      />
      {target.opens === 'lesson' ? (
        <Dropdown
          label={t('learn:edit.doc.lesson')}
          value={target.lesson}
          options={lessonIds().map((id) => ({
            value: id,
            label: localText(lessonById(id)?.title ?? { en: id, ru: id }, locale),
          }))}
          onChange={(lesson) => go({ ...target, lesson })}
        />
      ) : target.opens === 'chords' ? (
        <Input
          aria-label={t('learn:edit.doc.chord')}
          value={target.chord}
          spellCheck={false}
          autoCapitalize="off"
          className="font-display"
          onChange={(event) => go({ ...target, chord: event.target.value })}
        />
      ) : target.opens === 'scales' ? (
        <>
          <NoteChoice
            label={t('learn:edit.doc.root')}
            value={noteParam(target.root)}
            onChange={(root) => go({ ...target, root: noteFromParam(root) })}
          />
          <Dropdown
            label={t('learn:edit.doc.scale')}
            value={target.scale}
            options={SCALE_KINDS.map((scale) => ({
              value: scale,
              label: t(`music:scaleKind.${scale}`),
            }))}
            onChange={(scale) => go({ ...target, scale })}
          />
        </>
      ) : target.opens === 'key' ? (
        <KeyChoice
          value={keyParam(target.key)}
          onChange={(key) => go({ ...target, key: keyFromParam(key) })}
        />
      ) : target.opens === 'intervals' ? (
        <NoteChoice
          label={t('learn:edit.doc.root')}
          value={noteParam(target.root ?? C_MAJOR.tonic)}
          onChange={(root) => go({ ...target, root: noteFromParam(root) })}
        />
      ) : target.opens === 'progressions' ? (
        <>
          <Input
            aria-label={t('learn:edit.doc.numerals')}
            value={target.numerals}
            spellCheck={false}
            autoCapitalize="off"
            className="font-display"
            onChange={(event) => go({ ...target, numerals: event.target.value })}
          />
          <KeyChoice
            value={keyParam(target.key)}
            onChange={(key) => go({ ...target, key: keyFromParam(key) })}
          />
        </>
      ) : null}
    </>
  )
}
