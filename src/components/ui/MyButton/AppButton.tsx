"use client";

import React from "react";
import { Button, ButtonProps, theme } from "antd";

type StatusVariant = "success" | "warning" | "error";

interface AppButtonProps extends ButtonProps {
  status?: StatusVariant;
}

const AppButton: React.FC<AppButtonProps> = ({ status, style, ...props }) => {
  const { token } = theme.useToken();

  // map AntD theme tokens for interactions
  const colorMap: Record<StatusVariant, { base: string; hover: string; active: string }> = {
    success: {
      base: token.colorSuccess,
      hover: token.colorSuccessHover,
      active: token.colorSuccessActive,
    },
    warning: {
      base: token.colorWarning,
      hover: token.colorWarningHover,
      active: token.colorWarningActive,
    },
    error: {
      base: token.colorError,
      hover: token.colorErrorHover,
      active: token.colorErrorActive,
    },
  };

  const colors = status ? colorMap[status] : null;

  return (
    <Button
      {...props}
      style={{
        ...(colors
          ? {
              backgroundColor: colors.base,
              borderColor: colors.base,
              color: "#fff",
            }
          : {}),
        ...style, // allow overriding
      }}
      onMouseEnter={(e) => {
        if (colors) {
          e.currentTarget.style.backgroundColor = colors.hover;
          e.currentTarget.style.borderColor = colors.hover;
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (colors) {
          e.currentTarget.style.backgroundColor = colors.base;
          e.currentTarget.style.borderColor = colors.base;
        }
        props.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (colors) {
          e.currentTarget.style.backgroundColor = colors.active;
          e.currentTarget.style.borderColor = colors.active;
        }
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        if (colors) {
          e.currentTarget.style.backgroundColor = colors.hover;
          e.currentTarget.style.borderColor = colors.hover;
        }
        props.onMouseUp?.(e);
      }}
    />
  );
};

export default AppButton;
