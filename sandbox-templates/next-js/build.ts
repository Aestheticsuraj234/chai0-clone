
import { Template, defaultBuildLogger } from 'e2b'
import { template as nextJSTemplate } from './template'
import dotenv from 'dotenv'
dotenv.config()

// Build script: compiles the Next.js sandbox template (see ./template) into a
// named, reusable E2B image ("chai0-clone"). Run this once (or when the template
// changes) so the agent can spin up sandboxes from it quickly.
Template.build(nextJSTemplate, 'chai0-clone', {
  cpuCount: 4,
  memoryMB: 4096,
  onBuildLogs: defaultBuildLogger(),
  apiKey: "e2b_73501d7a907eccf073b200293ac1dde3a84994ad",

})