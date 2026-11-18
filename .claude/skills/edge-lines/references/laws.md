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

## Information architecture (Uxcel, "Basic Components of IA" and "What is UX Design?", sent 2026-11-18)

The source's words first, then the instruction each one gives a board. Every instruction is a check with a yes or no.

**The three pillars.** "Information architecture has 3 main pillars: context, content, and users." Context is "the
goals, mission, constraints, and the devices"; content is "the actual information that needs to be organized"; users
are "the people who will use the product".
- Before a page is drawn, write three lines in the spec: its context (phone on the piano's stand, one free hand, a
  laptop at a desk, offline in a hall), its content (the exact list of things it shows), its user's top task. A part
  that serves none of the three goes.

**Organization systems.** "Methods used to arrange and categorize information … grouping, labeling, and ordering."
"Choosing the type of organization system depends on key user tasks. For example, if most users often search for books
by author, organizing the books alphabetically by author's last name might be best." The screenshot: one undivided
grid of "Our books" (wrong) against a row of categories, All · Biography · Fiction · Horror · Romance · Mystery ·
Fantasy, the chosen one shown, then a titled shelf "Biography" with its own ‹ › (right).
1. A collection of more than about 12 items is never one undivided grid or list: it is grouped by the key the learner
   hunts by (level, book, key, kind, composer), named in the spec.
2. The groups are shown as a row of choices at the top, the first one All, the chosen one marked; the content under
   them is titled with the chosen group's name.
3. The order inside a group follows the hunt: by a musical order where one exists (learning order, the circle of
   fifths), else Recently used first; alphabetical only when the learner looks things up by name.

**Labeling systems.** "Grouping items under clear labels like 'Electronics' or 'Furniture' … without using jargon";
"ensure you use clear and meaningful labels consistently throughout the interface." The screenshot: a menu of
"Tech & Tools, Ornamentation, Apparel, Children's Playsets, Cooking Tools, Literature, Personal Care" (wrong) against
"Electronics, Furniture, Clothing, Toys, Kitchen Appliances, Books, Health & Beauty" (right).
4. A category label is the plain, common name of what it holds, one or two words, the word the learner would type
   in Search; never a coined or clever name. (Here the musician's term is the common name: Chords, Scales and keys,
   Accompaniment.)
5. Labels side by side are the same kind of word and the same level of generality (all nouns for kinds of thing; no
   one label much broader or narrower than its siblings).
6. One thing has one label on every screen, in the bar, the sidebar, the tab, Search and the page title.

**Navigation systems.** Global, footer, sidebar, breadcrumbs. "A good navigation system is clear, concise, and helps
users find what they need quickly." The screenshot: a top bar of "Catalog · Services · About Us · Contact" plus
"Follow us" icons and "Terms of Use" crammed beside them (wrong) against the four places alone (right).
7. The main navigation holds only the places (Learn, Songs, Practice, Profile). Nothing else stands beside them:
   no social links, legal links, promotions or settings rows; those live at the foot of Settings or Profile.
8. Navigation items are one kind (places), one style, evenly spaced; a sub-place is indented under its place (the
   laptop sidebar), never a mixed row.
9. Every page shows where it is: the current place marked in the bar or sidebar, the page's name in its bar, Back to
   its parent.

**Search systems.** "Save time … especially on large sites"; "auto-suggestions, filters, and advanced search options".
10. Any collection a learner would hunt in has a search at its top; Search opens with help (recent, suggested) before a
    word is typed, and its results are grouped by kind with counts.

**Design value.** "What information to present, how much, and when." The screenshot: a hospital menu of "About Us, Our
Cafeteria Menu, Visitor Guestbook, Gift Shop, Staff Blogs" (wrong) against "Departments ⌄, Specialists ⌄, Patient
Records, Emergency Care" and one "Book Appointment" button at its foot (right).
11. A menu or page lists first the things the learner comes for, never the organisation's own pages (about, news,
    blog); the one main act of the menu is a filled button at its foot.
12. An item with children shows a chevron ⌄ and opens in place; it never jumps to a page that only lists them.

