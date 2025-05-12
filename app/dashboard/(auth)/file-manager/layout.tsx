import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = generateMeta({
  title: "VA Claims File Manager",
  description:
    "Centralized file management system for VA disability claims documents. Upload, categorize, and manage your claim-related files efficiently.",
  canonical: "/file-manager"
});

export default function FileManagerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
