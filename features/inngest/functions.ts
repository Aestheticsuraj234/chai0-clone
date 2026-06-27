import { prisma } from "@/lib/db";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/lib/prompt";
import { Sandbox } from "@e2b/code-interpreter";
import {
  createAgent,
  createNetwork,
  createState,
  createTool,
  gemini,
} from "@inngest/agent-kit";
import { z } from "zod";
import { inngest } from "./client";
import { lastAssistantTextMessageContent } from "./utils";

/**
 * Shared state passed between agents inside the coding network.
 *
 * @property summary - The agent's final `<task_summary>` once the build is done.
 * @property files   - Map of file path to file contents written to the sandbox.
 */
interface CodeAgentState {
  summary: string;
  files: Record<string, string>;
}

/**
 * Minimal demo Inngest function that acknowledges an `app/task.created` event.
 *
 * It records the task as processed, waits briefly, and returns a completion
 * message. Primarily a placeholder/example of the Inngest wiring.
 *
 * @event app/task.created - Carries `{ id }` of the task to process.
 */
export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      return { processed: true, id: event.data.id };
    });

    await step.sleep("pause", "1s");

    return { message: `Task ${event.data.id} complete`, result };
  }
);

/**
 * Core background job that turns a user prompt into a working web app.
 *
 * High-level flow:
 * 1. Spin up an E2B sandbox and load prior project messages as agent context.
 * 2. Run a coding agent (Gemini) that can use the terminal, create/update files,
 *    and read files inside the sandbox until it emits a `<task_summary>`.
 * 3. Generate a short fragment title and a user-facing response message.
 * 4. Persist the result (or an error message) to the database, linking a
 *    Fragment that points at the live sandbox URL and generated files.
 *
 * @event code-agent/run - Carries `{ value, projectId }` where `value` is the
 *   user's prompt and `projectId` is the project to attach messages to.
 * @returns The sandbox URL, generated title, files map, and agent summary.
 */
export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", triggers: { event: "code-agent/run" } },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create({
        template: "tx1v125jl3xix3mvkchq",
      });
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return messages.map((message) => ({
          type: "text" as const,
          role:
            message.role === MessageRole.ASSISTANT ? ("assistant" as const) : ("user" as const),
          content: message.content,
        }));
      }
    );

    const state = createState<CodeAgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const geminiModel = gemini({
      model: "gemini-2.5-flash",
      step,
      defaultParameters: {
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 8192,
          // Disable the thinking pass — it conflicts with tool calling on
          // 2.5-flash and triggers MALFORMED_FUNCTION_CALL.
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      },
    } as Parameters<typeof gemini>[0]);

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: geminiModel,
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step: toolStep }) => {
            return await toolStep?.run(`terminal-${command}`, async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await Sandbox.connect(sandboxId);

                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });

                return result.stdout;
              } catch (error) {
                console.log(
                  `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`
                );

                return `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFile",
          description:
            "Create or update one file in the sandbox. Call this tool once per file with a relative path and full file contents.",
          parameters: z.object({
            path: z
              .string()
              .describe("Relative file path, e.g. app/page.tsx"),
            content: z.string().describe("Full contents of the file"),
          }),
          handler: async ({ path, content }, { step: toolStep, network }) => {
            const newFiles = await toolStep?.run(
              `create-or-update-file-${path}`,
              async () => {
                try {
                  const updatedFiles = network?.state?.data.files || {};

                  const sandbox = await Sandbox.connect(sandboxId);
                  await sandbox.files.write(path, content);
                  updatedFiles[path] = content;

                  return updatedFiles;
                } catch (error) {
                  return "Error" + error;
                }
              }
            );

            if (typeof newFiles === "object" && network) {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files in the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step: toolStep }) => {
            return await toolStep?.run(`read-files-${files.length}`, async () => {
              try {
                const sandbox = await Sandbox.connect(sandboxId);

                const contents = [];

                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }

                return JSON.stringify(contents);
              } catch (error) {
                return "Error" + error;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Generate a title for the fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: geminiModel,
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "Generate a response for the fragment",
      system: RESPONSE_PROMPT,
      model: geminiModel,
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary,
      { step }
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary,
      { step }
    );

    /**
     * Normalize the title-generator output into a plain string.
     *
     * Falls back to "Untitled" when the model did not return text, and joins
     * multi-part content into a single string when needed.
     */
    const generateFragmentTitle = () => {
      if (fragmentTitleOutput[0]?.type !== "text") {
        return "Untitled";
      }

      if (Array.isArray(fragmentTitleOutput[0].content)) {
        return fragmentTitleOutput[0].content
          .map((part) => (typeof part === "string" ? part : part.text ?? ""))
          .join("");
      }

      return fragmentTitleOutput[0].content;
    };

    /**
     * Normalize the response-generator output into a plain string.
     *
     * Falls back to "Here you go" when the model did not return text, and joins
     * multi-part content into a single string when needed.
     */
    const generateResponse = () => {
      if (responseOutput[0]?.type !== "text") {
        return "Here you go";
      }

      if (Array.isArray(responseOutput[0].content)) {
        return responseOutput[0].content
          .map((part) => (typeof part === "string" ? part : part.text ?? ""))
          .join("");
      }

      return responseOutput[0].content;
    };

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const host = sandbox.getHost(3000);

      return `http://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again",
            role: MessageRole.ASSISTANT,
            type: MessageType.ERROR,
          },
        });
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generateResponse(),
          role: MessageRole.ASSISTANT,
          type: MessageType.RESULT,
          fragments: {
            create: {
              sandboxUrl,
              title: generateFragmentTitle(),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: generateFragmentTitle(),
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
