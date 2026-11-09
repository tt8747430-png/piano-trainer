# YouTube transcripts

Writes `piano-data/transcriptions/youtube/`: one Markdown transcript per piano video on the owner's YouTube, by
playlist, and its `README.md` index. The app reads none of it.

Needs `yt-dlp`, `ffmpeg` and `whisper-cpp` (`brew install yt-dlp ffmpeg whisper-cpp`, plus `deno` for yt-dlp's
challenges), and two models in `~/.cache/whisper-cpp/`:

- `ggml-large-v3-turbo-q5_0.bin` (547 MB) from `huggingface.co/ggerganov/whisper.cpp`
- `ggml-silero-v5.1.2.bin` (0.9 MB, voice detection) from `huggingface.co/ggml-org/whisper-vad`

Keep the Mac awake and on power for the whole run (the commands below use `caffeinate`): a Mac that sleeps drops
the network, and YouTube answers the waking burst with "confirm you're not a bot".

## 1. The list of videos

The YouTube Data API cannot read Watch later, and the private playlists need the owner's sign-in, so they are read
from a signed-in YouTube tab. Public playlists come from yt-dlp alone:
`yt-dlp --flat-playlist -J "https://www.youtube.com/playlist?list=<id>"`.

For a private one, run `python3 -I receive-export.py <folder>`, open the playlist in Chrome and run this in its
console, naming the file (`piano`, `exercises`, `watch-later`, …):

```js
;(async (name) => {
  const sleep = (t) => new Promise((r) => setTimeout(r, t))
  const rows = () => document.querySelectorAll('ytd-playlist-video-renderer')
  let n = -1
  let same = 0
  while (same < 10) {
    const k = rows().length
    same = k === n ? same + 1 : 0
    n = k
    window.scrollTo(0, document.documentElement.scrollHeight)
    await sleep(2500)
  }
  const out = [...rows()].map((r) => {
    const a = r.querySelector('a#video-title')
    return {
      id: new URL(a.href).searchParams.get('v'),
      title: a.title || a.innerText.trim(),
      channel: r.querySelector('ytd-channel-name a')?.innerText ?? '',
      duration: r.querySelector('badge-shape .yt-badge-shape__text')?.innerText.trim() ?? '',
    }
  })
  await fetch(`http://127.0.0.1:8765/${name}.json`, { method: 'POST', body: JSON.stringify(out) })
})('piano')
```

Liked videos draws its rows as `yt-lockup-view-model` with the title in `a.ytLockupMetadataViewModelTitle`; swap
those two selectors there.

Then write `piano-data/transcriptions/youtube/manifest.json`, one group per folder in the order of
`index.py`'s `TITLES`. Watch later, Liked videos and Cântări keep only their piano videos: a title or channel
about piano, keys, chords, scales, theory, technique, improvisation, accompaniment or an instrumental (in English,
Romanian or Russian), or a channel already in the piano playlists. A video added to a group goes at its end, so
the numbers of the files already written hold.

## 2. Transcribe

From this folder, with `O=../../piano-data/transcriptions/youtube` and `M=$O/manifest.json`. `state/` is the run's
cache, kept out of git: it lets a run resume and holds `failed.txt`.

```sh
caffeinate -is sh -c "for i in 0 1 2 3 4 5; do python3 -I transcribe.py $M $O state --mode captions --shard \$i/6 & done; wait"
caffeinate -is sh -c "for i in 0 1; do python3 -I transcribe.py $M $O state --mode whisper --shard \$i/2 & done; wait"
python3 -I index.py $M $O state && npx prettier --write $O/README.md
```

The captions pass takes the uploader's captions, else YouTube's original-language auto-captions, and lists the
videos with neither. The Whisper pass downloads those videos' audio and transcribes the speech, skipping music-only
stretches. Six caption workers ran at about 40 videos a minute and two Whisper workers at about 8× real time;
more Whisper workers only slow each other. A re-run skips every file already written, so after failures run the
same command again.
