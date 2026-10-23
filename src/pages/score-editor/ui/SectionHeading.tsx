import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BUILT_IN_PATTERNS, isPatternId, pickerShelves, useFullShelfName } from '@/entities/pattern'
import { SONG_SECTION_KINDS, useSectionHeading } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { ActionMenu, Dropdown } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The song's own pattern, in the section's choice: the section plays what the song plays. */
const SONG = 'song'

/**
 * A section's heading, opening a menu: name it as a song's part (Intro to Ending), join it to the
 * section before, or give it a pattern of its own (ADR 0065), the song's otherwise; a pattern of its
 * own is named beside it.
 */
export function SectionHeading({ section }: { section: number }) {
  const { t } = useTranslation(['editor', 'piece'])
  const { actions } = useScoreEditorContext()
  const locale = useLocale()
  const shelfName = useFullShelfName()
  const heading = useEditorState((state) => state.draft.sections[section]?.heading)
  const songPattern = useEditorState((state) => state.draft.pattern)
  const named = useSectionHeading()
  if (!heading) return null
  const nameOf = (id: string) => {
    const found = isPatternId(id) ? BUILT_IN_PATTERNS.get(id) : undefined
    return found ? localText(found.name, locale) : id
  }
  return (
    <h2 className="flex flex-wrap items-baseline gap-x-2 text-xl">
      <ActionMenu
        label={t('editor:section.kind')}
        // A heading that opens its menu, as a notation app's section names: no field's box round it.
        render={
          <Button
            variant="ghost"
            className="-ml-2 h-auto min-h-11 gap-1 rounded-xl px-2 py-1 font-display text-xl font-semibold"
          />
        }
        trigger={
          <>
            {named({ ...heading, lines: [] })}
            <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
          </>
        }
        actions={[
          ...SONG_SECTION_KINDS.filter((kind) => kind !== heading.kind).map((kind) => ({
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
      >
        <div className="border-t border-hairline px-1 pt-2">
          <Dropdown<string>
            label={t('editor:section.pattern')}
            value={heading.pattern ?? SONG}
            groups={[
              {
                label: t('editor:section.thisSong'),
                options: [
                  {
                    value: SONG,
                    label: t('editor:section.songPattern', { name: nameOf(songPattern) }),
                  },
                ],
              },
              ...pickerShelves(
                BUILT_IN_PATTERNS,
                { favourites: [], hidden: [] },
                heading.pattern ?? 'chart',
              ).map((shelf) => ({
                label: shelfName(shelf),
                options: shelf.patterns.flatMap((pattern) =>
                  isPatternId(pattern.ref)
                    ? [
                        {
                          value: pattern.ref,
                          label: localText(pattern.name, locale),
                          detail: localText(pattern.idea, locale),
                        },
                      ]
                    : [],
                ),
              })),
            ]}
            onChange={(chosen) =>
              actions.dispatch({
                type: 'sectionPattern',
                section,
                pattern: isPatternId(chosen) ? chosen : null,
              })
            }
          />
        </div>
      </ActionMenu>
      {heading.pattern ? (
        <span className="font-sans text-sm text-muted-foreground">
          {t('editor:section.plays', { name: nameOf(heading.pattern) })}
        </span>
      ) : null}
    </h2>
  )
}
