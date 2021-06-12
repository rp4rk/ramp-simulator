import { SpellListContainer } from "components/SpellList/styled";
import styled from "styled-components";

export const TimelineContainer = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  display: flex;
  align-items: center;

  ${SpellListContainer} {
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.05);
    background: #cde0fe;
    display: flex;
    justify-content: start;
    height: 68px;
    margin: 0 48px;
  }
`;
