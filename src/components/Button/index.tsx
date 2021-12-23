import { FC, MouseEventHandler } from "react";
import * as HeroIconsSolid from "@heroicons/react/solid";
import * as HeroIconsOutline from "@heroicons/react/solid";

interface ButtonProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  outline?: boolean;
  icon?: keyof typeof HeroIconsSolid;
}

interface ButtonPropsSolid extends ButtonProps {
  outline: false;
  icon: keyof typeof HeroIconsSolid;
}

interface ButtonPropsOutline extends ButtonProps {
  outline: true;
  icon: keyof typeof HeroIconsOutline;
}

type ButtonPropTypes = ButtonProps | ButtonPropsSolid | ButtonPropsOutline;

export const Button: FC<ButtonPropTypes> = (props) => {
  const Icon =
    props.icon && props.outline === true ? HeroIconsOutline[props.icon] : props.icon && HeroIconsSolid[props.icon];

  return (
    <button
      className={"text-sm text-white font-semibold py-2 px-4 bg-sky-600 hover:bg-sky-700 rounded-full ".concat(
        props.className || ""
      )}
      onClick={props.onClick}
    >
      {Icon && <Icon className="w-5 h-5 text-white inline-block align-middle mr-2" />}
      {props.children}
    </button>
  );
};
