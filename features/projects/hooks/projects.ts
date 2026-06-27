import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjectById, getProjects } from "../actions";
import { isActionError } from "../types";

/**
 * Convert a server-action result into a value or a thrown error.
 *
 * Server actions return either the data or an `{ error }` object; React Query
 * expects thrown errors. This bridges the two so hooks can rely on `isError`.
 *
 * @param result - The raw server-action result.
 * @returns The unwrapped success value.
 * @throws An `Error` carrying the action's error message when present.
 */
async function unwrapActionResult<T>(result: T | { error: string }): Promise<T> {
  if (isActionError(result)) {
    throw new Error(result.error);
  }

  return result;
}

/**
 * React Query mutation hook for creating a project.
 *
 * Invalidates the `projects` list on success so it refetches.
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: string) =>
      unwrapActionResult(await createProject(value)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

/**
 * React Query hook that loads the signed-in user's projects.
 */
export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => unwrapActionResult(await getProjects()),
  });
};

/**
 * React Query hook that loads a single project by id.
 *
 * Disabled until an `id` is provided.
 *
 * @param id - The project id to fetch.
 */
export const useGetProjectById = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => unwrapActionResult(await getProjectById(id)),
    enabled: Boolean(id),
  });
};
