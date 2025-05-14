"use client";

import { CommunityProvider } from "../lib/community-provider";
import CommunitiesGrid from "../components/CommunitiesGrid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function AllCommunitiesPage() {
  return (
    <CommunityProvider>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Communities</h1>
            <p className="text-muted-foreground">
              Discover and join communities that interest you
            </p>
          </div>
          
          <Link href="/community/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          </Link>
        </div>
        
        <CommunitiesGrid />
      </main>
    </CommunityProvider>
  );
} 