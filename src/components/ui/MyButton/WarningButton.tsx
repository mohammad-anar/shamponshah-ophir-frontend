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
      style={{ backgroundColor: "#FAAD14", color: "#fff" }}
      className={cn(className)}
    >
      {text}
    </Button>
  );
};

export default WarningButton;
