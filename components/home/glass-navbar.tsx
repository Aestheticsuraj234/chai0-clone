"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Chai0Logo } from "@/components/brand/chai0-logo";

/**
 * Fixed, frosted-glass top navigation bar for the home page.
 *
 * Shows the chai0 logo (linking home) on the left and Clerk's `UserButton` on
 * the right. The header is click-through except for the inner nav pill.
 */
export function GlassNavbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="pointer-events-auto flex h-12 w-full max-w-3xl items-center justify-between rounded-full border border-border/50 bg-background/70 px-4 shadow-sm backdrop-blur-xl supports-backdrop-filter:bg-background/50">
        <Link href="/" className="flex items-center">
          <Chai0Logo className="gap-2" />
        </Link>
        <UserButton />
      </nav>
    </header>
  );
}
