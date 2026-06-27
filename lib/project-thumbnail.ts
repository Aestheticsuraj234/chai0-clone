/**
 * Build a deterministic DiceBear "glass" avatar URL for a project thumbnail.
 *
 * The same `seed` always yields the same image, so passing a stable value
 * (e.g. the project id) gives each project a consistent thumbnail.
 *
 * @param seed - Stable value used to generate the image (URL-encoded internally).
 * @returns A fully-qualified DiceBear SVG URL.
 */
export function getProjectThumbnailUrl(seed: string) {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;
}
