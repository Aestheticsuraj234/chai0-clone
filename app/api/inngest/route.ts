import { inngest } from "@/features/inngest/client";
import { serve } from "inngest/next";
import { codeAgentFunction, processTask } from "@/features/inngest/functions";


/**
 * Inngest HTTP endpoint.
 *
 * Exposes the registered Inngest functions ({@link processTask},
 * {@link codeAgentFunction}) so the Inngest platform can introspect and invoke
 * them. `serve` provides the `GET`, `POST`, and `PUT` route handlers.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, codeAgentFunction],
});