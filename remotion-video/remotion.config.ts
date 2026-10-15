import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// This sandbox has no internet access to remotion.media (where Remotion
// would normally download its own Chrome Headless Shell), but a
// pre-installed Chromium is available for Playwright at this path — reuse
// it instead of trying to fetch one.
const preinstalledChromium = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
Config.setBrowserExecutable(preinstalledChromium);
