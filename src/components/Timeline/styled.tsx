import { SpellListContainer } from "components/SpellList/styled";
import styled from "styled-components";

export const TimelineContainer = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  display: flex;
  align-items: center;

  ${SpellListContainer} {
    box-sizing: border-box;
    border-radius: 3px;
    background: #bfd7ff;
    display: flex;
    justify-content: start;
    min-height: 68px;
    padding: 12px 0;
    margin: 0 48px;
  }
`;
