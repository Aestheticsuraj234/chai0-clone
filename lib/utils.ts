import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind class names safely.
 *
 * Combines conditional classes via `clsx`, then resolves conflicting Tailwind
 * utilities with `tailwind-merge` (e.g. `px-2 px-4` becomes `px-4`).
 *
 * @param inputs - Class values (strings, arrays, objects, falsey values).
 * @returns The merged, deduplicated class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A node in a file tree: either a file name (string) or a folder represented as
 * `[folderName, ...children]`.
 */
export type TreeItem = string | [string, ...TreeItem[]];

/**
 * Intermediate nested representation while building the tree. A `null` value
 * marks a file (leaf); a nested object marks a folder.
 */
interface TreeNode {
  [key: string]: TreeNode | null;
}

/**
 * Convert a flat map of file paths to a nested tree structure for the TreeView.
 *
 * Folders are sorted before files at each level and paths are processed in
 * sorted order for stable output.
 *
 * @param files - Map of file path (e.g. `"src/Button.tsx"`) to its contents.
 * @returns A list of {@link TreeItem}s representing the folder/file hierarchy.
 *
 * @example
 * Input: { "src/Button.tsx": "...", "README.md": "..." }
 * Output: [["src", "Button.tsx"], "README.md"]
 */
export function convertFilesToTreeItems(files: Record<string, string>): TreeItem[] {
  const tree: TreeNode = {};
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as TreeNode;
    }

    const fileName = parts[parts.length - 1];
    current[fileName] = null;
  }

  /**
   * Recursively convert a {@link TreeNode} into ordered {@link TreeItem}s,
   * listing folders before files.
   */
  function buildChildren(node: TreeNode): TreeItem[] {
    const folders: TreeItem[] = [];
    const leaves: TreeItem[] = [];

    for (const [key, value] of Object.entries(node)) {
      if (value === null) {
        // File (leaf node)
        leaves.push(key);
      } else {
        // Folder: [name, ...children]
        folders.push([key, ...buildChildren(value)]);
      }
    }

    // Show folders before files
    return [...folders, ...leaves];
  }

  return buildChildren(tree);
}
