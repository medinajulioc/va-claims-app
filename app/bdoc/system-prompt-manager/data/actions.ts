"use server";

import { SystemPrompt, SystemPromptVersion, SystemPromptCategory } from "./types";
import { mockPrompts, mockCategories } from "./mock-data";

// In a real app, these functions would interact with a database or API
// For now, they're just simulating backend functionality using mock data

let prompts: SystemPrompt[] = [...mockPrompts];
let categories: SystemPromptCategory[] = [...mockCategories];

// Get all prompts
export async function getPrompts(): Promise<SystemPrompt[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return prompts;
}

// Get prompt by ID
export async function getPromptById(id: string): Promise<SystemPrompt | undefined> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return prompts.find((prompt) => prompt.id === id);
}

// Save a prompt (create or update)
export async function savePrompt(prompt: SystemPrompt): Promise<SystemPrompt> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  const existingIndex = prompts.findIndex((p) => p.id === prompt.id);

  if (existingIndex !== -1) {
    // Update existing prompt
    prompts[existingIndex] = prompt;
  } else {
    // Create new prompt
    prompts.push(prompt);
  }

  return prompt;
}

// Save a prompt version
export async function savePromptVersion(
  version: SystemPromptVersion
): Promise<SystemPromptVersion> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  // In a real app this would be stored in its own table/collection
  // Here we're just making sure the version is attached to the prompt
  const promptIndex = prompts.findIndex((p) => p.id === version.promptId);

  if (promptIndex !== -1) {
    // Update all existing versions to inactive
    const otherVersions = prompts[promptIndex].versions.map((v) => ({
      ...v,
      isActive: false
    }));

    // Find and remove this version if it exists (to avoid duplicates)
    const existingVersionIndex = otherVersions.findIndex((v) => v.id === version.id);
    if (existingVersionIndex !== -1) {
      otherVersions.splice(existingVersionIndex, 1);
    }

    // Add the new active version
    prompts[promptIndex].versions = [...otherVersions, { ...version, isActive: true }];

    // Update the prompt content to match the active version
    prompts[promptIndex].content = version.content;
    prompts[promptIndex].lastUpdated = new Date().toISOString();
  }

  return version;
}

// Delete a prompt
export async function deletePrompt(id: string): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const initialLength = prompts.length;
  prompts = prompts.filter((p) => p.id !== id);

  return prompts.length < initialLength;
}

// Get all categories
export async function getCategories(): Promise<SystemPromptCategory[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return categories;
}

// Save a category (create or update)
export async function saveCategory(category: SystemPromptCategory): Promise<SystemPromptCategory> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const existingIndex = categories.findIndex((c) => c.id === category.id);

  if (existingIndex !== -1) {
    // Update existing category
    categories[existingIndex] = category;
  } else {
    // Create new category
    categories.push(category);
  }

  return category;
}

// Delete a category
export async function deleteCategory(id: string): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const initialLength = categories.length;
  categories = categories.filter((c) => c.id !== id);

  // In a real app, you might want to handle prompts that were in this category
  // Here we'll just remove the category ID from them
  prompts = prompts.map((prompt) => {
    if (prompt.categoryId === id) {
      return { ...prompt, categoryId: undefined };
    }
    return prompt;
  });

  return categories.length < initialLength;
}
