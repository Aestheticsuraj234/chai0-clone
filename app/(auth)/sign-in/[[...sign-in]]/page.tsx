import { SignIn } from '@clerk/nextjs'

/**
 * Sign-in page.
 *
 * Renders Clerk's prebuilt `<SignIn />` widget. The optional catch-all route
 * segment (`[[...sign-in]]`) lets Clerk handle its multi-step sub-routes.
 */
export default function Page() {
  return <SignIn />
}