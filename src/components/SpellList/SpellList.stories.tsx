import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";

import { SpellList } from ".";

export default {
  title: "Spell List",
  component: SpellList,
};

const Template: Story<ComponentProps<typeof SpellList>> = (args) => (
  <SpellList {...args} />
);

export const FirstStory = Template.bind({});

FirstStory.args = {};
