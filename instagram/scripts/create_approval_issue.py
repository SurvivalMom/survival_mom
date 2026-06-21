#!/usr/bin/env python3
"""Create a GitHub issue so a human can approve or reject an Instagram draft.

The actual approval gate lives on GitHub (commenting "approve" or "reject" on
the created issue triggers instagram-publish.yml); Discord/Slack notifications
are for visibility only, since interactive chat buttons would require a
standalone webhook server.
"""
import argparse
import json
import os
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parents[2]
API_ROOT = "https://api.github.com"


def write_github_output(name: str, value: str) -> None:
    output_file = os.environ.get("GITHUB_OUTPUT")
    if not output_file:
        return
    with open(output_file, "a", encoding="utf-8") as fh:
        fh.write(f"{name}={value}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("draft_dir", help="Path (relative to repo root) to the draft directory")
    args = parser.parse_args()

    token = os.environ["GITHUB_TOKEN"]
    repo = os.environ["GITHUB_REPOSITORY"]
    branch = os.environ.get("GITHUB_REF_NAME", "main")

    draft_dir_path = REPO_ROOT / args.draft_dir
    draft = json.loads((draft_dir_path / "draft.json").read_text(encoding="utf-8"))
    raw_image_url = f"https://raw.githubusercontent.com/{repo}/{branch}/{draft['image_path']}"

    body = (
        f"**元ページ**: `{draft['source_file']}`\n\n"
        f"![draft image]({raw_image_url})\n\n"
        f"**キャプション案:**\n\n{draft['caption']}\n\n"
        "---\n"
        "承認する場合はこのIssueに `approve` とコメントしてください。\n"
        "却下する場合は `reject` とコメントしてください。\n\n"
        f"draft_dir: `{args.draft_dir}`"
    )

    response = requests.post(
        f"{API_ROOT}/repos/{repo}/issues",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"},
        json={"title": f"[Instagram draft] {draft['title']}", "body": body, "labels": ["instagram-draft"]},
        timeout=30,
    )
    response.raise_for_status()
    issue = response.json()
    print(f"[create_approval_issue] Created issue #{issue['number']}: {issue['html_url']}")

    write_github_output("issue_url", issue["html_url"])
    write_github_output("issue_number", str(issue["number"]))


if __name__ == "__main__":
    main()
