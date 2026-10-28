import { Link, useParams, useSearch } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { CUSTOM, isTrainerId, type TrainerId, type TrainerView } from '@/features/trainer'
import { useViewChange } from '@/shared/lib'
import { BackButton, ButtonLink, RoundButton, ScreenHeader } from '@/shared/ui'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { TrainerSetup } from '@/widgets/trainer-setup'
import { useTrainerScreen } from '../model/use-trainer-screen'
import { TrainerRecordLine } from './TrainerRecordLine'
import { TrainerRunView } from './TrainerRunView'
import { useLevelName } from './use-level-name'

/** A trainer, named by the path: the one Quiz opened. */
export function TrainerPage() {
  const { trainerId } = useParams({ from: '/shell/practice/quiz/$trainerId' })
  return isTrainerId(trainerId) ? <TrainerScreenView key={trainerId} id={trainerId} /> : null
}

/**
 * A trainer under its name: its setup (the one template every trainer shares), then, once started,
 * a run of it in the setup's place, closed back to the setup by its X or its results' Done.
 */
function TrainerScreenView({ id }: { id: TrainerId }) {
  const { t } = useTranslation(['quiz', 'common'])
  const view = useSearch({ from: '/shell/practice/quiz/$trainerId' })
  const setView = useViewChange<TrainerView>()
  const [running, setRunning] = useState(false)
  const { trainer, level, asks, runKey, runId, record } = useTrainerScreen(id, view)
  const levelName = useLevelName()
  const levels = [...trainer.levels, ...(trainer.custom.length > 0 ? [CUSTOM] : [])].map(
    (value) => ({ value, label: levelName(id, value) }),
  )
  const close = () => setRunning(false)
  return (
    <div className="flex flex-col gap-6 landscape-phone:gap-3">
      <ScreenHeader
        title={t(`trainers.${id}`)}
        back={
          running ? (
            <RoundButton label={t('common:close')} icon={X} onClick={close} />
          ) : (
            <BackButton fallback={{ to: '/practice/quiz' }} />
          )
        }
        actions={<MidiButton />}
      />
      {!asks ? (
        // Nothing to ask yet: said as every empty screen says it, with a way to a trainer.
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('gaps.none')}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink
              variant="soft"
              render={
                <Link
                  to="/practice/quiz/$trainerId"
                  params={{ trainerId: 'chords' }}
                  search={{ drill: 'entry' }}
                />
              }
            >
              {t('gaps.toBuildChord')}
            </ButtonLink>
          </EmptyContent>
        </Empty>
      ) : running ? (
        <TrainerRunView
          key={runId}
          asks={asks}
          rounds={view.rounds}
          limit={view.limit}
          runKey={runKey}
          onDone={close}
        />
      ) : (
        <TrainerSetup
          trainer={trainer}
          view={view}
          level={level}
          levels={levels}
          onChange={setView}
          onStart={() => setRunning(true)}
          footer={<TrainerRecordLine record={record} />}
        />
      )}
    </div>
  )
}
