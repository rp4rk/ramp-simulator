import { Card } from "components/Card";
import styled from "styled-components";

export const TalentDiv = styled(Card)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  padding: 24px;

  background-color: #eee;
  border-radius: 7px;
  width: max-content;

  box-shadow: var(--big-shadow);
`;

export const TalentInner = styled.div`
  article {
    background-color: #ddd;
    border-radius: 7px;
    padding: 12px;
  }

  .spec-tree {
    margin-left: 24px;
  }

  & > div {
    margin-bottom: 12px;
  }

  .talent-set-form {
    position: relative;
  }
`;

export const TalentHeader = styled.header`
  width: 100%;
`;

export const TalentFooter = styled.footer`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;
