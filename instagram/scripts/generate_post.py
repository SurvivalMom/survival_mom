#!/usr/bin/env python3
"""Generate an Instagram post draft (caption + image) from a survival_mom landing page.

Usage:
    python generate_post.py [--source FILE.html] [--dry-run]

Writes a draft directory under instagram/pending/<timestamp>-<slug>/ containing
draft.json (caption + metadata) and image.png.
"""
import argparse
import json
import os
import re
import sys
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


def generate_image(content: dict, out_path: Path) -> None:
    """Generate a post image with Gemini's Imagen model, falling back to a template render."""
    prompt = (
        f"Instagram用の正方形の告知画像。商品名「{content['title']}」。"
        "やさしい色合いで、悩んでいる保護者を励ますイラスト風デザイン。"
        "テキストは入れない。写実的な人物の顔は描かない。"
    )
    try:
        from google import genai
        from google.genai import types

        client = genai.Client()
        result = client.models.generate_images(
            model="imagen-4.0-generate-001",
            prompt=prompt,
            config=types.GenerateImagesConfig(number_of_images=1),
        )
        image_bytes = result.generated_images[0].image.image_bytes
        out_path.write_bytes(image_bytes)
        return
    except Exception as exc:  # noqa: BLE001 - fall back on any SDK/network error
        print(f"[generate_post] Gemini image generation failed, using fallback: {exc}", file=sys.stderr)

    render_fallback_image(content, out_path)


def render_fallback_image(content: dict, out_path: Path) -> None:
    """A simple text-card image used when no AI image-generation API is configured."""
    from PIL import Image, ImageDraw, ImageFont

    size = 1080
    img = Image.new("RGB", (size, size), color=(255, 246, 230))
    draw = ImageDraw.Draw(img)

    font_paths = (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    )
    try:
        font_title = ImageFont.truetype(font_paths[0], 56)
        font_body = ImageFont.truetype(font_paths[1], 32)
    except OSError:
        font_title = ImageFont.load_default()
        font_body = ImageFont.load_default()

    margin = 80
    draw.text((margin, 320), content["title"], fill=(60, 40, 30), font=font_title)
    draw.text((margin, 440), content["description"][:80], fill=(80, 60, 50), font=font_body)
    img.save(out_path)


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

    image_path = draft_dir / "image.png"
    if args.dry_run:
        caption = f"[DRY RUN] {content['title']}\n\n{content['description']}\n\n#dryrun"
        render_fallback_image(content, image_path)
    else:
        caption = build_caption(content)
        generate_image(content, image_path)

    draft = {
        "source_file": source_name,
        "title": content["title"],
        "caption": caption,
        "image_path": str(image_path.relative_to(REPO_ROOT)),
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