**Value for users.** The screenshot: a Courses menu listing six single courses, "History 101 … Organic Chemistry"
(wrong), against three groups, "Undergraduate Courses, Graduate Courses, Online Courses" (right).
13. A menu shows groups, not a sample of items: at most about seven entries, each a group the learner recognises;
    single items are reached inside their group. Six items picked from a hundred is a wrong menu.

**Strategy and technology value.** The structure serves the product's goal (here: practice that brings the learner
back, Continue first) and the data model holds the same groups the screen shows.
14. The first thing on a place's overview is the learner's next step (Continue); its groups match the model's
    groups one for one (a level's Journey, a book's exercises), so one name means one set everywhere.

**UX and UI ("What is UX Design?").** UX "focuses on the overall journey"; UI "on what users see and interact with";
"observing what users do rather than just listening to what they say". The design-thinking stages: empathize,
define, ideate, prototype, test, "not strictly linear".
15. A screen change starts from the learner's journey (how they arrive, what they do, where they go next), written in
    the spec's sketch phase, before any look; a looks-only fix that leaves the journey broken is not done.

## One outcome per screen (Uxcel, "How to Design Landing Pages That Convert", sent 2026-11-18)

The source's words, then the exact instruction for every board (a screen of ours is a page with one outcome, as a
landing page is: the welcome, an empty library, a song's page, a lesson's end, Explore's song).

- "A landing page commits fully to one outcome … every design choice becomes clearer when measured against a single
  question: does this help someone take action?"
  1. Each board's spec names its one outcome in one line (play this song, open the next lesson). Every part is asked
     "does this help that outcome?"; a part that does not goes, or moves behind a ··· or a fold.
- "Remove everything on the page that doesn't directly support that information … secondary offers, distracting
  imagery … even navigation"; "most users read as little as 20% of web copy … limiting your paragraphs to 3-4 lines
  and add descriptive subheadings for every couple of paragraphs." The screenshot: a five-line headline over a cloud of
  five images (wrong) against a three-line headline and one picture (right).
  2. No second offer beside the one act (no banner, promotion or "also try" inside the content).
  3. One picture per block, the one that shows the thing (the score, the keys, the cover); never a collage.
  4. A paragraph is at most 4 lines at the column's width (phone 402: about 4 × 45 characters); a lesson section of
     more than two paragraphs gets a subhead.
- "Users form a first impression … in 0.05 seconds"; "clear, concise headlines … Shorter is generally better." The
  screenshot: "Becoming a designer may take years of study. We have a different offer for you" (wrong) against
  "Become a UX Designer in 6 months" (right).
  5. A screen's title or headline is one idea in at most about 6 words and two lines; a promise is concrete (a number,
     a time, a thing) never a setup sentence.
- Value proposition: "What is the product? How does it benefit users? How does it work?" — "a header, description, and
  image/video". The screenshot: "We're managing your finances, while you have time enjoying your life moments" (wrong)
  against "We manage your finances, you savor life's moments" (right): active, present, shorter.
  6. A welcome or empty state answers the three questions in a header (what), a line (the benefit) and a picture (how
     it works), in that order, in active present tense.
- "Avoid jargon … If your product is targeted at a specialized group of users, you may use technical terms, but you
  should explain what they mean first." The screenshot: "Optimize ROI through curricular frameworks and individualized
  learning trajectories" (wrong) against "Unlock your full potential with personalized learning paths" (right).
  7. Words are the learner's words. A musician's term is the learner's word here (the rulings); a term a beginner may
     not know (voicing, inversion) has an ⓘ the first time it appears on a screen, never a paragraph.
- CTA: "an accent color … contrasting hue"; "without requiring users to scroll"; "active verbs"; "a larger CTA button";
  "a minimum touch target of 44x44 CSS pixels". The screenshot: "Start hiring" as a grey button (wrong) against the
  same in the accent (right).
  8. The one act is the screen's only honey (accent) fill, 44 high at least (48–56 for the page's main act), its label a
     verb and its object, and it is on the first screen without scrolling at 402×874 and at 1710×904.
  9. On a long page (over two screens) the act is reachable from the foot as well: it floats (one FAB) or repeats once
     at the end, never more than twice.
