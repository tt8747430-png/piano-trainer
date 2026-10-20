import {
  ClipboardPaste,
  Copy,
  Heading,
  Merge,
  Minus,
  Plus,
  Scissors,
  WrapText,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { barAt, barLengths, type BarEdit } from '@/features/score-editor'
import { TICKS_PER_BEAT, timeSignature, timeSignatureText } from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The edits of the form by what they act on: the bars, the line, the section, the clipboard. */
const GROUPS: readonly (readonly [
  'bar' | 'line' | 'section' | 'clipboard',
  readonly (readonly [BarEdit, LucideIcon])[],
])[] = [
  [
    'bar',
    [
      ['insert', Plus],
      ['delete', Minus],
    ],
  ],
  [
    'line',
    [
      ['newLine', WrapText],
      ['joinLine', Merge],
    ],
  ],
  ['section', [['newSection', Heading]]],
  [
    'clipboard',
    [
      ['copy', Copy],
      ['cut', Scissors],
      ['paste', ClipboardPaste],
    ],
  ],
]

/**
 * The Bars tab, as a notation app's: each edit named by what it does and grouped by what it acts on
 * (the bars chosen, else the caret's; its line; its section; the clipboard), and the caret's bar's
 * length as its time signature.
 */
export function BarKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  const ticks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  const hasClip = useEditorState((state) => state.clip !== null)
  return (
    <div className="col-span-full flex flex-wrap items-end gap-x-4 gap-y-3">
      {GROUPS.map(([group, edits]) => (
        <div
          key={group}
          role="group"
          aria-label={t(`bars.groups.${group}`)}
          className="flex flex-col gap-1"
        >
          <span aria-hidden className="text-xs font-semibold text-muted-foreground">
            {t(`bars.groups.${group}`)}
          </span>
          <div className="flex gap-1">
            {edits.map(([edit, Icon]) => (
              <Button
                key={edit}
                variant="outline"
                className="h-10 rounded-xl px-3 text-sm"
                disabled={edit === 'paste' && !hasClip}
                onClick={() => actions.dispatch({ type: 'bars', edit })}
              >
                <Icon data-icon="inline-start" aria-hidden />
                {t(`bars.${edit}`)}
              </Button>
            ))}
          </div>
        </div>
      ))}
      <div className="min-w-40">
        <Dropdown<number>
          label={t('bars.length')}
          value={ticks}
          options={barLengths(meter).map((length) => ({
            value: length,
            label: timeSignatureText(timeSignature(length / TICKS_PER_BEAT, meter)),
          }))}
          onChange={(length) => actions.dispatch({ type: 'barLength', ticks: length })}
        />
      </div>
    </div>
  )
}
