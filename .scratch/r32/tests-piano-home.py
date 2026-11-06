# R32: the on-screen piano's settings have one home; /settings/player goes, the Player's gear is theirs.
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]


def edit(path, fn):
    p = ROOT / path
    p.write_text(fn(p.read_text()))


def titles(text):
    return re.sub(
        r"within\(sheet\)\s*\.getAllByRole\('button'\)\s*\.map\(\(row\) =>",
        "[...sheet.querySelectorAll('button, a')].map((row) =>",
        text,
    )


edit('src/pages/player/ui/PlayerPage.test.tsx', titles)
edit('src/pages/player/ui/PlayerBarAndFoot.test.tsx', titles)


def acts(text):
    start = text.index("  it('opens the On-screen piano’s page in its own sheet, never leaving the Player (R31-P)'")
    end = text.index("  it.each([\n    // Its files alone")
    return text[:start] + """  it('leads to the On-screen piano’s one home, and Back returns to the Player (R32)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Player settings' }))
    const settings = await screen.findByRole('dialog', { name: 'Player settings' })
    await user.click(within(settings).getByRole('link', { name: /^On-screen piano/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/on-screen-piano'))
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/bz5'))
  })

""" + text[end:]


edit('src/pages/player/ui/PlayerActs.test.tsx', acts)


def pages(text):
    text = text.replace(
        "  ['player', '/settings/player'],\n",
        "  ['player', '/play/bz5', /^Score view/],\n  ['player', '/play/bz5', /^Playback/],\n  ['player', '/play/bz5', /^Staves/],\n",
    )
    text = text.replace(
        "      if (rows.length > 0) place = await openGear(user, ...rows)",
        "      if (rows.length > 0)\n        place = path.startsWith('/play/')\n          ? await openPlayerGear(user, ...rows)\n          : await openGear(user, ...rows)",
    )
    text = text.replace(
        "import { openGear } from './testing/editor-gear'",
        "import { openGear } from './testing/editor-gear'\nimport { openPlayerGear } from './testing/player-gear'",
    )
    text = text.replace(
        " * screen's gear to it (the score editor's, R32-B).",
        " * screen's gear to it (the score editor's, R32-B; the Player's, R32).",
    )
    return text


edit('src/app/settings-pages.test.tsx', pages)

(ROOT / 'src/app/testing/player-gear.ts').write_text("""import { screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

/**
 * Opens the Player's gear (R29, R32: the home of the Player's settings) and turns its pages by their
 * rows' names, in turn: the sheet at the last page.
 */
export async function openPlayerGear(
  user: UserEvent,
  ...rows: readonly RegExp[]
): Promise<HTMLElement> {
  await user.click(await screen.findByRole('button', { name: 'Player settings' }))
  for (const row of rows)
    await user.click(
      await within(await screen.findByRole('dialog')).findByRole('button', { name: row }),
    )
  return screen.findByRole('dialog')
}
""")
