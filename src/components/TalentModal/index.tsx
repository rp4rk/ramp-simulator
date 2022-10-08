import { ComponentPropsWithoutRef, FC, useCallback, useRef } from "react";
import { SUPPORTED_SPECS, TalentSet, TalentSetReturn } from "@focused-will/components";

import { TalentDiv, TalentFooter, TalentHeader, TalentInner } from "./styled";
import { Button } from "components/Button";
import classNames from "classnames";

interface TalentWindowProps extends ComponentPropsWithoutRef<"div"> {
  onSave?: (talents: TalentSetReturn) => void;
  onClose?: () => void;
}

export const TalentWindow: FC<TalentWindowProps> = ({ className, onSave, onClose, ...rest }) => {
  const talents = useRef<TalentSetReturn>();

  /**
   * Handle talent investments
   */
  const handleTalentChange = useCallback((talentChange: TalentSetReturn) => {
    const { GENERAL, TREE } = talentChange;

    if (GENERAL) {
      talents.current = { ...talents.current, GENERAL };
    }

    if (TREE) {
      talents.current = { ...talents.current, TREE };
    }
  }, []);

  return (
    <TalentDiv aria-modal="true" role="dialog" className={classNames("", className)} {...rest}>
      <TalentHeader>
        <h2 className="text-3xl font-medium text-gray-700 text-center mb-4">Talent Selection</h2>
      </TalentHeader>
      <TalentInner>
        <TalentSet classTalents={SUPPORTED_SPECS.PRIEST.DISCIPLINE} onChange={handleTalentChange} />
        <TalentFooter>
          <Button onClick={onClose} className="bg-red-600 hover:bg-red-700" icon="XCircleIcon">
            Cancel Selection
          </Button>
          <Button
            icon="SaveIcon"
            onClick={() => {
              if (talents.current && onSave) {
                onSave(talents.current);
                onClose && onClose();
              }
            }}
          >
            Save Selection
          </Button>
        </TalentFooter>
      </TalentInner>
    </TalentDiv>
  );
};
