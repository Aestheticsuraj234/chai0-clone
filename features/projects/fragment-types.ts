import type { Fragment } from "@/lib/generated/prisma/client";

/**
 * A Prisma `Fragment` with its JSON `files` column narrowed to a typed
 * path-to-contents map, ready for use by the file explorer and preview.
 */
export type ProjectFragment = Fragment & {
  files: Record<string, string>;
};

/**
 * Safely coerce a fragment's raw JSON `files` value into a path-to-contents map.
 *
 * Prisma types JSON columns loosely, so this guards against `null`, non-objects,
 * and arrays, returning an empty object in those cases.
 *
 * @param files - The raw `files` value from a `Fragment` record.
 * @returns A `Record<string, string>` mapping file paths to contents.
 */
export function parseFragmentFiles(files: Fragment["files"]): Record<string, string> {
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    return {};
  }

  return files as Record<string, string>;
}
