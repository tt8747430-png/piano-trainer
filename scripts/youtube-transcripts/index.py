"""Write README.md for the YouTube transcriptions: every piano playlist, each video, its transcript and source."""

import json
import os
import re
import sys

TITLES = {
    "piano": ("Piano", "the owner's playlist"),
    "piano-cantari": ("Piano - Cantari", "the owner's playlist"),
    "cantari": ("Cântări", "the piano videos only"),
    "exercises": ("Exercises", "the owner's playlist"),
    "technic": ("Technic", "the owner's playlist"),
    "called-to-play-2": ("Призван играть для Него - 2 уровень", "saved, by Aleksandr Savchenko"),
    "improvisation-lessons-lala": ("Уроки импровизации", "saved, by LaLa Lady"),
    "pianote-music-theory": ("Music Theory", "saved, by Pianote"),
    "mdecks-jazz-improvisation": ("Best Jazz Piano Improvisation Exercises & Practice Routines", "saved, by mDecks Music"),
    "jps-podcast": ("JPS Podcast Episodes", "saved, by Jazz Piano School"),
    "watch-later": ("Watch later", "the piano videos only"),
    "liked": ("Liked videos", "the piano videos only"),
}


def main():
    manifest_path, out, state = sys.argv[1:4]
    manifest = json.load(open(manifest_path, encoding="utf-8"))
    failed = {}
    fpath = os.path.join(state, "failed.txt")
    if os.path.exists(fpath):
        for line in open(fpath, encoding="utf-8"):
            parts = line.rstrip("\n").split("\t")
            if len(parts) == 4:
                failed[parts[1]] = parts[3]
    lines = [
        "# YouTube transcriptions",
        "",
        "Transcripts of the owner's piano videos on YouTube: every piano playlist they keep or saved, and the piano",
        "videos in Cântări, Watch later and Liked videos. One file per video, numbered in playlist order, with the channel, link,",
        "description and the transcript in paragraphs stamped every 30 seconds. A video in two playlists has a file in",
        "each. The source line says whether the words are the uploader's captions, YouTube's auto-captions or Whisper",
        "(large-v3-turbo, run locally, with Silero voice detection so music-only stretches are skipped); auto-captions",
        "and Whisper can mishear names and musical terms, and a music-only video says so.",
        "",
        "| Playlist | Folder | Videos | Transcribed |",
        "| --- | --- | --- | --- |",
    ]
    body = []
    for group in manifest:
        folder = group["playlist"]
        title, note = TITLES[folder]
        files = sorted(f for f in os.listdir(os.path.join(out, folder)) if f.endswith(".md") and f != "README.md")
        by_number = {int(f[:3]): f for f in files}
        lines.append(f"| {title} ({note}) | [`{folder}/`]({folder}/) | {len(group['videos'])} | {len(files)} |")
        body += ["", f"## {title}", ""]
        for i, video in enumerate(group["videos"], 1):
            name = by_number.get(i)
            label = re.sub(r"[\[\]|]", "", video.get("title") or video["id"]).strip()
            url = f"https://www.youtube.com/watch?v={video['id']}"
            if name:
                body.append(f"{i}. [{label}]({folder}/{name}) · [video]({url})")
            else:
                why = failed.get(video["id"], "not transcribed")
                body.append(f"{i}. {label} · [video]({url}) · _{why}_")
    with open(os.path.join(out, "README.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines + body) + "\n")


if __name__ == "__main__":
    main()
