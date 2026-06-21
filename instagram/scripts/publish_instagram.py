#!/usr/bin/env python3
"""Publish an approved draft to Instagram as a Reel via the Instagram Graph API.

Requires IG_ACCESS_TOKEN and IG_USER_ID environment variables. See
instagram/README.md for how to obtain these (a Facebook Page-linked
Instagram Business/Creator account and a Meta developer app are required).
"""
import argparse
import json
import os
import time
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parents[2]
GRAPH_API_VERSION = "v21.0"
# Reels video processing takes longer than image processing.
STATUS_POLL_INTERVAL_SECONDS = 10
STATUS_POLL_ATTEMPTS = 30


def write_github_output(name: str, value: str) -> None:
    output_file = os.environ.get("GITHUB_OUTPUT")
    if not output_file:
        return
    with open(output_file, "a", encoding="utf-8") as fh:
        fh.write(f"{name}={value}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("draft_dir", help="Path (relative to repo root) to the draft directory")
    parser.add_argument(
        "--video-url",
        required=True,
        help="Publicly accessible URL of the draft video (Instagram fetches it server-side)",
    )
    args = parser.parse_args()

    access_token = os.environ["IG_ACCESS_TOKEN"]
    ig_user_id = os.environ["IG_USER_ID"]

    draft_path = REPO_ROOT / args.draft_dir / "draft.json"
    draft = json.loads(draft_path.read_text(encoding="utf-8"))

    base_url = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{ig_user_id}"

    container = requests.post(
        f"{base_url}/media",
        data={
            "media_type": "REELS",
            "video_url": args.video_url,
            "caption": draft["caption"],
            "access_token": access_token,
        },
        timeout=60,
    )
    container.raise_for_status()
    creation_id = container.json()["id"]

    for _ in range(STATUS_POLL_ATTEMPTS):
        status = requests.get(
            f"https://graph.facebook.com/{GRAPH_API_VERSION}/{creation_id}",
            params={"fields": "status_code", "access_token": access_token},
            timeout=30,
        )
        status.raise_for_status()
        status_code = status.json().get("status_code")
        if status_code == "FINISHED":
            break
        if status_code == "ERROR":
            raise SystemExit(f"Instagram failed to process video container {creation_id}")
        time.sleep(STATUS_POLL_INTERVAL_SECONDS)
    else:
        raise SystemExit(f"Timed out waiting for media container {creation_id} to finish processing")

    publish = requests.post(
        f"{base_url}/media_publish",
        data={"creation_id": creation_id, "access_token": access_token},
        timeout=60,
    )
    publish.raise_for_status()
    media_id = publish.json()["id"]

    draft["status"] = "published"
    draft["ig_media_id"] = media_id
    draft_path.write_text(json.dumps(draft, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[publish_instagram] Published. Instagram media id: {media_id}")
    write_github_output("media_id", media_id)


if __name__ == "__main__":
    main()
