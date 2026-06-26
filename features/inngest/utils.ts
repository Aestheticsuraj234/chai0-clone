import type { AgentResult } from "@inngest/agent-kit";

export function lastAssistantTextMessageContent(
  result: AgentResult
): string | undefined {
  for (let i = result.output.length - 1; i >= 0; i--) {
    const message = result.output[i];
    if (message.type !== "text" || message.role !== "assistant") {
      continue;
    }

    if (Array.isArray(message.content)) {
      return message.content
        .map((part) => (typeof part === "string" ? part : part.text ?? ""))
        .join("");
    }

    return message.content;
  }

  return undefined;
}
