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
      style={{ backgroundColor: "#3ECF8E", color: "#fff", border: "none" }}
      className={cn(className, "hover:!bg-green-300")}
    >
      {text}
    </Button>
  );
};

export default SuccessButton;
