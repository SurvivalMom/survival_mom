#!/usr/bin/env python3
"""Send a generated Instagram draft to a Discord channel for human review.

Requires the DISCORD_WEBHOOK_URL environment variable. If it is not set,
this script logs a message and exits successfully (notification is optional).
"""
import argparse
import json
import os
import sys
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parents[2]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("draft_dir", help="Path (relative to repo root) to the draft directory")
    parser.add_argument("--issue-url", default="", help="GitHub issue URL for approval instructions")
    args = parser.parse_args()

    webhook_url = os.environ.get("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        print("[notify_discord] DISCORD_WEBHOOK_URL not set, skipping notification", file=sys.stderr)
        return

    draft_dir = REPO_ROOT / args.draft_dir
    draft = json.loads((draft_dir / "draft.json").read_text(encoding="utf-8"))
    video_path = REPO_ROOT / draft["video_path"]

    content_lines = [f"**新しいInstagram Reelsドラフト**: {draft['title']}", "", draft["caption"]]
    if args.issue_url:
        content_lines += ["", f"承認/却下はこちら: {args.issue_url}"]

    payload = {"content": "\n".join(content_lines)[:2000]}
    files = None
    if video_path.exists():
        files = {"file": (video_path.name, video_path.read_bytes(), "video/mp4")}

    response = requests.post(
        webhook_url,
        data={"payload_json": json.dumps(payload)},
        files=files,
        timeout=30,
    )
    response.raise_for_status()
    print(f"[notify_discord] Sent draft notification for {draft_dir.name}")


if __name__ == "__main__":
    main()
