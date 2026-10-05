"use client";
import { cn } from "@/lib/utils";
import { Button } from "antd";
import { FC } from "react";

interface MyButtonProps {
  title: string;
  className?: string;
}
const MyButton: FC<MyButtonProps> = ({ title, className }) => {
  return (
    <>
      <Button type="primary" danger className={cn(className)}>
        {title}
      </Button>
    </>
  );
};

export default MyButton;
