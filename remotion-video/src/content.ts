// Timeline content parsed from:
// content/caredesign/ai-video/dokuhaku-09-houchi.md
// ("あとよろしく」で、終わらせていませんか" — 解説×語りかけ型 / D-4-4)
//
// Each entry is one on-screen telop burst. `kind` controls the visual
// treatment (see Composition.tsx): "hook" = the red headline card shown
// at 0.0s per the source script's note, "line" = a regular mid-monologue
// caption, "cta" = the closing 保存 call-to-action card.

export type Segment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
};

export const title = '「あとよろしく」で、終わらせていませんか';

export const segments: Segment[] = [
	// Scene 1 — hook, shown in full per D-4-2 (0.0秒で全文表示)
	{kind: 'hook', text: '「あとよろしく」で、\n終わらせていませんか'},
	{kind: 'line', text: '『あとよろしく』、'},
	{kind: 'line', text: 'それだけで'},
	{kind: 'line', text: '終わらせていませんか。'},

	// Scene 2 — structure / observation
	{kind: 'line', text: '管理職が陥りやすい'},
	{kind: 'line', text: 'もうひとつの落とし穴に、'},
	{kind: 'line', text: '「放置マンタイプ」という'},
	{kind: 'line', text: '傾向があります。'},
	{kind: 'line', text: '任せた後の'},
	{kind: 'line', text: '進捗確認を怠ると、'},
	{kind: 'line', text: '『大丈夫です』という'},
	{kind: 'line', text: '一言だけが'},
	{kind: 'line', text: '積み重なっていくようです。'},

	// Scene 3 — closing realization + CTA
	{kind: 'line', text: '任せることと、'},
	{kind: 'line', text: '任せきりは、'},
	{kind: 'line', text: '違うのかもしれません。'},
	{kind: 'cta', text: '保存して、\nフォローの仕方を\n見直してください。'},
];
