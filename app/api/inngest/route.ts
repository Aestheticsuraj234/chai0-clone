import { inngest } from "@/features/inngest/client";
import { serve } from "inngest/next";
import { codeAgentFunction, processTask } from "@/features/inngest/functions";


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, codeAgentFunction],
});