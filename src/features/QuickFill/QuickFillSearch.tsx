import { Button } from "components/Button";
import { FC, ComponentPropsWithoutRef, memo } from "react";

interface QuickFillSearchProps extends ComponentPropsWithoutRef<"form"> {
  onUpdate: (v: string) => any;
}

export const QuickFillSearch: FC<QuickFillSearchProps> = memo(({ onUpdate, ...rest }) => {
  return (
    <form {...rest} className="w-full flex gap-x-2">
      <label htmlFor="quick-fill" className="sr-only">
        Ramp Sequence
      </label>
      <input
        autoComplete="off"
        autoFocus
        onChange={(e) => onUpdate(e.target.value)}
        id="quick-fill"
        className="w-full rounded-sm p-3 text-lg text-gray-700"
        type="search"
      />
      <Button type="submit" className="rounded-sm w-32" icon="PlusIcon">
        Add
      </Button>
    </form>
  );
});
