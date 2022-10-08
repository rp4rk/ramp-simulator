import { FC, ComponentPropsWithoutRef } from "react";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className, ...rest }) => (
  <div
    {...rest}
    className={"bg-gradient-to-t from-slate-200 to-slate-100 rounded p-3 mb-4 mx-4".concat(
      className || ""
    )}
  >
    {children}
  </div>
);
