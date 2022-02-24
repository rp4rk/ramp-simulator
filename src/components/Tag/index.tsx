import { ComponentPropsWithoutRef, FC } from "react";

interface TagProps extends ComponentPropsWithoutRef<"span"> {}

export const Tag: FC<TagProps> = ({ children, className, ...rest }) => {
  return (
    <span
      className={"inline-block text-xs font-semibold text-white bg-slate-600 rounded p-1".concat(
        className || ""
      )}
      {...rest}
    >
      {children}
    </span>
  );
};
