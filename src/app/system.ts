// credits to https://github.com/ma3a/SDH-PlayTime

import { SpeedTestSettings, Settings } from "./settings";

export { LocatorDependencies, Locator as Locator };

interface Locator {
  currentSettings: SpeedTestSettings;
  settings: Settings;
}

interface LocatorDependencies {
  settings: Settings;
}
