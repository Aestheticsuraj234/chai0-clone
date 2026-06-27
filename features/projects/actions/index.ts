"use server";
import { getCurrentUser } from "@/features/auth/actions";
import { inngest } from "@/features/inngest/client";
import { MessageRole, MessageType } from "@/lib/generated/prisma/client";
import { generateSlug } from "random-word-slugs";
import { prisma } from "@/lib/db";


/**
 * Create a new project from an initial prompt and start an agent run.
 *
 * Generates a random kebab-case project name, stores the prompt as the first
 * user message, and emits a `code-agent/run` event to build the app.
 *
 * @param value - The user's initial prompt describing what to build.
 * @returns The created project, or an `{ error }` object on failure/unauthorized.
 */
export const createProject = async (value: string) => {
    const user = await getCurrentUser();

    if (!user) {
        return {
            error: "Unauthorized",
        }
    }

    try {
        const project = await prisma.project.create({
            data: {
                name: generateSlug(2, { format: "kebab" }),
                userId: user.id,
                messages: {
                    create: {
                        content: value,
                        role: MessageRole.USER,
                        type: MessageType.RESULT,
                    }
                }
            }
        });

        await inngest.send({
            name: "code-agent/run",
            data: {
                value,
                projectId: project.id,
            },
        });

        return project;
    } catch (error) {
        console.error("❌ Error creating project:", error);
        return {
            error: "Failed to create project",
        }
    }
}

/**
 * List the signed-in user's projects, newest first.
 *
 * @returns The user's projects, or an `{ error }` object on failure/unauthorized.
 */
export const getProjects = async () => {
    const user = await getCurrentUser();

    if(!user) {
        return {
            error: "Unauthorized",
        }
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return projects;
    } catch (error) {
        console.error("❌ Error getting projects:", error);
        return {
            error: "Failed to get projects",
        }
    }
}

/**
 * Fetch a single project owned by the signed-in user, including its messages.
 *
 * @param id - The project id to look up.
 * @returns The project with its messages, or an `{ error }` object when not
 *   found, unauthorized, or on failure.
 */
export const getProjectById = async (id: string) => {
    const user = await getCurrentUser();

    if(!user) {
        return {
            error: "Unauthorized",
        }
    }

    try {
        const project = await prisma.project.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                messages: true,
            },
        });

        if(!project) {
            return {
                error: "Project not found",
            }
        }

        return project;
    } catch (error) {
        console.error("❌ Error getting project by id:", error);
        return {
            error: "Failed to get project by id",
        }
    }
}

