import { onboardUser } from "@/features/auth/actions";

export default async function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await onboardUser();
  return children;
}
