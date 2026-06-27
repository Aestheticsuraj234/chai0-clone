/**
 * Layout for the `(auth)` route group (sign-in / sign-up).
 *
 * Centers its children on a full-height, neutral background.
 *
 * @param children - The auth page content to render.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      {children}
    </div>
  );
}
