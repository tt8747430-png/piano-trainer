import { useSearch } from '@tanstack/react-router'
import {
  AudioWaveform,
  ChartNoAxesColumnIncreasing,
  Ear,
  Hand,
  KeyboardMusic,
  ListMusic,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { ScreenHeader } from '@/shared/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/primitives/tabs'
import { GapsLink } from '@/widgets/trainer-list'
import { PRACTICE_TOPICS, type PracticeHubView, type PracticeTopic } from '../model/topics'
import { TopicPanel } from './TopicPanel'

/** Each topic's mark on its tab. */
const TOPIC_ICON: Readonly<Record<PracticeTopic, LucideIcon>> = {
  chords: KeyboardMusic,
  scales: ChartNoAxesColumnIncreasing,
  ear: Ear,
  progressions: ListMusic,
  accompaniment: AudioWaveform,
  technique: Hand,
}

const isTopic = (value: unknown): value is PracticeTopic =>
  PRACTICE_TOPICS.some((topic) => topic === value)

/**
 * Practice: everything practised, a topic at a time (the URL holds it, and the place comes back on
 * it): the pages that explore the topic, the trainers that quiz it, and the exercises and pieces
 * that play it in the Player. My gaps, which checks across topics, is in the bar.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const { topic } = useSearch({ from: '/shell/practice' })
  const onChange = useViewChange<PracticeHubView>()
  return (
    <div className="flex flex-col">
      <ScreenHeader title={t('title')} actions={<GapsLink />} />
      <Tabs
        value={topic}
        onValueChange={(next: unknown) => {
          if (isTopic(next)) onChange({ topic: next })
        }}
      >
        <TabsList aria-label={t('topics.label')} className="-mx-gutter px-gutter">
          {PRACTICE_TOPICS.map((id) => {
            const Icon = TOPIC_ICON[id]
            return (
              <TabsTrigger key={id} value={id}>
                <Icon aria-hidden />
                {t(`topics.${id}`)}
              </TabsTrigger>
            )
          })}
        </TabsList>
        <TabsContent value={topic}>
          <TopicPanel topic={topic} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
