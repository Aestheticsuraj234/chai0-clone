"use client";

import Link from "next/link";
import { GlassNavbar } from "@/components/home/glass-navbar";
import { HomeBackground } from "@/components/home/home-background";
import { Spinner } from "@/components/ui/spinner";
import { useGetProjectById } from "@/features/projects/hooks/projects";

export function ProjectView({ id }: { id: string }) {
  const { data: project, isLoading, isError, error } = useGetProjectById(id);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <HomeBackground />
      <GlassNavbar />
      <main className="flex flex-1 flex-col px-4 pb-16 pt-28">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : isError || !project ? (
            <div className="rounded-2xl border border-border/60 bg-card/50 p-8 text-center shadow-sm backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Project not found"}
              </p>
              <Link
                href="/"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← New project
                </Link>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {project.name}
                </h1>
              </div>

              <div className="flex flex-col gap-4">
                {project.messages.map((message) => (
                  <article
                    key={message.id}
                    className="rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {message.role.toLowerCase()}
                    </p>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
