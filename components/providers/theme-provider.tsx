"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Thin wrapper around `next-themes`' provider.
 *
 * Enables light/dark/system theming for the app and forwards all props through
 * to the underlying `NextThemesProvider`.
 *
 * @param props - Any `next-themes` provider props (e.g. `attribute`,
 *   `defaultTheme`, `enableSystem`).
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}