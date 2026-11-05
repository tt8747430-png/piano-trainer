import { Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CARD_DENSITIES,
  CARD_SHOWS,
  DEFAULT_CARD_LOOK,
  childFolders,
  useFolderName,
  useLibrary,
  useLibraryLayout,
  useLibraryStoreApi,
  type CardLook,
  type CardPlace,
  type ShelvedFolder,
} from '@/entities/library'
import { resetCardLook, setCardLook } from '@/features/manage-library'
import {
  BackButton,
  ButtonLink,
  ChoiceCard,
  ConfirmDialog,
  NotFound,
  ScreenHeader,
  SettingsGroup,
  SwitchRow,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { CardLookProvider, cardLookProps, FolderRow, SongRow } from '@/widgets/song-library'
import { StyleEditor } from '@/widgets/style-editor'
import { useLibraryPage } from '../model/use-library-page'

/** Where Apply to… keeps the look: this place, it with its subfolders, or every folder. */
type Reach = 'this' | 'below' | 'every'

const NO_FILTER = {
  q: '',
  stage: 'any',
  key: '',
  favourites: false,
  folder: 'any',
  learned: 'any',
} as const

/** A folder's Card style (R29 B9), reached from its Settings › Appearance. */
export function FolderCardStylePage() {
  const { t } = useTranslation('songs')
  const { folderId } = useParams({ from: '/shell/songs/folders/$folderId/card-style' })
  const { folders } = useLibraryLayout()
  const folder = folders.find((each) => each.id === folderId)
  if (!folder)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('title')}</ButtonLink>
      </NotFound>
    )
  return <CardStyle key={folder.id} folder={folder} />
}

/** Home's Card style (R29 B9): the library's own rows, reached from Songs' Card style. */
export function HomeCardStylePage() {
  return <CardStyle folder={null} />
}

/**
 * Card style (R29 B9, memory-palaces' deck card style): the place's look edited on a live preview of
 * its first rows: the style editor, What cards show, Density; Reset, and Apply to… this place, it
 * and its subfolders, or every folder (asked first). Kept only on Apply.
 */
function CardStyle({ folder }: { folder: ShelvedFolder | null }) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const store = useLibraryStoreApi()
  const layout = useLibraryLayout()
  const place: CardPlace = folder?.id ?? 'home'
  const saved = useLibrary((state) => state.cardLooks[place])
  const [draft, setDraft] = useState<CardLook>(saved ?? DEFAULT_CARD_LOOK)
  const [reach, setReach] = useState<Reach>('this')
  const [asking, setAsking] = useState(false)
  const [said, setSaid] = useState<string | null>(null)
  const page = useLibraryPage(folder, NO_FILTER)

  // Every folder under this one, at any depth (Home: every folder).
  const below = (from: CardPlace): CardPlace[] => {
    const children = childFolders(layout.folders, from === 'home' ? null : from)
    return children.flatMap((each): CardPlace[] => [each.id, ...below(each.id)])
  }
  const subfolders = below(place)
  const everyFolder: CardPlace[] = ['home', ...layout.folders.map((each) => each.id)]
  const apply = (places: readonly CardPlace[]) => {
    setCardLook(store, places, draft)
    setSaid(t('cardStyle.applied', { count: places.length }))
  }
  const onApply = () =>
    reach === 'every'
      ? setAsking(true)
      : apply(reach === 'below' ? [place, ...subfolders] : [place])

  const rows = [
    ...page.view.folders
      .slice(0, 3)
      .map(({ folder: each, ...holds }) => (
        <FolderRow
          key={each.id}
          folder={each}
          holds={holds}
          actions={[]}
          onSelect={() => undefined}
        />
      )),
    ...page.view.groups
      .flatMap((group) => group.entries)
      .map((entry) => (
        <SongRow
          key={entry.id}
          entry={entry}
          favourite={page.favourites.includes(entry.id)}
          actions={[]}
          onSelect={() => undefined}
        />
      )),
  ].slice(0, 3)

  const preview = (
    <CardLookProvider value={draft}>
      {/* Seen, never used: its rows lead nowhere while the look is edited. */}
      <div inert>
        {rows.length > 0 ? (
          <ul className="grid-cards auto-rows-fr gap-2" {...cardLookProps(draft)}>
            {rows}
          </ul>
        ) : (
          <p className="px-1 text-muted-foreground">{t('cardStyle.empty')}</p>
        )}
      </div>
    </CardLookProvider>
  )

  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('cardStyle.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="px-1 font-display text-2xl font-semibold text-balance">
          {folder ? nameOf(folder) : t('library.home')}
        </p>
        <StyleEditor
          value={draft.style}
          onChange={(style) => setDraft({ ...draft, style })}
          preview={preview}
        />
        <SettingsGroup title={t('cardStyle.shows')}>
          {CARD_SHOWS.map((show) => (
            <SwitchRow
              key={show}
              label={t(`cardStyle.show.${show}`)}
              checked={draft.show[show]}
              onCheckedChange={(on) => setDraft({ ...draft, show: { ...draft.show, [show]: on } })}
            />
          ))}
        </SettingsGroup>
        <ChoiceCard
          title={t('cardStyle.density')}
          value={draft.density}
          options={CARD_DENSITIES.map((density) => ({
            value: density,
            label: t(`cardStyle.densities.${density}.label`),
            example: t(`cardStyle.densities.${density}.example`),
          }))}
          onChange={(density) => setDraft({ ...draft, density })}
        />
        <ChoiceCard<Reach>
          title={t('cardStyle.applyTo')}
          value={reach}
          options={[
            { value: 'this', label: t(folder ? 'cardStyle.thisFolder' : 'cardStyle.homeOnly') },
            ...(subfolders.length > 0
              ? [
                  {
                    value: 'below' as const,
                    label: t('cardStyle.withSubfolders', { count: subfolders.length }),
                  },
                ]
              : []),
            {
              value: 'every',
              label: t('cardStyle.everyFolder', { count: everyFolder.length }),
            },
          ]}
          onChange={setReach}
        />
        <div className="flex flex-wrap items-center justify-end gap-3">
          {said ? (
            <p role="status" className="mr-auto text-sm text-muted-foreground">
              {said}
            </p>
          ) : null}
          <Button
            variant="ghost"
            onClick={() => {
              resetCardLook(store, place)
              setDraft(DEFAULT_CARD_LOOK)
              setSaid(t('cardStyle.resetDone'))
            }}
          >
            {t('cardStyle.reset')}
          </Button>
          <Button onClick={onApply}>{t('cardStyle.apply')}</Button>
        </div>
      </div>
      <ConfirmDialog
        open={asking}
        onOpenChange={setAsking}
        title={t('cardStyle.everyTitle')}
        body={t('cardStyle.everySays', { count: everyFolder.length })}
        action={t('cardStyle.apply')}
        destructive={false}
        onConfirm={() => apply(everyFolder)}
      />
    </div>
  )
}
