# The laws, read from their sources

Read in full on 2026-11-17 for the owner's "research properly the laws and the proper how and where to use the cards
and the ui ux laws". Each law: what the source says, then what it asks of a Piano Trainer screen.

## Grouping (Gestalt)

**Proximity** ([NN/g, Harley 2020](https://www.nngroup.com/articles/gestalt-proximity/);
[Laws of UX](https://lawsofux.com/law-of-proximity/)). "Items close together are likely to be perceived as part of the
same group." It "can overpower competing visual cues such as similarity of color or shape". Whitespace both unites and
separates: a heading sits closer to its own section than to the one before; a label closer to its field than to the
next label. "Grouping together unrelated elements may camouflage them", and "far-away elements appear unrelated, are
easily overlooked" (tunnel vision). Groupings shift in responsive layouts: two things side by side on a laptop may end
far apart on a phone.
- Here: the gap inside a group is smaller than the gap between groups, always, measured. A control sits beside what it
  changes. A gap that is the same everywhere groups nothing.

**Closeness of actions and objects** ([NN/g, Nielsen 2010](https://www.nngroup.com/articles/closeness-of-actions-and-objects-gui/)).
"When buttons … are too far away from the objects they act on, people don't see them … and simply assume the features
aren't available." iTunes' Update button at the window's foot, in "a separate colored stripe", went unseen for months.
- Here: Play sits on the music it plays; a page's acts sit where the eye already is. A coloured strip under content
  reads as outside it.

### Spacing: how close groups things, how far separates them, how far is too far (researched 2026-11-18)

The owner: "how much spacing should they have to be related and how much to differentiate from other, but not too
much spacing? … take more specific and precise instructions". The sources, with their numbers:

- **Kubovy & Wagemans 1995, "Grouping by proximity and multistability in dot lattices"** (Psychological Science
  6(4):225–234). Viewers saw dot lattices for 300ms and said which way the dots grouped. The pull of a gap falls off
  exponentially with its length: f(v) = e^(−α(v/a − 1)), where a is the shortest gap and v another. Across seven
  observers α ran 6.72–11.57 (α ≈ 8 in their worked figure). The ratios they tested were 1.0, 1.26, 1.59 and 2.0,
  steps of about 1.26 (Weber's law: the eye judges distance by ratio, not by pixels). With α ≈ 8, how strongly a
  gap r times the shortest one still pulls, against the shortest:
  | r (wider gap ÷ narrower) | 1.1 | 1.25 | 1.5 | 2 | 3 |
  | --- | --- | --- | --- | --- | --- |
  | pull of the wider gap | 0.45 | 0.14 | 0.02 | 0.0003 | ≈0 |
  So under about 1.25 the grouping is ambiguous (people split); from 1.5 it is near-certain; at 2 it is certain.
  Past 2–3× the eye gains nothing more: the extra space separates nothing further, it only empties the page.
- **Jakob Nielsen, "Gestalt Principles for Visual UI Design" (2026):** "The practical lever is the ratio of space,
  not its absolute amount: a form field 'belongs' to its label when the gap between them is visibly smaller than the
  gap to the next field. When labels sit equidistant… roughly half of them guess wrong." And the other way: "Squeeze
  everything together and you trigger a grouping collapse." His audit: "Is the gap inside each group unmistakably
  smaller than the gap between groups?"; "Do the strongest cues (spacing, border, color, alignment, and motion) agree
  about the same structure?"; "Does the hierarchy survive mobile reflow, text enlargement…?"; "Specify internal vs.
  external spacing… in the component library."
- **Refactoring UI (Wathan & Schoger), "Establish a spacing and sizing system":** "make sure no two values in your scale
  are ever closer than about 25%" (their example scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 128). On grouping: "Avoid
  ambiguous spacing… if the margin below a form label is the same as the margin below its input, the form group won't
  feel obviously connected… always ensure there's more space around the group than within it." And: "Start with too
  much white space, then remove it until you're happy" — the end point is the least space that still groups.
- **Atlassian Design System, spacing tokens:** 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80. Small (0–8) "for small
  and compact pieces of UI"; medium (12–24) "for larger and less dense pieces"; large (32–80) "for the largest pieces of
  UI and for layout elements". "Group similar items together using similar spacing."
- **Uxcel:** "External spacing ≥ internal spacing. Keep outer ≥ inner." Micro whitespace inside a group, macro between
  sections.
- **Material 3, list item tokens** (material-web `md.comp.list.list-item`): one line 56, two lines 72, three lines 88
  high; 16 leading and trailing; 10 above and below the text. Rows touch (0 apart) and are told apart by their
  padding and a divider, so a list is one group by construction.

**The rules, with numbers, for every board and port:**

1. **Between ÷ within ≥ 1.5, aim for 2.** The gap that separates two groups is at least 1.5 times the gap inside
   them (8 inside → 12 at the very least, 16 best; 12 → 24; 16 → 32). Under 1.25 the grouping is a coin toss.
2. **No more than about 3×, past the smallest step that works.** Once separation is certain (2×), more space says
   nothing more: 8 inside → sections 16–24 apart, not 48; 16 inside → 32, at most 48. A gap over 4× its neighbours'
   (and 56 or more) cuts a thing off from what it belongs to (the owner's "too much spacing").
3. **A heading belongs to what it heads:** the space above it is at least 1.5×, best 2–3×, the space below it
   (section label 8 above its rows → 16–24 above the label).
4. **A box's edge outranks its rows:** a card's inset is at least its row gap (outer ≥ inner), and its distance to the
   next box at least its inset.
5. **Two neighbouring steps are never both used for one job:** 12 and 16 side by side read as a mistake, not as two
   levels (Refactoring UI's 25%: 12 → 16 is 33%, enough between levels; 14 → 16 is not). Use the scale's steps:
   4, 8, 12, 16, 24, 32, 48, 64.
6. **Levels:** inside a control 4–8; between rows of one group 0–12; between groups and sections 16–32 (phone),
   24–48 (laptop); between whole regions of a laptop page 48–64. Each level about 2× the one below it.
7. **Agree with the other cues:** when a hairline or a box already groups, the spacing must say the same thing, never
   the opposite (Nielsen).

`lines.mjs` holds rule 3 (PROBLEM at under 1×, NOTE under 1.5× and over 4×) and rule 4 (PROBLEM when rows sit as far
apart as the edge).

**Common region** ([NN/g, Harley 2020](https://www.nngroup.com/articles/common-region/); Palmer 1992;
[Laws of UX](https://lawsofux.com/law-of-common-region/)). "Items within a boundary are perceived as a group and
assumed to share some common characteristic or functionality." It is strong: it "can overpower other grouping
principles such as proximity". Use it "when whitespace alone doesn't suffice". **Caution, overuse creates clutter:**
"When possible, using whitespace alone to create clear groupings reduces the visual complexity"; borders "added in an
abundance of caution" make busy designs; full-width bands create **false floors** where people stop scrolling. Ask
before adding a box: is it needed to understand the grouping; can whitespace do it; must these be set apart from
nearby things?
- Here: a box is the last tool, not the first. A box around one thing groups nothing.

**Uniform connectedness** ([Laws of UX](https://lawsofux.com/law-of-uniform-connectedness/)): visually connected
elements read as more related than unconnected ones (a line, a shared fill). **Similarity**: alike-looking things read
as one group even apart, so two different acts never look alike, and the same act always does.

**Prägnanz** ([Laws of UX](https://lawsofux.com/law-of-pr%C3%A4gnanz/)): the eye takes the simplest reading. A screen
of many boxes, bands and pills is read as noise.

## Order and emphasis

**Visual hierarchy, scale, balance, contrast** ([NN/g, Gordon 2020, reviewed 2026](https://www.nngroup.com/articles/principles-visual-design/)).
"The most important elements in a design are bigger"; "a visually pleasing design generally uses no more than 3
different sizes"; 2–3 type sizes. Hierarchy comes from scale, value, colour, spacing and placement. "If you have a
hard time figuring out where to look on a page, it's more than likely that its layout is missing a clear visual
hierarchy." Balance: visual weight distributed on both sides of an axis; "no one area draws your eye so much that you
can't see the other areas". Contrast says two things differ in kind.
- Here: one focal point per screen; a large white block beside an empty band is unbalanced weight.

**Von Restorff** ([Laws of UX](https://lawsofux.com/von-restorff-effect/)): the one that differs is remembered. Two
honey things cancel each other.

**Apple HIG, Layout** ([developer.apple.com](https://developer.apple.com/design/human-interface-guidelines/layout),
updated 2026-09-09). "Order content by relative importance … the most important items near the top and leading side."
"Align elements to make them easier to scan … People assume that aligned items are related … indented items as
subordinate." "Group related items … negative space, container shapes, or separator lines." "Use progressive
disclosure." "Differentiate controls from content": Liquid Glass for controls, never a solid band under them. Keep
functionality the same as the size changes; a larger space may show more of it.

**Serial position, Hick, Miller, Choice overload, Cognitive load** ([Laws of UX](https://lawsofux.com/)): first and last
are remembered; decisions slow with each option; working memory holds few things. Fewer controls at once.

**Fitts** ([Laws of UX](https://lawsofux.com/fittss-law/)): time to a target grows with distance, shrinks with size.
The primary act is large and in reach of the thumb.

**Jakob** ([Laws of UX](https://lawsofux.com/jakobs-law/)): people expect our app to behave like the ones they use
(Flat, Apple Music, forScore).

**Aesthetic-usability** ([Laws of UX](https://lawsofux.com/aesthetic-usability-effect/)): what looks finished is trusted
and forgiven more.

## Laws the tool measures (2026-11-17)

- **Fitts's law** (lawsofux.com/fittss-law): the time to reach a target grows with its distance and shrinks with its
  size, so targets are 44pt on touch (Apple HIG) and at least 40 in a dense laptop row; primary acts sit where the
  thumb or pointer already is.
- **Hick's law** (lawsofux.com/hicks-law): the time to choose grows with the number of choices; a bar, menu or tab row
  offers a few, the rare ones folded behind a More.
- **Von Restorff effect** (lawsofux.com/von-restorff-effect): the one item that differs is remembered; one honey act
  per screen, or none stands out.
- **Jakob's law** (lawsofux.com/jakobs-law) and **consistency** (NN/g heuristic 4): people expect a place to work as
  the others do; sibling pages keep one frame (bar, title, search, pane, the column content starts on) so moving
  between them changes the content, not the page.
- **Alignment of boxes side by side** (Müller-Brockmann, grid systems; HIG layout): columns share their tops, and a
  box that starts inside its neighbour's height and ends below it reads as overlap, not as a column.
- **Contrast** (WCAG 2.2, 1.4.3): text 4.5:1, large text 3:1.

## Cards: where they belong, and where not

**NN/g, "Cards: UI-Component Definition"** ([Laubheimer 2016](https://www.nngroup.com/articles/cards-component/)).
A card is "a container for a few short, related pieces of information … a linked, short representation of a
conceptual unit." Four properties: it **groups** several kinds of information about one thing; it is a **summary and
a link** to the details (tap anywhere opens them); it **looks like a card** (border, a fill unlike the canvas, often a
slight shadow as a sign it can be pressed); cards allow **flexible layouts** of mixed content. When useful: for
**browsing**, not searching; for **heterogeneous** collections (dashboards, feeds of different kinds). Not useful:
for homogeneous items (a list of similar songs) — "consider using a standard vertical list"; when people compare or
scan for one item (lists are more scannable, ranked and compact); a photo gallery needs no card around each photo.
"Cards work especially well … rather than when simply used as a modern-looking replacement for a list of content."

**Material 3, Cards guidelines** ([m3.material.io](https://m3.material.io/components/cards/guidelines)). "Use a card to
display content and actions on a single topic … entry points into deeper levels of detail." **Don't:** "force content
into cards when spacing, headlines, or dividers would create a simpler visual hierarchy." Filled cards separate subtly,
elevated more, outlined most; cards in a collection share one elevation; sort and filter sit outside the collection.
On a phone "consider swapping cards for lists"; on a large screen "adjust the card layout so content remains the main
focus" and "avoid extending UI elements across the screen".

**What follows here**
- A card is a **thing you can open**, or a few unlike facts about one thing, shown among siblings. Songs in a
  playlist, rows of Explore, settings rows: a list, not a card each (Flat, Apple Music).
- **Never a card around the page's own subject on its own page.** A song's page is the song; its info is the page, in
  a plain column on the paper. A white box there groups nothing the margin did not already group, and draws the eye
  away from the music.
- **A lone card on a plain page** is a box dropped on the paper. If it is not one of a collection, ask whether
  whitespace and a heading would do.
- **Grouped settings** (iOS's inset grouped list) are the one card-like group of rows that stays: many short rows that
  belong together, edge to edge inside, with hairlines.
- **No card in a card.** Never a full-width band (false floor).

## Floating actions

**Material 3, FAB guidelines** ([m3.material.io](https://m3.material.io/components/floating-action-button/guidelines)).
"Use a FAB for the most important action on a screen"; "Don't display multiple FABs on a single screen"; "FABs are not
needed on every screen". For "primary, positive actions: create, favorite, share, start a process"; never minor or
destructive ones (archive, trash). An extended FAB when a label is needed; a FAB menu when several kinds of creation
belong to it. On a phone the lower right corner, "easy to reach and less likely to cover important content". "A FAB
shouldn't contain … actions found elsewhere on a screen." "Individual components, such as cards, shouldn't have their
own FAB." It stays in place on scroll.

**What follows here**
- One floating action per screen, honey: the library's + (a dial of New song, Record, Import, New playlist), a public
  song's Add to my library (extended, labelled).
- Play is not a second floating button beside it: it sits on the music it plays (closeness), a quiet control at the
  head of the chart; a tap on a bar plays that bar.
- Never two acts of different weight in one box in the content: two focal points.

## What the owner's lines found, by law (2026-11-17, the public song board)

| Mark | Law broken |
| ---- | ---------- |
| the eye goes to the Amazing Grace card, not the verses and chords | hierarchy, figure and ground: a white card on the page outweighs the music |
| the card's top not level with the music's top | alignment (HIG): edges that nearly meet read as a mistake |
| the play button doesn't fit there | closeness of actions and objects: Play away from what it plays |
| the header empty | hierarchy: the bar holds the page's name |
| the gap between the card and the sidebar too big | proximity and balance: the card floats free of everything |
| white card on this background, other space empty | common region overused; balance |
| Add to library and Play in one box on a phone | Von Restorff, one FAB: two focal points |
| a pedal and a strip under the keyboard | removed features, and a coloured strip under content reads as outside it |

## Software ergonomics (the owner's course: mebis "Grundlagen – Knowledge Base", section 2, sent 2026-11-17)

- **Usability** is the extent to which a product can be used by given users in a given context to reach given goals
  effectively, efficiently and satisfyingly (DIN ISO 9241-11); **UX** the whole experience from first touch to long use,
  trust and joy included (DIN ISO 9241-210). The five E's: effective, efficient, engaging, error tolerant, easy to learn.
  Functionality, usability and UX only work together.
- **Gestalt, as the course lists them:** similarity (the same function wears the same icon and colour), proximity
  (picture and its text close), Prägnanz (the one call to action differs in colour and size from the rest), closure
  (a container with quiet lines unites text and picture), continuity (along a line the eye follows), common fate
  (what moves together belongs together), common region, connectedness (a line joins steps). Expected places are
  landmarks: a menu where people look for it, "as villagers use the church tower".
- **Colour:** 3–4 colours for the essential parts (one brand colour, two neutrals); no crowd of strong colours; shades
  of one colour for variety; the accent only on the central interactive element; text contrast at least 4.5:1; no
  red–green pairs alone (about 8 % of men see colour differently); **never colour alone**: a change of colour also
  changes type, an icon or a line.
- **Type:** at most two families (one for headings, one for text); fixed sizes for each level, headings about twice
  the text; weight and italic used on purpose; left-aligned ragged text, never justified; about 50–70 characters a line.
  (The course prefers a sans for screens; `DESIGN.md`'s Literata for names and Onest for text stands: two families.)
- **Accessibility (WCAG):** perceivable, operable, understandable, robust; large enough targets; clear structure, the
  same labels for the same things, predictable links, plain language; text that scales.
- **Dark patterns:** "you expect something to happen from experience, and something quite different happens":
  misleading buttons, hidden costs, unclear ways out. Here: every link says where it goes and goes there (the owner's
  "I don't want misleading links"), Play plays, a loss is named truly.
