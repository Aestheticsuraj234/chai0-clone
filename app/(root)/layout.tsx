import { onboardUser } from "@/features/auth/actions";

/**
 * Layout for the authenticated `(root)` route group.
 *
 * Runs {@link onboardUser} on every render so a database user record exists for
 * the signed-in Clerk user before rendering any child page.
 *
 * @param children - The nested route content to render.
 */
export default async function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await onboardUser();
  return children;
}