- "If there's content below the cut that isn't immediately apparent … use a visual indicator"; "the CTA, main image, and
  headline are clearly visible without scrolling."
  10. The first screen never ends on a clean break that looks like the end: the next block's top or a shelf's next
      cover shows at the fold (a cut card, a peeking cover), so the learner sees there is more. The screenshot: a
      hero that ends flat at the fold under "Get started" (wrong) against the same hero with a small drawn arrow
      pointing down beside the act (right): where nothing peeks, a quiet ⌄ under the act says there is more.
- "Use contextual images … that add to the meaning."
  11. A picture is the content itself (the song's first bars, the chord's keys, a real cover), never stock or a
      decorative illustration. The screenshot: "Let's travel to Switzerland" over a Paris street (wrong) against the
      same words over the Alps (right): the picture proves the headline. Here: a song's cover is its own first bars,
      a chord's card its own keys, a course's its own first piece; never a generic piano photo.
- Social proof and authority ("reviews, ratings, stats"; logos).
  12. Only where true and on a public thing: Explore's saves and plays, a course's learners; never invented numbers.
      The screenshot: a vague claim, "Worldwide photographers choose our app", ringed by floating faces (wrong),
      against quotes, each with its person's face and words ("I've been a professional photographer for 10 years…")
      (right). And "Trusted by industry leaders worldwide" over faces and grey bars (wrong) against "Trusted by" and
      five real logos in one row (right). So: proof is specific (a named person's words, a real count, a known
      name), never an adjective; a count says what was counted ("1,240 saves"), on one line with its thing.
  12a. A reward or perk is the concrete thing the learner gets, named in the headline: "Subscribe to stay updated on
      new lessons" (wrong) against "Subscribe and get a free yoga practice session" (right). Here: a streak's or a
      badge's line names what it unlocks or proves ("7 days: the Arpeggios course opens"), never "keep going".
- "Design responsively"; "load times under 2.5 seconds".
  13. The headline and the act hold at 393, 402, 744, 1024 and 1710 (testing.md); a screen shows its frame at once and
      fills slow parts with skeletons, never a blank.
- "Sticky chat elements should be desktop features only … mobile users always complain that sticky chats overlay search
  results, filters, or worse, the Checkout button."
  14. Nothing floats over a phone screen's content except the bars and its one floating act; help is a row in Settings
      and a ⓘ, never a floating bubble.

## Which component for which job (Uxcel, "Common UI Components Part I", sent 2026-11-18)

The source's sentence for each component, then the instruction that holds on every board. A component used for
another component's job is a finding.

- **Button.** "Allow users to perform actions with a single click or tap"; "Use action verbs on button labels … so
  they can act without reading supporting text."
  1. A button does one act now, and its label is a verb (and its object): Play, Add to library, Next lesson. Never a
     noun alone ("Settings" is a row or an icon, not a button), never "OK" or "Yes".
  2. A button needs no line of text under it to be understood; if it does, its label is wrong.
- **Checkbox.** "Multiple options to be selected … simultaneously"; "a checkmark inside" when on, "empty" when off;
  "a label beside them … alone … or stacked."
  3. Several independent picks from one list (Select mode's rows, a filter's options) are checkboxes, the label on
     the right of the box, the whole row tapping it. Off is an empty ring, on is filled with a check (scan-first 5).
- **Radio button.** "Only allow one"; "filled with a dot" when chosen; "once an option is selected, it cannot be
  returned to that state … If the deselected state is important, you'll need to give users an alternative."
  4. One choice of several that are all shown and exclusive is a radio group (or a segmented control when there are
     two to four short options); one option is always chosen, the usual one by default. "None" is an option of its
     own when it is a real choice (Off, None), never a radio that cannot be unticked.
