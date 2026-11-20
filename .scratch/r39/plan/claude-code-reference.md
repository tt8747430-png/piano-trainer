# Claude Code's frame, measured (reference for the sidebar, Settings and popups)

Source: the owner's saved page of claude.ai/code (2026-11-20, `.mhtml`, German UI), rendered offline in Chromium at
1710×984 and measured. The export itself never enters the repo (it shows the owner's account). A saved page is one
frozen state: only the Settings dialog open over the sidebar could be measured; menus, the palette and the flows
between states need one save per state or a screen recording (asked of the owner).

## Sidebar (left, ~288 wide)
- Rows 261 wide from x 8, 32 tall, 8 round, 14px at weight 435, ink 90%, icon then label (gap 4).
- Order: New · Search · Projects (Beta badge) · Artifacts · Customize · More; then folding sections.
- Section heads ("Pinned", "Recent"): 12px at 520, ink 60%, a 28-tall button that folds the section, 10 in.
- Account at the foot: avatar, name · plan, one row.

## Settings (a dialog, laptop)
- 1024×800, 16 round, white, centred over a 40% black backdrop; its title in a header row, × (28, 40% ink) at the right.
- Left nav 212 wide: a search field first, then groups under small labels (Preferences, Customize, Platform),
  rows 179×32, 8 round, 14px at 435, 1 apart; the chosen row a 10% black fill, no other mark.
- Pane: section heads 15px at 520; each setting a row of its title (14) over a soft description, its switch
  (36×20, blue on) at the right; rows parted by a hairline; inputs 28 tall, 8 round, a 5% fill, no border.

## claude.ai's Settings, second save (English, Account open)
- The same 1024×800 dialog, 16 round, 40% black backdrop; header 44: "Settings" 15 at 520 at the left, × 28 at the right.
- Nav column 211 wide, 12 16 16 inside, 12 between its search (32 tall, 5% fill, a magnifier) and the list.
- Nav rows 179×32, 8 round, an icon 16 then the label 12 after it, 14 at 435; the chosen a 10% fill. Groups are
  parted by a hairline 8 in from each side, not labelled (Account · Billing · Usage / Appearance … Wellbeing /
  Customize · Code). A quiet link pinned at the nav's foot: "API keys ↗", 13, ink 60%, 28 tall.
- Pane 16 in: the section's title 14; each row a title (14) over a soft description (14, ink 60%) with its control at
  the right edge: a field 224×28 (5% fill, 8 round), a choice as its value and a chevron, a 28-tall outlined button;
  rows parted by hairlines. A table's head 13 at 435, ink 60%.
- The sidebar under it: New · Search · Projects · Artifacts · Scheduled · Design · Customize, each an icon and its word;
  then "Pinned ⌄" and "Recents ⌄" (12, ink 60%, each folds its list); the account at the foot with a menu chevron.

## Motion seen in its CSS
- Enters ease-out (cubic-bezier(.215,.61,.355,1)), 160–200ms for inline cards and notifications (8px slide + fade),
  fades 180ms; every animation off under reduced motion.

## Against ours (1710×984, /settings)
| Part | Claude | Piano Trainer |
| --- | --- | --- |
| Dialog | 1024×800, 16 round, 40% black | 1200×888, 22 round, 28% ink |
| Nav | 212, rows 32, chosen 10% shade | 239, rows 40, chosen sand |
| Heads | 15 at 520 | 20 (pane title) and 16 at 600 |
| Sidebar rows | 32 at 14 | 40–44 at 15–16 (our 44px rule; 40 the dense-laptop floor) |

Taken: the dialog's size and corner and the pane's title-over-description rows are candidates for the SettingsLaptop
board first, then the port. Not taken: 32-tall rows (below our 40 floor).
