import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";

import { DragSpell } from ".";
import { Spells } from "lib";

export default {
  title: "Spell",
  component: DragSpell,
};

const Template: Story<ComponentProps<typeof DragSpell>> = (args) => (
  <DragSpell {...args} />
);

export const FirstStory = Template.bind({});

FirstStory.args = {
  spell: Spells.BoonOfTheAscended,
};
