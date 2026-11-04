import fs from 'fs';
import path from 'path';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// This sandbox has no internet access to remotion.media (where Remotion
// would normally download its own Chrome Headless Shell), but a
// pre-installed Chromium is available for Playwright under
// /opt/pw-browsers. Its versioned folder name changes when the sandbox
// image is updated (e.g. chromium_headless_shell-1194 -> -1243), so look
// it up instead of hard-coding one version. On a normal machine (no
// /opt/pw-browsers), nothing is set and Remotion downloads its own
// browser as usual.
const findPreinstalledHeadlessShell = (): string | null => {
	const root = '/opt/pw-browsers';
	if (!fs.existsSync(root)) {
		return null;
	}
	const candidates = fs
		.readdirSync(root)
		.filter((d) => d.startsWith('chromium_headless_shell-'))
		.sort()
		.reverse();
	for (const dir of candidates) {
		for (const rel of [
			'chrome-headless-shell-linux64/chrome-headless-shell',
			'chrome-linux/headless_shell',
		]) {
			const full = path.join(root, dir, rel);
			if (fs.existsSync(full)) {
				return full;
			}
		}
	}
	return null;
};

const preinstalled = findPreinstalledHeadlessShell();
if (preinstalled) {
	Config.setBrowserExecutable(preinstalled);
}
