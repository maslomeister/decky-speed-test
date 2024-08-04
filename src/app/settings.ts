// credits to https://github.com/ma3a/SDH-PlayTime

import logger from "../utils";

declare global {
  // @ts-ignore
  let SteamClient: SteamClient;
}

export interface SpeedTestSettings {
  bitsPerSecond: boolean;
}

let SPEED_TEST_SETTINGS_KEY = "decky-speed-test";
export let DEFAULTS: SpeedTestSettings = {
  bitsPerSecond: true,
};

export class Settings {
  constructor() {
    SteamClient.Storage.GetJSON(SPEED_TEST_SETTINGS_KEY).catch((e: any) => {
      if ((e.message = "Not found")) {
        logger.error("Unable to get settings, saving defaults", e);
        SteamClient.Storage.SetObject(SPEED_TEST_SETTINGS_KEY, DEFAULTS);
      } else {
        logger.error("Unable to get settings", e);
      }
    });
  }

  async get(): Promise<SpeedTestSettings> {
    let settings = await SteamClient.Storage.GetJSON(SPEED_TEST_SETTINGS_KEY);
    if (settings == undefined) {
      return DEFAULTS;
    }
    return JSON.parse(settings) as SpeedTestSettings;
  }

  async save(data: SpeedTestSettings) {
    await SteamClient.Storage.SetObject(SPEED_TEST_SETTINGS_KEY, data);
  }
}
