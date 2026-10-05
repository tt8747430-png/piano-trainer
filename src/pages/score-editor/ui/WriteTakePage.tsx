import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { takeGrids, type Take } from '@/entities/take'
import { barAt, TAKE_INTO, type TakeInto } from '@/features/score-editor'
import { midi, MIDDLE_C, printedKeyName, type Midi } from '@/shared/lib/music'
import type { Duration } from '@/shared/lib/notation'
import { Dropdown, Fact, NamedSegmented, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { TAKES_PAGE } from '../model/use-editor-takes'
import { VALUE_GLYPHS } from '../model/value-words'
import { SheetBack } from './SheetBack'
import { TakeName } from './TakeName'
import { useValueWord } from './use-value-word'

/** The keys from `from` to `to` a take may be split at, under their range. */
function splitGroup(from: number, to: number) {
  return {
    label: `${printedKeyName(midi(from))}–${printedKeyName(midi(to))}`,
    options: Array.from({ length: to - from + 1 }, (_, i) => {
      const key = midi(from + i)
      return { value: key, label: printedKeyName(key) }
    }),
  }
}

/** The keys a take may be split at, C2 to C6: an octave a group, the last up to C6. */
const SPLITS = [splitGroup(36, 47), splitGroup(48, 59), splitGroup(60, 71), splitGroup(72, 84)]

/** A note value as a choice's value: `8`, `4d` dotted, `8t` a triplet's. */
const gridKey = ({ value, dots, triplet }: Duration): string =>
  `${value}${dots === 1 ? 'd' : ''}${triplet ? 't' : ''}`
/** A note value's glyph, dotted or marked a triplet's. */
const gridGlyph = ({ value, dots, triplet }: Duration): string =>
  `${VALUE_GLYPHS[value]}${dots === 1 ? '.' : ''}${triplet ? '³' : ''}`

/** An eighth: the shortest note a take is snapped to unless the learner says. */
const EIGHTH = gridKey({ value: 8, dots: 0, triplet: false })

/**
 * A take's page of the sheet (spec 2026-10-05 §4): where it goes, the key the hands split at, the
 * shortest note it is snapped to (a value of the meter it was played in), and Write from the caret's
 * bar.
 */
export function WriteTakePage({ take }: { take: Take }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const fromBar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const valueWord = useValueWord()
  const [into, setInto] = useState<TakeInto>('both')
  const [split, setSplit] = useState<Midi>(MIDDLE_C)
  const [chosen, setChosen] = useState(EIGHTH)
  const grids = takeGrids(take.meter)
  const grid = grids.find((each) => gridKey(each) === chosen) ?? grids[0]
  return (
    <div className="flex flex-col gap-5 pt-2">
      <SheetBack onBack={() => takes.show(TAKES_PAGE)} />
      <TakeName take={take} />
      <Segmented
        label={t('recorder.into.label')}
        value={into}
        options={TAKE_INTO.map((value) => ({ value, label: t(`recorder.into.${value}`) }))}
        onChange={setInto}
      />
      {into === 'both' ? (
        <Dropdown label={t('recorder.split')} value={split} groups={SPLITS} onChange={setSplit} />
      ) : null}
      <NamedSegmented
        label={t('recorder.grid')}
        value={gridKey(grid)}
        options={grids.map((each) => ({
          value: gridKey(each),
          label: gridGlyph(each),
          title: valueWord(each),
        }))}
        onChange={setChosen}
      />
      <dl>
        <Fact term={t('recorder.from')}>{fromBar}</Fact>
      </dl>
      <Button size="lg" onClick={() => takes.write(take, { into, split, grid })}>
        {t('recorder.writeIt')}
      </Button>
    </div>
  )
}
