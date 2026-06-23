#!/usr/bin/env python3
"""
Instagram Graph API のハッシュタグ検索を使って、テーマ別の話題のリールを収集し
CSV（任意でGoogle Sheets）に出力するスクリプト。

必須の環境変数:
  IG_ACCESS_TOKEN        - Instagramビジネス/クリエイターアカウントに紐づくアクセストークン
  IG_BUSINESS_ACCOUNT_ID - 上記トークンに対応するInstagramビジネスアカウントID

任意の環境変数:
  MIN_VIEWS                     - play_countでの絞り込み閾値（デフォルト 100000）。
                                   play_countが取得できないメディアは閾値判定をスキップして出力する。
  GOOGLE_SHEETS_CREDENTIALS_JSON - サービスアカウントの認証JSONへのパス。設定時はSheetsにも追記する。
  GOOGLE_SHEET_ID                - 書き込み先のスプレッドシートID。

制約:
  - ハッシュタグ検索（ig_hashtag_search + top_media）は週あたり30ハッシュタグまで。
  - 自分のアカウント以外が投稿したメディアについては play_count（再生数）が
    APIから返らないことが多い。その場合は play_count 列を空にする。
"""
import csv
import datetime
import os
import sys
import time

import requests

GRAPH_API_BASE = "https://graph.facebook.com/v21.0"

THEMES = {
    "子育て": ["子育て", "育児", "ママ", "子育てママ"],
    "発達障害": ["発達障害", "発達障害育児", "グレーゾーン"],
    "不登校": ["不登校", "不登校小学生", "不登校中学生"],
    "お受験": ["お受験", "中学受験", "小学校受験"],
    "組織作り": ["組織作り", "チームビルディング", "マネジメント"],
}

MIN_VIEWS = int(os.environ.get("MIN_VIEWS", "100000"))


def _get(path, params):
    resp = requests.get(f"{GRAPH_API_BASE}/{path}", params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def get_hashtag_id(hashtag, token, business_id):
    data = _get(
        "ig_hashtag_search",
        {"user_id": business_id, "q": hashtag, "access_token": token},
    )
    results = data.get("data", [])
    return results[0]["id"] if results else None


def get_top_media(hashtag_id, token, business_id):
    data = _get(
        f"{hashtag_id}/top_media",
        {
            "user_id": business_id,
            "fields": "id,caption,permalink,media_type,media_product_type,"
            "like_count,comments_count,timestamp",
            "access_token": token,
        },
    )
    return data.get("data", [])


def get_play_count(media_id, token):
    try:
        data = _get(
            media_id,
            {"fields": "play_count", "access_token": token},
        )
        return data.get("play_count")
    except requests.HTTPError:
        return None


def collect(token, business_id):
    rows = []
    fetched_at = datetime.datetime.now().isoformat(timespec="seconds")

    for theme, hashtags in THEMES.items():
        for hashtag in hashtags:
            try:
                hashtag_id = get_hashtag_id(hashtag, token, business_id)
            except requests.HTTPError as e:
                print(f"[warn] hashtag search failed for #{hashtag}: {e}", file=sys.stderr)
                continue

            if not hashtag_id:
                continue

            try:
                media_list = get_top_media(hashtag_id, token, business_id)
            except requests.HTTPError as e:
                print(f"[warn] top_media failed for #{hashtag}: {e}", file=sys.stderr)
                continue

            for media in media_list:
                if media.get("media_product_type") != "REELS":
                    continue

                play_count = get_play_count(media["id"], token)

                if play_count is not None and play_count < MIN_VIEWS:
                    continue

                rows.append(
                    {
                        "theme": theme,
                        "hashtag": hashtag,
                        "media_id": media["id"],
                        "permalink": media.get("permalink", ""),
                        "caption": (media.get("caption") or "")[:200],
                        "like_count": media.get("like_count"),
                        "comments_count": media.get("comments_count"),
                        "play_count": play_count,
                        "posted_at": media.get("timestamp", ""),
                        "fetched_at": fetched_at,
                    }
                )

            time.sleep(1)  # レート制限対策

    return rows


def write_csv(rows, output_path):
    fieldnames = [
        "theme",
        "hashtag",
        "media_id",
        "permalink",
        "caption",
        "like_count",
        "comments_count",
        "play_count",
        "posted_at",
        "fetched_at",
    ]
    file_exists = os.path.exists(output_path)
    with open(output_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerows(rows)


def write_google_sheet(rows, credentials_path, sheet_id):
    import gspread

    gc = gspread.service_account(filename=credentials_path)
    sheet = gc.open_by_key(sheet_id).sheet1

    if sheet.row_count == 0 or not sheet.row_values(1):
        sheet.append_row(
            [
                "theme",
                "hashtag",
                "media_id",
                "permalink",
                "caption",
                "like_count",
                "comments_count",
                "play_count",
                "posted_at",
                "fetched_at",
            ]
        )

    for row in rows:
        sheet.append_row(
            [
                row["theme"],
                row["hashtag"],
                row["media_id"],
                row["permalink"],
                row["caption"],
                row["like_count"],
                row["comments_count"],
                row["play_count"],
                row["posted_at"],
                row["fetched_at"],
            ]
        )


def main():
    token = os.environ.get("IG_ACCESS_TOKEN")
    business_id = os.environ.get("IG_BUSINESS_ACCOUNT_ID")

    if not token or not business_id:
        print(
            "IG_ACCESS_TOKEN と IG_BUSINESS_ACCOUNT_ID を環境変数で指定してください。",
            file=sys.stderr,
        )
        sys.exit(1)

    rows = collect(token, business_id)
    print(f"{len(rows)} 件のリールを収集しました。")

    output_path = os.environ.get(
        "OUTPUT_CSV", f"reels_{datetime.date.today().isoformat()}.csv"
    )
    write_csv(rows, output_path)
    print(f"CSVに出力: {output_path}")

    creds_path = os.environ.get("GOOGLE_SHEETS_CREDENTIALS_JSON")
    sheet_id = os.environ.get("GOOGLE_SHEET_ID")
    if creds_path and sheet_id:
        write_google_sheet(rows, creds_path, sheet_id)
        print("Google Sheetsへの追記が完了しました。")


if __name__ == "__main__":
    main()
