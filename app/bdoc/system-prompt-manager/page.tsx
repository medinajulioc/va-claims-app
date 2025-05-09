import React from "react";
import { Metadata } from "next";
import { SystemPromptManager } from "./components/SystemPromptManager";
import { getPrompts, getCategories } from "./data/actions";
import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "System Prompt Manager",
    description: "Manage system prompts for your AI applications",
    canonical: "/bdoc/system-prompt-manager"
  });
}

export default async function SystemPromptManagerPage() {
  // In a real app, this would be fetched from a database or API
  const prompts = await getPrompts();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight lg:text-2xl">System Prompt Manager</h1>

      <SystemPromptManager initialPrompts={prompts} initialCategories={categories} />
    </div>
  );
}
