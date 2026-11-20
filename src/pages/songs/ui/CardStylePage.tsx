import { Link, useParams } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
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
import { BLOCK_PRESETS, presetOf, sameStyle, STYLE_LAYOUTS } from '@/shared/lib/style'
import {
  ActionMenu,
  ActionRow,
  BackButton,
  ButtonLink,
  ConfirmDialog,
  LIBRARY_PANES,
  NotFound,
  ScreenHeader,
  Segmented,
  SettingsGroup,
  say,
  SwitchRow,
} from '@/shared/ui'
import { CardLookProvider, FolderRow, LibraryRows, SongRow } from '@/widgets/song-library'
import { useLibraryPage, type LibraryPage } from '../model/use-library-page'

/** The presets a place's cards take (the board's four; Night is a lesson block's alone). */
const CARD_PRESETS = ['plain', 'soft', 'bold', 'paper'] as const
type CardPreset = (typeof CARD_PRESETS)[number]
/** A preset as the cards take it: none for one they do not. */
const cardPreset = (preset: string | null): CardPreset | null =>
  CARD_PRESETS.find((each) => each === preset) ?? null

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

/**
 * Card style (loop round 24, the board's): the place's look, its own rows previewed as a phone or a
 * laptop draws them, then Presets (Plain · Soft · Bold · Paper), Layout (List · Grid · Covers) and
 * Card contents; then Apply to… (this place, it with its subfolders, or every folder, asked first)
 * and Reset to default. Each change takes effect at once.
 */
function CardStyle({ folder }: { folder: ShelvedFolder | null }) {
  const { t } = useTranslation(['songs', 'common'])
  const nameOf = useFolderName()
  const store = useLibraryStoreApi()
  const layout = useLibraryLayout()
  const laptop = useMediaQuery(LIBRARY_PANES)
  const place: CardPlace = folder?.id ?? 'home'
  // The look as it stands: every change takes effect at once (the board's; no Apply).
  const draft = useLibrary((state) => state.cardLooks[place]) ?? DEFAULT_CARD_LOOK
  const [device, setDevice] = useState<Device>(laptop ? 'laptop' : 'phone')
  const [asking, setAsking] = useState(false)
  const page = useLibraryPage(folder, NO_FILTER)

  // Every folder under this one, at any depth (Home: every folder).
  const below = (from: CardPlace): CardPlace[] => {
    const children = childFolders(layout.folders, from === 'home' ? null : from)
    return children.flatMap((each): CardPlace[] => [each.id, ...below(each.id)])
  }
  const subfolders = below(place)
  const everyFolder: CardPlace[] = ['home', ...layout.folders.map((each) => each.id)]
  // The app's own look is kept as none: the place reads the default again.
  const keep = (places: readonly CardPlace[], look: CardLook) => {
    if (sameLook(look, DEFAULT_CARD_LOOK)) for (const each of places) resetCardLook(store, each)
    else setCardLook(store, places, look)
  }
  const apply = (places: readonly CardPlace[]) => {
    keep(places, draft)
    say(t('cardStyle.applied', { count: places.length }))
  }
  const change = (next: CardLook) => keep([place], next)
  const name = folder ? nameOf(folder) : t('library.home')

  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader column title={t('cardStyle.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {/* The preview first (the board's): the place's own rows as a phone or a laptop draws them. */}
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-muted p-4">
          <Segmented<Device>
            label={t('cardStyle.previewOn')}
            value={device}
            options={[
              { value: 'phone', label: t('cardStyle.phone') },
              { value: 'laptop', label: t('cardStyle.laptop') },
            ]}
            onChange={setDevice}
          />
          <p className="truncate font-display text-lg font-semibold">{name}</p>
          <StylePreview look={draft} page={page} device={device} />
        </div>
        <section className="flex flex-col gap-2">
          <h2 className="px-1 font-sans text-[0.8125rem]/4 font-semibold tracking-[0.04em] text-muted-foreground uppercase">
            {t('common:style.presets')}
          </h2>
          <Segmented<CardPreset>
            label={t('common:style.presets')}
            value={cardPreset(presetOf({ ...draft.style, layout: 'list' }))}
            options={CARD_PRESETS.map((preset) => ({
              value: preset,
              label: t(`common:style.preset.${preset}`),
            }))}
            onChange={(preset) =>
              change({ ...draft, style: { ...BLOCK_PRESETS[preset], layout: draft.style.layout } })
            }
          />
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="px-1 font-sans text-[0.8125rem]/4 font-semibold tracking-[0.04em] text-muted-foreground uppercase">
            {t('common:style.layout')}
          </h2>
          <Segmented
            label={t('common:style.layout')}
            value={draft.style.layout}
            options={STYLE_LAYOUTS.map((layout) => ({
              value: layout,
              label: t(`cardStyle.layout.${layout}`),
            }))}
            onChange={(layout) => change({ ...draft, style: { ...draft.style, layout } })}
          />
        </section>
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
        <SettingsGroup flush>
          <ActionMenu
            label={t('cardStyle.applyToTitle')}
            align="end"
            trigger={
              <>
                <span className="flex-1 text-start">{t('cardStyle.applyTo')}</span>
                <span className="text-muted-foreground">
                  {t(folder ? 'cardStyle.thisFolder' : 'cardStyle.homeOnly')}
                </span>
                <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
              </>
            }
            render={
              <button
                type="button"
                className="flex min-h-13 w-full items-center gap-3 px-4 text-base hover:bg-muted/60"
              />
            }
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
          <ActionRow
            title={t('cardStyle.reset')}
            disabled={sameLook(draft, DEFAULT_CARD_LOOK)}
            onClick={() => change(DEFAULT_CARD_LOOK)}
          />
        </SettingsGroup>
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

/**
 * The place's first rows in the look, as `device` draws them: a phone's column of cards, a laptop's
 * two across (R72). Seen, never used: they lead nowhere while the look is edited.
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
  // What the pane holds whole: two rows on a phone, a page's worth on a laptop.
  const folders = device === 'phone' ? page.view.folders.slice(0, 2) : []
  if (songs.length === 0 && folders.length === 0)
    return <p className="text-muted-foreground">{t('cardStyle.empty')}</p>
  return (
    <CardLookProvider value={look}>
      <div inert className="min-h-0 flex-1 overflow-hidden">
        <LibraryRows look={look} className={cn(device === 'laptop' && 'grid-cols-2')}>
          {folders.map(({ folder: each, ...holds }) => (
            <FolderRow
              key={each.id}
              folder={each}
              holds={holds}
              actions={[]}
              onSelect={() => undefined}
            />
          ))}
          {songs.slice(0, device === 'laptop' ? 6 : 2 - folders.length).map((entry) => (
            <SongRow key={entry.id} entry={entry} actions={[]} onSelect={() => undefined} />
          ))}
        </LibraryRows>
      </div>
    </CardLookProvider>
  )
}
