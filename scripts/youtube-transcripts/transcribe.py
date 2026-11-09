"""Transcribe YouTube videos listed in a manifest into Markdown files.

piano-data/transcriptions/youtube/manifest.json: [{"playlist": "<folder>", "videos": [{"id", "title", "channel", "duration"}]}]

Pass 1 (--mode captions): YouTube's own captions (manual first, else the original-language auto track).
Pass 2 (--mode whisper): the videos pass 1 found without captions, transcribed locally with whisper.cpp.
Re-running skips every video already written; failures go to state/failed.txt.
"""

import argparse
import glob
import html
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
import zlib

MODEL = os.path.expanduser("~/.cache/whisper-cpp/ggml-large-v3-turbo-q5_0.bin")
VAD_MODEL = os.path.expanduser("~/.cache/whisper-cpp/ggml-silero-v5.1.2.bin")
PARAGRAPH_SECONDS = 30


def run(cmd, timeout=900):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def slug(text, limit=70):
    text = re.sub(r"[#@]\S+", "", text)
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE).strip().lower()
    text = re.sub(r"[\s_-]+", "-", text)
    return text[:limit].strip("-") or "video"


def stamp(seconds):
    seconds = int(seconds)
    h, rest = divmod(seconds, 3600)
    m, s = divmod(rest, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def vtt_seconds(t):
    parts = t.replace(",", ".").split(":")
    parts = [float(p) for p in parts]
    while len(parts) < 3:
        parts.insert(0, 0.0)
    return parts[0] * 3600 + parts[1] * 60 + parts[2]


def parse_vtt(path):
    """Cues as (start, text), with the rolling repeats of auto captions removed."""
    cues, start, lines = [], None, []
    seen_last = ""
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip("\n")
        if "-->" in line:
            start = vtt_seconds(line.split("-->")[0].strip())
            lines = []
            continue
        if start is None:
            continue
        if not line.strip():
            for text in lines:
                if text and text != seen_last:
                    cues.append((start, text))
                    seen_last = text
            start, lines = None, []
            continue
        text = html.unescape(re.sub(r"<[^>]+>", "", line))
        text = re.sub(r"\[(?:music|applause|laughter|музыка|аплодисменты|muzică)\]|>>|&gt;&gt;", "", text, flags=re.I)
        text = re.sub(r"\s+", " ", text).strip()
        lines.append(text)
    for text in lines:
        if text and text != seen_last:
            cues.append((start, text))
    # Auto captions repeat the previous line as the first line of the next cue.
    out = []
    for s, text in cues:
        if out and (text == out[-1][1] or out[-1][1].endswith(text)):
            continue
        out.append((s, text))
    return out


def paragraphs(cues):
    paras, cur, cur_start = [], [], None
    for s, text in cues:
        if cur_start is None:
            cur_start = s
        if s - cur_start >= PARAGRAPH_SECONDS and cur:
            paras.append((cur_start, " ".join(cur)))
            cur, cur_start = [], s
        cur.append(text)
    if cur:
        paras.append((cur_start, " ".join(cur)))
    return paras


def pick_track(info):
    lang = (info.get("language") or "").split("-")[0]
    manual = {k: v for k, v in (info.get("subtitles") or {}).items() if k != "live_chat"}
    if manual:
        for k in manual:
            if lang and k.split("-")[0] == lang:
                return k, "manual"
        return next(iter(manual)), "manual"
    auto = info.get("automatic_captions") or {}
    for k in auto:
        if k.endswith("-orig"):
            return k, "auto"
    if lang and lang in auto:
        return lang, "auto"
    return None, None


def write_md(path, info, video, source, lang, paras):
    url = f"https://www.youtube.com/watch?v={video['id']}"
    title = info.get("title") or video.get("title") or video["id"]
    channel = info.get("channel") or info.get("uploader") or video.get("channel") or ""
    duration = info.get("duration")
    date = info.get("upload_date") or ""
    if len(date) == 8:
        date = f"{date[:4]}-{date[4:6]}-{date[6:]}"
    head = [
        f"# {title}",
        "",
        f"- Channel: {channel}",
        f"- Link: {url}",
        f"- Duration: {stamp(duration) if duration else video.get('duration', '')}",
        f"- Published: {date}",
        f"- Transcript: {source}" + (f" ({lang})" if lang else ""),
        "",
    ]
    desc = (info.get("description") or "").strip()
    if desc:
        head += ["## Description", "", desc, ""]
    head += ["## Transcript", ""]
    if paras:
        head += [f"**[{stamp(s)}]** {t}\n" for s, t in paras]
    else:
        head += ["_No speech: the video is music only._", ""]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(head).rstrip() + "\n")


def info_for(vid, state):
    cache = os.path.join(state, "info", f"{vid}.json")
    if os.path.exists(cache):
        return json.load(open(cache, encoding="utf-8"))
    r = run(["yt-dlp", "-J", "--skip-download", "--no-playlist",
             f"https://www.youtube.com/watch?v={vid}"], timeout=180)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip().splitlines()[-1] if r.stderr.strip() else "yt-dlp failed")
    full = json.loads(r.stdout)
    keep = {k: full.get(k) for k in ("id", "title", "channel", "uploader", "duration", "upload_date",
                                     "description", "language", "subtitles", "automatic_captions")}
    for k in ("subtitles", "automatic_captions"):
        keep[k] = {lang: [f["url"] for f in fmts if f.get("ext") == "vtt"] for lang, fmts in (keep[k] or {}).items()}
    os.makedirs(os.path.dirname(cache), exist_ok=True)
    json.dump(keep, open(cache, "w", encoding="utf-8"), ensure_ascii=False)
    return keep


