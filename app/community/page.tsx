"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCommunities, useCurrentUser } from "./lib/mock-data-adapter";
import { CommunityCard } from "./components/CommunityCard";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Paperclip, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import useFileManagerStore from "@/store/useFileManagerStore";
import { MessageLengthIndicator } from "@/components/ui/custom/prompt/message-length-indicator";
import type { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/ui/custom/minimal-tiptap/minimal-tiptap";

function CommunityQuickPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Content>("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const { data: communities } = useCommunities();
  const { user } = useCurrentUser();
  const maxTitleLength = 100;

  if (!user) {
    return (
      <Card className="mb-6 p-4 text-center">
        <p className="text-muted-foreground mb-2 text-sm">
          You need to be logged in to create a post.
        </p>
        <Button size="sm" asChild>
          <Link href="/dashboard/login/v1">Sign In</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="mt-2 mb-6 w-full">
      <div className="border-border/80 bg-background/80 dark:bg-background/40 rounded-lg border p-3 shadow-sm">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Input
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= maxTitleLength) {
                    setTitle(e.target.value);
                  }
                }}
                placeholder="What's on your mind?"
                className="border-border/60 bg-background/60 focus-visible:border-primary/80 h-10"
              />
            </div>
            <div className="ml-2 w-1/3">
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="border-border/60 bg-background/60 h-10 w-full rounded-md border px-3 py-2">
                <option value="">Select community</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground text-xs font-medium">Title</span>
            <MessageLengthIndicator currentLength={title.length} maxLength={maxTitleLength} />
          </div>
        </div>

        <div className="mt-2">
          <MinimalTiptapEditor
            value={content}
            onChange={setContent}
            placeholder="Share your thoughts, questions, or insights..."
            className="border-border/60 bg-background/60 max-h-48 min-h-28"
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileUploadDialog
              customTrigger={
                <Button type="button" variant="ghost" size="icon" className="rounded-full">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach File</span>
                </Button>
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-xs font-normal">
              <Link href="/community/new">Advanced Options</Link>
            </Button>
            <Button
              type="button"
              disabled={!title.trim() || !content || !selectedCommunity}
              className="gap-1 rounded-full">
              <Send className="h-4 w-4" />
              <span>Post</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { data: communities, isLoading, error } = useCommunities();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter communities based on search term
  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (community.description &&
        community.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="mt-8 flex justify-center">
          <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-gray-300"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <p>Error loading communities: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold">Communities</h1>
        <p className="text-muted-foreground">
          Join and participate in communities centered around VA benefits, claims, and veteran
          support.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="flex-shrink-0 gap-1" asChild>
          <Link href="/community/new">
            <Plus className="h-4 w-4" />
            Create Community
          </Link>
        </Button>
      </div>

      <CommunityQuickPost />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCommunities.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">
              No communities found. Try a different search term.
            </p>
          </div>
        ) : (
          filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))
        )}
      </div>
    </main>
  );
}
