import { cn } from "@/lib/utils";
import { Button } from "antd";
import React, { FC } from "react";

interface WarningButtonProps {
  text?: string;
  className?: string;
  icon?: React.ReactNode;
}

const WarningButton: FC<WarningButtonProps> = ({ text, className, icon }) => {
  return (
    <Button
      icon={icon}
      style={{ backgroundColor: "rgb(var(--warning-solid))", color: "rgb(var(--on-brand))" }}
      className={cn(className)}
    >
      {text}
    </Button>
  );
};

export default WarningButton;
