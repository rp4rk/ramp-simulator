import { FC } from "react";

interface CardProps {
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => (
  <div
    className={"bg-gradient-to-t from-slate-200 to-slate-100 rounded p-3 mb-4 mx-4 drop-shadow-2xl".concat(
      className || ""
    )}
  >
    {children}
  </div>
);
