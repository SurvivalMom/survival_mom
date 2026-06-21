#!/usr/bin/env python3
"""Generate an Instagram Reels draft (caption + short vertical video) from a
survival_mom landing page.

Usage:
    python generate_post.py [--source FILE.html] [--dry-run]

Writes a draft directory under instagram/pending/<timestamp>-<slug>/ containing
draft.json (caption + metadata) and video.mp4 (9:16 vertical, ~8 seconds).
"""
import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup

REPO_ROOT = Path(__file__).resolve().parents[2]
PENDING_DIR = REPO_ROOT / "instagram" / "pending"
STATE_FILE = REPO_ROOT / "instagram" / "state.json"

# Pages that are not customer-facing product landing pages and should never be
# picked as an Instagram post source.
EXCLUDED_FILES = {"index.html", "tokusyou.html"}


def list_sources() -> list[str]:
    return sorted(
        p.name
        for p in REPO_ROOT.glob("*.html")
        if p.name not in EXCLUDED_FILES and not p.name.startswith("success_")
    )


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {"last_index": -1}


def save_state(state: dict) -> None:
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def pick_next_source() -> str:
    sources = list_sources()
    if not sources:
        raise RuntimeError("No source landing pages found in repository root")
    state = load_state()
    next_index = (state["last_index"] + 1) % len(sources)
    state["last_index"] = next_index
    save_state(state)
    return sources[next_index]


def extract_content(html_path: Path) -> dict:
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")

    raw_title = soup.title.string.strip() if soup.title and soup.title.string else html_path.stem
    title = re.sub(r"\s*[|｜].*$", "", raw_title).strip()

    desc_tag = soup.find("meta", attrs={"name": "description"})
    description = desc_tag["content"].strip() if desc_tag and desc_tag.get("content") else ""

    headings = [h.get_text(strip=True) for h in soup.find_all(["h1", "h2"]) if h.get_text(strip=True)]

    return {"title": title, "description": description, "headings": headings[:5]}


def build_caption(content: dict) -> str:
    """Build an Instagram caption with Gemini, falling back to a simple template."""
    prompt = (
        "あなたはInstagram運用担当です。以下の商品ページの情報から、"
        "Instagram投稿用の日本語キャプションを作成してください。\n\n"
        f"商品名: {content['title']}\n"
        f"説明: {content['description']}\n"
        f"特徴: {', '.join(content['headings']) or 'なし'}\n\n"
        "条件:\n"
        "- 150〜300文字程度\n"
        "- 悩んでいる保護者に寄り添う、親しみやすい語り口\n"
        "- 絵文字は控えめに使う\n"
        "- 最後に関連ハッシュタグを5〜8個つける\n"
    )
    try:
        from google import genai

        client = genai.Client()
        response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        text = (response.text or "").strip()
        if text:
            return text
    except Exception as exc:  # noqa: BLE001 - fall back on any SDK/network error
        print(f"[generate_post] Gemini caption generation failed, using fallback: {exc}", file=sys.stderr)

    headings_block = "\n".join(f"・{h}" for h in content["headings"][:3])
    return (
        f"{content['title']}\n\n{content['description']}\n\n{headings_block}\n\n"
        "#survivalmom #育児 #子育て応援 #発達支援"
    ).strip()


VIDEO_POLL_INTERVAL_SECONDS = 10
VIDEO_POLL_TIMEOUT_SECONDS = 600


def generate_video(content: dict, out_path: Path) -> None:
    """Generate a short vertical Reels video with Veo 3, falling back to a template render."""
    prompt = (
        f"Instagram Reels用の縦長(9:16)動画、約8秒。商品名「{content['title']}」。"
        f"テーマ: {content['description']}。"
        "やさしい色合いで、悩んでいる保護者を励ますような、温かみのあるイラスト風の短い映像。"
        "テキストは映像内に入れない。写実的な人物の顔は描かない。"
    )
    try:
        from google import genai
        from google.genai import types

        client = genai.Client()
        operation = client.models.generate_videos(
            model="veo-3.0-generate-001",
            prompt=prompt,
            config=types.GenerateVideosConfig(aspect_ratio="9:16"),
        )

        elapsed = 0
        while not operation.done:
            if elapsed >= VIDEO_POLL_TIMEOUT_SECONDS:
                raise TimeoutError("Veo video generation timed out")
            time.sleep(VIDEO_POLL_INTERVAL_SECONDS)
            elapsed += VIDEO_POLL_INTERVAL_SECONDS
            operation = client.operations.get(operation)

        generated_video = operation.response.generated_videos[0]
        client.files.download(file=generated_video.video)
        generated_video.video.save(str(out_path))
        return
    except Exception as exc:  # noqa: BLE001 - fall back on any SDK/network error
        print(f"[generate_post] Veo video generation failed, using fallback: {exc}", file=sys.stderr)

    render_fallback_video(content, out_path)


def render_fallback_video(content: dict, out_path: Path, duration_seconds: int = 5, fps: int = 24) -> None:
    """A simple static text-card video used when no AI video-generation API is configured."""
    import imageio
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont

    width, height = 1088, 1920  # divisible by 16, required by the libx264 encoder
    img = Image.new("RGB", (width, height), color=(255, 246, 230))
    draw = ImageDraw.Draw(img)

    font_paths = (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    )
    try:
        font_title = ImageFont.truetype(font_paths[0], 64)
        font_body = ImageFont.truetype(font_paths[1], 36)
    except OSError:
        font_title = ImageFont.load_default()
        font_body = ImageFont.load_default()

    margin = 80
    draw.text((margin, 760), content["title"], fill=(60, 40, 30), font=font_title)
    draw.text((margin, 900), content["description"][:80], fill=(80, 60, 50), font=font_body)

    frame = np.array(img)
    writer = imageio.get_writer(str(out_path), fps=fps, codec="libx264", format="FFMPEG")
    try:
        for _ in range(duration_seconds * fps):
            writer.append_data(frame)
    finally:
        writer.close()


def write_github_output(name: str, value: str) -> None:
    output_file = os.environ.get("GITHUB_OUTPUT")
    if not output_file:
        return
    with open(output_file, "a", encoding="utf-8") as fh:
        fh.write(f"{name}={value}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", help="Specific HTML filename to use instead of rotating through sources")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Skip Gemini API calls and produce placeholder caption/image (for local testing)",
    )
    args = parser.parse_args()

    source_name = args.source or pick_next_source()
    source_path = REPO_ROOT / source_name
    if not source_path.exists():
        raise SystemExit(f"Source file not found: {source_path}")

    content = extract_content(source_path)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", source_path.stem).strip("-").lower() or "post"
    draft_dir = PENDING_DIR / f"{timestamp}-{slug}"
    draft_dir.mkdir(parents=True, exist_ok=True)

    video_path = draft_dir / "video.mp4"
    if args.dry_run:
        caption = f"[DRY RUN] {content['title']}\n\n{content['description']}\n\n#dryrun"
        render_fallback_video(content, video_path)
    else:
        caption = build_caption(content)
        generate_video(content, video_path)

    draft = {
        "source_file": source_name,
        "title": content["title"],
        "caption": caption,
        "video_path": str(video_path.relative_to(REPO_ROOT)),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "pending",
    }
    (draft_dir / "draft.json").write_text(
        json.dumps(draft, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    relative_draft_dir = str(draft_dir.relative_to(REPO_ROOT))
    print(json.dumps(draft, ensure_ascii=False, indent=2))
    write_github_output("draft_dir", relative_draft_dir)


if __name__ == "__main__":
    main()
