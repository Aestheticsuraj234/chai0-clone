"use client";

import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  FileCodeIcon,
  FileIcon,
  FileJsonIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import { useState } from "react";

type TreeItem = import("@/lib/utils").TreeItem;

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return <FileCodeIcon className="size-4 shrink-0 text-sky-500" />;
    case "json":
      return <FileJsonIcon className="size-4 shrink-0 text-amber-500" />;
    case "css":
    case "scss":
      return <FileCodeIcon className="size-4 shrink-0 text-pink-500" />;
    case "md":
    case "txt":
      return <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />;
    default:
      return <FileIcon className="size-4 shrink-0 text-muted-foreground" />;
  }
}

export function TreeView({
  data,
  value,
  onSelect,
}: {
  data: TreeItem[];
  value: string | null;
  onSelect?: (filePath: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-9 shrink-0 items-center border-b px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Files
      </div>
      <div className="min-h-0 flex-1 overflow-auto py-1">
        {data.map((item, index) => (
          <TreeNode
            key={index}
            item={item}
            selectedValue={value}
            onSelect={onSelect}
            parentPath=""
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}

function TreeNode({
  item,
  selectedValue,
  onSelect,
  parentPath,
  depth,
}: {
  item: TreeItem;
  selectedValue: string | null;
  onSelect?: (filePath: string) => void;
  parentPath: string;
  depth: number;
}) {
  const [open, setOpen] = useState(true);

  const [name, ...children] = Array.isArray(item) ? item : [item];
  const currentPath = parentPath ? `${parentPath}/${name}` : String(name);
  const isFolder = children.length > 0;

  // Indentation: base padding + per-depth step. Folders have no leading icon
  // gap so the chevron aligns; files get an extra inset where the chevron sits.
  const indent = 8 + depth * 12;

  if (!isFolder) {
    const isSelected = selectedValue === currentPath;

    return (
      <button
        type="button"
        onClick={() => onSelect?.(currentPath)}
        style={{ paddingLeft: indent + 18 }}
        className={cn(
          "flex w-full items-center gap-2 py-1 pr-2 text-sm transition-colors",
          "hover:bg-accent/60",
          isSelected
            ? "bg-accent font-medium text-accent-foreground"
            : "text-foreground/80"
        )}
        title={name}
      >
        {getFileIcon(String(name))}
        <span className="truncate">{name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{ paddingLeft: indent }}
        className="flex w-full items-center gap-1.5 py-1 pr-2 text-sm text-foreground/90 transition-colors hover:bg-accent/60"
        title={name}
      >
        <ChevronRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90"
          )}
        />
        {open ? (
          <FolderOpenIcon className="size-4 shrink-0 text-sky-500" />
        ) : (
          <FolderIcon className="size-4 shrink-0 text-sky-500" />
        )}
        <span className="truncate font-medium">{name}</span>
      </button>

      {open && (
        <div>
          {children.map((child, index) => (
            <TreeNode
              key={index}
              item={child}
              selectedValue={selectedValue}
              onSelect={onSelect}
              parentPath={currentPath}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
