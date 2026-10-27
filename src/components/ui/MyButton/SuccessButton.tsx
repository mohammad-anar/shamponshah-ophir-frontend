import { cn } from "@/lib/utils";
import { Button } from "antd";
import React, { FC } from "react";

interface SuccessButtonProps {
  text?: string;
  className?: string;
  icon?: React.ReactNode;
}

const SuccessButton: FC<SuccessButtonProps> = ({ text, className, icon }) => {
  return (
    <Button
      icon={icon}
      type="primary"
      style={{ backgroundColor: "rgb(var(--success-solid))", color: "rgb(var(--foreground))", border: "none" }}
      className={cn(className, "hover:!bg-success")}
    >
      {text}
    </Button>
  );
};

export default SuccessButton;
