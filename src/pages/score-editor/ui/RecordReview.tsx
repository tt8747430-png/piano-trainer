import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { quantise, type Take } from '@/entities/take'
import { barAt, type TakeInto } from '@/features/score-editor'
import { MIDDLE_C, type Midi } from '@/shared/lib/music'
import { notate, singleStaff } from '@/shared/lib/notation'
import { ConfirmDialog, Dropdown, NamedSegmented, SettingsGroup, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ScoreView } from '@/shared/ui/score'
import { TakeRoll } from '@/widgets/take-roll'
import { useLayerName } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { gridKey, reviewGrids, reviewMusic } from '../model/review'
import { TAKES_PAGE } from '../model/use-editor-takes'
import { useStaffHeads } from '../model/use-staff-heads'
import { useTakePlay } from '../model/use-take-play'
import { SheetBack } from './SheetBack'
import { TakeName } from './TakeName'

/** The engraved result's size: a little under the sheet's. */
const SCALE = 0.7
/** An eighth: what a take is snapped to until the learner says. */
const EIGHTH = '8'

/** A grid's name as Flat writes it: 1/8, 1/4t, 1/4. dotted. */
const gridName = (key: string) => `1/${key}`

/**
 * Review your recording (A40, Flat's): the take as it would be written, engraved, over its piano roll
 * (the notes as played faint, as snapped in the accent, Hide raw notes leaving the snapped alone);
 * Quantize, the shortest note it is snapped to; the split point, dragged on the roll, where the hands
 * part on the piano's staves; Into, for a score of other staves; Discard (asked first) and Save to
 * score, writing it from the caret's bar.
 */
export function RecordReview({ take }: { take: Take }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const key = useEditorState((state) => state.draft.key)
  const fromBar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const staves = useStaffHeads()
  const leadSheet = useEditorState((state) => state.draft.leadSheet)
  const layerName = useLayerName(staves)
  const play = useTakePlay(take)
  const grids = reviewGrids(take.meter)
  const [chosen, setChosen] = useState(EIGHTH)
  const grid = grids.find((each) => gridKey(each) === chosen) ?? grids[0]
  const [raw, setRaw] = useState(true)
  const [split, setSplit] = useState<Midi>(MIDDLE_C)
  const [into, setInto] = useState<TakeInto>(leadSheet ? singleStaff(0) : 'both')
  const [discarding, setDiscarding] = useState(false)
  const notes = useMemo(() => {
    const snapped = reviewGrids(take.meter).find((each) => gridKey(each) === chosen)
    return snapped ? quantise(take, snapped) : []
  }, [take, chosen])
  const score = useMemo(
    () => notate(reviewMusic(notes, { key, meter: take.meter, split })),
    [notes, key, take.meter, split],
  )
  const piano = into === 'both'
  const intoGroups = [
    ...(leadSheet
      ? []
      : [
          {
            label: t('recorder.into.piano'),
            options: (['both', 'rh', 'lh'] as const).map((value) => ({
              value,
              label: t(`recorder.into.${value}`),
            })),
          },
        ]),
    ...(staves.length > 0
      ? [
          {
            label: t('recorder.into.staves'),
            options: staves.map((_, place) => ({
              value: singleStaff(place),
              label: layerName(singleStaff(place)),
            })),
          },
        ]
      : []),
  ]
  return (
    <div className="flex flex-col gap-4 pt-2">
      <SheetBack onBack={() => takes.show(TAKES_PAGE)} />
      <TakeName take={take} />
      <section aria-label={t('review.result')} className="flex flex-col gap-2">
        <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-control border border-border bg-card p-2 scrollbar-none">
          <ScoreView
            score={score}
            scale={SCALE}
            fingers={false}
            staves={piano ? ['treble', 'bass'] : undefined}
          />
        </div>
        <TakeRoll
          take={take}
          playing={play.playing}
          onPlayFrom={play.playFrom}
          quantised={notes}
          raw={raw}
          split={piano ? { key: split, onChange: setSplit } : undefined}
        />
      </section>
      <NamedSegmented
        label={t('review.quantize')}
        value={chosen}
        options={grids.map((each) => ({
          value: gridKey(each),
          label: gridName(gridKey(each)),
          title: gridName(gridKey(each)),
        }))}
        onChange={setChosen}
      />
      <SettingsGroup flush>
        <SwitchRow
          label={t('review.hideRaw')}
          checked={!raw}
          onCheckedChange={(on) => setRaw(!on)}
        />
      </SettingsGroup>
      {intoGroups.reduce((count, group) => count + group.options.length, 0) > 1 ? (
        <Dropdown
          label={t('recorder.into.label')}
          value={into}
          groups={intoGroups}
          onChange={setInto}
        />
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" variant="outline" onClick={() => setDiscarding(true)}>
          {t('review.discard')}
        </Button>
        <Button
          size="lg"
          title={t('recorder.writeFrom', { n: fromBar })}
          onClick={() => grid && takes.write(take, { into, split, grid })}
        >
          {t('review.save')}
        </Button>
      </div>
      <ConfirmDialog
        open={discarding}
        onOpenChange={setDiscarding}
        title={t('review.discardTitle')}
        body={t('review.discardBody')}
        action={t('review.discard')}
        onConfirm={() => {
          setDiscarding(false)
          takes.remove(take.id)
          takes.show(TAKES_PAGE)
        }}
      />
    </div>
  )
}
