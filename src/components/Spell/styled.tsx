import styled from "styled-components";
import { SpellProps } from ".";

export const SpellImage = styled.img`
  transition: ease-in-out 0.15s;
  border-radius: 3px;
  width: 32px;
  border-radius: 5px;
`;

export const SpellContainer = styled.span<Pick<SpellProps, "toggled">>`
  transition: ease-in-out 0.15s;
  display: inline-block;
  padding: 4px 6px;

  opacity: ${(p) => (p.toggled ? 1 : 0.2)};

  &:hover {
    cursor: pointer;
    transform: translateY(-3px);

    opacity: ${(p) => (p.toggled ? 1 : 0.6)};

    img {
      background: #cde0fe;
      box-shadow: 2px 2px 5px #aebed8, -2px -2px 5px #ecffff;
    }
  }
`;

export const HoverSpellContainer = styled.span`
  color: rgb(0, 31, 63);
  display: inline-flex;
  box-sizing: content-box;
  justify-content: center;
  align-items: center;
  transition: ease-in-out 0.15s;
  padding: 8px 12px;

  &:hover {
    cursor: grab;
    transform: translateY(-3px);

    img {
      background: #cde0fe;
      box-shadow: 2px 2px 5px #aebed8, -2px -2px 5px #ecffff;
    }
  }

  & > ${SpellImage} {
    border-radius: 7px;
  }
`;
