import { generateMeta } from "@/lib/utils";
import AppRender from "@/app/dashboard/app-render";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "AI Chat Dashboard",
    description:
      "A template you can use to chat with artificial intelligence. Built with shadcn/ui, Next.js and Tailwind CSS.",
    canonical: "/dashboard"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">AI Chat</h1>
        <div className="flex items-center space-x-2">
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>
      <div className="gap-4 space-y-4">
        <AppRender />
      </div>
    </div>
  );
} 