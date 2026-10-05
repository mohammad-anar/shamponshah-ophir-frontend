import { cn } from "@/lib/utils"; // Assuming you have this utility function for conditional classnames
import React from "react";

interface TitleWithBorderProps {
  title?: string;
  borderColor?: string;
  className?: string;
}

const TitleWithBorder: React.FC<TitleWithBorderProps> = ({
  title,
  className,
  borderColor,
}) => {
  return (
    <div className={cn("flex items-center gap-5 text-black", className)}>
      {title ? (
        <>
          <div className={cn("w-12 border border-black", borderColor)}></div>
          <p className="font-semibold">{title}</p>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default TitleWithBorder;
