import type { AgentResult } from "@inngest/agent-kit";

/**
 * Extract the text of the most recent assistant message from an agent result.
 *
 * Scans the agent output from the end backwards, skipping anything that is not
 * an assistant text message. When the matching message stores its content as an
 * array of parts, the parts are concatenated into a single string.
 *
 * @param result - The result returned by an agent/network run.
 * @returns The assistant's latest text content, or `undefined` if none exists.
 */
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
