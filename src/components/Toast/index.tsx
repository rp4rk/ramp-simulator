import { FC, useRef, useEffect } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import {
  StyledToastAction,
  StyledToastDescription,
  StyledToastRoot,
  StyledToastTitle,
} from "./styled";

interface ToastProps extends ToastPrimitive.ToastProps {
  title?: string;
  content: string;
  altText?: string;
  duration?: number;
  onClose?: () => void;
}

const DEFAULT_DURATION = 2500;

export const Toast: FC<ToastProps> = ({
  title,
  content,
  children,
  altText,
  duration = DEFAULT_DURATION,
  onClose,
  ...props
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose && onClose();
    }, duration);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [duration, onClose]);

  return (
    <StyledToastRoot {...props} className="bg-white rounded-sm grid p-4 font-sans">
      {title && (
        <StyledToastTitle className="font-semibold text-sm text-slate-600">
          {title}
        </StyledToastTitle>
      )}
      {content && (
        <StyledToastDescription className="text-xs italic text-slate-500">
          {content}
        </StyledToastDescription>
      )}
      {children && (
        <StyledToastAction asChild altText={altText || ""}>
          {children}
        </StyledToastAction>
      )}
      <ToastPrimitive.Close aria-label="Close">×</ToastPrimitive.Close>
    </StyledToastRoot>
  );
};
