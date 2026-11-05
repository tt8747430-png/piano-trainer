import { Link, useParams } from '@tanstack/react-router'
import { Check, Layers, Laptop, RotateCcw, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
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
import { cn, useMediaQuery } from '@/shared/lib'
import { sameStyle } from '@/shared/lib/style'
import {
  ActionMenu,
  BackButton,
  ButtonLink,
  ConfirmDialog,
  Docked,
  LIBRARY_PANES,
  NotFound,
  RoundButton,
  ScreenHeader,
  Segmented,
  SettingsGroup,
  SwitchRow,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { CardLookProvider, cardLookProps, FolderRow, SongRow } from '@/widgets/song-library'
import { StyleEditor } from '@/widgets/style-editor'
import { useLibraryPage, type LibraryPage } from '../model/use-library-page'
import { SongTable } from './SongTable'

/** Which device the preview draws the rows on. */
type Device = 'phone' | 'laptop'

const NO_FILTER = {
  q: '',
  stage: 'any',
  key: '',
  favourites: false,
  folder: 'any',
  learned: 'any',
} as const

/** Whether two looks draw the same. */
const sameLook = (a: CardLook, b: CardLook) =>
  sameStyle(a.style, b.style) && CARD_SHOWS.every((show) => a.show[show] === b.show[show])

/** A folder's Card style (R29 B9), from its ⋯. */
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

/** The library home's Card style (R29 B9), from Songs' More. */
export function HomeCardStylePage() {
  return <CardStyle folder={null} />
}

/**
 * Card style (R32-C, memory-palaces' deck card style): the place's look, edited on a pinned preview
 * of its own rows as a phone or a laptop draws them; the style editor, then Card contents. Reset to
 * default in the bar; at the foot Apply to… (this place, it with its subfolders, or every folder,
 * asked first) and Apply, which keeps the draft for this place. Nothing is kept until then.
 */
function CardStyle({ folder }: { folder: ShelvedFolder | null }) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const store = useLibraryStoreApi()
  const layout = useLibraryLayout()
  const laptop = useMediaQuery(LIBRARY_PANES)
  const place: CardPlace = folder?.id ?? 'home'
  const saved = useLibrary((state) => state.cardLooks[place]) ?? DEFAULT_CARD_LOOK
  const [draft, setDraft] = useState<CardLook>(saved)
  const [device, setDevice] = useState<Device>(laptop ? 'laptop' : 'phone')
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
  // The app's own look is kept as none: the place reads the default again.
  const apply = (places: readonly CardPlace[]) => {
    if (sameLook(draft, DEFAULT_CARD_LOOK)) for (const each of places) resetCardLook(store, each)
    else setCardLook(store, places, draft)
    setSaid(t('cardStyle.applied', { count: places.length }))
  }
  const change = (next: CardLook) => {
    setDraft(next)
    setSaid(null)
  }
  const name = folder ? nameOf(folder) : t('library.home')

  return (
    <div className="flex flex-col gap-6 pb-docked-8">
      <ScreenHeader
        title={t('cardStyle.title')}
        back={<BackButton />}
        tools={
          <RoundButton
            label={t('cardStyle.reset')}
            icon={RotateCcw}
            disabled={sameLook(draft, DEFAULT_CARD_LOOK)}
            onClick={() => change(DEFAULT_CARD_LOOK)}
          />
        }
      />
      <StyleEditor
        value={draft.style}
        onChange={(style) => change({ ...draft, style })}
        preview={
          <div className="flex h-full flex-col gap-3">
            <div className="flex min-h-11 items-center justify-between gap-3">
              <p className="min-w-0 truncate font-display text-lg font-semibold">{name}</p>
              <Segmented<Device>
                label={t('cardStyle.previewOn')}
                compact
                value={device}
                options={[
                  { value: 'phone', label: t('cardStyle.phone'), icon: <Smartphone aria-hidden /> },
                  { value: 'laptop', label: t('cardStyle.laptop'), icon: <Laptop aria-hidden /> },
                ]}
                onChange={setDevice}
              />
            </div>
            <StylePreview look={draft} page={page} device={device} />
          </div>
        }
      >
        <SettingsGroup title={t('cardStyle.shows')}>
          {CARD_SHOWS.map((show) => (
            <SwitchRow
              key={show}
              label={t(`cardStyle.show.${show}`)}
              checked={draft.show[show]}
              onCheckedChange={(on) => change({ ...draft, show: { ...draft.show, [show]: on } })}
            />
          ))}
        </SettingsGroup>
      </StyleEditor>
      {/* Apply to… and Apply at the foot, always in reach: never under a long page's end. */}
      <Docked className="pt-3">
        <div className="flex w-full flex-wrap items-center justify-end gap-3">
          {said ? (
            <p role="status" className="me-auto text-sm text-muted-foreground">
              {said}
            </p>
          ) : null}
          <ActionMenu
            label={t('cardStyle.applyToTitle')}
            align="end"
            trigger={
              <>
                <Layers aria-hidden />
                {t('cardStyle.applyTo')}
              </>
            }
            render={<Button variant="soft" size="lg" className="flex-1 sm:flex-none" />}
            actions={[
              {
                key: 'this',
                label: t(folder ? 'cardStyle.thisFolder' : 'cardStyle.homeOnly'),
                onSelect: () => apply([place]),
              },
              ...(subfolders.length > 0
                ? [
                    {
                      key: 'below',
                      label: t('cardStyle.withSubfolders', { count: subfolders.length }),
                      onSelect: () => apply([place, ...subfolders]),
                    },
                  ]
                : []),
              {
                key: 'every',
                label: t('cardStyle.everyFolder', { count: everyFolder.length }),
                onSelect: () => setAsking(true),
              },
            ]}
          />
          <Button
            size="lg"
            className="flex-1 sm:flex-none"
            disabled={sameLook(draft, saved)}
            onClick={() => apply([place])}
          >
            <Check aria-hidden />
            {t('cardStyle.apply')}
          </Button>
        </div>
      </Docked>
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

/**
 * The place's first rows in the look, as `device` draws them: a phone's list or cards; a laptop's
 * right pane, its songs a table inside a card in the style for List, the style's cards for Cards and
 * Grid (R32-C). Seen, never used: they lead nowhere while the look is edited.
 */
function StylePreview({
  look,
  page,
  device,
}: {
  look: CardLook
  page: LibraryPage
  device: Device
}) {
  const { t } = useTranslation('songs')
  const songs = page.view.groups.flatMap((group) => group.entries)
  const folders = device === 'phone' ? page.view.folders.slice(0, 2) : []
  if (songs.length === 0 && folders.length === 0)
    return <p className="text-muted-foreground">{t('cardStyle.empty')}</p>
  const table = device === 'laptop' && look.style.layout === 'list'
  return (
    <CardLookProvider value={look}>
      <div inert className="min-h-0 flex-1 overflow-hidden">
        {table ? (
          <div {...cardLookProps(look)}>
            <div className="card overflow-hidden px-2">
              <SongTable entries={songs.slice(0, 5)} page={page} />
            </div>
          </div>
        ) : (
          <ul
            className={cn('grid-cards auto-rows-fr gap-2', device === 'laptop' && 'grid-cols-2')}
            {...cardLookProps(look)}
          >
            {folders.map(({ folder: each, ...holds }) => (
              <FolderRow
                key={each.id}
                folder={each}
                holds={holds}
                actions={[]}
                onSelect={() => undefined}
              />
            ))}
            {songs.slice(0, device === 'laptop' ? 6 : 3 - folders.length).map((entry) => (
              <SongRow
                key={entry.id}
                entry={entry}
                favourite={page.favourites.includes(entry.id)}
                actions={[]}
                onSelect={() => undefined}
              />
            ))}
          </ul>
        )}
      </div>
    </CardLookProvider>
  )
}
