import styled from "styled-components";

export const SimOrchestratorContainer = styled.div`
  display: grid;
  grid-template-columns: 180px 180px minmax(0, auto) 300px;
  grid-column-gap: 12px;

  & > *:first-child {
    z-index: 1;
  }
  & > div {
    padding-right: 12px;
    border-right: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.15);
    border-radius: 0;
  }
  & > div:last-child {
    border: none;
    box-shadow: none;
  }
`;
