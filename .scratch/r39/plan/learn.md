# Learn (canvas 128)

Premium for Learn means it stands beside flowkey's course list and Duolingo's unit view: you see at once where you
are, what is next, and that every lesson can still be opened.

## The rulings as they stand

- **Learn refactored: one overview, a page per level, a page for all courses** (canvas 163, owner 2026-11-13: "make
  proper refactor of the lessons and cources and the header and the structure and organization"). Replaces the
  "Lessons | Courses as the title", the level chips and the laptop's level column below.
  - **The header is every place's:** the large title "Learn" with Search in the bar, as Practice and Songs; no
    two-word switch, no Edit in a learner's bar (an editor's Edit is in a level's or Courses' More).
  - **Learn** (`/`): Continue (the next lesson, "Lesson 7 · 6 of 13 learned", a meter, the honey button); **Levels**,
    four rows, each a ring of its progress round its number, "Beginner", "Foundations · 13 lessons", "6 of 13";
    **Courses**, a row of course cards (the one in progress first) with See all; **Your lessons and courses**, the
    learner's own rows, then New lesson and New course.
  - **A level** (`/levels/$level`, Back to Learn): its name large with its progress, its goal, then its chapters as
    the line of lessons (the tiles of canvas 162). On a laptop its side holds the progress, Continue and the other
    levels.
  - **Courses** (`/courses`, Back to Learn): the shelves, each a list of courses with their covers; what courses are
    in an ⓘ beside the title, never a box over the page.
  - **The title is in the bar** (owner, same day: "I dont like that the header is occupied only by these two
    buttons no the right and the rest is just empty"): every place's and page's bar holds its title at the left and
    its actions at the right, one row (`TITLEBAR`); two titles side by side (My songs · Explore) step down to 26px so
    neither is cut. Learn, Songs, Practice, Profile, Settings, Administration and the library pages changed with it.
  - Never again: a title that switches the page, levels as chips that swap the page in place, Your lessons among the
    levels, a second column that repeats the page's own switch.

- **The lesson and the course, their editors and Settings, refactored** (canvas 164, owner 2026-11-13: "and refactor
  also their lessons pages and controls and features and the editing of the lessons and cources and their settings
  and all of its controls"):
  - **A course's page:** its name in the bar (Back to Courses, a second line before it is cut), Settings and Edit at
    the bar's end; the cover, what it teaches, its facts, how much is learned with Next, Continue in honey, About.
    Its lessons are the line a level's are (one spine, no card). A laptop holds the course's card in view on the
    left and its lessons and guided songs on the right; never one narrow column in a wide screen.
  - **A lesson's Learned says itself:** a pill with its word ("Learned"), grass once learned, never a bare check.
  - **Settings, the lesson's and the course's:** the title "Settings" in the bar with Back, the item's name under it
    small; groups as before, then Progress: Reset progress happens at once with Undo in its toast (R38), never
    asked; Delete lesson / Delete course asks, as it reaches every learner, naming the loss in its dialog; no line of
    explanation under any row.

- **Your lessons and courses, organised; one New; their Settings** (canvas 165, owner 2026-11-13: "refactor further
  the settings and what bout the new lessons or new courses actions and such things and organizing my lessons and
  cources. and refactor the courses settings and lessons settings and their overviews pages properly"):
  - **A page of their own** (`/your-lessons`, from See all beside Learn's "Your lessons and courses", Back to
    Learn), in the app's library shape: search with its sort joined to its end (Recent, Name); All · Lessons ·
    Courses; each course a row that folds open to its own lessons; lessons in no course below; every row's ⋯
    (Open, Duplicate, Settings, Delete), Delete at once with Undo. The + floats on a phone; New beside the
    search on a laptop. Empty: one line and New lesson or course; no match: says so, with Clear search.
  - **One tile per kind, everywhere:** a lesson the level's round tile (a book, grass with a check once
    learned, its arc of what is read); a course its cover. Learn shows the newest four, courses first.
  - **One New sheet** for both (Flat's New score): Lesson | Course, Name, then In a course (a lesson) or Cover (a
    course), one Create at its foot that opens what was made in its editor. Learn keeps one row, "New lesson or
    course"; the two New rows and their two sheets are gone.
  - **Own lesson's Settings:** Read as; The lesson: Name (its value, opening Rename), In courses (a checklist,
    at once), Duplicate; Progress: Reset progress (Undo); Delete lesson apart.
  - **Own course's Settings:** The course: Name, Duplicate; Progress; Delete course apart. Its line, cover and
    lessons keep their one home in its Edit mode (one home a setting). No Share link on either: the learner's
    own live on their devices, and a link would promise what the app cannot do.

- **One piano; New as a choice of two; popovers that carry the facts** (canvas 167, owner 2026-11-13: "make proper ui
  and refactoring also for the popups with meaningful information and how you can show more things with less ui. and
  what about proper floating actions for the new lessons or courses … and we should have consistency between the
  components across the app, like this piano doesn't look like the piano be design from the piano player or chords
  play"):
  - **One piano everywhere:** every 2D keyboard on every board wears the app's keys (`PianoKeyboard`): the felt along
    the far end, ivory keys lit from the player's side with a lip, ebony keys bevelled with a sheen, rounded feet, on
    the key bed; marks paint the key, its name at its foot. One pass (`keyface.py`) gives every board's keys their
    faces, Day and Night; the Player and Chords keep the 3D hands at the same keys.
  - **New is a choice of two:** on a phone the + is New's dial, the app's one `SpeedDial`, as Songs' (centred, it
    turns to a close, the page dims, a card of New course over New lesson grows from it); from a row (Learn's "New lesson or course") or the laptop's
    New ▾ the same two as a menu. Each opens its own short sheet, titled New lesson or New course: a lesson's Name
    and In a course, a course's Name and Cover. No Lesson | Course switch in the sheet.
  - **Popovers carry facts, not prose:** a lesson's keys explain their colours in an ⓘ beside the example's title
    (Whole step · W, two half steps: C–D; Half step · H, the very next key: E–F, B–C), never a line under the
    keys; About the courses is one line, then the shelves with their counts.

- **"A library, not a path"** (feedback log, Learn and the editors): the levels stay chips (Beginner, Intermediate,
  Advanced, Professional, Your lessons) and any lesson opens from any state. The word "journey" stays out of the
  interface.
- **The level's lessons drawn as a line of tiles** (canvas 128, the bold decision): one spine joins a level's lessons
  in order, chapter by chapter ("1 · The keyboard and the staff", with "3/3" learned). A learned lesson is a sage
  tile with a check, the next one has a honey ring, a book and a "Next" pill, and the rest show their number. A skill
  check (Scales check, Chords check) is a rounded square, not a circle, with "Scales · 5 of 12 known". The spine
  shows the order and what is learned at a glance (scan-first 3 and 7); it locks nothing.
- **Continue first:** "Continue · Foundations", the next lesson in the serif, "6 of 13 learned" and a meter, and one
  honey round button. No days practised here (that is Profile's).
- **Lessons | Courses as the title:** the large title is a two-word switch. Courses are shelves (Beginner courses,
  Intermediate courses, Chords and improvisation, Method books), each course one row with its line ("Rhythm Basics ·
  Count, clap and play in time"), then Your courses.
- **Laptop:** a level list on the left (each level with its book title and "6/13"), the line of lessons in the middle,
  and Continue with Your courses on the right.
- **Real content:** the four levels' chapters and lessons from `src/entities/lesson/content/journeys.ts`.

- **A course is edited as a lesson is** (canvas 130): the Course page enters Edit mode in place (Done · Publish…,
  "Not published yet"); Shelf, Level and Length as chips; lessons keep their order by a grip, Remove is undone from
  its toast; Add lesson opens a New sheet. Learn's Courses take the same Edit mode, with New course (Name, Shelf,
  Level, Length, Create course). Settings and Publish are pages with Back, the same for a lesson and a course.

- **A check is named as what it checks** (canvas 162, loop round 10): one scale ("Major", "Scale · Not known yet")
  or one chord family ("Triads", "Chords · 0 of 7 known"), its square showing its kind's picture (bars for a scale,
  the keys for chords); never an invented "Scales check · 5 of 12 known". Tiles still to learn are plain (white, a
  hairline, the number in ink): colour only for learned (sage) and next (the honey ring).
- **Learn by Night** (canvas 162): phone and laptop Night boards beside the Day ones.

## History

- Canvas 128 (2026-11-11): Learn drawn for the first time on the one canvas: phone and laptop, Lessons and Courses.
- Canvas 162 (2026-11-13, loop round 10, design first): checks named truly with their pictures; Learn's Night boards.
- Canvas 163 (2026-11-13): Learn refactored to an overview (Continue, Levels, Courses, your own), a level's page and Courses' page; the header as every place's.
- Built to canvas 163 (2026-11-13, "as close as possible"): Continue a plain card, "Continue · Foundations" in honey ink, the count over a meter the card's width; each level "Foundations · 13 lessons" beside a smaller ring with a plain number; each course cover its summary under it, Next on the one in progress. The serif titles stay (DESIGN.md), as the canvas draws its own names.
