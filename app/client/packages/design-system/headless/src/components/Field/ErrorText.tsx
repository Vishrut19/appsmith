import React, { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { useDOMRef } from "@react-spectrum/utils";
import type { DOMRef, SpectrumHelpTextProps } from "@react-types/shared";

// Adapted from remixicon-react/AlertFillIcon (https://github.com/Remix-Design/RemixIcon/blob/f88a51b6402562c6c2465f61a3e845115992e4c6/icons/System/alert-fill.svg)
const AlertIcon = () => {
  return (
    <svg fill="currentColor" height={24} viewBox="0 0 24 24" width={24}>
      <path d="m12.865 3 9.526 16.5a1 1 0 0 1-.866 1.5H2.473a1 1 0 0 1-.866-1.5L11.133 3a1 1 0 0 1 1.732 0Zm-1.866 13v2h2v-2h-2Zm0-7v5h2V9h-2Z" />
    </svg>
  );
};

interface HelpTextProps extends SpectrumHelpTextProps {
  errorMessageProps?: HTMLAttributes<HTMLElement>;
}

export const ErrorText = forwardRef(
  (props: HelpTextProps, ref: DOMRef<HTMLDivElement>) => {
    const { errorMessage, errorMessageProps, showErrorIcon } = props;
    const domRef = useDOMRef(ref);

    return (
      <div data-field-error-text="">
        {showErrorIcon && <AlertIcon />}
        <span {...errorMessageProps} ref={domRef}>
          {errorMessage}
        </span>
      </div>
    );
  },
);
