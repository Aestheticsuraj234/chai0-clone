import { onboardUser } from "@/lib/actions/onboard-user";

export default async function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await onboardUser();
  return children;
}
