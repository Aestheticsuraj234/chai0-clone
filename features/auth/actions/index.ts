"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/**
 * Ensure a database `User` record exists for the currently signed-in Clerk user.
 *
 * Reads the active Clerk session, derives a best-effort email and display name,
 * and upserts the corresponding row keyed by `clerkId`. Safe to call on every
 * authenticated request: it creates the user on first login and keeps profile
 * fields in sync on subsequent visits. No-ops when there is no signed-in user.
 */
export async function onboardUser() {
  const { userId } = await auth();
  if (!userId) return;

  const clerkUser = await currentUser();
  if (!clerkUser) return;

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    null;

  const name =
    clerkUser.fullName ??
    ([clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null);

  await prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      name,
      imageUrl: clerkUser.imageUrl,
    },
    update: {
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      name,
      imageUrl: clerkUser.imageUrl,
    },
  });
}

/**
 * Fetch the database `User` record for the currently signed-in Clerk user.
 *
 * @returns The user's core fields (`id`, `email`, `name`, `imageUrl`,
 *   `clerkId`), or `null` if no one is signed in, the user has not been
 *   onboarded yet, or an error occurs.
 */
export const getCurrentUser = async () => {
    try {
      const user = await currentUser();
  
      if (!user) {
        return null;
      }
  
      const dbUser = await prisma.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          imageUrl: true,
          clerkId: true,
        },
      });
  
      return dbUser;
    } catch (error) {
      console.error("❌ Error fetching current user:", error);
      return null;
    }
  };
  