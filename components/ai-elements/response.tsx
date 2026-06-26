"use client";

import { cn } from "@/lib/utils";
import { memo } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = {
  className?: string;
  children: string;
};

export const Response = memo(function Response({
  className,
  children,
}: ResponseProps) {
  return (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
    >
      {children}
    </Streamdown>
  );
});
