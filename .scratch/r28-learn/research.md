# R28: how inline block editors look and behave

Facts only, for the lesson and course editors (ADR 0116). Sources: Notion's help ("Writing and editing
basics"), BlockNote's docs (Side Menu), TipTap's Notion-like template page and its extension docs
(Placeholder, BubbleMenu, DragHandle), and hands-on knowledge of Craft, Bear and Obsidian.

## The block's gutter
- **Notion:** hovering a block shows, in the left margin, `+` (adds a block below and opens the block
  menu of kinds) and `⋮⋮`. Dragging `⋮⋮` moves the block; clicking it opens the block's menu: Turn into,
  Color, Copy link, Duplicate, Move to (another page), Delete, Comment, AI. There is no Move up / Move
  down: order is by drag (or the keyboard shortcut ⌘⇧↑/↓).
- **BlockNote:** the same Side Menu: `+` and a drag handle (⠿), shown while the mouse is over the editor;
  the handle's click opens the Drag Handle Menu (Delete, Colors by default).
- **TipTap:** a DragHandle extension and, in the Notion-like template, a drag context menu and a
  "turn into" dropdown.
- On a phone none of them has hover: Notion puts the block actions in a toolbar over the keyboard and a
  long-press menu; BlockNote shows the side menu beside the caret's block.

## Placeholders
- Notion shows a hint only on the **empty line the caret is in** ("Type '/' for commands", lately
  "…press '/' for commands"); other empty lines show nothing. Headings show "Heading 1/2/3", a title
  "Untitled".
- TipTap's Placeholder can show on every empty node or only the current one (`showOnlyCurrent`), and
  passes `hasAnchor` to a placeholder function.

## Text selected
- Notion, Craft, BlockNote and the TipTap template show a **bubble toolbar** over a text selection:
  marks (bold, italic …), link, and Turn into. Bear and Obsidian show markdown marks in muted colour on
  the line being edited, rendered elsewhere (Obsidian's Live Preview).

## Atom blocks (an image, an embed, a database)
- Notion: a click selects the block whole: a blue tint/outline over it, and on hover a **small toolbar
  at its top right** (for an image: Replace, Caption, Crop, Comment, ⋯). Editing opens **in place** (a
  popover anchored to the block on desktop; a sheet on the phone whose page is not blurred out).
- Obsidian Live Preview: an embed renders; a click on it (or its corner's edit icon) shows its source
  in place, under/instead of the render; nothing covers the page.
- Craft: a block is a card; its selected state is an outline and a floating strip of its actions.

## Per-document settings
- Notion: a page's ⋯ menu: font, small text, full width, lock page, page history, copy link,
  move to, delete; page properties under the title.
- Craft: a document's "Document settings": style, cover, width, share (a link), export, delete.
- Noji (our reference for Settings pages): a deck's settings page of grouped rows (ADR of round 26,
  `SongSettingsPage`).

## What we take
- `+` and `⋮⋮` beside a block (hover on a laptop, the caret's block on a phone); `⋮⋮`'s tap opens Turn
  into, Duplicate, Delete. Order by drag and Alt+↑/↓ (the owner's rule: never Move up/down in a menu).
- A hint on the current empty line only ("Type / for blocks").
- A bubble toolbar on selected text: the lead in bold (our only mark).
- An example selected: an outline and a small floating toolbar (Edit, Duplicate, Delete); its Edit
  opens a panel in place, under the block, the same on a phone and a laptop: nothing blurs the page.
- A lesson's and a course's Settings page, as a song's.
