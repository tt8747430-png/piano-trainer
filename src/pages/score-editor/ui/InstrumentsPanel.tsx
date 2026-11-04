import { ArrowUpDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, useStaffTitle } from '@/entities/piece'
import { VOICE_IDS, VOICES } from '@/features/edit-piece'
import {
  allPlay,
  isSolo,
  movedStaves,
  orderedStaves,
  trackOf,
  withAllPlaying,
  withShown,
  withSolo,
  withTrack,
  type TrackId,
} from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { singleStaff } from '@/shared/lib/notation'
import { ActionMenu, ConfirmDialog, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { StaffList, type StaffRow } from '@/widgets/instrument-list'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { instrumentCount, NEW_INSTRUMENTS, scoreOrder, voiceOf } from '../model/instruments'
import { useEditorStaves } from '../model/use-editor-staves'
import { useStaffHeads } from '../model/use-staff-heads'

/** The piano's two staves, heard and shown together as one instrument. */
const PIANO: readonly TrackId[] = ['treble', 'bass']

/** What Delete asks about: the staff at a place, or the piano. */
type Deleting = { readonly place: number; readonly name: string } | { readonly piano: string }

/**
 * The editor's Instruments (A40, Flat's): the score's staves heard (All, S) and in sight (the eye),
 * the Player's `staves` in the URL (A35); each single staff dragged into its place, renamed, changed
 * to another instrument or deleted (asked first); New instrument adds one; Sort › Score order stacks
 * the voices as a choir is.
 */
export function InstrumentsPanel() {
  const { t } = useTranslation(['editor', 'songs'])
  const locale = useLocale()
  const { actions, store } = useScoreEditorContext()
  const heads = useStaffHeads()
  const leadSheet = useEditorState((state) => state.draft.leadSheet)
  const names = useStaffNames(heads)
  const titleOf = useStaffTitle()
  const [staves, setStaves] = useEditorStaves()
  const [deleting, setDeleting] = useState<Deleting | null>(null)
  const tracks: TrackId[] = [
    ...heads.map((_, place) => singleStaff(place)),
    ...(leadSheet ? [] : PIANO),
  ]
  const playingAll = allPlay(staves, tracks)
  const instrumentName = (instrument: (typeof NEW_INSTRUMENTS)[number]) =>
    instrument === 'piano'
      ? t('songs:setup.piano')
      : instrument === 'staff'
        ? t('scoreSettings.staff')
        : localText(VOICES[instrument].name, locale)

  const rowOf = (key: string, name: string, own: readonly TrackId[]) => ({
    key,
    name,
    solo: !playingAll && isSolo(staves, own, tracks),
    shown: own.every((id) => trackOf(staves, id).show),
    onSolo: () => setStaves(withSolo(staves, own, tracks)),
    onShow: (shown: boolean) => setStaves(withShown(staves, own, shown, tracks)),
  })
  const lastStaff = leadSheet && heads.length === 1
  const single: StaffRow[] = heads.map((head, place) => {
    const name = titleOf(names[place], place)
    const kind = voiceOf(head.name) ?? 'staff'
    const change: MenuAction[] = [...VOICE_IDS, 'staff' as const].map((instrument) => ({
      key: `change-${instrument}`,
      label: instrumentName(instrument),
      group: t('instruments.change'),
      checked: kind === instrument,
      onSelect: () =>
        actions.dispatch(
          instrument === 'staff'
            ? { type: 'staffInstrument', place, clef: head.clef }
            : {
                type: 'staffInstrument',
                place,
                name: VOICES[instrument].name,
                clef: VOICES[instrument].clef,
              },
        ),
    }))
    return {
      ...rowOf(singleStaff(place), name, [singleStaff(place)]),
      movable: true,
      onRename: (text: string) => actions.dispatch({ type: 'renameStaff', place, name: text }),
      actions: [
        ...change,
        {
          key: 'delete',
          label: t('instruments.delete'),
          icon: Trash2,
          destructive: true,
          disabled: lastStaff,
          reason: lastStaff ? t('instruments.keepOne') : undefined,
          onSelect: () => setDeleting({ place, name }),
        },
      ],
    }
  })
  const piano: StaffRow[] = leadSheet
    ? []
    : [
        {
          ...rowOf('piano', t('songs:setup.piano'), PIANO),
          movable: false,
          actions: [
            {
              key: 'delete',
              label: t('instruments.delete'),
              icon: Trash2,
              destructive: true,
              disabled: heads.length === 0,
              reason: heads.length === 0 ? t('instruments.keepOne') : undefined,
              onSelect: () => setDeleting({ piano: t('songs:setup.piano') }),
            },
          ],
        },
      ]
  const reorder = (order: readonly number[]) => {
    if (order.every((at, i) => at === i)) return
    actions.dispatch({ type: 'orderStaves', order })
    setStaves(orderedStaves(staves, order))
  }
  const draft = store.getState().draft
  const offered: MenuAction[] = NEW_INSTRUMENTS.flatMap((instrument) => {
    const more = instrumentCount(draft, instrument).more
    if (instrument === 'piano' && !more) return []
    return [
      {
        key: instrument,
        label: instrumentName(instrument),
        disabled: !more,
        reason: more ? undefined : t('instruments.full'),
        onSelect: () => {
          if (more) actions.dispatch(more)
        },
      },
    ]
  })
  const confirm = () => {
    if (!deleting) return
    if ('piano' in deleting) {
      actions.dispatch({ type: 'piano', hidden: true })
      setStaves(PIANO.reduce((kept, id) => withTrack(kept, id, { play: true, show: true }), staves))
    } else {
      actions.dispatch({ type: 'removeStaff', place: deleting.place })
      setStaves(movedStaves(staves, deleting.place, null))
    }
    setDeleting(null)
  }
  return (
    <>
      <StaffList
        label={t('panel.tabs.instruments')}
        rows={[...single, ...piano]}
        all={playingAll}
        onAll={(on) => setStaves(withAllPlaying(staves, tracks, on))}
        onMove={(order) => reorder(order.map((key) => Number(key.slice('staff'.length))))}
        onNew={offered}
        sort={
          <ActionMenu
            label={t('instruments.sort')}
            align="end"
            render={<Button variant="ghost" />}
            trigger={
              <>
                <ArrowUpDown aria-hidden />
                {t('instruments.sort')}
              </>
            }
            actions={[
              {
                key: 'score',
                label: t('instruments.scoreOrder'),
                disabled: heads.length < 2,
                onSelect: () => reorder(scoreOrder(heads)),
              },
            ]}
          />
        }
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title={t('instruments.deleteTitle', {
          staff: deleting ? ('piano' in deleting ? deleting.piano : deleting.name) : '',
        })}
        body={t(
          deleting && 'piano' in deleting ? 'instruments.pianoBody' : 'instruments.deleteBody',
        )}
        action={t('instruments.deleteAction')}
        onConfirm={confirm}
      />
    </>
  )
}
