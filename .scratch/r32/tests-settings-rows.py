# R32: the Player's Settings is one ranked list of pages, each row its name, a line and its value.
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGES = "['Score view', 'Playback', 'Staves', 'Accompaniment', 'On-screen piano']"
HELPER = f"""
/** The Player's Settings pages in the order they stand, by each row's name (R32). */
const pageTitles = (sheet: HTMLElement) =>
  within(sheet)
    .getAllByRole('button')
    .map((row) => {PAGES}.find((title) => row.textContent?.startsWith(title)))
    .filter((title) => title !== undefined)
"""


def edit(path, pairs, helper_after=None):
    p = ROOT / path
    text = p.read_text()
    for old, new in pairs:
        assert old in text, (path, old[:60])
        text = text.replace(old, new)
    if helper_after:
        i = text.index(helper_after) + len(helper_after)
        text = text[:i] + HELPER + text[i:]
    p.write_text(text)


edit(
    'src/pages/player/ui/PlayerPage.test.tsx',
    [
        ("/** Opens the Player's Settings › Display. */", "/** Opens the Player's Settings › Score view. */"),
        (
            """  await user.click(within(sheet).getByRole('button', { name: 'Display' }))
  return screen.findByRole('dialog', { name: 'Display' })""",
            """  await user.click(within(sheet).getByRole('button', { name: /^Score view/ }))
  return screen.findByRole('dialog', { name: 'Score view' })""",
        ),
        (
            """  it('names each page of While you play apart in Russian (R29 review)', async () => {""",
            """  it('names each page of its Settings apart in Russian (R29 review)', async () => {""",
        ),
        (
            """    const rows = within(within(sheet).getByRole('region', { name: 'Во время игры' }))
      .getAllByRole('button')
      .map((row) => row.textContent)""",
            """    const rows = within(sheet)
      .getAllByRole('button')
      .map((row) => row.textContent)""",
        ),
        (
            """  it('opens its one Settings from the gear: the music’s choices and While you play, none of the music’s acts (R29, R31-P)', async () => {""",
            """  it('opens its one Settings from the gear: its pages ranked by use, none of the music’s acts (R29, R31-P, R32)', async () => {""",
        ),
        (
            """    const rows = (group: string) =>
      within(within(sheet).getByRole('region', { name: group }))
        .getAllByRole('button')
        .map((row) => row.textContent)
    const works = within(sheet).getByRole('region', { name: 'While you play' })
    expect(rows('While you play')).toEqual(['Playback', 'On-screen piano', 'Display'])""",
            """    const works = sheet
    expect(pageTitles(sheet)).toEqual([
      'Score view',
      'Playback',
      'Staves',
      'Accompaniment',
      'On-screen piano',
    ])
    // Each row says what it controls and what it is set to (R32).
    expect(within(sheet).getByRole('button', { name: /^Score view/ })).toHaveTextContent(
      'Layout, cursor and what appears on the score',
    )""",
        ),
    ],
    helper_after="describe('Player', () => {\n",
)

edit(
    'src/pages/player/ui/PlayerBarAndFoot.test.tsx',
    [
        (
            """    const group = within(sheet).getByRole('region', { name: 'While you play' })
    expect(
      within(group)
        .getAllByRole('button')
        .map((page) => page.textContent),
    ).toEqual(['Playback', 'On-screen piano', 'Display'])""",
            """    expect(pageTitles(sheet)).toEqual(['Score view', 'Playback', 'Staves', 'On-screen piano'])""",
        ),
        ("""  it('opens the Player’s Settings at Display: one home', async () => {""", """  it('opens the Player’s Settings at Score view: one home', async () => {"""),
        (
            """    await user.click(within(sheet).getByRole('button', { name: 'Display' }))
    const settings = await screen.findByRole('dialog', { name: 'Display' })""",
            """    await user.click(within(sheet).getByRole('button', { name: /^Score view/ }))
    const settings = await screen.findByRole('dialog', { name: 'Score view' })""",
        ),
    ],
)
p = ROOT / 'src/pages/player/ui/PlayerBarAndFoot.test.tsx'
text = p.read_text()
i = text.index('\ndescribe(')
p.write_text(text[:i] + '\n' + HELPER + text[i:])

edit(
    'src/pages/player/ui/PlayerViews.test.tsx',
    [
        (
            """    await user.click(await screen.findByRole('button', { name: 'Display' }))
    const menu = await screen.findByRole('dialog', { name: 'Display' })""",
            """    await user.click(await screen.findByRole('button', { name: /^Score view/ }))
    const menu = await screen.findByRole('dialog', { name: 'Score view' })""",
        ),
    ],
)
edit(
    'src/pages/player/ui/PickView.test.tsx',
    [("async function openDisplay(user: User, settings = 'Player settings', display = 'Display') {", "async function openDisplay(user: User, settings = 'Player settings', display = 'Score view') {")],
)
