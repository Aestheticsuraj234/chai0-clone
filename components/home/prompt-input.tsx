"use client";

import { useState } from "react";
import {
  IconArrowUp,
  IconChartLine,
  IconChevronDown,
  IconDeviceGamepad2,
  IconMail,
  IconPhoto,
  IconRefresh,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const suggestions = [
  {
    label: "Contact Form",
    icon: IconMail,
    prompt: "Build a contact form with validation and success states",
  },
  {
    label: "Image Editor",
    icon: IconPhoto,
    prompt: "Build a simple image editor with crop and filter controls",
  },
  {
    label: "Mini Game",
    icon: IconDeviceGamepad2,
    prompt: "Build a mini browser game with score tracking",
  },
  {
    label: "Finance Calculator",
    icon: IconChartLine,
    prompt: "Build a finance calculator with charts and projections",
  },
] as const;

export function PromptInput() {
  const [prompt, setPrompt] = useState("");

  function handleSubmit() {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    // TODO: wire up generation flow
    console.log(trimmed);
  }

  function applySuggestion(nextPrompt: string) {
    setPrompt(nextPrompt);
  }

  function shuffleSuggestions() {
    setPrompt(suggestions[Math.floor(Math.random() * suggestions.length)].prompt);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <InputGroup className="h-auto min-h-32 flex-col rounded-2xl border-border/60 bg-card/50 shadow-sm backdrop-blur-sm has-[>textarea]:h-auto">
        <InputGroupTextarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask chai0 to build..."
          rows={4}
          className="min-h-24 px-4 pt-4 text-sm"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
        />
        <InputGroupAddon
          align="block-end"
          className="w-full justify-between border-t border-border/50 px-3 py-2"
        >
          <Button variant="outline" size="sm" className="rounded-full">
            <InputGroupText>chai0 Max</InputGroupText>
            <IconChevronDown className="size-3 opacity-60" />
          </Button>
          <InputGroupButton
            size="icon-sm"
            variant="default"
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            aria-label="Submit prompt"
          >
            <IconArrowUp />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestions.map(({ label, icon: Icon, prompt: suggestionPrompt }) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => applySuggestion(suggestionPrompt)}
          >
            <Icon />
            {label}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          onClick={shuffleSuggestions}
          aria-label="Shuffle suggestions"
        >
          <IconRefresh />
        </Button>
      </div>
    </div>
  );
}
