# Dorico master pages (page templates): defaults

From the Dorico 4.0.5 default library, decoded from `score.dtn` (`library/pagePairDefinitionSets`).
Frame constraints are in **points**, measured inward from the page **margin** edge named in the constraint (left/right/top/bottom). Example: the composer frame is 255 pt wide, half of the 510 pt between margins on A4 (594 − 2 × 42).
A frame with both `left = 0` and `right = 0` stretches the full width between the margins. `{@token@}` fields are filled from project, flow or page info.


## Default Full Score (`pageset.fullscore`, kFullScore)


### firstPageDefinition (None)

| Side | Chain | Kind | Content (paragraph style → text) | Position | Size |
|---|---|---|---|---|---|
| left | 1 | text | `paragraph.title` → `{@projectTitle@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 36.0} |
| left | 3 | text | `paragraph.copyright` → `{@projectCopyright@}` | {'left': 0.0, 'right': 0.0, 'bottom': 0.0} | {'height': 15.0} |
| left | 0 | music | kFollowFlowFilter | {'left': 0.0, 'right': 0.0, 'bottom': 20.0, 'top': 60.0} | {} |
| left | 4 | text | `paragraph.lyricist` → `{@projectLyricist@}` | {'left': 0.0, 'top': 36.0} | {'width': 255.0, 'height': 24.0} |
| left | 5 | text | `paragraph.composer` → `{@projectComposer@}` | {'right': 0.0, 'top': 36.0} | {'width': 255.0, 'height': 24.0} |
| right | 1 | text | `paragraph.title` → `{@projectTitle@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 36.0} |
| right | 3 | text | `paragraph.copyright` → `{@projectCopyright@}` | {'left': 0.0, 'right': 0.0, 'bottom': 0.0} | {'height': 15.0} |
| right | 0 | music | kFollowFlowFilter | {'left': 0.0, 'right': 0.0, 'bottom': 20.0, 'top': 60.0} | {} |
| right | 4 | text | `paragraph.lyricist` → `{@projectLyricist@}` | {'left': 0.0, 'top': 36.0} | {'width': 255.0, 'height': 24.0} |
| right | 5 | text | `paragraph.composer` → `{@projectComposer@}` | {'right': 0.0, 'top': 36.0} | {'width': 255.0, 'height': 24.0} |

### normalPageDefinition (None)

| Side | Chain | Kind | Content (paragraph style → text) | Position | Size |
|---|---|---|---|---|---|
| left | 2 | text | `paragraph.pagenumber` → `{@page@}` | {'left': 0.0, 'top': 0.0} | {'width': 20.0, 'height': 15.0} |
| left | 0 | music | kFollowFlowFilter | {'left': 0.0, 'right': 0.0, 'bottom': 0.0, 'top': 20.0} | {} |
| left | 6 | text | `paragraph.header` → `{@flowTitle@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 15.0} |
| right | 2 | text | `paragraph.pagenumber` → `{@page@}` | {'right': 0.0, 'top': 0.0} | {'width': 20.0, 'height': 15.0} |
| right | 0 | music | kFollowFlowFilter | {'left': 0.0, 'right': 0.0, 'bottom': 0.0, 'top': 20.0} | {} |
| right | 6 | text | `paragraph.header` → `{@flowTitle@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 15.0} |

### flowHeadingDefinition (Default)

