import styled from "styled-components";
import { Root, Title, Description, Action } from "@radix-ui/react-toast";

export const StyledToastRoot = styled(Root)`
  box-shadow: var(--big-shadow);
  display: "grid";
  grid-template-areas: "title action" "description action";
  grid-template-columns: auto max-content;
  align-items: center;
  gap: 0 24px;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &[data-state="open"] {
    animation: slideIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &[data-state="closed"] {
    animation: slideIn 0.15s ease-in-out;
  }
`;

export const StyledToastTitle = styled(Title)`
  grid-area: title;
`;

export const StyledToastDescription = styled(Description)`
  grid-area: description;
`;

export const StyledToastAction = styled(Action)`
  grid-area: action;
`;
