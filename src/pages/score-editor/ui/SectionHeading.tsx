import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SECTION_KINDS, useSectionHeading } from '@/entities/piece'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { ActionMenu } from './ActionMenu'

/** A section's heading, a pull-down: make it another kind, or join it to the section before. */
export function SectionHeading({ section }: { section: number }) {
  const { t } = useTranslation(['editor', 'piece'])
  const { actions } = useScoreEditorContext()
  const heading = useEditorState((state) => state.draft.sections[section]?.heading)
  const named = useSectionHeading()
  if (!heading) return null
  return (
    <h2 className="text-xl">
      <ActionMenu
        label={t('editor:section.kind')}
        trigger={
          <>
            {named({ ...heading, lines: [] })}
            <ChevronDown data-icon="inline-end" />
          </>
        }
        actions={[
          ...SECTION_KINDS.filter((kind) => kind !== heading.kind).map((kind) => ({
            key: kind,
            label: t(`piece:section.${kind}`),
            onSelect: () => actions.dispatch({ type: 'sectionKind', section, kind }),
          })),
          ...(section > 0
            ? [
                {
                  key: 'join',
                  label: t('editor:section.join'),
                  onSelect: () => actions.dispatch({ type: 'joinSection', section }),
                },
              ]
            : []),
        ]}
      />
    </h2>
  )
}
