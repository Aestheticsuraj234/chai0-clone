"use client";

import { Chai0Mark } from "@/components/brand/chai0-logo";
import { useEffect, useState } from "react";

const loadingMessages = [
  "Thinking...",
  "Loading...",
  "Generating...",
  "Processing...",
  "Analyzing your prompt...",
  "Generating response...",
  "Adding final touches...",
  "Almost there...",
];

function ShimmerMessages() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="animate-pulse text-base text-muted-foreground">
      {loadingMessages[currentMessageIndex]}
    </span>
  );
}

export default function MessageLoading() {
  return (
    <div className="group flex flex-col px-2 pb-4">
      <div className="mb-2 flex items-center gap-2 pl-2">
        <Chai0Mark className="h-7 w-auto shrink-0" />
      </div>
      <div className="flex flex-col gap-y-4 pl-8.5">
        <ShimmerMessages />
      </div>
    </div>
  );
}
