"use client";

import "./code-theme.css";

import Prism from "prismjs";
import { useEffect, useRef } from "react";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";

export function CodeView({
  code,
  lang = "javascript",
}: {
  code: string;
  lang?: string;
}) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, lang]);

  return (
    <div className="min-h-full w-full bg-background">
      <pre className="m-0 w-max min-w-full overflow-x-auto p-4 text-sm leading-7 text-foreground">
        <code ref={codeRef} className={`language-${lang} block font-mono`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
