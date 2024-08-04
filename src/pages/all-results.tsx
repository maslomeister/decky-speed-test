import { VFC, useState } from "react";
import { Backend } from "../app/backend";
import { PageWrapper } from "../components/page-wrapper";
import { Tab } from "../components/tab";
import { AllTests } from "../containers/all-tests";
import { Tabs } from "decky-frontend-lib";

type Props = {
  backend: Backend;
};

export const AllResults: VFC<Props> = ({ backend }) => {
  const [currentTabRoute, setCurrentTabRoute] = useState<string>("all-tests");

  return (
    <PageWrapper>
      <Tabs
        activeTab={currentTabRoute}
        onShowTab={(tabId: string) => {
          setCurrentTabRoute(tabId);
        }}
        tabs={[
          {
            title: "All Tests",
            content: (
              <Tab>
                <AllTests backend={backend} />
              </Tab>
            ),
            id: "all-tests",
          },
        ]}
      />
    </PageWrapper>
  );
};
