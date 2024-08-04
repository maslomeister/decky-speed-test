import { StoryFn, Meta } from "@storybook/react";

import { AllTestsFlex } from ".";

// main quickAccess window size 348 width 454 height
// the plugin window 300 by 440, top padding 14

export default {
  title: "AllTestsFlex",
  component: AllTestsFlex,
} as Meta;

export const Default: StoryFn = (args) => <AllTestsFlex />;
