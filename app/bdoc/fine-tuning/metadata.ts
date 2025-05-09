import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "AI Fine-Tuning Management",
    description: "Manage AI fine-tuning jobs and models for VA claims processing",
    canonical: "/bdoc/fine-tuning"
  });
} 