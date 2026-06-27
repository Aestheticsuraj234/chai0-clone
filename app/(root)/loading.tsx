import { Spinner } from "@/components/ui/spinner";

/**
 * Route-level loading UI for the `(root)` group.
 *
 * Shown by Next.js (via Suspense) while a segment in this group is loading.
 */
export default function Loading() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );
}
