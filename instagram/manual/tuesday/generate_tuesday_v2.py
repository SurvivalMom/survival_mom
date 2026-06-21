import sys
import time

from google import genai
from google.genai import types

STYLE = (
    "全シーン共通スタイル: 柔らかい色鉛筆・水彩風のイラストアニメーション。"
    "実写・フォトリアルではない。同じキャラクターデザイン(疲れた30代の日本人女性、母親)と"
    "同じ配色パレット(暖かいベージュとオレンジ系)を、全シーンで一貫して保つこと。"
)

SUBTITLE_OFF = "映像内に文字・字幕・テロップは一切描かないこと。"


def narration(line: str) -> str:
    return f"音声: 落ち着いた優しい女性の声で、次のセリフだけをナレーションとして話す:「{line}」"


SCENES = [
    (
        "scene1",
        "深夜のリビング。スマホの画面の光だけが顔を照らす。ゆっくりカメラが横顔にズームインする。",
        "正直、今日一日この子の声を聞かなくていいなら、それだけで天国だと思う。",
    ),
    (
        "scene2",
        "深いため息をつき、スマホを伏せて両手で顔を覆う。",
        "こんなこと、誰にも言えない。夫にも、ママ友にも。",
    ),
    (
        "scene3",
        "窓の外に冷たい雨が降っている。水滴が窓ガラスを伝う様子をクローズアップで描く、静かで切ない雰囲気。",
        "『母親なんだから』って、もう限界なの。",
    ),
    (
        "scene4",
        "少し開いた子ども部屋のドアからやわらかい光が漏れている。そっとドアを閉める手元をクローズアップで描く。",
        "この子が嫌いなわけじゃない。でも、消えたい夜がある。",
    ),
    (
        "scene5",
        "ゆっくり顔を上げ、まっすぐカメラを見る。表情に小さな強さが戻る瞬間。",
        "それは母親失格の証拠じゃない。戦ってきた証なんだよ。",
    ),
    (
        "scene6",
        "朝日が部屋にゆっくり差し込む。スマホの画面が再び光る。カメラに向かって小さく頷く、希望を感じさせる温かい瞬間。",
        "今、これを見ているあなたへ。保存して、また見返して。",
    ),
]


def build_prompt(visual: str, line: str) -> str:
    return (
        f"Instagram Reels用の縦長(9:16)動画、約8秒。{STYLE} "
        f"{visual} {narration(line)} {SUBTITLE_OFF}"
    )


def generate_one(client, name, prompt):
    print(f"[generate] {name} starting...", file=sys.stderr)
    operation = client.models.generate_videos(
        model="veo-3.0-generate-001",
        prompt=prompt,
        config=types.GenerateVideosConfig(aspect_ratio="9:16"),
    )
    elapsed = 0
    while not operation.done:
        if elapsed >= 300:
            raise TimeoutError(f"{name} timed out")
        time.sleep(10)
        elapsed += 10
        operation = client.operations.get(operation)
    if operation.error:
        raise RuntimeError(f"{name} failed: {operation.error}")
    generated_video = operation.response.generated_videos[0]
    client.files.download(file=generated_video.video)
    out_path = f"/tmp/tuesday_v2_{name}.mp4"
    generated_video.video.save(out_path)
    print(f"[generate] {name} saved to {out_path}", file=sys.stderr)
    return out_path


def main():
    client = genai.Client()
    for name, visual, line in SCENES:
        prompt = build_prompt(visual, line)
        generate_one(client, name, prompt)


if __name__ == "__main__":
    main()
