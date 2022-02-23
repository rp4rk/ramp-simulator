import { FC, ComponentPropsWithoutRef } from "react";

interface SpellIconProps extends ComponentPropsWithoutRef<"img"> {
  name: string;
  icon: string;
}

export const SpellIcon: FC<SpellIconProps> = ({ name, icon, ...rest }) => {
  return (
    <img {...rest} alt={`Spell Icon for ${name}`} src={`https://render.worldofwarcraft.com/us/icons/56/${icon}.jpg`} />
  );
};
