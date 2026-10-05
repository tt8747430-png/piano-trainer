import { Link, useParams, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { CUSTOM, isTrainerId, ROUNDS, type TrainerId, type TrainerView } from '@/features/trainer'
import { useGoBack, useViewChange } from '@/shared/lib'
import { BackButton, ButtonLink, Dropdown, NamedSegmented, ScreenHeader } from '@/shared/ui'
import { TrainerChoice } from '@/widgets/trainer-choice'
import { useTrainerScreen } from '../model/use-trainer-screen'
import { TrainerRecordLine } from './TrainerRecordLine'
import { TrainerRunView } from './TrainerRunView'
import { AutoNextToggle } from './AutoNextToggle'
import { useLevelName } from './use-level-name'

/** A trainer, named by the path: the one Quiz opened. */
export function TrainerPage() {
  const { trainerId } = useParams({ from: '/shell/practice/trainers/$trainerId' })
  return isTrainerId(trainerId) ? <TrainerScreenView key={trainerId} id={trainerId} /> : null
}

/** A trainer under its name, with its level, rounds and record, and a run of it. */
function TrainerScreenView({ id }: { id: TrainerId }) {
  const { t } = useTranslation('quiz')
  const view = useSearch({ from: '/shell/practice/trainers/$trainerId' })
  const setView = useViewChange<TrainerView>()
  const close = useGoBack({ to: '/practice/quiz' })
  const { trainer, level, asks, runKey, runId, record } = useTrainerScreen(id, view)
  const levelName = useLevelName()
  const levels = [...trainer.levels, ...(trainer.custom.length > 0 ? [CUSTOM] : [])].map(
    (value) => ({ value, label: levelName(id, value) }),
  )
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t(`trainers.${id}`)}
        back={<BackButton fallback={{ to: '/practice/quiz' }} />}
        actions={<MidiButton />}
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {levels.length > 0 ? (
            <Dropdown
              label={t('level')}
              value={level}
              options={levels}
              onChange={(next) => setView({ level: next === trainer.levels[0] ? undefined : next })}
            />
          ) : null}
          <NamedSegmented
            label={t('rounds.label')}
            value={view.rounds}
            options={ROUNDS.map((rounds) =>
              rounds === 0
                ? { value: rounds, label: '∞', title: t('rounds.untilStopped') }
                : { value: rounds, label: String(rounds) },
            )}
            onChange={(rounds) => setView({ rounds })}
          />
          <AutoNextToggle />
        </div>
        {level === CUSTOM ? (
          <TrainerChoice trainer={trainer} view={view} onChange={setView} />
        ) : null}
        <TrainerRecordLine record={record} />
      </div>
      {asks ? (
        <TrainerRunView
          key={runId}
          asks={asks}
          rounds={view.rounds}
          runKey={runKey}
          onDone={close}
        />
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-lg">{t('gaps.none')}</p>
          <ButtonLink
            variant="soft"
            render={
              <Link to="/practice/trainers/$trainerId" params={{ trainerId: 'build-chord' }} />
            }
          >
            {t('gaps.toBuildChord')}
          </ButtonLink>
        </div>
      )}
    </div>
  )
}
