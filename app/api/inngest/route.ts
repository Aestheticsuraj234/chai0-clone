import { inngest } from "@/features/inngest/client";
import { serve } from "inngest/next";
import { processTask } from "@/features/inngest/functions";


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask],
});