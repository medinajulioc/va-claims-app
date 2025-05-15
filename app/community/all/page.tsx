"use client";

import { CommunityProvider } from "../lib/community-provider";
import CommunitiesGrid from "../components/CommunitiesGrid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useCreatePostModal } from "../components/CreatePostProvider";

export default function AllCommunitiesPage() {
  const { openCreatePostModal } = useCreatePostModal();

  return (
    <CommunityProvider>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Communities</h1>
            <p className="text-muted-foreground">Discover and join communities that interest you</p>
          </div>

          <Button onClick={() => openCreatePostModal()}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        <CommunitiesGrid />
      </main>
    </CommunityProvider>
  );
}
