// src/inngest/client.ts
import { Inngest } from "inngest";

/**
 * Shared Inngest client for the app.
 *
 * Used both to send events (e.g. `code-agent/run`) and to register the
 * background functions that react to those events. The `id` namespaces all
 * functions and events for this application within Inngest.
 */
export const inngest = new Inngest({ id: "chai0" });