def caption_pass(vid, info, state):
    key, kind = pick_track(info)
    if not key:
        return None
    urls = info["subtitles" if kind == "manual" else "automatic_captions"].get(key) or []
    if not urls:
        raise RuntimeError(f"no vtt url for {key}")
    tmp = os.path.join(state, "subs")
    os.makedirs(tmp, exist_ok=True)
    path = os.path.join(tmp, f"{vid}.vtt")
    for attempt in range(4):
        try:
            req = urllib.request.Request(urls[0], headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                open(path, "wb").write(resp.read())
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 3:
                time.sleep(60 * (attempt + 1))
                continue
            raise
    cues = parse_vtt(path)
    os.remove(path)
    source = "YouTube captions" if kind == "manual" else "YouTube auto-captions"
    return source, key.replace("-orig", ""), paragraphs(cues)


def whisper_pass(vid, state):
    tmp = os.path.join(state, "audio")
    os.makedirs(tmp, exist_ok=True)
    base = os.path.join(tmp, vid)
    r = run(["yt-dlp", "-f", "bestaudio", "--no-playlist", "-o", base + ".%(ext)s",
             f"https://www.youtube.com/watch?v={vid}"], timeout=1800)
    got = [f for f in glob.glob(base + ".*") if not f.endswith((".wav", ".json"))]
    if not got:
        raise RuntimeError(r.stderr.strip().splitlines()[-1] if r.stderr.strip() else "no audio")
    wav = base + ".wav"
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", got[0], "-ar", "16000", "-ac", "1", wav], timeout=1800)
    os.remove(got[0])
    r = run(["whisper-cli", "-m", MODEL, "-f", wav, "-l", "auto", "--vad", "-vm", VAD_MODEL, "-oj", "-of", base, "-np"], timeout=7200)
    os.remove(wav)
    if r.returncode != 0 or not os.path.exists(base + ".json"):
        raise RuntimeError("whisper failed: " + r.stderr.strip()[-200:])
    data = json.load(open(base + ".json", encoding="utf-8", errors="replace"))
    os.remove(base + ".json")
    lang = data.get("result", {}).get("language", "")
    cues = []
    for seg in data.get("transcription", []):
        text = seg.get("text", "").strip()
        if not text or re.fullmatch(r"[\[\(*♪].*[\]\)*♪]", text):
            continue
        cues.append((seg["offsets"]["from"] / 1000, text))
    return "Whisper (large-v3-turbo, speech detected by Silero VAD), transcribed from the audio", lang, paragraphs(cues)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("out")
    ap.add_argument("state")
    ap.add_argument("--mode", choices=["captions", "whisper"], required=True)
    ap.add_argument("--shard", default="0/1", help="i/n: this worker takes the videos whose id hashes to i")
    ap.add_argument("--caption-shards", type=int, default=1, help="whisper --follow: how many caption workers to wait for")
    ap.add_argument("--follow", action="store_true", help="whisper: keep going until the captions pass has finished")
    args = ap.parse_args()
    shard, shards = (int(x) for x in args.shard.split("/"))
    args.shard_index, args.shards = shard, shards
    while True:
        finished = len(glob.glob(os.path.join(args.state, "captions.done.*"))) >= args.caption_shards
        work(args)
        if args.mode == "captions":
            open(os.path.join(args.state, f"captions.done.{shard}"), "w").close()
            return
        if not args.follow or finished:
            return
        time.sleep(120)


def work(args):
    manifest = json.load(open(args.manifest, encoding="utf-8"))
    os.makedirs(args.state, exist_ok=True)
    done_dir = os.path.join(args.state, "done")
    os.makedirs(done_dir, exist_ok=True)
    pending_path = os.path.join(args.state, "no-captions.txt")
    pending = set(open(pending_path).read().split()) if os.path.exists(pending_path) else set()
    failed = open(os.path.join(args.state, "failed.txt"), "a")
    for group in manifest:
        folder = os.path.join(args.out, group["playlist"])
        os.makedirs(folder, exist_ok=True)
        for i, video in enumerate(group["videos"], 1):
            vid = video["id"]
            if zlib.crc32(vid.encode()) % args.shards != args.shard_index:
                continue
            name = f"{i:03d}-{slug(video.get('title') or vid)}.md"
            path = os.path.join(folder, name)
            if os.path.exists(path):
                continue
            cached = os.path.join(done_dir, f"{vid}.md")
            if os.path.exists(cached):
                shutil.copyfile(cached, path)
                continue
            if args.mode == "whisper" and vid not in pending:
                continue
            try:
                info = info_for(vid, args.state)
                if args.mode == "captions":
                    result = caption_pass(vid, info, args.state)
                    if result is None:
                        if vid not in pending:
                            pending.add(vid)
                            open(pending_path, "a").write(vid + "\n")
                        print(f"no captions {vid}", flush=True)
                        continue
                else:
                    result = whisper_pass(vid, args.state)
                source, lang, paras = result
                write_md(cached, info, video, source, lang, paras)
                shutil.copyfile(cached, path)
                print(f"ok {group['playlist']}/{name}", flush=True)
            except Exception as e:  # one bad video never stops the run
                failed.write(f"{args.mode}\t{vid}\t{group['playlist']}\t{e}\n")
                failed.flush()
                print(f"fail {vid}: {e}", flush=True)
            time.sleep(1)


if __name__ == "__main__":
    sys.exit(main())
