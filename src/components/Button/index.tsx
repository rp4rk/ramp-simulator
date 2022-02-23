import { FC, MouseEventHandler, ComponentPropsWithoutRef } from "react";
import * as HeroIconsSolid from "@heroicons/react/solid";
import * as HeroIconsOutline from "@heroicons/react/solid";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
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

export const Button: FC<ButtonPropTypes> = ({ icon, outline, onClick, className, children, ...rest }) => {
  const Icon = icon && outline === true ? HeroIconsOutline[icon] : icon && HeroIconsSolid[icon];

  return (
    <button
      {...rest}
      className={"text-sm text-white font-semibold py-2 px-4 bg-sky-600 hover:bg-sky-700 rounded-full ".concat(
        className || ""
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5 text-white inline-block align-middle mr-2" />}
      {children}
    </button>
  );
};
