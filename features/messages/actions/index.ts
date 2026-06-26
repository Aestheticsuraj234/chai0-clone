"use server";

import { getCurrentUser } from "@/features/auth/actions";
import { inngest } from "@/features/inngest/client";
import { prisma } from "@/lib/db";
import { MessageRole, MessageType } from "@/lib/generated/prisma/client";

export const createMessage = async (value: string, projectId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const newMessage = await prisma.message.create({
    data: {
      projectId,
      content: value,
      role: MessageRole.USER,
      type: MessageType.RESULT,
    },
  });

  await inngest.send({
    name: "code-agent/run",
    data: {
      value,
      projectId,
    },
  });

  return newMessage;
};

export const getMessages = async (projectId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  return prisma.message.findMany({
    where: {
      projectId,
    },
    orderBy: {
      updatedAt: "asc",
    },
    include: {
      fragments: true,
    },
  });
};
