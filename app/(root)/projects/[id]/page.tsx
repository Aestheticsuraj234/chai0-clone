import { ProjectView } from "@/components/projects/project-view";

/**
 * Project workspace page (`/projects/[id]`).
 *
 * Awaits the route params to read the project id, then renders the split-pane
 * {@link ProjectView} (chat on one side, preview/code on the other).
 *
 * @param params - Promise resolving to the route params containing `id`.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectView projectId={id} />;
}