- **Toggle switch.** "Alternate between two options that cannot coexist … on and off"; "effective for tasks where the
  response is instantaneous"; "make sure the on and off states … are immediately apparent."
  5. On/off for a setting that takes effect at once is a switch, its row's label the thing switched ("Count-in"),
     never a switch that needs a Save; on is filled with the track coloured, off is grey, both readable without colour
     (the knob's side).
- **Text input.** "Recognize different types of data … auto-format … switch the mobile keyboard."
  6. Every field names its kind (`type`/`inputmode`: a tempo is numeric, an email is email, a search is search) and
     carries a visible label; a value with a known form (BPM, 3/4) formats as typed and accepts loose input (Postel).
- **Menu.** "Context-sensitive … appear when you need them and disappear when you don't."
  7. A menu opens from the control the learner touched, holds the acts for that thing only, and closes on a tap
     outside (ui-and-mockups: a ··· opens a menu at its button). Never a menu of one item; never the screen's main
     act hidden in a menu.
- **Form.** "Collect as little information as necessary to complete the user's action."
  8. A form (New song, New playlist, sign in) asks only what the act needs now; everything else has a default and is
     changed later in the thing's settings. Its one act is at its foot.
- **Modal.** "Disable the rest of the elements … while keeping them visible"; "used sparingly, either in response to
  an action users have taken or to warn them about something important"; "any time a modal is triggered indirectly,
  it interrupts the flow."
  9. A modal (a dialog, a sheet that blocks) opens only from the learner's own tap or for a loss that cannot be undone
     (`ConfirmDialog`); never on arrival, never for news or a prompt to rate, sign in or upgrade.
- **Card.** "Compact, self-contained information containers that present a snippet of content … like digital index
  cards"; "may also contain interactive elements … such as a Learn More button."
  10. As "Cards" below: a card is a thing you open, among siblings; at most one act of its own besides opening it.
- **Table.** "Rows and columns … each row … a single entry, while columns categorize"; "headers provide labels for
  columns"; "filters … sorting … search."
  11. Data compared across several attributes (All songs on a laptop, Explore, the Admin lists) is a table: one row per
      thing, a header row naming every column, numbers right-aligned in tabular digits, sorting from the header or a
      sort menu, and search above it.
- **Header.** "Navigational landmarks … essential context"; "keep the design of your header uniform throughout."
  12. Every screen's bar is the one bar (`ScreenHeader`, `ScoreBar` on the Player and editor): Back at the left, the
      page's name, its own acts at the right, the same height and inset on every board (`lines.mjs` flow checks it).
- **Footer.** "Information that is useful but not necessarily the primary focus … contact information, links to
  privacy policies or terms of use … closure."
  13. What a web footer holds (Legal, About, version, Report a problem) lives at the foot of Settings, after its
      groups, never on a working screen; the phone's tab bar is navigation, not a footer, and holds only the places.

## Predictions and suggestions (Uxcel, "What Is AI-Powered UX?", sent 2026-11-18)

Where the app guesses for the learner: chords detected from a recording or an import, a suggested next song or
lesson, Continue, a level placement, a practice pace. The source's words, then the rule.

- "Show predictions as helpful suggestions, not decisions. Always let users easily accept, change, or ignore these
  suggestions."
  1. A guess is drawn as a suggestion (a quiet chip or row labelled Suggested, or a chord in the soft style), with
     its accept in one tap, a way to change it in place, and a way to dismiss it; it never replaces the learner's own
     choice or data until accepted.
- "Predictions that miss the mark feel intrusive and waste interface space."
  2. At most one suggestion block per screen, below what the learner came for, never above it; a dismissed
     suggestion does not come back on the same screen in the same session.
- "Users need to understand when the system is certain versus when it's making an educated guess"; "a weather app
  might show a percentage chance of rain"; "hiding uncertainty often backfires."
  3. A detected chord or note that is uncertain is marked as uncertain (a dashed outline, "?") and is the first one a
     review step goes to; a certain one is drawn plainly. Never a percentage where a musician would not use one.
- "Good designs include clear ways for users to provide feedback when predictions are wrong."
  4. Correcting a guess is the same act as editing it (tap the chord, pick the right one); the correction is the
     feedback, with no separate form.
- "Balance personalization with transparency by showing users how the system learns from their behavior and giving
  them control."
  5. Every personal ordering says why in its head or ⓘ ("Recently played", "From your level"), and the learner can
     change it (a sort menu) or clear it (Settings › Clear history).
- Personalization of "layout", "features" and "complexity": "bringing frequently used features forward … keeping
  interfaces simpler for beginners."
  6. The frame never rearranges itself by use: bars, places and the order of settings stay where they are (Jakob,
     consistency). Personal order is allowed only inside lists (Recently used first) and in Continue.
- "Transparency mechanisms that help users understand … what data influences those decisions"; "clear user controls
  over what information feeds into models"; "mechanisms for user redress."
  7. Anything learned from the learner's playing is theirs: Settings shows what is kept and has Clear and Export;
     Report a problem is reachable from the screen where a guess went wrong (its ··· menu). Never read a learner's
     data to diagnose (`CLAUDE.md`).
- "Automation offers consistency and reliability for well-defined tasks."
  8. Where a rule gives the right answer (a key signature's accidentals, a scale's notes, a chord's tones), the app
     uses the rule and shows it as fact, never as a guess.

## Cognitive biases: in the learner and in us (Uxcel, "Cognitive Biases", sent 2026-11-18)

- **False consensus.** "People assume that others think the same way they do … a designer loves using shortcut keys
  … might design a software interface that relies heavily on these shortcuts."
  1. Every act reachable by a shortcut or a gesture (a swipe, a long press, a letter key) is also a visible control
     or a menu item; a shortcut is never the only way.
  2. A design choice the owner has not ruled and the references do not settle is checked against two shipped apps'
     screenshots (`piano-data/reference-apps`, the web) before it is drawn, never decided by our own taste alone.
- **Halo and horn.** "If their first interaction is negative, they might continue to view the app negatively"; the
  search "often forms users' initial impressions"; "simplify the account setup."
  3. The first screens a new learner meets (welcome, Learn's first run, the first song played, Search) are checked
     first in every round, at every width; Search answers the first letter with results or help, never a blank.
  4. Nothing asks for an account before the first song plays; signing in is offered after a thing worth saving
     exists (accounts optional, ADR 0116).
- **Confirmation bias.** "Favor information that confirms their existing beliefs"; "have someone not involved in the
  project review."
  5. A fix is checked by a measure that could prove it wrong (the lines tool, a shot after the change, a fresh look at a
     stale shot's date), never by looking for what confirms it. A shot's file time is checked before it is judged.
- **Negativity bias.** "A single issue … can seem more significant than many of its good features"; "keep navigation
  and search functions in standard locations"; "ensure that error messages are helpful and polite."
  6. The worst moment of each flow (a failed import, a wrong note, a lost connection) is drawn as carefully as its
     best: the error says what happened, what is kept, and the one act that fixes it, beside the place it failed.
  7. Search, Back, Settings and the places stay where the platform puts them on every board.
- **Anchoring.** "Rely heavily on the first piece of information they see"; "well-chosen numerical default values …
  set expectations"; "providing an upfront time estimate."
  8. Every number control starts on the usual value (tempo at the piece's marked tempo, Wait mode's pace at 100%, a
     metronome at 4/4 and 80), and the default is shown as the default (grey, scan-first 5).
  9. A wait over about 2 seconds (an import, an export, a recording's analysis) says how long it will take or how far
     it has got, before it starts.
- **Framing.** "Different presentations of the same information lead to different conclusions"; "use neutral language
  … rather than asking users if they 'love' a new feature, ask how they 'feel'."
  10. Progress is framed as what was done and what is next ("6 of 13 lessons", "2 more days to Gold"), never as a
      failure count; a result after practice names the bars to work on as the next step, not as a score lost.
  11. A loss is framed truly as a loss (R38), never softened into a gain; feedback prompts ask in neutral words.

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