| Side | Chain | Kind | Content (paragraph style → text) | Position | Size |
|---|---|---|---|---|---|
| heading | 7 | text | `paragraph.flowtitle` → `{@flowNumber@}. {@flowTitle@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 24.0} |

## Default Part (`pageset.part`, kPart)


### firstPageDefinition (None)

| Side | Chain | Kind | Content (paragraph style → text) | Position | Size |
|---|---|---|---|---|---|
| left | 1 | text | `paragraph.title` → `{@projectTitle@}` | {'left': 0.0, 'right': 0.0, 'top': 20.0} | {'height': 36.0} |
| left | 3 | text | `paragraph.copyright` → `{@projectCopyright@}` | {'left': 0.0, 'right': 0.0, 'bottom': 0.0} | {'height': 15.0} |
| left | 0 | music | kFollowFlowFilter | {'left': 0.0, 'right': 0.0, 'bottom': 20.0, 'top': 80.0} | {} |
| left | 4 | text | `paragraph.lyricist` → `{@projectLyricist@}` | {'left': 0.0, 'top': 56.0} | {'width': 255.0, 'height': 24.0} |
| left | 5 | text | `paragraph.composer` → `{@projectComposer@}` | {'right': 0.0, 'top': 56.0} | {'width': 255.0, 'height': 24.0} |
| left | 7 | text | `paragraph.layoutname` → `{@layoutName@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 20.0} |
| right | 1 | text | `paragraph.title` → `{@projectTitle@}` | {'left': 0.0, 'right': 0.0, 'top': 20.0} | {'height': 36.0} |
| right | 3 | text | `paragraph.copyright` → `{@projectCopyright@}` | {'left': 0.0, 'right': 0.0, 'bottom': 0.0} | {'height': 15.0} |
| right | 0 | music | kFollowFlowFilter | {'left': 0.0, 'right': 0.0, 'bottom': 20.0, 'top': 80.0} | {} |
| right | 4 | text | `paragraph.lyricist` → `{@projectLyricist@}` | {'left': 0.0, 'top': 56.0} | {'width': 255.0, 'height': 24.0} |
| right | 5 | text | `paragraph.composer` → `{@projectComposer@}` | {'right': 0.0, 'top': 56.0} | {'width': 255.0, 'height': 24.0} |
| right | 7 | text | `paragraph.layoutname` → `{@layoutName@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 20.0} |

### normalPageDefinition (None)

| Side | Chain | Kind | Content (paragraph style → text) | Position | Size |
|---|---|---|---|---|---|
| left | 2 | text | `paragraph.pagenumber` → `{@page@}` | {'left': 0.0, 'top': 0.0} | {'width': 20.0, 'height': 15.0} |
| left | 0 | music | kFollowFlowFilter | {'left': 0.0, 'right': 0.0, 'bottom': 0.0, 'top': 20.0} | {} |
| left | 6 | text | `paragraph.header` → `{@layoutName@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 15.0} |
| right | 2 | text | `paragraph.pagenumber` → `{@page@}` | {'right': 0.0, 'top': 0.0} | {'width': 20.0, 'height': 15.0} |
| right | 0 | music | kFollowFlowFilter | {'left': 0.0, 'right': 0.0, 'bottom': 0.0, 'top': 20.0} | {} |
| right | 6 | text | `paragraph.header` → `{@layoutName@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 15.0} |

### flowHeadingDefinition (Default)

| Side | Chain | Kind | Content (paragraph style → text) | Position | Size |
|---|---|---|---|---|---|
| heading | 8 | text | `paragraph.flowtitle` → `{@flowNumber@}. {@flowTitle@}` | {'left': 0.0, 'right': 0.0, 'top': 0.0} | {'height': 24.0} |

## Paragraph styles

| Style | ID | Font | Size (pt) | Font style | Alignment | Leading | Gap after |
|---|---|---|---|---|---|---|---|
| Bar numbers (parts) | `paragraph.barnumbers.part` | Academico | kStaveRelativeSize, 9 | Italic | kLeft | 100 | 0 |
| Bar numbers (score) | `paragraph.barnumbers.score` | Academico | kStaveRelativeSize, 9 | Italic | kLeft | 100 | 0 |
| Composer | `paragraph.composer` | Academico | kAbsoluteSize, 10 |  | kRight | 100 | 0 |
| Copyright | `paragraph.copyright` | Academico | kAbsoluteSize, 8 |  | kCentre | 100 | 0 |
| Default Text | `paragraph.defaulttext` | Academico | kStaveRelativeSize, 12 |  | kLeft | 100 | 0 |
| Figured Bass Tasto Solo | `paragraph.figuredbasstastosolo` | Academico | kStaveRelativeSize, 8 |  | kLeft | 100 | 0 |
| Flow Title | `paragraph.flowtitle` | Academico | kAbsoluteSize, 16 |  | kCentre | 100 | 0 |
| Galley View Margin Labels | `paragraph.galleyviewsmarginlabels` | Source Sans Pro | kStaveRelativeSize, 8 |  | kLeft | 100 | 0 |
| Header | `paragraph.header` | Academico | kAbsoluteSize, 10 |  | kCentre | 100 | 0 |
| Instrument Change Labels | `paragraph.instrumentchangelabels` | Academico | kStaveRelativeSize, 12 |  | kLeft | 100 | 0 |
| Layout name | `paragraph.layoutname` | Academico | kAbsoluteSize, 14 |  | kLeft | 100 | 0 |
| Lyricist | `paragraph.lyricist` | Academico | kAbsoluteSize, 10 |  | kLeft | 100 | 0 |
| Page Number | `paragraph.pagenumber` | Academico | kAbsoluteSize, 10 |  | kOutside | 100 | 0 |
| Player Group Labels | `paragraph.playergrouplabels` | Academico | kStaveRelativeSize, 10 |  | kLeft | 100 | 0 |
| Player Labels | `paragraph.condensationlabels` | Academico | kStaveRelativeSize, 8 |  | kLeft | 100 | 0 |
| Repeat Count | `paragraph.repeatcount` | Academico | kStaveRelativeSize, 11 | Bold | kLeft | 100 | 0 |
| Staff Labels | `paragraph.stafflabels` | Academico | kStaveRelativeSize, 10 |  | kRight | 100 | 0 |
| Staff Labels (Inner) | `paragraph.stafflabelsinner` | Academico | kStaveRelativeSize, 10 |  | kRight | 100 | 0 |
| Staff Labels (Percussion Grid) | `paragraph.stafflabelsgrid` | Academico | kStaveRelativeSize, 8 |  | kRight | 100 | 0 |
| Tacet | `paragraph.tacet` | Academico | kAbsoluteSize, 16 |  | kCentre | 100 | 0 |
| Title | `paragraph.title` | Academico | kAbsoluteSize, 20 |  | kCentre | 100 | 0 |
