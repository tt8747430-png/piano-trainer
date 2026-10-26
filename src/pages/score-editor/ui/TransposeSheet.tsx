import { ChevronLeft, Maximize2, Minus, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings } from '@/entities/settings'
import { firstLine, transpose, type Draft, type TransposeApplies } from '@/features/score-editor'
import {
  keySymbol,
  printedSymbol,
  relativeKey,
  transposedKey,
  TRANSPOSITION_RANGE,
  type Key,
} from '@/shared/lib/music'
import { Sheet, SheetContent, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ScoreSheet, type EditPrinted } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** How far the music moves, signed with a minus sign: `+2`, `−1`, `0`. */
const signed = (semitones: number): string =>
  semitones === 0 ? '0' : `${semitones > 0 ? '+' : '−'}${Math.abs(semitones)}`

/** A key named with its relative, the major first, as a key signature writes both: `E♭ / Cm`. */
const bothModes = (key: Key): string => {
  const major = key.minor ? relativeKey(key) : key
  const minor = key.minor ? key : relativeKey(key)
  return `${printedSymbol(keySymbol(major))} / ${printedSymbol(keySymbol(minor))}`
}

/** What a sheet only shown prints as it is: its printed things are no buttons to open. */
const shownAsPrinted: EditPrinted = (_printed, trigger) => trigger
const NO_TITLE = () => null
const NOTHING = () => undefined
const NO_TICKS = () => [] as const

/** A sheet only shown, the music moved: no caret, nothing to click; across in one line, or down. */
function PreviewSheet({ draft, view }: { draft: Draft; view: 'horizontal' | 'scroll' }) {
  const shown = useSettings(selectScoreView)
  return (
    <div inert className="pointer-events-none">
      <ScoreSheet
        draft={draft}
        caret={null}
        layer="chords"
        selection={null}
        onPlace={NOTHING}
        onReach={NOTHING}
        onDeselect={NOTHING}
        placesOf={NO_TICKS}
        tapsOf={NO_TICKS}
        chordNames={shown.chordNames}
        lyrics={shown.lyrics}
        hidden={shown.hidden}
        edit={shownAsPrinted}
        view={view}
        title={NO_TITLE}
      />
    </div>
  )
}

/**
 * Transpose (ADR 0110, the transpose sheets of notation apps): the semitones the song moves, − and +,
 * as far as its notes move the short way (−5 to +6); the key it lands in, its relative beside it
 * (`E♭ / Cm`), spelled by its simplest signature (ADR 0104); Apply to key and Apply to chords, each
 * its ⓘ; a preview of the first line moved, opened to the whole song full screen. Transpose writes
 * the song so, one edit Undo takes back; Cancel leaves it.
 */
export function TransposeSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const [semitones, setSemitones] = useState(0)
  const [applies, setApplies] = useState<TransposeApplies>({ key: true, chords: true })
  const [whole, setWhole] = useState(false)
  const moved = useMemo(
    () => (open ? transpose(draft, semitones, applies) : draft),
    [open, draft, semitones, applies],
  )
  const line = useMemo(() => firstLine(moved), [moved])
  // The key the song is written in once it is moved: its own, where the key is not applied.
  const shownKey = bothModes(applies.key ? transposedKey(draft.key, semitones) : draft.key)
  const change = (opened: boolean) => {
    // Opened afresh each time: from the song's key, both applied, the first line in sight.
    if (opened) {
      setSemitones(0)
      setApplies({ key: true, chords: true })
    }
    setWhole(false)
    onOpenChange(opened)
  }
  const apply = () => {
    actions.dispatch({ type: 'transpose', semitones, applies })
    change(false)
  }
  return (
    <Sheet open={open} onOpenChange={change}>
      <SheetContent
        title={whole ? t('transpose.whole') : t('transpose.title')}
        full={whole}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => change(false)}>
              {t('transpose.cancel')}
            </Button>
            <Button disabled={semitones === 0} onClick={apply}>
              {t('transpose.apply')}
            </Button>
          </div>
        }
      >
        {whole ? (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <Button variant="ghost" className="self-start" onClick={() => setWhole(false)}>
              <ChevronLeft data-icon="inline-start" aria-hidden />
              {t('transpose.title')}
            </Button>
            <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-background p-2">
              <PreviewSheet draft={moved} view="scroll" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-sm font-semibold text-muted-foreground">
                {t('transpose.semitones')}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={t('transpose.down')}
                  title={t('transpose.down')}
                  disabled={semitones <= TRANSPOSITION_RANGE.min}
                  onClick={() => setSemitones(semitones - 1)}
                >
                  <Minus aria-hidden />
                </Button>
                <output
                  aria-label={t('transpose.semitones')}
                  className="w-12 text-center text-xl font-semibold tabular-nums"
                >
                  {signed(semitones)}
                </output>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={t('transpose.up')}
                  title={t('transpose.up')}
                  disabled={semitones >= TRANSPOSITION_RANGE.max}
                  onClick={() => setSemitones(semitones + 1)}
                >
                  <Plus aria-hidden />
                </Button>
              </div>
              <p
                aria-live="polite"
                className="ms-auto rounded-full border border-border px-3 py-1 font-display text-lg font-semibold"
              >
                <span className="sr-only">
                  {semitones === 0
                    ? `${t('transpose.same')}: ${shownKey}`
                    : t('transpose.lands', { key: shownKey })}
                </span>
                <span aria-hidden>{shownKey}</span>
              </p>
            </div>
            <div className="flex flex-col">
              <SwitchRow
                label={t('transpose.key')}
                info={t('transpose.keyInfo')}
                checked={applies.key}
                onCheckedChange={(key) => setApplies({ ...applies, key })}
              />
              <SwitchRow
                label={t('transpose.chords')}
                info={t('transpose.chordsInfo')}
                checked={applies.chords}
                onCheckedChange={(chords) => setApplies({ ...applies, chords })}
                className="border-b-0"
              />
            </div>
            <section className="flex flex-col gap-2" aria-label={t('transpose.preview')}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{t('transpose.preview')}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t('transpose.open')}
                  title={t('transpose.open')}
                  onClick={() => setWhole(true)}
                >
                  <Maximize2 aria-hidden />
                </Button>
              </div>
              <button
                type="button"
                aria-label={t('transpose.open')}
                onClick={() => setWhole(true)}
                className="overflow-hidden rounded-2xl border border-border bg-background p-2 text-start"
              >
                <PreviewSheet draft={line} view="horizontal" />
              </button>
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
