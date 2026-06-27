// template.ts
import { Template, waitForURL } from 'e2b'

/**
 * E2B sandbox template definition for generated Next.js apps.
 *
 * Starts from a Bun image, scaffolds a fresh Next.js + Tailwind app, installs
 * all shadcn/ui components, flattens the project into the home directory, and
 * starts the dev server (Turbo), waiting until it is reachable on port 3000.
 */
export const template = Template()
  .fromBunImage('1.3')
  .setWorkdir('/home/user/nextjs-app')
  .runCmd('bun create next-app . --app --ts --tailwind --yes --use-bun')
  .runCmd('bunx --bun shadcn@latest init -d -y')
  .runCmd('bunx --bun shadcn@latest add -a -y')
  .runCmd(
    'mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app'
  )
  .setWorkdir('/home/user')
  .setStartCmd('bun --bun run dev --turbo', waitForURL('http://localhost:3000'))