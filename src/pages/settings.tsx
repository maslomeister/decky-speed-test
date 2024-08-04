import {
  Field,
  PanelSectionRow,
  PanelSection,
  SidebarNavigation,
  Toggle,
} from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { DEFAULTS, SpeedTestSettings } from "../app/settings";
import { useLocator } from "../components/locator";
import { Tab } from "../components/tab";

export const GeneralSettings: VFC<{}> = () => {
  const { settings } = useLocator();
  let [current, setCurrent] = useState<SpeedTestSettings>(DEFAULTS);
  let [loaded, setLoaded] = useState<boolean>(false);

  let loadSettings = () => {
    setLoaded(false);
    settings.get().then((r) => {
      setCurrent(r);
      setLoaded(true);
    });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  let updateSettings = async () => {
    await settings.save(current);
    loadSettings();
  };

  return (
    <div>
      {loaded && (
        <div>
          <PanelSection title="Appearance">
            <PanelSectionRow>
              <Field label="Speed in bits per second">
                <Toggle
                  value={current?.bitsPerSecond}
                  onChange={(v) => {
                    current.bitsPerSecond = v;
                    updateSettings();
                  }}
                />
              </Field>
            </PanelSectionRow>
          </PanelSection>
        </div>
      )}
    </div>
  );
};

export const SettingsPage: VFC<{}> = () => {
  return (
    <SidebarNavigation
      pages={[
        {
          title: "General",
          content: (
            <Tab>
              <GeneralSettings />
            </Tab>
          ),
        },
      ]}
    />
  );
};
