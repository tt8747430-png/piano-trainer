# The R37 Player canvas generator

History only: this canvas was merged into the one canvas (owner, v15). New work is drawn in `../../r39/canvas/`
(`index.py`, the r39 kit), as `redesigning-a-screen` says.

The Design artifact https://claude.ai/artifact/HezkVS2MXdwz7uJ14KDGgp is built from these files: `R3Phone.bak` and
`R3Laptop.bak` are the base pages, and each Python file patches one part of both pages (`panels.py` the panels,
`kb.py` the keyboard, `score.py` the sheet, `keys.py` the keys, `loop.py` the loop, `settings.py`, `views2.py` and
`words.py` the rest).

- **Build:** put the artifact's files in `../ideal-canvas/project/` beside this folder (Artifact `read` with `paths`
  fetches them), then `bash build.sh`.
- **Test:** `node live4.mjs '<json shots>'`, for example
  `[{"file":"R3Phone","vp":{"width":450,"height":920},"state":{"open":"pattern"},"name":"p1","test":"patlib"}]`.
  Screenshots go to `../shots`. The laptop needs a viewport 1960 wide. The 3D keyboard pictures come from
  `blobs.json`, which maps blob ids to local images and is not kept here; without it the pictures are blank and the
  rest works.
- **Publish:** the Artifact tool with the artifact's `url`, `root` the folder holding `project/`, `file_path`
  `project/canvas.json`, and `files` naming `project/R3Phone.dc.html` and `project/R3Laptop.dc.html`. A label has
  60 characters at most.
- A flex-column panel's children need `flex: none`, or they collapse.
